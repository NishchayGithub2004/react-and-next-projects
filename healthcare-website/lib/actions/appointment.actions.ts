"use server"; // mark this file as a Next.js server action module to enable server-side execution of functions

import { revalidatePath } from "next/cache"; // import 'revalidatePath' to refresh specific Next.js route cache after data mutations
import { ID, Query } from "node-appwrite"; // import 'ID' for unique identifiers and 'Query' for querying Appwrite collections
import { Appointment } from "@/types/appwrite.types"; // import Appointment type for consistent type safety across database operations
import { // import Appwrite configuration constants and services for database and messaging interactions
  APPOINTMENT_COLLECTION_ID, // constant holding the Appwrite collection ID where appointments are stored
  DATABASE_ID, // constant holding the Appwrite database ID for referencing the correct database
  databases, // initialized Appwrite Databases instance for CRUD operations
  messaging, // initialized Appwrite Messaging instance for sending SMS notifications
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils"; // import utility functions for formatting timestamps and safely serializing Appwrite responses

export const createAppointment = async ( // define async function 'createAppointment' to create a new appointment record in database
  appointment: CreateAppointmentParams // parameter representing new appointment data to be stored
) => {
  try {
    const newAppointment = await databases.createDocument( // create new document in the appointment collection using provided appointment data
      DATABASE_ID!, // specify target database ID for document creation
      APPOINTMENT_COLLECTION_ID!, // specify target collection ID for appointments
      ID.unique(), // generate a unique identifier for the new appointment record
      appointment // provide the appointment data object as payload
    );

    revalidatePath("/admin"); // trigger cache revalidation for admin route to reflect newly created appointment immediately
    
    return parseStringify(newAppointment); // return serialized version of created document for safe server-client data handling
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error); // log error message for debugging creation failures
  }
};

export const getRecentAppointmentList = async () => { // define async function to fetch recent appointments and compute summary counts
  try {
    const appointments = await databases.listDocuments( // retrieve all appointment documents sorted by creation date
      DATABASE_ID!, // specify database ID to fetch from
      APPOINTMENT_COLLECTION_ID!, // specify collection ID for appointments
      [Query.orderDesc("$createdAt")] // order results descendingly by creation time to get most recent first
    );

    const initialCounts = { // define initial counters for appointment statuses to start aggregation
      scheduledCount: 0, // initialize scheduled appointment count
      pendingCount: 0, // initialize pending appointment count
      cancelledCount: 0, // initialize cancelled appointment count
    };

    const counts = (appointments.documents as Appointment[]).reduce( // iterate through appointments to count each status category
      (acc, appointment) => {
        switch (appointment.status) { // switch to check each appointment’s status
          case "scheduled": // handle scheduled appointments
            acc.scheduledCount++; // increment scheduled counter
            break;
          case "pending": // handle pending appointments
            acc.pendingCount++; // increment pending counter
            break;
          case "cancelled": // handle cancelled appointments
            acc.cancelledCount++; // increment cancelled counter
            break;
        }
        return acc; // return updated accumulator object for next iteration
      },
      initialCounts // provide starting object with zeroed counts
    );

    const data = { // construct final data object combining total count and computed status counts
      totalCount: appointments.total, // include total number of appointment documents
      ...counts, // spread in all computed counts for each status
      documents: appointments.documents, // include full list of retrieved appointment records
    };

    return parseStringify(data); // serialize data object for safe JSON transport
  } catch (error) {
    console.error("An error occurred while retrieving the recent appointments:", error); // log descriptive error when fetching fails
  }
};

export const sendSMSNotification = async ( // define async function 'sendSMSNotification' to send text notifications to users
  userId: string, // parameter for recipient user’s ID in Appwrite
  content: string // parameter for SMS message content to be sent
) => {
  try {
    const message = await messaging.createSms( // create a new SMS message using Appwrite messaging service
      ID.unique(), // generate unique message ID to track SMS
      content, // set body content for message
      [], // provide empty array for group recipients (unused here)
      [userId] // specify recipient user ID array for individual notification
    );
    
    return parseStringify(message); // return serialized message response for consistent handling
  } catch (error) {
    console.error("An error occurred while sending sms:", error); // log error to debug failed message delivery
  }
};

export const updateAppointment = async ({ // define async function 'updateAppointment' to modify an existing appointment and send SMS updates
  appointmentId, // unique ID of the appointment to be updated
  userId, // user ID to send notification to
  timeZone, // timezone used for correctly formatting appointment time in SMS
  appointment, // updated appointment data to apply
  type, // type of update (e.g., 'schedule' or 'cancel')
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument( // update specific appointment document in Appwrite
      DATABASE_ID!, // specify database ID for update
      APPOINTMENT_COLLECTION_ID!, // specify appointment collection ID
      appointmentId, // specify ID of document being updated
      appointment // provide updated appointment data as payload
    );

    if (!updatedAppointment) throw Error; // throw error if update fails to ensure downstream logic doesn’t execute incorrectly

    const smsMessage = `Greetings from CarePulse. ${ // construct notification text dynamically based on update type
      type === "schedule" // check if appointment is being scheduled or cancelled
        ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` // build confirmation message for scheduled appointments
        : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}` // build cancellation message with reason included
    }.`; // finalize full message text
    
    await sendSMSNotification(userId, smsMessage); // trigger SMS notification to user with constructed message content

    revalidatePath("/admin"); // refresh admin route cache to show updated appointment status immediately
    
    return parseStringify(updatedAppointment); // return serialized updated appointment document for safe response handling
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error); // log error when appointment update or SMS fails
  }
};

export const getAppointment = async (appointmentId: string) => { // define async function to retrieve a single appointment by ID for detailed view
  try {
    const appointment = await databases.getDocument( // fetch appointment record from Appwrite by its unique ID
      DATABASE_ID!, // specify database ID for query
      APPOINTMENT_COLLECTION_ID!, // specify collection ID to search within
      appointmentId // pass appointment ID to locate exact record
    );

    return parseStringify(appointment); // serialize appointment data for safe client-side use
  } catch (error) {
    console.error("An error occurred while retrieving the existing patient:", error); // log error if retrieval fails for given appointment ID
  }
};

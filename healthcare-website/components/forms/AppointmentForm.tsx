"use client"; // enable client-side rendering for this component so it can use hooks and browser APIs

import { zodResolver } from "@hookform/resolvers/zod"; // import zodResolver to integrate Zod schema validation with react-hook-form
import Image from "next/image"; // import Image for optimized image rendering in Next.js
import { useRouter } from "next/navigation"; // import useRouter hook to programmatically navigate within Next.js app
import { Dispatch, SetStateAction, useState } from "react"; // import hooks and types from React for state and prop management
import { useForm } from "react-hook-form"; // import useForm to handle form state, validation, and submission
import { z } from "zod"; // import Zod library for schema validation and type inference

import { SelectItem } from "@/components/ui/select"; // import SelectItem component used to render selectable options
import { Doctors } from "@/constants"; // import Doctors constant containing doctor-related data
import {
  createAppointment, // import createAppointment to send new appointment data to backend
  updateAppointment, // import updateAppointment to modify existing appointment data
} from "@/lib/actions/appointment.actions"; // import appointment actions to handle CRUD operations
import { getAppointmentSchema } from "@/lib/validation"; // import function to generate validation schema dynamically based on appointment type
import { Appointment } from "@/types/appwrite.types"; // import Appointment type definition for type safety

import "react-datepicker/dist/react-datepicker.css"; // import styles for datepicker component to ensure proper display

import CustomFormField, { FormFieldType } from "../CustomFormField"; // import CustomFormField component and type for dynamic form fields
import SubmitButton from "../SubmitButton"; // import SubmitButton component to handle form submission UI
import { Form } from "../ui/form"; // import Form component wrapper for consistent form structure and styling

// define a functional component named 'AppointmentForm' to create or update patient appointments based on type which takes following props
export const AppointmentForm = ({
  userId, // holds the ID of the current logged-in user to associate with appointment
  patientId, // holds the ID of the patient for whom appointment is being managed
  type = "create", // determines whether the form will create, schedule, or cancel an appointment
  appointment, // optional appointment object containing existing data if editing or rescheduling
  setOpen, // optional state setter to close modal or form UI upon completion
}: {
  userId: string; // defines the type of userId as string for type safety
  patientId: string; // defines the type of patientId as string for type safety
  type: "create" | "schedule" | "cancel"; // restricts the type prop to three possible string values
  appointment?: Appointment; // optional prop holding appointment details when editing
  setOpen?: Dispatch<SetStateAction<boolean>>; // optional state setter for managing UI visibility
}) => {
  const router = useRouter(); // initialize router to redirect or refresh the page after form actions
  
  const [isLoading, setIsLoading] = useState(false); // manage loading state during form submission to prevent duplicate actions

  const AppointmentFormValidation = getAppointmentSchema(type); // generate and store a Zod validation schema based on the appointment type

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({ // initialize react-hook-form with inferred types from validation schema
    resolver: zodResolver(AppointmentFormValidation), // apply Zod schema validation as resolver for react-hook-form
    defaultValues: { // set default values for all form fields to ensure consistent initial state
      primaryPhysician: appointment ? appointment?.primaryPhysician : "", // prefill primary physician if editing, else empty
      schedule: appointment // determine appointment schedule value dynamically
        ? new Date(appointment?.schedule!) // convert existing appointment schedule string into Date object
        : new Date(Date.now()), // otherwise default to current date and time for new appointment
      reason: appointment ? appointment.reason : "", // prefill reason field if editing, else empty
      note: appointment?.note || "", // prefill note if exists, else default to empty string
      cancellationReason: appointment?.cancellationReason || "", // prefill cancellation reason if present, else empty string
    },
  });

  const onSubmit = async ( // define asynchronous function 'onSubmit' to handle appointment form submission with validation
    values: z.infer<typeof AppointmentFormValidation> // parameter 'values' holds validated form input data inferred from Zod schema
  ) => {
    setIsLoading(true); // set loading state to true to indicate submission in progress and disable UI actions
  
    let status; // declare variable to store appointment status dynamically based on action type
    
    switch (type) { // determine appointment status according to form action type
      case "schedule": // if the form is used for scheduling
        status = "scheduled"; // assign status as scheduled to indicate confirmed booking
        break; // stop further evaluation in switch
      case "cancel": // if the form is used for canceling
        status = "cancelled"; // assign status as cancelled to indicate appointment termination
        break; // stop further evaluation in switch
      default: // for any other type (e.g., creating)
        status = "pending"; // set default status as pending meaning awaiting approval or scheduling
    }
  
    try { // start try block to safely handle async operations and possible errors
      if (type === "create" && patientId) { // check if the operation is to create a new appointment and patientId exists
        const appointment = { // define an appointment object to send to backend
          userId, // include current user’s ID to link appointment to user
          patient: patientId, // assign patient ID to associate appointment with a specific patient
          primaryPhysician: values.primaryPhysician, // set selected physician from form input
          schedule: new Date(values.schedule), // convert form schedule value to a Date object for backend storage
          reason: values.reason!, // include reason for visit, using non-null assertion since validation ensures presence
          status: status as Status, // cast dynamically determined status to Status type for type safety
          note: values.note, // include any additional notes entered in form
        };
  
        const newAppointment = await createAppointment(appointment); // call backend action to create a new appointment entry and await result
  
        if (newAppointment) { // check if appointment creation succeeded
          form.reset(); // reset form fields to clear data after successful submission
          router.push( // navigate user to success page with appointment ID as query parameter
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}` // construct route URL dynamically
          );
        }
      } else { // if not creating, then perform an update or cancellation
        const appointmentToUpdate = { // define object containing updated appointment data
          userId, // include current user ID for backend validation and authorization
          appointmentId: appointment?.$id!, // include appointment’s unique ID from props using non-null assertion
          appointment: { // define nested appointment update data
            primaryPhysician: values.primaryPhysician, // update assigned physician
            schedule: new Date(values.schedule), // update scheduled date/time
            status: status as Status, // update appointment status based on operation type
            cancellationReason: values.cancellationReason, // include cancellation reason if applicable
          },
          type, // pass operation type (schedule or cancel) to determine backend logic
        };
  
        const updatedAppointment = await updateAppointment(appointmentToUpdate); // call backend function to update existing appointment
  
        if (updatedAppointment) { // if update is successful
          setOpen && setOpen(false); // close form/modal if setOpen function is provided
          form.reset(); // clear form fields after successful update
        }
      }
    } catch (error) { // catch any runtime or API errors during submission
      console.log(error); // log error to console for debugging or monitoring
    }
    setIsLoading(false); // reset loading state to false after process completion to re-enable UI
  };
  
  let buttonLabel; // declare variable to store dynamic button label text
    
  switch (type) { // determine label text based on appointment action type
    case "cancel": // if canceling
      buttonLabel = "Cancel Appointment"; // set label to clearly indicate cancellation action
      break; // exit switch after assignment
    case "schedule": // if scheduling
      buttonLabel = "Schedule Appointment"; // set label to show scheduling intent
      break; // exit switch after assignment
    default: // for default (creating) case
      buttonLabel = "Submit Apppointment"; // set label for general submission of new appointment
  }  

  return ( // return JSX to render appointment form based on form type and validation state
    <Form {...form}> {/* pass react-hook-form object to Form component for context management */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6"> {/* attach onSubmit handler with validated form submission */}
  
        {type === "create" && ( // render heading only when creating new appointment
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
        )}
  
        {type !== "cancel" && ( // show doctor/date/reason fields for all modes except cancel
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => ( // dynamically render a selectable item for each doctor in list
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
  
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />
  
            <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}> {/* adjust layout only when creating */}
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                disabled={type === "schedule"} // disable editing when rescheduling existing appointment
              />
  
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"} // disable editing when rescheduling existing appointment
              />
            </div>
          </>
        )}
  
        {type === "cancel" && ( // render cancellation reason only if appointment is being cancelled
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}
  
        <SubmitButton
          isLoading={isLoading} // display spinner and disable button during submission
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel} {/* use dynamic button text depending on action type */}
        </SubmitButton>
  
      </form>
    </Form>
  );  
};
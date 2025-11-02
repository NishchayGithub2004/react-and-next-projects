import { Models } from "node-appwrite"; // import 'Models' from 'node-appwrite' to use document-related types provided by Appwrite SDK

export interface Patient extends Models.Document { // define an interface 'Patient' extending 'Models.Document' to represent a patient record stored in Appwrite

  // define core identification and contact details
  userId: string; // ID linking this patient to the corresponding user record
  name: string; // patient's full name
  email: string; // patient's email address
  phone: string; // patient's phone number

  // define personal demographic information
  birthDate: Date; // date of birth of the patient
  gender: Gender; // gender value restricted to the 'Gender' type
  address: string; // residential address of the patient
  occupation: string; // current occupation or profession

  // define emergency and medical details
  emergencyContactName: string; // name of the person to contact in emergencies
  emergencyContactNumber: string; // phone number of the emergency contact
  primaryPhysician: string; // name of the patient's assigned primary physician
  insuranceProvider: string; // name of the health insurance provider
  insurancePolicyNumber: string; // health insurance policy number
  allergies: string | undefined; // known allergies, or undefined if none
  currentMedication: string | undefined; // ongoing medications, or undefined if none
  familyMedicalHistory: string | undefined; // family medical history summary, if provided
  pastMedicalHistory: string | undefined; // previous medical conditions, if provided

  // define identification and privacy-related information
  identificationType: string | undefined; // type of identification document (e.g., passport, license)
  identificationNumber: string | undefined; // identification number of the provided document
  identificationDocument: FormData | undefined; // uploaded identification document stored as FormData
  privacyConsent: boolean; // indicates whether patient consented to privacy policy
}

export interface Appointment extends Models.Document { // define an interface 'Appointment' extending 'Models.Document' to represent appointment details in Appwrite

  // define relational and scheduling information
  patient: Patient; // reference to the associated 'Patient' record
  schedule: Date; // scheduled date and time of the appointment
  status: Status; // current appointment status represented by 'Status' type

  // define appointment-specific and administrative details
  primaryPhysician: string; // name or ID of the physician handling the appointment
  reason: string; // reason or purpose for scheduling this appointment
  note: string; // additional notes or comments made by the user or staff
  userId: string; // ID of the user who created or manages the appointment
  cancellationReason: string | null; // reason for cancellation if appointment is canceled, null otherwise
}

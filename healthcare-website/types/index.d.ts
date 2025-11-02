/* eslint-disable no-unused-vars */

declare type SearchParamProps = { // define a type 'SearchParamProps' representing parameters received in a search query

  // define the following parameter maps for routes and queries
  params: { [key: string]: string }; // key-value map of required route parameters
  searchParams: { [key: string]: string | string[] | undefined }; // key-value map of optional query parameters that can be string, array of strings, or undefined
};

declare type Gender = "Male" | "Female" | "Other"; // define a union type 'Gender' restricting valid gender values to specific strings

declare type Status = "pending" | "scheduled" | "cancelled"; // define a union type 'Status' representing possible appointment states

declare interface CreateUserParams { // define an interface 'CreateUserParams' containing minimal information needed to create a new user

  // define the following core user identification details
  name: string; // user's full name
  email: string; // user's email address
  phone: string; // user's phone number
}

declare interface User extends CreateUserParams { // define an interface 'User' extending 'CreateUserParams' to include unique identification
  $id: string; // unique identifier assigned to the user
}

declare interface RegisterUserParams extends CreateUserParams { // define an interface 'RegisterUserParams' for complete registration details

  // define personal and demographic details
  userId: string; // unique user reference ID
  birthDate: Date; // date of birth
  gender: Gender; // gender value using 'Gender' type
  address: string; // residential address
  occupation: string; // user's occupation or profession

  // define emergency contact and medical details
  emergencyContactName: string; // name of emergency contact person
  emergencyContactNumber: string; // phone number of emergency contact
  primaryPhysician: string; // name of user's primary physician
  insuranceProvider: string; // health insurance company name
  insurancePolicyNumber: string; // health insurance policy number
  allergies: string | undefined; // information about user's allergies, if any
  currentMedication: string | undefined; // list of current medications, if any
  familyMedicalHistory: string | undefined; // summary of family medical conditions
  pastMedicalHistory: string | undefined; // summary of user's own medical history

  // define identification and consent details
  identificationType: string | undefined; // type of ID document provided (e.g., passport, license)
  identificationNumber: string | undefined; // identification document number
  identificationDocument: FormData | undefined; // uploaded identification document as FormData
  privacyConsent: boolean; // indicates whether user provided privacy consent
}

declare type CreateAppointmentParams = { // define a type 'CreateAppointmentParams' representing details required to create an appointment

  // define user and patient-related information
  userId: string; // ID of the user creating the appointment
  patient: string; // patient name or ID reference
  primaryPhysician: string; // assigned physician's name or ID

  // define scheduling and appointment-specific details
  reason: string; // purpose or reason for the appointment
  schedule: Date; // date and time of the appointment
  status: Status; // current appointment status using 'Status' type
  note: string | undefined; // optional remarks or additional notes
};

declare type UpdateAppointmentParams = { // define a type 'UpdateAppointmentParams' representing data needed to update an existing appointment

  // define identifying and modification-related details
  appointmentId: string; // ID of the appointment to be updated
  userId: string; // ID of the user performing the update
  timeZone?: string; // optional timezone value for time adjustments
  appointment: Appointment; // updated appointment object containing new details
  type: string; // describes the kind or category of update being applied
};

import { z } from "zod"; // import the 'zod' library to define and validate schema-based form inputs safely

export const UserFormValidation = z.object({ // define a validation schema named 'UserFormValidation' to ensure user form fields meet required constraints
  name: z // define validation rule for user name field
    .string() // ensure the input is a string type
    .min(2, "Name must be at least 2 characters") // enforce minimum length of 2 to prevent too-short names
    .max(50, "Name must be at most 50 characters"), // enforce maximum length of 50 to avoid excessively long names
  email: z.string().email("Invalid email address"), // ensure valid email format for user email field to maintain communication accuracy
  phone: z // define validation rule for phone number
    .string() // ensure phone is entered as a string
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"), // apply regex to validate international phone format with '+' and digits
});

export const PatientFormValidation = z.object({ // define schema 'PatientFormValidation' to validate complete patient registration details
  name: z // define patient name validation rule
    .string() // ensure name is a string
    .min(2, "Name must be at least 2 characters") // enforce minimum length to ensure meaningful entry
    .max(50, "Name must be at most 50 characters"), // enforce maximum length to keep input manageable
  email: z.string().email("Invalid email address"), // ensure valid email for patient to enable communication and record linkage
  phone: z // define patient phone number validation
    .string() // ensure phone is string type
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"), // validate with regex pattern for proper phone format
  birthDate: z.coerce.date(), // coerce any input into a Date object to ensure correct date representation
  gender: z.enum(["Male", "Female", "Other"]), // restrict gender input to predefined options to maintain consistent data entries
  address: z // define address validation rule
    .string() // ensure input is a string
    .min(5, "Address must be at least 5 characters") // enforce a minimum to avoid incomplete addresses
    .max(500, "Address must be at most 500 characters"), // set maximum to prevent overly long entries
  occupation: z // define occupation field validation
    .string() // ensure occupation is string type
    .min(2, "Occupation must be at least 2 characters") // ensure valid descriptive text
    .max(500, "Occupation must be at most 500 characters"), // limit length for consistency
  emergencyContactName: z // define validation for emergency contact name
    .string() // ensure input is string
    .min(2, "Contact name must be at least 2 characters") // ensure meaningful name
    .max(50, "Contact name must be at most 50 characters"), // set maximum to keep concise
  emergencyContactNumber: z // define validation for emergency contact number
    .string() // ensure string input
    .refine( // apply regex-based refinement for phone number format
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber), // validate international phone structure
      "Invalid phone number" // show user-friendly error message when validation fails
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"), // ensure at least one doctor is selected to link patient to a provider
  insuranceProvider: z // define insurance provider validation
    .string() // ensure provider name is string
    .min(2, "Insurance name must be at least 2 characters") // validate non-empty and reasonable length
    .max(50, "Insurance name must be at most 50 characters"), // enforce upper limit for clarity
  insurancePolicyNumber: z // define insurance policy number validation
    .string() // ensure input is string
    .min(2, "Policy number must be at least 2 characters") // avoid too-short IDs
    .max(50, "Policy number must be at most 50 characters"), // prevent overly long entries
  allergies: z.string().optional(), // allow optional field for recording allergies if available
  currentMedication: z.string().optional(), // optional field to store current medications for treatment awareness
  familyMedicalHistory: z.string().optional(), // optional field to record hereditary conditions
  pastMedicalHistory: z.string().optional(), // optional field for previous illnesses or treatments
  identificationType: z.string().optional(), // optional field to specify ID type like passport or license
  identificationNumber: z.string().optional(), // optional field to store corresponding ID number
  identificationDocument: z.custom<File[]>().optional(), // optional upload field for identification documents as file array
  treatmentConsent: z // define boolean validation for treatment consent
    .boolean() // ensure true/false input type
    .default(false) // default to false until explicitly agreed
    .refine((value) => value === true, { // validate that user must give explicit consent before proceeding
      message: "You must consent to treatment in order to proceed", // show error if consent not given
    }),
  disclosureConsent: z // define boolean validation for disclosure consent
    .boolean() // ensure boolean type
    .default(false) // start with false by default
    .refine((value) => value === true, { // require explicit consent for data sharing
      message: "You must consent to disclosure in order to proceed", // show message if not accepted
    }),
  privacyConsent: z // define boolean validation for privacy consent
    .boolean() // ensure value is boolean
    .default(false) // default false until user opts in
    .refine((value) => value === true, { // enforce that user must accept privacy agreement
      message: "You must consent to privacy in order to proceed", // display message if unchecked
    }),
});

export const CreateAppointmentSchema = z.object({ // define schema for creating new appointments with required validation fields
  primaryPhysician: z.string().min(2, "Select at least one doctor"), // ensure doctor is selected before scheduling
  schedule: z.coerce.date(), // coerce schedule input into Date type for accurate timing
  reason: z // define reason for appointment
    .string() // ensure reason is string type
    .min(2, "Reason must be at least 2 characters") // avoid vague reasons
    .max(500, "Reason must be at most 500 characters"), // prevent overly long explanations
  note: z.string().optional(), // optional note field for additional details
  cancellationReason: z.string().optional(), // optional reason field for potential cancellation
});

export const ScheduleAppointmentSchema = z.object({ // define schema for scheduling appointments that may not require reason
  primaryPhysician: z.string().min(2, "Select at least one doctor"), // ensure doctor selection is valid
  schedule: z.coerce.date(), // coerce and validate schedule as Date type
  reason: z.string().optional(), // optional reason field for flexible scheduling
  note: z.string().optional(), // optional note field for doctor or patient remarks
  cancellationReason: z.string().optional(), // optional cancellation reason placeholder
});

export const CancelAppointmentSchema = z.object({ // define schema for cancelling appointments with mandatory cancellation reason
  primaryPhysician: z.string().min(2, "Select at least one doctor"), // ensure appointment links to a valid doctor
  schedule: z.coerce.date(), // validate schedule date type for proper record keeping
  reason: z.string().optional(), // optional field for internal reference notes
  note: z.string().optional(), // optional notes to specify additional cancellation context
  cancellationReason: z // define cancellation reason validation
    .string() // ensure text input
    .min(2, "Reason must be at least 2 characters") // enforce meaningful explanation
    .max(500, "Reason must be at most 500 characters"), // limit length for readability
});

export function getAppointmentSchema(type: string) { // define function to dynamically select appropriate schema based on operation type
  switch (type) { // use switch to evaluate input type string
    case "create": // handle 'create' operation case
      return CreateAppointmentSchema; // return schema used for creating a new appointment
    case "cancel": // handle 'cancel' operation case
      return CancelAppointmentSchema; // return schema used for cancelling an existing appointment
    default: // handle all other cases
      return ScheduleAppointmentSchema; // default to scheduling schema for general use
  }
}

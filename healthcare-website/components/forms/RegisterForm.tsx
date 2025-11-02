"use client"; // enable client-side rendering so hooks like useState and useRouter can function

import { zodResolver } from "@hookform/resolvers/zod"; // integrate zod schema validation with react-hook-form
import Image from "next/image"; // import Next.js Image component for optimized image rendering
import { useRouter } from "next/navigation"; // use Next.js navigation hook for programmatic routing
import { useState } from "react"; // import useState hook to manage component state
import { useForm } from "react-hook-form"; // import useForm to handle form logic and validation
import { z } from "zod"; // import Zod for schema-based validation and type inference

import { Form, FormControl } from "@/components/ui/form"; // import form components to manage form context and input control
import { Label } from "@/components/ui/label"; // import label component for form field labels
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // import radio group components for gender and other option selections
import { SelectItem } from "@/components/ui/select"; // import SelectItem component for select dropdown options
import {
  Doctors, // import list of doctors to populate select options
  GenderOptions, // import gender selection options
  IdentificationTypes, // import ID type options for identification
  PatientFormDefaultValues, // import default form values for patient registration
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions"; // import action function to register new patient in backend
import { PatientFormValidation } from "@/lib/validation"; // import Zod validation schema for patient registration form

import "react-datepicker/dist/react-datepicker.css"; // import datepicker styles
import "react-phone-number-input/style.css"; // import phone input styles
import CustomFormField, { FormFieldType } from "../CustomFormField"; // import reusable dynamic form field component
import { FileUploader } from "../FileUploader"; // import component to handle file uploads for ID documents
import SubmitButton from "../SubmitButton"; // import form submission button component

const RegisterForm = ({ user }: { user: User }) => { // define RegisterForm component for patient registration, receiving user as prop
  const router = useRouter(); // initialize Next.js router for navigation after registration
  
  const [isLoading, setIsLoading] = useState(false); // manage submission loading state to disable actions during processing

  const form = useForm<z.infer<typeof PatientFormValidation>>({ // initialize react-hook-form instance with Zod schema and default values
    resolver: zodResolver(PatientFormValidation), // attach Zod resolver for schema validation
    defaultValues: { // prefill default values for form fields
      ...PatientFormDefaultValues, // include predefined defaults like empty strings and base structure
      name: user.name, // auto-fill name from logged-in user data
      email: user.email, // auto-fill email from logged-in user data
      phone: user.phone, // auto-fill phone number from logged-in user data
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => { // define async function to handle validated form submission
    setIsLoading(true); // enable loading indicator to prevent multiple submissions

    let formData; // declare variable to hold file upload data when applicable
    
    if ( // check if identification document exists and contains at least one file
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], { // create blob object from uploaded file for backend upload
        type: values.identificationDocument[0].type, // set MIME type to match original file type
      });

      formData = new FormData(); // instantiate FormData object for file submission
      formData.append("blobFile", blobFile); // append blob file to form data for backend parsing
      formData.append("fileName", values.identificationDocument[0].name); // append original filename for reference
    }

    try { // wrap async backend operation in try-catch for error safety
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient); // send patient data to backend to create new patient record

      if (newPatient) { // check if backend successfully created new patient
        router.push(`/patients/${user.$id}/new-appointment`); // redirect to new appointment booking page upon successful registration
      }
    } catch (error) { // catch any unexpected errors during backend call
      console.log(error); // log error for debugging
    }

    setIsLoading(false); // disable loading state after operation completion
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New york, NY - 5101"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder=" Software Engineer"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
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

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

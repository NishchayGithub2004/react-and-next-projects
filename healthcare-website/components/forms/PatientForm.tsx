"use client"; // enable client-side rendering so hooks like useState and useRouter can function

import { zodResolver } from "@hookform/resolvers/zod"; // import zodResolver to integrate Zod schema validation with react-hook-form
import { useRouter } from "next/navigation"; // import useRouter hook to handle client-side navigation in Next.js
import { useState } from "react"; // import useState hook to manage component state within functional components
import { useForm } from "react-hook-form"; // import useForm hook to handle form state and validation logic
import { z } from "zod"; // import Zod library for defining and inferring validation schemas

import { Form } from "@/components/ui/form"; // import shared Form component wrapper for consistent form context
import { createUser } from "@/lib/actions/patient.actions"; // import backend action to create new patient user record
import { UserFormValidation } from "@/lib/validation"; // import Zod validation schema for user registration

import "react-phone-number-input/style.css"; // import phone number input styles for correct formatting
import CustomFormField, { FormFieldType } from "../CustomFormField"; // import reusable form field component and enum for field types
import SubmitButton from "../SubmitButton"; // import reusable button component for form submission

export const PatientForm = () => { // define PatientForm component to handle patient registration process
  const router = useRouter(); // initialize Next.js router to redirect user after successful registration
  
  const [isLoading, setIsLoading] = useState(false); // manage form submission state to disable inputs during processing

  const form = useForm<z.infer<typeof UserFormValidation>>({ // initialize form with Zod validation and typed schema
    resolver: zodResolver(UserFormValidation), // integrate Zod schema as validation resolver
    defaultValues: { // define default empty values for all form inputs
      name: "", // initialize name field as empty string
      email: "", // initialize email field as empty string
      phone: "", // initialize phone field as empty string
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => { // define asynchronous submit handler that receives validated form data
    setIsLoading(true); // activate loading state to prevent multiple submissions

    try { // handle potential errors in async operations
      const user = { // construct new user object with validated form inputs
        name: values.name, // assign user-entered name
        email: values.email, // assign user-entered email
        phone: values.phone, // assign user-entered phone number
      };

      const newUser = await createUser(user); // send user data to backend to create a new patient record

      if (newUser) { // check if backend successfully returned a created user object
        router.push(`/patients/${newUser.$id}/register`); // navigate to registration success page using new user ID
      }
    } catch (error) { // handle any exceptions during user creation process
      console.log(error); // log error to console for debugging
    }

    setIsLoading(false); // deactivate loading state after submission completes or fails
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

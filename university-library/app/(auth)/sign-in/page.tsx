"use client"; // enable client-side rendering for this Next.js component to allow use of hooks and browser APIs

import React from "react"; // import react library to use JSX and define functional components
import AuthForm from "@/components/AuthForm"; // import AuthForm component to render the sign-in form UI and handle its logic
import { signInSchema } from "@/lib/validations"; // import validation schema to enforce rules for sign-in inputs such as email and password
import { signInWithCredentials } from "@/lib/actions/auth"; // import function that handles sign-in logic using provided credentials

const Page = () => ( // define a functional component named 'Page' to render the sign-in page using the AuthForm component
  <AuthForm 
    type="SIGN_IN" // pass form type to indicate this form is for user sign-in, affecting validation and UI behavior
    schema={signInSchema} // pass imported schema to validate form input fields before submission
    defaultValues={{ // provide initial values for controlled input fields to ensure form state consistency
      email: "", // set default empty string for email input to initialize form state
      password: "", // set default empty string for password input to initialize form state
    }}
    onSubmit={signInWithCredentials} // assign handler function that executes authentication process upon form submission
  />
);

export default Page; // export Page component as default to make it accessible as the route's main component in Next.js

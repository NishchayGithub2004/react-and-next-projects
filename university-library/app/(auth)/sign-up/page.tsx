"use client"; // enable client-side rendering so this component can use React hooks and browser APIs in Next.js

import AuthForm from "@/components/AuthForm"; // import AuthForm component to render and manage the sign-up form interface
import { signUpSchema } from "@/lib/validations"; // import validation schema to enforce input rules for registration fields like email, password, etc.
import { signUp } from "@/lib/actions/auth"; // import function that handles user registration by submitting data to the authentication backend

// define a functional component named 'Page' to render the user sign-up page using the reusable AuthForm component
const Page = () => (
  <AuthForm 
    type="SIGN_UP" // pass form type to specify this instance is for user sign-up, changing validation and behavior accordingly
    schema={signUpSchema} // provide schema that validates sign-up inputs ensuring data integrity before submission
    defaultValues={{ // define initial state for form inputs to ensure predictable and controlled component behavior
      email: "", // initialize email field as empty string to start with a blank form
      password: "", // initialize password field as empty string to maintain controlled form state
      fullName: "", // initialize full name field as empty string for user's name input
      universityId: 0, // set default numeric value for university ID to ensure type consistency before user input
      universityCard: "", // initialize university card input as empty string to maintain controlled form behavior
    }}
    onSubmit={signUp} // assign handler function to execute the sign-up process upon form submission
  />
);

export default Page; // export Page component as default so it serves as the main route component for the sign-up page

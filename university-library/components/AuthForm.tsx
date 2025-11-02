"use client"; // mark this component as a client-side component so it can use React hooks and browser features

import { zodResolver } from "@hookform/resolvers/zod"; // import a resolver to integrate zod validation with react-hook-form
import { // import following things from react-hook-form to define form types and control form behavior
  DefaultValues, // type defining structure for form’s initial default values
  FieldValues, // type representing generic collection of all form fields
  Path, // type ensuring only valid form field keys are referenced
  SubmitHandler, // type describing the validated form submission function
  useForm, // hook to initialize and manage form state and validation
  UseFormReturn, // type representing the complete return object from useForm with all utilities
} from "react-hook-form";
import { ZodType } from "zod"; // import zod type for defining schema-based validation

import { Button } from "@/components/ui/button"; // import reusable button component for form submission
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // import reusable form components for consistent UI handling
import { Input } from "@/components/ui/input"; // import styled input component for text fields
import Link from "next/link"; // import next.js link for navigation between pages
import { FIELD_NAMES, FIELD_TYPES } from "@/constants"; // import constants to dynamically map field labels and input types
import FileUpload from "@/components/FileUpload"; // import file upload component for uploading user IDs
import { toast } from "@/hooks/use-toast"; // import custom toast hook to display success or error messages
import { useRouter } from "next/navigation"; // import next.js router hook to programmatically navigate between routes

interface Props<T extends FieldValues> { // define a generic interface for AuthForm props that supports any form field structure
  schema: ZodType<T>; // zod schema used to validate form inputs based on defined rules
  defaultValues: T; // provide initial default values for each field in the form
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>; // define async submit handler returning a success state and optional error
  type: "SIGN_IN" | "SIGN_UP"; // specify whether the form is for sign-in or sign-up to adjust text and behavior accordingly
}

// define a functional component named 'AuthForm' to handle authentication form logic (sign-in or sign-up) which takes following props
const AuthForm = <T extends FieldValues>({
  type, // specify whether user is signing in or signing up to determine behavior
  schema, // provide validation schema ensuring form data integrity
  defaultValues, // supply pre-filled values for form initialization
  onSubmit, // define async handler function executed on form submission
}: Props<T>) => {
  const router = useRouter(); // initialize next.js router to perform client-side navigation after submission

  const isSignIn = type === "SIGN_IN"; // compute a boolean flag to check if current form type is sign-in for conditional rendering

  const form: UseFormReturn<T> = useForm({ // create a new react-hook-form instance to manage input states and validation
    resolver: zodResolver(schema), // use zod resolver so validation is automatically handled by the schema
    defaultValues: defaultValues as DefaultValues<T>, // set up default values for controlled form fields ensuring consistent state
  });

  const handleSubmit: SubmitHandler<T> = async (data) => { // define async handler executed when form is submitted with valid data
    const result = await onSubmit(data); // call the onSubmit prop function to perform sign-in or sign-up operation and wait for result

    if (result.success) { // check if submission was successful to show success message and redirect
      toast({ // show success notification toast for user feedback
        title: "Success", // title text for toast indicating operation result
        description: isSignIn // dynamically choose message depending on form type for user clarity
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      });

      router.push("/"); // navigate to home page after successful authentication
    } else { // handle failed form submission to inform user
      toast({ // show error toast indicating what went wrong
        title: `Error ${isSignIn ? "signing in" : "signing up"}`, // dynamically display correct operation type in error message
        description: result.error ?? "An error occurred.", // display specific error or fallback message if unavailable
        variant: "destructive", // use destructive variant to visually highlight failure
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}> {/* spread form instance to provide context to all form fields */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)} // attach submit handler that validates and executes handleSubmit on success
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => ( // iterate through each field name in defaultValues to dynamically render form fields
            <FormField
              key={field} // provide unique key for each field to ensure stable rendering
              control={form.control} // pass control object from useForm to connect field to form state
              name={field as Path<T>} // cast each key as valid form field path type for type safety
              render={({ field }) => ( // define how each field should render with its associated properties
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]} {/* dynamically show field label name based on FIELD_NAMES constant */}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? ( // check if current field is for university card to decide input type
                      <FileUpload
                        type="image" // restrict upload to image type for ID verification
                        accept="image/*" // allow only image file formats for security
                        placeholder="Upload your ID" // provide hint text to guide user input
                        folder="ids" // specify cloud storage folder for uploaded IDs
                        variant="dark" // apply dark theme styling to match form aesthetics
                        onFileChange={field.onChange} // update form state when file changes ensuring reactivity
                      />
                    ) : (
                      <Input
                        required // enforce required validation so user cannot submit empty field
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES] // dynamically determine input type (e.g., email, password) for each field
                        }
                        {...field} // spread react-hook-form’s field props to bind input state
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage /> {/* display validation errors specific to this field */}
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn"> {/* render button that triggers form submission */}
            {isSignIn ? "Sign In" : "Sign Up"} {/* dynamically set button label according to form mode */}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"} // choose correct navigation route based on current form type for quick access
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"} {/* display appropriate call-to-action text */}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm; // export AuthForm component for use across authentication-related pages
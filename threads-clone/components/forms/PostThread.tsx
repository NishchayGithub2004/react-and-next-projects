"use client"; // mark this as a client-side component so it can use hooks and browser APIs

import * as z from "zod"; // import zod for schema validation to ensure thread input follows defined rules
import { useForm } from "react-hook-form"; // import react-hook-form to manage form state and validation efficiently
import { useOrganization } from "@clerk/nextjs"; // import hook from clerk to access current user's organization context
import { zodResolver } from "@hookform/resolvers/zod"; // connect zod validation schema with react-hook-form for input validation
import { usePathname, useRouter } from "next/navigation"; // import hooks to get current path and handle client-side navigation

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // import reusable form components for structured form logic
import { Button } from "@/components/ui/button"; // import styled button component for submission control
import { Textarea } from "@/components/ui/textarea"; // import styled textarea component for thread content input

import { ThreadValidation } from "@/lib/validations/thread"; // import zod schema defining validation rules for thread input
import { createThread } from "@/lib/actions/thread.actions"; // import server action to handle thread creation and persistence

interface Props { // define Props interface to specify required input for this component
  userId: string; // store id of the logged-in user to associate thread with correct author
}

// define a functional component named 'PostThread' to render thread creation form and handle submission which takes following props
function PostThread({ userId }: Props) {
  const router = useRouter(); // initialize router to navigate user after posting thread
  
  const pathname = usePathname(); // get current URL path to include in backend request for redirect context

  const { organization } = useOrganization(); // extract organization info to attach thread to a community if applicable

  const form = useForm<z.infer<typeof ThreadValidation>>({ // initialize react-hook-form with zod validation schema for thread input
    resolver: zodResolver(ThreadValidation), // connect zod schema resolver to automatically validate fields
    defaultValues: { // define initial values for form fields to set up controlled inputs
      thread: "", // initialize thread text field as empty for user input
      accountId: userId, // prefill accountId to identify which user is creating the thread
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => { // define async function to handle thread form submission
    await createThread({ // call backend action to create new thread and store in database
      text: values.thread, // pass thread content entered by user
      author: userId, // pass current user's id to link thread to correct author
      communityId: organization ? organization.id : null, // attach organization id if user belongs to one
      path: pathname, // pass current page path for backend redirect or tracking
    });

    router.push("/"); // redirect to homepage after successful thread creation for better user experience
  };

  return (
    <Form {...form}> 
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)} // bind submit handler to validate and process form data
      >
        <FormField
          control={form.control} // connect this field to react-hook-form for state and validation
          name='thread' // specify that this field maps to 'thread' in form schema
          render={({ field }) => ( // render logic and UI for thread input field
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} /> // bind textarea to react-hook-form to track and validate thread input
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'> 
          Post Thread 
        </Button> 
      </form> 
    </Form> 
  );
}

export default PostThread; // export component so it can be used for thread creation in community or user context

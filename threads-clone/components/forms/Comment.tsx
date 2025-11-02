"use client"; // mark this file as a client component to enable hooks and client-side rendering

import { z } from "zod"; // import zod for defining and validating schema for comment form data
import Image from "next/image"; // import next/image for optimized image rendering of user profile
import { useForm } from "react-hook-form"; // import react-hook-form to manage form state and handle validation
import { usePathname } from "next/navigation"; // import hook to get current route path for backend reference
import { zodResolver } from "@hookform/resolvers/zod"; // connect zod schema validation with react-hook-form

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"; // import reusable form components for consistent structure

import { Input } from "../ui/input"; // import styled input field component for comment input
import { Button } from "../ui/button"; // import styled button component for submitting comment

import { CommentValidation } from "@/lib/validations/thread"; // import schema defining rules for valid comment content
import { addCommentToThread } from "@/lib/actions/thread.actions"; // import server action to add a comment to a specific thread

interface Props { // define Props interface to specify expected component props
  threadId: string; // store id of the thread where comment should be added
  currentUserImg: string; // store URL of current user's profile image to display beside comment box
  currentUserId: string; // store unique id of current user to link comment to correct user
}

// define a functional component named 'Comment' to handle comment submission logic and rendering which takes following props
function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname(); // get the current page path to send to backend for proper redirection or context tracking

  const form = useForm<z.infer<typeof CommentValidation>>({ // initialize react-hook-form with zod validation for comment input
    resolver: zodResolver(CommentValidation), // link zod schema as resolver to validate user input automatically
    defaultValues: { // define initial values for the form fields
      thread: "", // initialize comment text field as empty for new comment input
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => { // define async handler to process form submission
    await addCommentToThread( // call backend action to store new comment in database
      threadId, // pass thread id so backend knows which thread to attach the comment to
      values.thread, // pass user's comment text to be stored
      JSON.parse(currentUserId), // parse and pass current user's id to associate comment with them
      pathname // pass current route to backend for potential navigation or context
    );

    form.reset(); // reset form after successful submission to clear input field
  };

  return (
    <Form {...form}> 
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}> 
        <FormField
          control={form.control} // connect form field to react-hook-form state management
          name='thread' // bind input field to 'thread' property in schema
          render={({ field }) => ( // render UI logic for text input and user image
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel> 
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                /> 
              </FormLabel>
              <FormControl className='border-none bg-transparent'> 
                <Input
                  type='text'
                  {...field} // connect input element to react-hook-form so typing updates form state
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                /> 
              </FormControl>
            </FormItem>
          )}
        /> 

        <Button type='submit' className='comment-form_btn'> 
          Reply 
        </Button> 
      </form> 
    </Form> 
  );
}

export default Comment; // export component so it can be reused wherever users can comment on threads

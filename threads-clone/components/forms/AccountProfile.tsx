"use client"; // mark this file as a client-side component so it can use hooks and browser APIs

import * as z from "zod"; // import zod library for schema validation to ensure user input meets defined rules
import Image from "next/image"; // import optimized Image component from Next.js for efficient image rendering
import { useForm } from "react-hook-form"; // import react-hook-form to handle form state and validation efficiently
import { usePathname, useRouter } from "next/navigation"; // import Next.js navigation hooks to get current path and perform redirects
import { ChangeEvent, useState } from "react"; // import types and hooks from React to manage state and handle change events
import { zodResolver } from "@hookform/resolvers/zod"; // connect zod validation schema with react-hook-form using a resolver

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // import reusable form components for consistent UI and structure
import { Input } from "@/components/ui/input"; // import styled input component for text and file inputs
import { Button } from "@/components/ui/button"; // import styled button component for submission
import { Textarea } from "@/components/ui/textarea"; // import styled textarea component for multiline user input

import { useUploadThing } from "@/lib/uploadthing"; // import custom hook to handle file uploads to external storage
import { isBase64Image } from "@/lib/utils"; // import utility function to check if an image string is base64 encoded

import { UserValidation } from "@/lib/validations/user"; // import user validation schema for validating form data
import { updateUser } from "@/lib/actions/user.actions"; // import server action to update user details in the database

interface Props { // define Props interface to enforce the expected props structure for this component
  user: { // define 'user' object containing user data to prefill and update the form
    id: string; // store user id for identifying user in backend updates
    objectId: string; // store database-specific object id for internal references
    username: string; // store username to prefill and update user's handle
    name: string; // store full name to display and edit
    bio: string; // store user's bio to display and edit
    image: string; // store user's profile image URL or base64 data
  };
  btnTitle: string; // store text for submit button label for reusability (e.g., "Save" or "Update")
}

// define a functional component named 'AccountProfile' to render and handle the user account form which takes following props
const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter(); // initialize router to programmatically navigate after form submission
  const pathname = usePathname(); // get current URL path to determine redirect logic
  const { startUpload } = useUploadThing("media"); // extract 'startUpload' to handle image uploads under 'media' endpoint

  const [files, setFiles] = useState<File[]>([]); // create state to store selected image files for uploading

  const form = useForm<z.infer<typeof UserValidation>>({ // initialize form handling with schema-based validation
    resolver: zodResolver(UserValidation), // connect zod schema to validate fields automatically
    defaultValues: { // prefill the form with current user data or empty strings
      profile_photo: user?.image ? user.image : "", // prefill profile image for preview and edit
      name: user?.name ? user.name : "", // prefill user name for editing
      username: user?.username ? user.username : "", // prefill username for editing
      bio: user?.bio ? user.bio : "", // prefill bio for editing
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => { // define async submit handler to process form data
    const blob = values.profile_photo; // store current profile photo value to check for changes

    const hasImageChanged = isBase64Image(blob); // check if the current image is a base64 string meaning it's newly uploaded
    if (hasImageChanged) { // if a new image was added, upload it
      const imgRes = await startUpload(files); // upload selected image files using uploadthing API

      if (imgRes && imgRes[0].fileUrl) { // verify upload succeeded and received valid URL
        values.profile_photo = imgRes[0].fileUrl; // update profile photo URL in form values to store it in database
      }
    }

    await updateUser({ // send updated user data to backend to persist changes
      name: values.name, // pass updated name to API
      path: pathname, // pass current path for potential redirect logic on backend
      username: values.username, // pass updated username to API
      userId: user.id, // pass current user's id for identifying record
      bio: values.bio, // pass updated bio
      image: values.profile_photo, // pass final profile photo URL
    });

    if (pathname === "/profile/edit") { // check if current page is profile edit view
      router.back(); // navigate back to previous page after update to improve UX
    } else {
      router.push("/"); // otherwise redirect user to homepage after profile update
    }
  };

  const handleImage = ( // define function to handle image file selection and preview
    e: ChangeEvent<HTMLInputElement>, // event argument for handling file input changes
    fieldChange: (value: string) => void // callback to update form field value when new image is selected
  ) => {
    e.preventDefault(); // prevent default input behavior to control upload manually

    const fileReader = new FileReader(); // create FileReader instance to convert image file into base64 string

    if (e.target.files && e.target.files.length > 0) { // check if a file was selected by user
      const file = e.target.files[0]; // extract first selected file to process
      setFiles(Array.from(e.target.files)); // store selected files in state for future upload

      if (!file.type.includes("image")) return; // ensure only image files are processed to avoid invalid uploads

      fileReader.onload = async (event) => { // define callback to execute once file is read
        const imageDataUrl = event.target?.result?.toString() || ""; // extract base64 image string from reader result
        fieldChange(imageDataUrl); // update the form field with base64 data to preview before upload
      };

      fileReader.readAsDataURL(file); // trigger reading of file content as base64 encoded string
    }
  };

  return (
    <Form {...form}> 
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)} // bind custom submit handler to process validated form data
      >
        <FormField
          control={form.control} // connect form field to form state management
          name='profile_photo' // bind this field to 'profile_photo' value in schema
          render={({ field }) => ( // render UI with logic for handling file upload and preview
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? ( // if user has selected or existing image, show it
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : ( // otherwise show placeholder profile image
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)} // call custom image handler to preview and prepare upload
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => ( // render controlled text input for user name
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field} // bind input to form state for automatic updates
                />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => ( // render controlled text input for username
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field} // bind input to form for validation and state tracking
                />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => ( // render controlled textarea for user bio
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field} // bind textarea to form for managing bio updates
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'> 
          {btnTitle} 
        </Button> 
      </form>
    </Form>
  );
};

export default AccountProfile; // export component so it can be used for user profile editing or creation

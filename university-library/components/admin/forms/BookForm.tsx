"use client"; // mark this file as a client component to enable browser-side interactivity and form handling in Next.js

import { zodResolver } from "@hookform/resolvers/zod"; // import resolver to integrate Zod validation schema with react-hook-form
import { useForm } from "react-hook-form"; // import hook to manage form state, validation, and submission logic
import { z } from "zod"; // import Zod library to define and enforce runtime validation rules for form data

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // import reusable UI components for structured and accessible form rendering
import { Input } from "@/components/ui/input"; // import custom styled input component for text fields
import { useRouter } from "next/navigation"; // import navigation hook to programmatically redirect users after form submission
import { bookSchema } from "@/lib/validations"; // import Zod validation schema specifically for book data validation
import { Textarea } from "@/components/ui/textarea"; // import textarea component for multi-line input fields like book description
import { Button } from "@/components/ui/button"; // import styled button component for form submission actions
import FileUpload from "@/components/FileUpload"; // import component to handle file uploads like book cover or video
import ColorPicker from "@/components/admin/ColorPicker"; // import color picker component to select cover color interactively
import { createBook } from "@/lib/admin/actions/book"; // import server action to create a new book entry in database
import { toast } from "@/hooks/use-toast"; // import toast hook to display user feedback messages on form actions

interface Props extends Partial<Book> { // define Props interface to allow optional Book fields for flexibility between create and update modes
  type?: "create" | "update"; // define optional prop to differentiate between creating a new book or updating an existing one
}

const BookForm = ({ type, ...book }: Props) => { // define functional component 'BookForm' to handle book creation or update, receiving type and book data as props
  const router = useRouter(); // initialize Next.js router to enable navigation after successful form submission

  const form = useForm<z.infer<typeof bookSchema>>({ // initialize form management using react-hook-form with Zod validation inference for type safety
    resolver: zodResolver(bookSchema), // connect form validation logic to bookSchema to enforce field constraints and data correctness
    defaultValues: { // set initial form field values to ensure controlled inputs and avoid undefined states
      title: "", // initialize book title as empty string since it's required user input
      description: "", // initialize book description field empty to await user-provided details
      author: "", // initialize author field empty to collect author name later
      genre: "", // initialize genre field empty for user selection or input
      rating: 1, // set default rating to minimum valid value for immediate valid state
      totalCopies: 1, // initialize totalCopies to 1 since each book must have at least one copy
      coverUrl: "", // leave cover URL empty until image upload provides link
      coverColor: "", // initialize cover color empty to be chosen using color picker
      videoUrl: "", // leave video URL empty until upload is completed
      summary: "", // initialize summary field empty to store short description of book content
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => { // define async function to handle validated form submission logic
    const result = await createBook(values); // call backend server action to create a new book record in database with form values

    if (result.success) { // check if backend operation completed successfully
      toast({ // trigger toast notification to inform user of success
        title: "Success", // set success toast title
        description: "Book created successfully", // provide confirmation message for clarity
      });

      router.push(`/admin/books/${result.data.id}`); // redirect user to newly created book’s admin detail page for further actions
    } else { // handle failed book creation case
      toast({ // show error toast to notify user of failure
        title: "Error", // set toast title indicating problem
        description: result.message, // show descriptive error message from backend response
        variant: "destructive", // apply destructive style variant to visually highlight failure
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book title"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"author"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Author
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book author"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"genre"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Genre
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book genre"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Book rating"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"totalCopies"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Total Copies
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Total copies"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverUrl"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Image
              </FormLabel>
              <FormControl>
                <FileUpload
                  type="image"
                  accept="image/*"
                  placeholder="Upload a book cover"
                  folder="books/covers"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverColor"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Primary Color
              </FormLabel>
              <FormControl>
                <ColorPicker
                  onPickerChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book description"
                  {...field}
                  rows={10}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"videoUrl"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Trailer
              </FormLabel>
              <FormControl>
                <FileUpload
                  type="video"
                  accept="video/*"
                  placeholder="Upload a book trailer"
                  folder="books/videos"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"summary"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Summary
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book summary"
                  {...field}
                  rows={5}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="book-form_btn text-white">
          Add Book to Library
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
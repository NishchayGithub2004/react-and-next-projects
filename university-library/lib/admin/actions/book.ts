"use server"; // enable server-side execution context for this module to ensure database operations run securely on the backend

import { books } from "@/database/schema"; // import books table schema to define target table for inserting new records
import { db } from "@/database/drizzle"; // import initialized drizzle ORM instance for executing SQL queries

export const createBook = async (params: BookParams) => { // define async function to create a new book entry in the database using provided parameters
  try { // wrap operation in try-catch to handle runtime errors gracefully
    const newBook = await db // execute database insertion using drizzle ORM
      .insert(books) // specify books table as insertion target
      .values({ // define data values to insert into new record
        ...params, // spread user-provided book parameters such as title, author, genre, etc.
        availableCopies: params.totalCopies, // initialize availableCopies to totalCopies to indicate all copies are initially available
      })
      .returning(); // return inserted record data for confirmation or further use

    return { // return success response containing newly created book record
      success: true, // indicate operation completed successfully
      data: JSON.parse(JSON.stringify(newBook[0])), // serialize inserted record to ensure proper object structure when returned
    };
  } catch (error) { // catch any error that occurs during database insertion
    console.log(error); // log error details to console for debugging

    return { // return failure response with generic error message
      success: false, // indicate operation failed
      message: "An error occurred while creating the book", // provide human-readable message for frontend or logs
    };
  }
};

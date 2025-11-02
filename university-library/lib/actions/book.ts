"use server"; // enable server-only execution to ensure secure access for database operations like borrowing books

import { db } from "@/database/drizzle"; // import database instance configured with drizzle ORM for SQL queries
import { books, borrowRecords } from "@/database/schema"; // import schema definitions for books and borrowRecords tables
import { eq } from "drizzle-orm"; // import equality operator helper to define WHERE clauses in queries
import dayjs from "dayjs"; // import lightweight date library to handle due date calculations

export const borrowBook = async (params: BorrowBookParams) => { // define async function to process book borrowing requests for users
  const { userId, bookId } = params; // extract user ID and book ID from function parameters to identify borrower and book

  try { // wrap all DB logic in try-catch to handle runtime or SQL errors safely
    const book = await db // query database to fetch current availability of the requested book
      .select({ availableCopies: books.availableCopies }) // select only availableCopies column to minimize data retrieval
      .from(books) // specify books table as data source
      .where(eq(books.id, bookId)) // filter records to match the requested book ID
      .limit(1); // restrict result set to one book entry for efficiency

    if (!book.length || book[0].availableCopies <= 0) { // check if no book found or no copies left
      return { // return structured error response to notify user
        success: false, // indicate failure
        error: "Book is not available for borrowing", // provide clear message on why borrowing failed
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString(); // calculate due date by adding 7 days to current date for return policy enforcement

    const record = await db.insert(borrowRecords).values({ // insert new borrow record to track who borrowed which book
      userId, // store ID of user borrowing the book to associate record
      bookId, // store ID of borrowed book to reference inventory
      dueDate, // store calculated due date for book return
      status: "BORROWED", // mark record status as currently borrowed
    });

    await db // perform update operation to decrement available copies of the borrowed book
      .update(books) // specify books table for update
      .set({ availableCopies: book[0].availableCopies - 1 }) // reduce availableCopies count by one to reflect current stock
      .where(eq(books.id, bookId)); // ensure update applies to the correct book entry

    return { // return success response after successful borrowing
      success: true, // indicate borrowing operation completed successfully
      data: JSON.parse(JSON.stringify(record)), // serialize DB record into plain JSON for frontend compatibility
    };
  } catch (error) { // handle unexpected errors like DB connection failure or constraint issues
    console.log(error); // log detailed error for debugging in server logs

    return { // return structured failure response
      success: false, // indicate failure
      error: "An error occurred while borrowing the book", // communicate generic error message to frontend
    };
  }
};

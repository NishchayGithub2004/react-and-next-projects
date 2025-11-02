import React from "react"; // import react to define and render the async component
import Image from "next/image"; // import next.js optimized image component for rendering static icons efficiently
import BookCover from "@/components/BookCover"; // import BookCover component to display styled book cover visuals
import BorrowBook from "@/components/BorrowBook"; // import BorrowBook component to handle book borrowing interactions
import { db } from "@/database/drizzle"; // import database instance configured with drizzle ORM for executing SQL queries
import { users } from "@/database/schema"; // import users table schema for database query reference
import { eq } from "drizzle-orm"; // import equality operator function to define conditional queries

interface Props extends Book {
  userId: string; // id of the user interacting with this book
} // extend Book interface and add userId prop for user-specific operations

// define an async functional component named 'BookOverview' to show detailed book info and borrowing eligibility that takes following props
const BookOverview = async ({
  title, // book title to display
  author, // book author name
  genre, // category or genre of the book
  rating, // book rating value
  totalCopies, // total number of copies available in library
  availableCopies, // current number of copies available for borrowing
  description, // detailed description or summary of the book
  coverColor, // color theme for the book cover background
  coverUrl, // url of the book cover image
  id, // unique book identifier
  userId, // id of the user requesting book information
}: Props) => {
  const [user] = await db // execute database query to retrieve user record
    .select() // select all columns from users table
    .from(users) // specify users table as source
    .where(eq(users.id, userId)) // filter user by matching provided userId
    .limit(1); // limit to single record for efficiency

  const borrowingEligibility = {
    isEligible: availableCopies > 0 && user?.status === "APPROVED", // determine if user can borrow: book must be available and user must have approved status
    message:
      availableCopies <= 0 // if no copies are available
        ? "Book is not available" // display message about unavailability
        : "You are not eligible to borrow this book", // otherwise indicate user lacks borrowing privileges
  }; // define borrowing conditions and relevant feedback message

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {user && ( // check if user exists before showing borrow button to prevent null access
          <BorrowBook
            bookId={id} // pass the book id to track which book is being borrowed
            userId={userId} // pass user id for recording borrowing activity
            borrowingEligibility={borrowingEligibility} // pass computed eligibility status and message to control borrowing behavior
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor} // pass book’s background color to match theme
            coverImage={coverUrl} // pass book cover image url to render the front-facing book cover
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor} // reuse color for secondary background copy of book
              coverImage={coverUrl} // reuse image to create visual depth effect
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview; // export component as default for use in the book details page

import React from "react"; // import react library to enable JSX syntax and define the functional component
import { db } from "@/database/drizzle"; // import database instance configured with drizzle ORM to perform SQL queries
import { books } from "@/database/schema"; // import books schema definition to access table columns and structure
import { eq } from "drizzle-orm"; // import equality operator helper from drizzle ORM to build query conditions
import { redirect } from "next/navigation"; // import redirect function to navigate users programmatically on certain conditions
import { auth } from "@/auth"; // import authentication utility to retrieve current user session
import BookOverview from "@/components/BookOverview"; // import BookOverview component to display main book information and metadata
import BookVideo from "@/components/BookVideo"; // import BookVideo component to render embedded book-related video content

// define an asynchronous functional component named 'Page' to display a detailed view of a specific book based on its id
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id; // extract book id from dynamic route parameters to identify which book to display
  
  const session = await auth(); // retrieve current user session to determine user-specific behavior like access or ownership

  const [bookDetails] = await db // query database to fetch details of the book that matches the given id
    .select() // select all columns of the book record for display and usage in components
    .from(books) // specify 'books' table as the source of data
    .where(eq(books.id, id)) // add condition to find a record where the id column equals the route parameter id
    .limit(1); // limit the result to a single record for efficiency and data safety

  if (!bookDetails) redirect("/404"); // if no book is found, redirect user to the 404 page to indicate missing resource

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string}/> {/* render overview section passing all book details and current user's id */}

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} /> {/* render video player component with the book's associated video URL */}
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => ( // split summary text by line breaks to render each line as a separate paragraph
                <p key={i}>{line}</p> // render each summary line in its own paragraph element for readability
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Page; // export Page as default so Next.js treats it as the route component for the book detail page
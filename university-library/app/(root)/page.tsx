import BookList from "@/components/BookList"; // import BookList component to display a scrollable or grid list of multiple books
import BookOverview from "@/components/BookOverview"; // import BookOverview component to feature a detailed display of a single highlighted book
import { db } from "@/database/drizzle"; // import configured drizzle ORM database instance to execute SQL queries
import { books } from "@/database/schema"; // import books schema definition to reference table structure and column names in queries
import { auth } from "@/auth"; // import authentication utility to fetch current user session for personalized data
import { desc } from "drizzle-orm"; // import descending order helper to sort database results by latest creation date

// define an asynchronous functional component named 'Home' to render the homepage showing latest books and featured book overview
const Home = async () => {
  const session = await auth(); // retrieve the current user session to personalize displayed data like user-specific actions

  const latestBooks = (await db // query the database to fetch the most recently added books for the homepage feed
    .select() // select all columns from the books table to display full book details
    .from(books) // specify books table as data source
    .limit(10) // limit the result set to the 10 latest entries to avoid overloading the UI
    .orderBy(desc(books.createdAt))) as unknown as Book[]; // order books by descending creation date to show newest books first and cast result to Book[] type

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} /> {/* render BookOverview for the most recently added book, passing userId for context */}

      <BookList
        title="Latest Books" // set title for the book list section to label it as the latest books
        books={latestBooks.slice(1)} // pass remaining 9 books to BookList to display under the featured book
        containerClassName="mt-28" // apply margin to separate the list visually from the overview
      />
    </>
  );
};

export default Home; // export Home component as default so Next.js uses it as the main page component for the root route

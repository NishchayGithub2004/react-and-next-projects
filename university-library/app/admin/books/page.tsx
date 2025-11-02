import React from "react"; // import react library to enable JSX syntax and define a functional component
import { Button } from "@/components/ui/button"; // import reusable Button component to maintain consistent styling and behavior across the UI
import Link from "next/link"; // import Next.js Link component to provide client-side navigation without page reloads

// define a functional component named 'Page' to render the admin interface that lists all books and provides navigation to create a new book
const Page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2> {/* display section heading to indicate this page lists all available books */}
        <Button className="bg-primary-admin" asChild> {/* render a styled button that acts as a link for creating a new book entry */}
          <Link href="/admin/books/new" className="text-white"> {/* provide navigation to the form page for adding a new book */}
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <p>Table</p> {/* placeholder for future table component that will list existing books in the admin dashboard */}
      </div>
    </section>
  );
};

export default Page; // export Page component as default so Next.js recognizes it as the admin route for managing all books

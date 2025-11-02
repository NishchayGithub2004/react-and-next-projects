import React from "react"; // import react library to enable JSX syntax and define a functional component
import { Button } from "@/components/ui/button"; // import reusable Button component for consistent design and interaction handling
import Link from "next/link"; // import Link component from Next.js to enable client-side navigation without page reload
import BookForm from "@/components/admin/forms/BookForm"; // import BookForm component that renders the form used for creating or editing a book record

// define a functional component named 'Page' to render the admin interface for adding or editing a book entry
const Page = () => {
  return (
    <>
      <Button asChild className="back-btn"> {/* render a styled button that behaves as a link to navigate back to the book list page */}
        <Link href="/admin/books">Go Back</Link> {/* define navigation target to return admin user to books management page */}
      </Button>
      <section className="w-full max-w-2xl">
        <BookForm /> {/* render BookForm component where admin can input or modify book details */}
      </section>
    </>
  );
};

export default Page; // export Page component as default so Next.js treats it as the main route for admin book form page
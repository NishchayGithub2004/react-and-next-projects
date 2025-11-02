import React from "react"; // import react library to enable JSX syntax and define the functional component
import { Button } from "@/components/ui/button"; // import reusable Button component for consistent styling and behavior of buttons
import { signOut } from "@/auth"; // import signOut function to handle user logout and session invalidation
import BookList from "@/components/BookList"; // import BookList component to display a list of book items on the page
import { sampleBooks } from "@/constants"; // import sampleBooks constant as mock data source to display borrowed books temporarily

// define a functional component named 'Page' to render the home or dashboard page showing borrowed books and a logout option
const Page = () => {
  return (
    <>
      <form
        action={async () => { // define an async server action for form submission to handle logout process securely on the server
          "use server"; // specify that this function should run on the server side to maintain authentication security

          await signOut(); // call signOut function to terminate current user session and log the user out
        }}
        className="mb-10"
      >
        <Button>Logout</Button> {/* render logout button to allow user to trigger the sign-out process */}
      </form>

      <BookList title="Borrowed Books" books={sampleBooks} /> {/* render BookList component showing user's borrowed books using sample data */}
    </>
  );
};

export default Page; // export Page as default so Next.js uses it as the main route component for the corresponding path

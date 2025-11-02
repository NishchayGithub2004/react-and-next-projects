"use client"; // enable client-side rendering for this component to allow browser-side interactivity

import React, { useState } from "react"; // import react and useState hook to manage component state
import { Button } from "@/components/ui/button"; // import reusable button component for consistent UI
import Image from "next/image"; // import next.js image component for optimized image rendering
import { useRouter } from "next/navigation"; // import useRouter hook to enable programmatic navigation
import { toast } from "@/hooks/use-toast"; // import custom toast hook to display notifications
import { borrowBook } from "@/lib/actions/book"; // import borrowBook action to handle book borrowing logic

interface Props { // define props interface for type safety and clarity
  userId: string; // userId represents the unique identifier of the user borrowing the book
  bookId: string; // bookId represents the unique identifier of the book to be borrowed
  borrowingEligibility: { // borrowingEligibility defines user's permission status to borrow
    isEligible: boolean; // isEligible indicates if the user is allowed to borrow
    message: string; // message contains reason or feedback about eligibility
  };
}

// define a functional component named 'BorrowBook' to allow users to borrow a book if eligible which takes following props
const BorrowBook = ({ 
  userId, // userId identifies which user is borrowing the book
  bookId, // bookId identifies which book is being borrowed
  borrowingEligibility: { isEligible, message }, // destructure eligibility status and message for validation and feedback
}: Props) => {
  const router = useRouter(); // initialize router to perform page navigation after borrowing
  
  const [borrowing, setBorrowing] = useState(false); // define local state 'borrowing' to track if the process is ongoing

  const handleBorrowBook = async () => { // define async function to handle borrow operation including validation and API call
    if (!isEligible) { // check if user is not eligible before making API call
      toast({ // show toast notification to inform the user about ineligibility
        title: "Error", // display error title
        description: message, // display eligibility message as description
        variant: "destructive", // use destructive variant to indicate failure visually
      });
    }

    setBorrowing(true); // set borrowing state to true to disable button and show progress

    try { // use try block to safely handle async operation and catch runtime errors
      const result = await borrowBook({ bookId, userId }); // call borrowBook action to attempt borrowing using bookId and userId

      if (result.success) { // check if the borrowing action succeeded
        toast({ // show success toast to notify user of completion
          title: "Success", // display success title
          description: "Book borrowed successfully", // show confirmation message
        });

        router.push("/"); // navigate user back to home page after successful borrowing
      } else { 
        toast({ // show error toast if borrowBook returned failure
          title: "Error", // display error title
          description: result.error, // show backend-provided error message
          variant: "destructive", // use destructive variant to indicate issue
        });
      }
    } catch (error) { // handle unexpected runtime or network errors
      toast({ // show toast to inform user about unexpected failure
        title: "Error", // display error title
        description: "An error occurred while borrowing the book", // show generic fallback error message
        variant: "destructive", // visually emphasize failure
      });
    } finally {
      setBorrowing(false); // reset borrowing state to false to re-enable button regardless of outcome
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook} // attach click handler to trigger borrowing process
      disabled={borrowing} // disable button when borrowing is in progress to prevent duplicate requests
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} /> 
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing ..." : "Borrow Book"} {/* conditionally display progress or default label based on borrowing state */}
      </p>
    </Button>
  );
};

export default BorrowBook; // export component as default so it can be imported and used elsewhere

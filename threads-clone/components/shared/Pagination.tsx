"use client"; // mark this file as a client component to allow hooks and client-side navigation behavior

import { useRouter } from "next/navigation"; // import next.js router hook for programmatic navigation between pages

import { Button } from "../ui/button"; // import reusable button component for consistent UI styling

interface Props { // define type for component props to enforce structure and types
  pageNumber: number; // current page number to display and use for navigation
  isNext: boolean; // flag indicating if there is a next page available
  path: string; // base route path to append pagination query parameter
}

function Pagination({ pageNumber, isNext, path }: Props) { // define a functional component named 'Pagination' to handle page switching logic
  const router = useRouter(); // get router instance to perform client-side navigation

  const handleNavigation = (type: string) => { // define function to handle next or previous page navigation based on button click
    let nextPageNumber = pageNumber; // initialize next page number with current value

    if (type === "prev") { // check if user clicked previous button
      nextPageNumber = Math.max(1, pageNumber - 1); // decrease page number but ensure it does not go below 1
    } else if (type === "next") { // check if user clicked next button
      nextPageNumber = pageNumber + 1; // increment page number to go to next page
    }

    if (nextPageNumber > 1) { // if new page number is greater than 1, include query parameter
      router.push(`/${path}?page=${nextPageNumber}`); // navigate to the new page URL with page query parameter
    } else {
      router.push(`/${path}`); // navigate to base path if page number is 1 (no query needed)
    }
  };

  if (!isNext && pageNumber === 1) return null; // conditionally hide pagination if only one page exists and no next page is available

  return ( // return jsx structure for rendering pagination buttons and current page number
    <div className='pagination'>
      <Button
        onClick={() => handleNavigation("prev")} // trigger previous page navigation when clicked
        disabled={pageNumber === 1} // disable previous button if already on first page
        className='!text-small-regular text-light-2'
      >
        Prev
      </Button>
      <p className='text-small-semibold text-light-1'>{pageNumber}</p> {/* display current page number */}
      <Button
        onClick={() => handleNavigation("next")} // trigger next page navigation when clicked
        disabled={!isNext} // disable next button if no next page exists
        className='!text-small-regular text-light-2'
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination; // export Pagination component as default for use in paginated lists or feeds
"use client"; // mark this file as a client component to enable use of React hooks and browser-based routing

import Image from "next/image"; // import next.js image component for optimized and responsive image rendering
import { useRouter } from "next/navigation"; // import router hook for programmatic navigation within next.js
import { useEffect, useState } from "react"; // import React hooks for state management and side effects

import { Input } from "../ui/input"; // import reusable input component with consistent UI styling

interface Props { // define props interface for type safety
  routeType: string; // specify the base route where search results should be displayed
}

function Searchbar({ routeType }: Props) { // define a functional component named 'Searchbar' for handling text-based search navigation
  const router = useRouter(); // get router instance to perform client-side navigation
  const [search, setSearch] = useState(""); // initialize state variable to store user's search query

  useEffect(() => { // use side effect to handle search query changes with debounce
    const delayDebounceFn = setTimeout(() => { // create delay before performing navigation to reduce frequent rerenders
      if (search) { // check if user entered a search query
        router.push(`/${routeType}?q=` + search); // navigate to route with query parameter for filtering results
      } else {
        router.push(`/${routeType}`); // navigate to base route when search is cleared
      }
    }, 300); // wait 300ms after user stops typing before executing navigation

    return () => clearTimeout(delayDebounceFn); // clear timeout to prevent overlapping navigations on rapid typing
  }, [search, routeType]); // re-run effect when search input or route type changes

  return ( // return jsx structure for rendering the search bar
    <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text' // assign input field id for accessibility
        value={search} // bind input value to local state
        onChange={(e) => setSearch(e.target.value)} // update search state when user types in input field
        placeholder={`${ // dynamically set placeholder text based on route type
          routeType !== "/search" ? "Search communities" : "Search creators"
        }`}
        className='no-focus searchbar_input' // apply styling for consistent input appearance
      />
    </div>
  );
}

export default Searchbar; // export Searchbar component for use in pages or layout requiring search functionality

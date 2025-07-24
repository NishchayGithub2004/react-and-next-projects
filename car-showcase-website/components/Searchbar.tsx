"use client"; /* content written in this file will be rendered only on client side
since this content is not required to run on server side, and content by default
runs on both client and server side, so running it on server side unnecessarily decreases performance */

import Image from "next/image"; // import in-built 'Image' component from 'next' framework to render images
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // import 'useRouter' hook from 'next/navigation' to redirect to different pages
import SearchManufacturer from "./SearchManufacturer"; // import 'SearchManufacturer' component from './SearchManufacturer' directory

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type='submit' className={`-ml-3 z-10 ${otherClasses}`}>
    <Image src={"/magnifying-glass.svg"} alt={"magnifying glass"} width={40} height={40} className='object-contain'/>
  </button>
);

const SearchBar = () => {
  const [manufacturer, setManuFacturer] = useState(""); // create state variable 'manufacturer' and its setter function 'setManuFacturer' using 'useState' hook
  const [model, setModel] = useState(""); // create state variable'model' and its setter function'setModel' using 'useState' hook

  const router = useRouter(); // create an object of 'useRouter' hook

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => { // create a function 'handleSearch' that takes an object 'e' of type <form> tag of HTML
    e.preventDefault(); // prevents the form from refresing the page after giving input

    if (manufacturer.trim() === "" && model.trim() === "") {
      return alert("Please provide some input"); // if both 'manufacturer' and 'model' are empty, return an alert
    }

    updateSearchParams(model.toLowerCase(), manufacturer.toLowerCase()); // otherwise update the URL with new parameters
  };

  // create a function 'updateSearchParams' that takes two parameters 'model' and 'manufacturer' as strings
  const updateSearchParams = (model: string, manufacturer: string) => {
    const searchParams = new URLSearchParams(window.location.search); // get search parameters from the current URL

    // if 'model' is not empty, set it as the value of 'model' parameter, otherwise delete it from the search parameters
    if (model) {
      searchParams.set("model", model);
    } else {
      searchParams.delete("model");
    }

    // if 'manufacturer' is not empty, set it as the value of 'model' parameter, otherwise delete it from the search parameters
    if (manufacturer) {
      searchParams.set("manufacturer", manufacturer);
    } else {
       searchParams.delete("manufacturer");
    }

    const newPathname = `${window.location.pathname}?${searchParams.toString()}`; // create a new URL with new parameters

    router.push(newPathname); // push this new URL to the router
  };

  return (
    <form className='searchbar' onSubmit={handleSearch}>
      <div className='searchbar__item'>
        <SearchManufacturer manufacturer={manufacturer} setManuFacturer={setManuFacturer} />
        <SearchButton otherClasses='sm:hidden' />
      </div>
      <div className='searchbar__item'>
        <Image src='/model-icon.png' width={25} height={25} className='absolute w-[20px] h-[20px] ml-4' alt='car model' />
        {/* create an input field which when has a value insertion or change, calls 'setMode' for input field value */}
        <input type='text' name='model' value={model} onChange={(e) => setModel(e.target.value)} placeholder='Tiguan...' className='searchbar__input' />
        <SearchButton otherClasses='sm:hidden' />
      </div>
      <SearchButton otherClasses='max-sm:hidden' />
    </form>
  );
};

export default SearchBar;
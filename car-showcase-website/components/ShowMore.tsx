"use client"; /* content written in this file will be rendered only on client side
since this content is not required to run on server side, and content by default
runs on both client and server side, so running it on server side unnecessarily decreases performance */

import { useRouter } from "next/navigation"; // import in-built 'useRouter' hook from 'next/navigation' to navigate between pages
import { ShowMoreProps } from "@types"; // import 'ShowMoreProps' type from '@types' directory
import { updateSearchParams } from "@utils"; // import 'updateSearchParams' function from '@utils' directory
import CustomButton from "./CustomButton"; // import 'CustomButton' component from './CustomButton' directory

// create a funtional component 'ShowMore' that takes properties 'pageNumber' and 'isNext' of type 'ShowMoreProps'
const ShowMore = ({ pageNumber, isNext }: ShowMoreProps) => {
  const router = useRouter(); // create an object of 'useRouter' named 'router'

  const handleNavigation = () => {
    const newLimit = (pageNumber + 1) * 10; // calculate the new limit value

    const newPathname = updateSearchParams("limit", `${newLimit}`); // update the search parameter 'limit' with new value
    
    router.push(newPathname); // push new URL to the router which contains new value of 'limit'
  };

  return (
    <div className="w-full flex-center gap-5 mt-10">
      {!isNext && (
        // use 'CustomButton' component clicking which activates 'handleNavigation' function
        <CustomButton btnType="button" title="Show More" containerStyles="bg-primary-blue rounded-full text-white" handleClick={handleNavigation}/>
      )}
    </div>
  );
};

export default ShowMore;
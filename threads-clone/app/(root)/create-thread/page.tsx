import { currentUser } from "@clerk/nextjs"; // import clerk method to retrieve details of the currently authenticated user
import { redirect } from "next/navigation"; // import next.js function to programmatically redirect users to another route

import PostThread from "@/components/forms/PostThread"; // import custom PostThread component used to create a new discussion thread
import { fetchUser } from "@/lib/actions/user.actions"; // import custom function to fetch full user details from the database

async function Page() { // define an asynchronous functional component named 'Page' to handle thread creation logic
  const user = await currentUser(); // retrieve currently logged-in user's authentication data from clerk
  if (!user) return null; // if no authenticated user exists, return null to prevent page rendering

  const userInfo = await fetchUser(user.id); // call backend function to get complete user data using the clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if the user has not completed onboarding, redirect to onboarding page to finish setup

  return ( // return jsx structure that renders the create thread interface
    <>
      <h1 className='head-text'>Create Thread</h1> {/* display page title indicating thread creation */}

      <PostThread userId={userInfo._id} /> {/* render PostThread component and pass user's database id as prop to link the thread to the user */}
    </>
  );
}

export default Page; // export Page component as default so it can be used by next.js routing system

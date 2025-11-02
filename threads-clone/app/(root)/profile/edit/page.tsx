import { currentUser } from "@clerk/nextjs"; // import clerk function to retrieve details of the currently logged-in user
import { redirect } from "next/navigation"; // import next.js helper to programmatically redirect users

import { fetchUser } from "@/lib/actions/user.actions"; // import function to fetch user data from the backend or database
import AccountProfile from "@/components/forms/AccountProfile"; // import AccountProfile component used for editing user profile details

async function Page() { // define an asynchronous next.js server component named 'Page'
  const user = await currentUser(); // fetch the currently authenticated user via clerk authentication
  if (!user) return null; // if there is no logged-in user, return null to prevent unauthorized access

  const userInfo = await fetchUser(user.id); // fetch user details from database using clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if the user hasn’t completed onboarding, redirect to onboarding page

  const userData = { // construct a unified user data object to pass to the AccountProfile component
    id: user.id, // store authenticated user's unique clerk id
    objectId: userInfo?._id, // store the internal database id for linking with database records
    username: userInfo ? userInfo?.username : user.username, // prefer username from database, fallback to clerk username if missing
    name: userInfo ? userInfo?.name : user.firstName ?? "", // prefer name from database, fallback to first name if not yet saved
    bio: userInfo ? userInfo?.bio : "", // prefer bio from database, else set empty string
    image: userInfo ? userInfo?.image : user.imageUrl, // prefer saved profile image, fallback to clerk image url
  };

  return ( // return jsx markup to render edit profile page
    <>
      <h1 className='head-text'>Edit Profile</h1> {/* display page heading for editing profile */}
      <p className='mt-3 text-base-regular text-light-2'>Make any changes</p> {/* provide short instruction text below heading */}
      <section className='mt-12'> {/* section wrapper to provide layout spacing */}
        <AccountProfile user={userData} btnTitle='Continue' /> {/* render profile editing form component with prefilled user data */}
      </section>
    </>
  );
}

export default Page; // export Page component as default for next.js routing system

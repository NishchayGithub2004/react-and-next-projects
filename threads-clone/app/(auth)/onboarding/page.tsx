import { currentUser } from "@clerk/nextjs"; // import currentUser function from clerk to retrieve authenticated user's data
import { redirect } from "next/navigation"; // import redirect utility to programmatically navigate users during SSR

import { fetchUser } from "@/lib/actions/user.actions"; // import server action to fetch user details from database
import AccountProfile from "@/components/forms/AccountProfile"; // import AccountProfile form component to handle onboarding setup

// define an async page component to manage user onboarding flow
async function Page() {
  const user = await currentUser(); // retrieve the currently logged-in user session from clerk
  if (!user) return null; // if no authenticated user exists, return null to prevent rendering and avoid errors

  const userInfo = await fetchUser(user.id); // fetch additional user information from the database using user id
  if (userInfo?.onboarded) redirect("/"); // if user has already completed onboarding, redirect them to homepage to avoid duplicate setup

  const userData = { // construct a userData object combining clerk data and database data for form population
    id: user.id, // assign clerk user id for identification
    objectId: userInfo?._id, // store database object id if exists for reference in updates
    username: userInfo ? userInfo?.username : user.username, // prefer database username if exists, otherwise use clerk username
    name: userInfo ? userInfo?.name : user.firstName ?? "", // prefer database name or fallback to clerk's first name
    bio: userInfo ? userInfo?.bio : "", // prefill bio if available, else start blank
    image: userInfo ? userInfo?.image : user.imageUrl, // use stored profile image or fallback to clerk's user image
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Threds.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Continue' /> {/* render account profile form using prefilled user data */}
      </section>
    </main>
  );
}

export default Page; // export the Page component as default for the onboarding route

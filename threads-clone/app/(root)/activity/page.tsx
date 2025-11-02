import Image from "next/image"; // import next.js optimized image component to efficiently render images with lazy loading and resizing
import Link from "next/link"; // import next.js link component to enable client-side navigation without full page reload
import { currentUser } from "@clerk/nextjs"; // import clerk method to retrieve the currently authenticated user's data
import { redirect } from "next/navigation"; // import next.js redirect function to programmatically navigate to another route

import { fetchUser, getActivity } from "@/lib/actions/user.actions"; // import custom functions to fetch user details and activity data from backend actions

async function Page() { // define an asynchronous functional component named 'Page' to render the user's activity page
  const user = await currentUser(); // retrieve the current logged-in user's information from clerk authentication
  if (!user) return null; // if no user is found, return null to prevent rendering the page for unauthenticated users

  const userInfo = await fetchUser(user.id); // call custom function to fetch the complete user data from database using clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if user has not completed onboarding, redirect them to the onboarding page to ensure setup

  const activity = await getActivity(userInfo._id); // retrieve all recent activities related to this user using their database id

  return ( // return jsx structure that renders the activity section for the user
    <>
      <h1 className='head-text'>Activity</h1> {/* render heading displaying the title 'Activity' */}

      <section className='mt-10 flex flex-col gap-5'> {/* create a section to display activity cards in a column layout with spacing */}
        {activity.length > 0 ? ( // check if the activity array contains any items to conditionally render content
          <>
            {activity.map((activity) => ( // iterate through each activity object to render individual activity cards dynamically
              <Link key={activity._id} href={`/thread/${activity.parentId}`}> {/* create clickable link that navigates to the thread related to the activity */}
                <article className='activity-card'> {/* create container for displaying a single activity item */}
                  <Image
                    src={activity.author.image} // set image source to the author's profile picture
                    alt='user_logo' // set alternate text for accessibility
                    width={20} // specify image width in pixels
                    height={20} // specify image height in pixels
                    className='rounded-full object-cover' // apply styling to make image circular and properly scaled
                  /> {/* render author's profile image */}
                  <p className='!text-small-regular text-light-1'> {/* display text describing the activity */}
                    <span className='mr-1 text-primary-500'> {/* highlight the author's name in a different color */}
                      {activity.author.name} {/* dynamically render the author's name */}
                    </span>{" "} {/* insert a space after the author's name */}
                    replied to your thread {/* display message indicating the user replied to the thread */}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p> // display fallback message when there are no activities
        )}
      </section>
    </>
  );
}

export default Page; // export the Page component as default for use in routing or imports elsewhere

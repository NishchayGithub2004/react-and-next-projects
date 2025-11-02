import Image from "next/image"; // import next.js optimized image component to render responsive and optimized images
import { currentUser } from "@clerk/nextjs"; // import clerk method to get details of the currently authenticated user
import { redirect } from "next/navigation"; // import next.js function to redirect users programmatically

import { profileTabs } from "@/constants"; // import predefined configuration array defining profile tab labels, icons, and values

import ThreadsTab from "@/components/shared/ThreadsTab"; // import ThreadsTab component to display user's threads or related data
import ProfileHeader from "@/components/shared/ProfileHeader"; // import ProfileHeader component to show user profile information
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // import tab components for creating a tabbed layout

import { fetchUser } from "@/lib/actions/user.actions"; // import backend action function to fetch user data from database

async function Page({ params }: { params: { id: string } }) { // define an asynchronous functional component named 'Page' that accepts route parameters
  const user = await currentUser(); // fetch the currently logged-in user using clerk authentication
  if (!user) return null; // if no user is logged in, return null to prevent unauthorized access

  const userInfo = await fetchUser(params.id); // fetch detailed user information from the database using the provided user id from URL params
  if (!userInfo?.onboarded) redirect("/onboarding"); // if user has not completed onboarding, redirect them to the onboarding page

  return ( // return jsx layout for rendering the user profile page
    <section> {/* create section container to hold entire profile content */}
      <ProfileHeader
        accountId={userInfo.id} // pass user’s id to ProfileHeader for identifying the displayed account
        authUserId={user.id} // pass logged-in user’s id to determine access permissions
        name={userInfo.name} // pass user's full name to display as the profile title
        username={userInfo.username} // pass user's handle or username for display
        imgUrl={userInfo.image} // pass user's profile image URL to display as avatar
        bio={userInfo.bio} // pass user's bio text to show personal description
      /> {/* render header section showing user's profile information */}

      <div className='mt-9'> {/* container for tabbed interface with margin at the top */}
        <Tabs defaultValue='threads' className='w-full'> {/* initialize tab system with default selected tab as 'threads' */}
          <TabsList className='tab'> {/* create tab button list container */}
            {profileTabs.map((tab) => ( // iterate through profileTabs array to generate tab triggers dynamically
              <TabsTrigger key={tab.label} value={tab.value} className='tab'> {/* create individual tab trigger button */}
                <Image
                  src={tab.icon} // use the tab’s icon from constants as source for image
                  alt={tab.label} // use tab label as alternative text for accessibility
                  width={24} // set icon width in pixels
                  height={24} // set icon height in pixels
                  className='object-contain' // maintain image proportions inside container
                /> {/* render icon for the tab */}
                <p className='max-sm:hidden'>{tab.label}</p> {/* display tab label text, hidden on small screens */}

                {tab.label === "Threads" && ( // conditionally render thread count only for the Threads tab
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'> {/* small badge showing thread count */}
                    {userInfo.threads.length} {/* dynamically display number of threads user has posted */}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => ( // iterate through tabs again to define content for each tab section
            <TabsContent
              key={`content-${tab.label}`} // assign unique key to each tab content section
              value={tab.value} // match value with corresponding tab trigger
              className='w-full text-light-1' // apply styling for content area
            >
              {/* @ts-ignore */}
              <ThreadsTab
                currentUserId={user.id} // pass current logged-in user's id to determine interactions allowed
                accountId={userInfo.id} // pass the id of the user whose profile is being viewed
                accountType='User' // specify that this ThreadsTab is for a user profile
              /> {/* render list of threads associated with the user */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page; // export Page component as default for next.js routing

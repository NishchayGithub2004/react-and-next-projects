import Image from "next/image"; // import next.js optimized image component for rendering responsive images efficiently
import { currentUser } from "@clerk/nextjs"; // import clerk method to get the currently authenticated user's data

import { communityTabs } from "@/constants"; // import predefined tab configuration for community sections

import UserCard from "@/components/cards/UserCard"; // import UserCard component to display member profiles
import ThreadsTab from "@/components/shared/ThreadsTab"; // import ThreadsTab component to render community threads or posts
import ProfileHeader from "@/components/shared/ProfileHeader"; // import ProfileHeader component to show community profile information
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // import UI tab components for organizing community sections

import { fetchCommunityDetails } from "@/lib/actions/community.actions"; // import backend function to fetch full details of a community by id

async function Page({ params }: { params: { id: string } }) { // define an asynchronous functional component named 'Page' which takes params containing the community id
  const user = await currentUser(); // get currently logged-in user using clerk authentication
  if (!user) return null; // if no user is authenticated, return null to stop page rendering

  const communityDetails = await fetchCommunityDetails(params.id); // call backend action to fetch all community details including members, threads, and metadata

  return ( // return jsx structure that renders community profile and tabs for threads, members, and requests
    <section> {/* create section wrapper for the entire community page */}
      <ProfileHeader
        accountId={communityDetails.createdBy.id} // pass id of the user who created the community for permission management
        authUserId={user.id} // pass currently logged-in user's id to check authorization level
        name={communityDetails.name} // pass community name to display as profile title
        username={communityDetails.username} // pass community handle or username for identification
        imgUrl={communityDetails.image} // pass community profile image to display as avatar
        bio={communityDetails.bio} // pass community bio text to display description
        type='Community' // specify profile type as 'Community' for conditional rendering in ProfileHeader
      /> {/* render community header section */}

      <div className='mt-9'> {/* container for tabs interface with top margin */}
        <Tabs defaultValue='threads' className='w-full'> {/* initialize tab component with default active tab as 'threads' */}
          <TabsList className='tab'> {/* create list container for tab buttons */}
            {communityTabs.map((tab) => ( // iterate through predefined communityTabs to dynamically create tab triggers
              <TabsTrigger key={tab.label} value={tab.value} className='tab'> {/* create a clickable tab trigger with label and icon */}
                <Image
                  src={tab.icon} // use icon path from tab configuration
                  alt={tab.label} // use label as alt text for accessibility
                  width={24} // set icon width in pixels
                  height={24} // set icon height in pixels
                  className='object-contain' // ensure icon maintains its aspect ratio
                /> {/* render tab icon */}
                <p className='max-sm:hidden'>{tab.label}</p> {/* display tab label text, hidden on small screens */}

                {tab.label === "Threads" && ( // conditionally render thread count only for the 'Threads' tab
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'> {/* create badge showing number of threads */}
                    {communityDetails.threads.length} {/* dynamically display total threads count in the community */}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'> {/* define content section for threads tab */}
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id} // pass logged-in user's id to determine interaction permissions
              accountId={communityDetails._id} // pass community id to fetch and display its threads
              accountType='Community' // specify account type to differentiate from user threads
            /> {/* render list of threads within the community */}
          </TabsContent>

          <TabsContent value='members' className='mt-9 w-full text-light-1'> {/* define content section for members tab */}
            <section className='mt-9 flex flex-col gap-10'> {/* container for displaying community members in a list */}
              {communityDetails.members.map((member: any) => ( // iterate through all members of the community
                <UserCard
                  key={member.id} // assign unique key for each member to optimize rendering
                  id={member.id} // pass member id to UserCard
                  name={member.name} // pass member name to display on card
                  username={member.username} // pass member username to show handle
                  imgUrl={member.image} // pass member profile picture url
                  personType='User' // specify that this card represents a user type
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-light-1'> {/* define content section for membership requests tab */}
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id} // pass logged-in user's id to determine authorization for requests
              accountId={communityDetails._id} // pass community id for backend queries
              accountType='Community' // specify type as community for contextual logic
            /> {/* reuse ThreadsTab component to show request-related data if applicable */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page; // export Page component as default for use by next.js routing system

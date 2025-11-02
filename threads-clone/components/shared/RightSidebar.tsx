import { currentUser } from "@clerk/nextjs"; // import function to get currently authenticated user data from clerk

import UserCard from "../cards/UserCard"; // import reusable component to display user or community information card

import { fetchCommunities } from "@/lib/actions/community.actions"; // import function to fetch community data from database or API
import { fetchUsers } from "@/lib/actions/user.actions"; // import function to fetch user data from database or API

async function RightSidebar() { // define an async functional component named 'RightSidebar' to render sidebar with users and communities
  const user = await currentUser(); // fetch the currently logged-in user from clerk authentication
  if (!user) return null; // return nothing if no user is authenticated to prevent unauthorized rendering

  const similarMinds = await fetchUsers({ // fetch list of users with similar interests or context
    userId: user.id, // pass current user's id to exclude or personalize suggestions
    pageSize: 4, // limit number of users fetched to 4 for concise display
  });

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 }); // fetch up to 4 community suggestions for user to explore

  return ( // return jsx structure for rendering the right sidebar layout
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities {/* display section title for suggested communities */}
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {suggestedCOmmunities.communities.length > 0 ? ( // check if any community suggestions exist
            <>
              {suggestedCOmmunities.communities.map((community) => ( // iterate through community array to render each community card
                <UserCard
                  key={community.id} // provide unique key for React rendering optimization
                  id={community.id} // pass community id as prop to identify entity
                  name={community.name} // pass community name for display
                  username={community.username} // pass community username for subtext
                  imgUrl={community.image} // pass community image for avatar
                  personType='Community' // specify type to customize card behavior or style
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>
              No communities yet {/* message shown if there are no community suggestions */}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3> {/* display section title for similar users */}
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {similarMinds.users.length > 0 ? ( // check if any similar user suggestions exist
            <>
              {similarMinds.users.map((person) => ( // iterate through user list to render user cards
                <UserCard
                  key={person.id} // provide unique key for rendering optimization
                  id={person.id} // pass user id as prop for identification
                  name={person.name} // pass user's display name
                  username={person.username} // pass user's username
                  imgUrl={person.image} // pass user image URL for avatar display
                  personType='User' // specify type to distinguish from communities
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p> // message shown when there are no similar users
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar; // export RightSidebar component as default for use in layout or dashboard

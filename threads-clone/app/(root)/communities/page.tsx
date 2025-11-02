import { currentUser } from "@clerk/nextjs"; // import clerk method to retrieve data of the currently authenticated user
import { redirect } from "next/navigation"; // import next.js function to programmatically redirect users between routes

import Searchbar from "@/components/shared/Searchbar"; // import Searchbar component to allow searching through communities
import Pagination from "@/components/shared/Pagination"; // import Pagination component to handle paginated results display
import CommunityCard from "@/components/cards/CommunityCard"; // import CommunityCard component to render community information cards

import { fetchUser } from "@/lib/actions/user.actions"; // import backend function to fetch full user details from database
import { fetchCommunities } from "@/lib/actions/community.actions"; // import backend function to retrieve list of communities based on filters

async function Page({ // define an asynchronous functional component named 'Page' that renders the communities page
  searchParams, // define parameter to capture URL query parameters used for search and pagination
}: {
  searchParams: { [key: string]: string | undefined }; // specify type of searchParams object where keys are strings and values may be undefined
}) {
  const user = await currentUser(); // fetch currently logged-in user from clerk authentication
  if (!user) return null; // if user is not authenticated, return null to prevent unauthorized access

  const userInfo = await fetchUser(user.id); // fetch additional user details from database using clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if user has not completed onboarding, redirect them to onboarding page

  const result = await fetchCommunities({ // call backend function to fetch paginated list of communities
    searchString: searchParams.q, // pass search query from URL parameter to filter communities by name or keyword
    pageNumber: searchParams?.page ? +searchParams.page : 1, // convert page number from string to number; default to 1 if not present
    pageSize: 25, // define number of communities to display per page
  });

  return ( // return jsx structure that renders communities search and listing interface
    <>
      <h1 className='head-text'>Communities</h1> {/* display main heading for communities page */}

      <div className='mt-5'> {/* container for search bar with top margin */}
        <Searchbar routeType='communities' /> {/* render search bar configured for community search route */}
      </div>

      <section className='mt-9 flex flex-wrap gap-4'> {/* section displaying grid of community cards */}
        {result.communities.length === 0 ? ( // check if there are no matching communities in the result
          <p className='no-result'>No Result</p> // show fallback message when no communities are found
        ) : (
          <> {/* render community cards if results are available */}
            {result.communities.map((community) => ( // iterate through each community object to render its details
              <CommunityCard
                key={community.id} // assign unique key using community id for efficient rendering
                id={community.id} // pass community id to the card for routing or identification
                name={community.name} // pass community name to display as title
                username={community.username} // pass community username or handle
                imgUrl={community.image} // pass community image to display as avatar
                bio={community.bio} // pass short description of the community
                members={community.members} // pass array of members to display membership count or details
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities' // specify base path for pagination links to maintain routing context
        pageNumber={searchParams?.page ? +searchParams.page : 1} // determine active page number for pagination component
        isNext={result.isNext} // indicate if there are more pages available for navigation
      /> {/* render pagination controls below the community list */}
    </>
  );
}

export default Page; // export Page component as default so next.js can use it for routing

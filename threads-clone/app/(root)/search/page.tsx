import { redirect } from "next/navigation"; // import next.js redirect function to programmatically navigate between routes
import { currentUser } from "@clerk/nextjs"; // import clerk method to fetch details of the currently logged-in user

import UserCard from "@/components/cards/UserCard"; // import UserCard component to display individual user information cards
import Searchbar from "@/components/shared/Searchbar"; // import Searchbar component to allow users to search for other users
import Pagination from "@/components/shared/Pagination"; // import Pagination component to navigate through multiple pages of results

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"; // import functions to fetch a single user’s details and multiple users based on query

async function Page({ // define an asynchronous functional component named 'Page' to handle user search and listing functionality
  searchParams, // define parameter 'searchParams' to capture query string parameters from the URL
}: {
  searchParams: { [key: string]: string | undefined }; // specify type of searchParams object, where each key is a string and value can be a string or undefined
}) {
  const user = await currentUser(); // fetch current logged-in user using clerk authentication
  if (!user) return null; // if no authenticated user exists, return null to prevent rendering restricted content

  const userInfo = await fetchUser(user.id); // call backend function to fetch complete user details using clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if user has not finished onboarding, redirect them to onboarding page for setup completion

  const result = await fetchUsers({ // fetch a paginated and filtered list of users based on search query and page number
    userId: user.id, // pass the current user's id to exclude self or tailor the search results accordingly
    searchString: searchParams.q, // pass the search query string obtained from URL parameters to filter users
    pageNumber: searchParams?.page ? +searchParams.page : 1, // convert page number from string to number; default to 1 if not present
    pageSize: 25, // define number of users to display per page for pagination
  });

  return ( // return jsx structure that renders the user search interface
    <section> {/* create a section container for search results page layout */}
      <h1 className='head-text mb-10'>Search</h1> {/* display main heading for the search page */}

      <Searchbar routeType='search' /> {/* render search bar component to handle search input and routing */}

      <div className='mt-14 flex flex-col gap-9'> {/* container for displaying user cards or no-result message */}
        {result.users.length === 0 ? ( // check if there are any users returned from search results
          <p className='no-result'>No Result</p> // display message when no matching users are found
        ) : (
          <> {/* render user cards if search results are available */}
            {result.users.map((person) => ( // iterate over each user in result set to display their details
              <UserCard
                key={person.id} // assign unique key using user's id to optimize rendering
                id={person.id} // pass user id to UserCard to identify the user
                name={person.name} // pass user's name to be displayed on card
                username={person.username} // pass user's username to display their handle
                imgUrl={person.image} // pass user's profile image to show avatar
                personType='User' // specify that this card represents a user type entity
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search' // specify the base path for pagination links to maintain correct route
        pageNumber={searchParams?.page ? +searchParams.page : 1} // determine current page number for active pagination state
        isNext={result.isNext} // indicate whether there are more pages available for navigation
      /> {/* render pagination controls for navigating between result pages */}
    </section>
  );
}

export default Page; // export Page component as default for use in next.js routing system

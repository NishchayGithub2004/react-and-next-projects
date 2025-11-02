import { currentUser } from "@clerk/nextjs"; // import clerk method to get details of the authenticated user
import { redirect } from "next/navigation"; // import next.js navigation method to programmatically redirect users

import ThreadCard from "@/components/cards/ThreadCard"; // import custom component to display individual thread details
import Pagination from "@/components/shared/Pagination"; // import pagination component to handle navigation between thread pages

import { fetchPosts } from "@/lib/actions/thread.actions"; // import backend function to fetch threads from the database
import { fetchUser } from "@/lib/actions/user.actions"; // import backend function to retrieve user information by id

async function Home({ // define an asynchronous functional component named 'Home' that serves as the main homepage
  searchParams, // destructure search parameters from the props for pagination and filtering
}: {
  searchParams: { [key: string]: string | undefined }; // define type for searchParams as a key-value object with string or undefined values
}) {
  const user = await currentUser(); // get the currently logged-in user's details from clerk authentication
  if (!user) return null; // if no user is logged in, stop rendering and return null to prevent access

  const userInfo = await fetchUser(user.id); // fetch additional user details from database using clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // if user has not completed onboarding, redirect them to onboarding page

  const result = await fetchPosts( // fetch posts from database with pagination parameters
    searchParams.page ? +searchParams.page : 1, // convert 'page' parameter from string to number, defaulting to page 1 if missing
    30 // specify page size to limit results to 30 posts per request
  );

  return ( // return jsx content that renders the homepage layout
    <>
      <h1 className='head-text text-left'>Home</h1> {/* display main page heading 'Home' aligned to the left */}

      <section className='mt-9 flex flex-col gap-10'> {/* create a vertical section to list threads with spacing */}
        {result.posts.length === 0 ? ( // check if there are no posts to display
          <p className='no-result'>No threads found</p> // render message when no threads exist
        ) : ( // otherwise render the available threads
          <>
            {result.posts.map((post) => ( // iterate through fetched posts array to render each thread
              <ThreadCard
                key={post._id} // assign unique key for react rendering using post id
                id={post._id} // pass post id to ThreadCard to identify the thread
                currentUserId={user.id} // pass current logged-in user's id for interaction tracking
                parentId={post.parentId} // pass parent thread id to handle reply hierarchies
                content={post.text} // pass thread text content to display post body
                author={post.author} // pass author object to display user information on post
                community={post.community} // pass community info to show where thread was posted
                createdAt={post.createdAt} // pass timestamp to display when post was created
                comments={post.children} // pass array of comment threads to show replies
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/' // specify root path for pagination links to navigate between home pages
        pageNumber={searchParams?.page ? +searchParams.page : 1} // determine current page number for pagination display
        isNext={result.isNext} // indicate if next page exists to enable forward navigation
      />
    </>
  );
}

export default Home; // export Home component as default so next.js can use it as the main route for homepage

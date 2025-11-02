import { redirect } from "next/navigation"; // import next.js redirect function to navigate users to another route programmatically
import { currentUser } from "@clerk/nextjs"; // import clerk method to get details of the currently authenticated user

import Comment from "@/components/forms/Comment"; // import Comment component to allow users to add comments to a thread
import ThreadCard from "@/components/cards/ThreadCard"; // import ThreadCard component to display thread details and discussions

import { fetchUser } from "@/lib/actions/user.actions"; // import backend action to fetch complete user data from database
import { fetchThreadById } from "@/lib/actions/thread.actions"; // import backend action to fetch a single thread by its id

export const revalidate = 0; // disable next.js data caching to ensure fresh data is fetched on every request

async function page({ params }: { params: { id: string } }) { // define an asynchronous functional component named 'page' which accepts params containing the thread id
  if (!params.id) return null; // if thread id is missing in params, return null to prevent rendering without required data

  const user = await currentUser(); // fetch the currently logged-in user from clerk authentication
  if (!user) return null; // if user is not authenticated, return null to block access

  const userInfo = await fetchUser(user.id); // call backend function to get full user data using the clerk user id
  if (!userInfo?.onboarded) redirect("/onboarding"); // redirect the user to onboarding page if setup is incomplete

  const thread = await fetchThreadById(params.id); // retrieve the specific thread data from backend using thread id

  return ( // return jsx structure that renders thread details, comments, and replies
    <section className='relative'> {/* create a section container with relative positioning for layout control */}
      <div> {/* container for main thread display */}
        <ThreadCard
          id={thread._id} // pass thread’s unique database id to ThreadCard component
          currentUserId={user.id} // pass logged-in user's id to determine ownership and permissions
          parentId={thread.parentId} // pass parent thread id to manage nested comment structure
          content={thread.text} // pass main text content of the thread
          author={thread.author} // pass author object to display user information
          community={thread.community} // pass community details if thread belongs to a specific community
          createdAt={thread.createdAt} // pass creation timestamp to display post time
          comments={thread.children} // pass child comments or replies associated with the thread
        /> {/* render the main thread using ThreadCard */}
      </div>

      <div className='mt-7'> {/* container for comment input section with top margin */}
        <Comment
          threadId={params.id} // pass the thread id where the comment will be posted
          currentUserImg={user.imageUrl} // pass current user's profile image to display beside the comment input
          currentUserId={JSON.stringify(userInfo._id)} // pass user’s database id as a string for identification in comment creation
        /> {/* render comment form allowing users to add replies */}
      </div>

      <div className='mt-10'> {/* container for displaying all reply threads with spacing */}
        {thread.children.map((childItem: any) => ( // iterate through each child comment of the thread
          <ThreadCard
            key={childItem._id} // assign unique key using child thread id to optimize rendering
            id={childItem._id} // pass id of the reply thread
            currentUserId={user.id} // pass logged-in user's id to manage permissions for replies
            parentId={childItem.parentId} // pass parent thread id to maintain reply hierarchy
            content={childItem.text} // pass reply text content
            author={childItem.author} // pass reply author details to display their info
            community={childItem.community} // pass community info if reply is linked to a specific community
            createdAt={childItem.createdAt} // pass creation timestamp of reply for ordering
            comments={childItem.children} // pass nested replies if they exist for further rendering
            isComment // flag this card as a comment type thread for conditional rendering in ThreadCard
          />
        ))}
      </div>
    </section>
  );
}

export default page; // export page component as default to make it available for next.js routing

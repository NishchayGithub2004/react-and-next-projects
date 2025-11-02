import { redirect } from "next/navigation"; // import redirect function to programmatically navigate users when no data is found

import { fetchCommunityPosts } from "@/lib/actions/community.actions"; // import function to fetch posts belonging to a specific community
import { fetchUserPosts } from "@/lib/actions/user.actions"; // import function to fetch posts made by a specific user

import ThreadCard from "../cards/ThreadCard"; // import reusable component to display each post (thread) in a card format

interface Result { // define structure for fetched result data
  name: string; // name of the community or user whose posts are fetched
  image: string; // profile or community image
  id: string; // unique identifier of the user or community
  threads: { // array of thread objects representing posts
    _id: string; // unique id of each thread
    text: string; // content text of the thread
    parentId: string | null; // id of parent thread if this is a reply, null if main post
    author: { // details of the user who created the thread
      name: string;
      image: string;
      id: string;
    };
    community: { // optional community data if thread belongs to a community
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string; // timestamp when thread was created
    children: { // array of child replies associated with the thread
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props { // define props structure for component inputs
  currentUserId: string; // id of the currently logged-in user
  accountId: string; // id of the account (user or community) whose threads are being displayed
  accountType: string; // type of account determining whether it's a user or a community
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) { // define an async component named 'ThreadsTab' to render posts for a user or community
  let result: Result; // declare variable to store fetched thread data

  if (accountType === "Community") { // check if the account type is a community
    result = await fetchCommunityPosts(accountId); // fetch community posts by community id
  } else {
    result = await fetchUserPosts(accountId); // fetch user posts by user id
  }

  if (!result) { // check if no data was returned from fetch call
    redirect("/"); // redirect user to homepage as fallback
  }

  return ( // return jsx for rendering list of threads
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread) => ( // iterate through threads array to display each thread card
        <ThreadCard
          key={thread._id} // assign unique key for React reconciliation
          id={thread._id} // pass thread id for routing or identification
          currentUserId={currentUserId} // pass logged-in user's id for actions like likes or comments
          parentId={thread.parentId} // pass parent thread id for nested comment handling
          content={thread.text} // pass thread text content to display in card
          author={ // determine which author info to display based on account type
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id } // use fetched user's info if viewing a user account
              : {
                  name: thread.author.name, // otherwise use the author of each thread
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={ // determine which community data to show
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image } // use current community details when viewing community page
              : thread.community // otherwise use community info attached to thread
          }
          createdAt={thread.createdAt} // pass creation date to display posting time
          comments={thread.children} // pass array of comment data for rendering replies
        />
      ))}
    </section>
  );
}

export default ThreadsTab; // export ThreadsTab component as default for rendering threads in profile or community pages

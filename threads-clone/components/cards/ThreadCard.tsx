import Image from "next/image"; // import next/image to handle optimized image rendering with lazy loading
import Link from "next/link"; // import next/link for efficient client-side navigation between pages

import { formatDateString } from "@/lib/utils"; // import helper function to format timestamps into readable dates
import DeleteThread from "../forms/DeleteThread"; // import delete thread component to allow thread deletion by author

interface Props { // define Props interface specifying expected data structure for thread rendering
  id: string; // store unique identifier of the thread
  currentUserId: string; // store id of the logged-in user to determine ownership and permissions
  parentId: string | null; // store id of parent thread to manage nested replies
  content: string; // store main content text of the thread
  author: { // define author information object
    name: string; // store name of the thread author
    image: string; // store profile image URL of the author
    id: string; // store id of the author for profile linking
  };
  community: { // define optional community data object
    id: string; // store community id for navigation to its page
    name: string; // store community name for display
    image: string; // store community image for visual context
  } | null;
  createdAt: string; // store timestamp of when the thread was created
  comments: { // define comments array to display user interactions
    author: { // define nested author info for each comment
      image: string; // store profile image of comment author
    };
  }[];
  isComment?: boolean; // determine whether current component is a comment view or main thread
}

// define a functional component named 'ThreadCard' to display thread details and interactions which takes following props
function ThreadCard({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'> 
              <Image
                src={author.image} // load the profile image of the author dynamically
                alt='user_community_image' // provide alt text for accessibility
                fill // make image fill container for consistent scaling
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' /> 
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'> 
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name} 
              </h4> 
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p> 

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <Image
                  src='/assets/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                /> 
                <Link href={`/thread/${id}`}> 
                  <Image
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  /> 
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                /> 
                <Image
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                /> 
              </div>

              {isComment && comments.length > 0 && ( // check if component is comment and show reply count if exists
                <Link href={`/thread/${id}`}> 
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"} 
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)} // pass thread id as string for JSON-safe deletion request
          currentUserId={currentUserId} // pass id of currently logged-in user for permission check
          authorId={author.id} // pass author id to verify ownership before deletion
          parentId={parentId} // pass parent id to maintain thread hierarchy after deletion
          isComment={isComment} // indicate if this deletion request is for a comment
        /> 
      </div>

      {!isComment && comments.length > 0 && ( // display preview of commenters if this is a main thread with replies
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => ( // render up to two comment author images for compact display
            <Image
              key={index} // assign unique key for React list rendering
              src={comment.author.image} // display comment author’s image
              alt={`user_${index}`} // generate accessible alt text dynamically
              width={24} // set fixed width for small avatar display
              height={24} // set fixed height for consistency
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`} // overlap multiple avatars for a group effect
            />
          ))}

          <Link href={`/thread/${id}`}> 
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"} 
            </p> 
          </Link>
        </div>
      )}

      {!isComment && community && ( // display community info only for main threads associated with a community
        <Link
          href={`/communities/${community.id}`} 
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)} // format and display thread creation date
            {community && ` - ${community.name} Community`} // append community name for context
          </p>

          <Image
            src={community.image} // display community logo next to name for identity
            alt={community.name} // use community name as alt text for accessibility
            width={14} // small size icon to indicate affiliation
            height={14} // maintain square ratio
            className='ml-1 rounded-full object-cover'
          /> 
        </Link>
      )}
    </article>
  );
}

export default ThreadCard; // export the component for use in feed, profile, or community pages

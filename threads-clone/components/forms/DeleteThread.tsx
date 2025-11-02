"use client"; // mark this component as a client component to allow usage of hooks and browser APIs

import Image from "next/image"; // import optimized Image component from Next.js for rendering the delete icon efficiently
import { usePathname, useRouter } from "next/navigation"; // import navigation hooks to read current path and navigate programmatically

import { deleteThread } from "@/lib/actions/thread.actions"; // import server action function to delete a thread or comment from database

interface Props { // define Props interface to specify expected inputs for this component
  threadId: string; // store the id of the thread to be deleted so backend knows which one to remove
  currentUserId: string; // store id of currently logged-in user to check if they have permission to delete
  authorId: string; // store id of thread's author to ensure only author can delete their thread
  parentId: string | null; // store id of parent thread to determine if this is a reply or a root thread
  isComment?: boolean; // optional flag to indicate if this thread is a comment to handle redirect logic properly
}

// define a functional component named 'DeleteThread' to show delete icon and handle deletion logic which takes following props
function DeleteThread({ threadId, currentUserId, authorId, parentId, isComment }: Props) {
  const pathname = usePathname(); // get current URL path to determine whether delete option should be shown
  const router = useRouter(); // initialize router to navigate after successful deletion

  if (currentUserId !== authorId || pathname === "/") return null; // prevent rendering delete button if user is not the author or on home page

  return (
    <Image
      src='/assets/delete.svg'
      alt='delte'
      width={18}
      height={18}
      className='cursor-pointer object-contain'
      onClick={async () => { // attach click handler to perform delete action when icon is clicked
        await deleteThread(JSON.parse(threadId), pathname); // call backend function to delete specified thread using its id and path
        if (!parentId || !isComment) { // check if deleted thread is main thread to decide navigation
          router.push("/"); // redirect to homepage after deleting a main thread for better UX
        }
      }}
    />
  );
}

export default DeleteThread; // export component so it can be used in thread or comment lists for deletion functionality

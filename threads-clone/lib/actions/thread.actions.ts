"use server"; // specify that this file runs on the server side in a Next.js app

import { revalidatePath } from "next/cache"; // import a function to manually revalidate cached pages in next.js
import { connectToDB } from "../mongoose"; // import custom function to establish a connection to the mongoDB database
import User from "../models/user.model"; // import mongoose model representing the user collection
import Thread from "../models/thread.model"; // import mongoose model representing discussion threads
import Community from "../models/community.model"; // import mongoose model representing community groups

export async function fetchPosts( // define an async function named fetchPosts to fetch paginated posts for the main feed
  pageNumber = 1, // define parameter pageNumber with default value 1 to indicate the current page of results
  pageSize = 20 // define parameter pageSize with default value 20 to specify number of posts per page
) {
  connectToDB(); // ensure a connection to the mongoDB database before executing queries

  const skipAmount = (pageNumber - 1) * pageSize; // calculate how many posts to skip based on the current page for pagination

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } }) // create a query to find only root-level threads that are not replies
    .sort({ createdAt: "desc" }) // sort threads by newest creation date
    .skip(skipAmount) // skip already retrieved posts for pagination
    .limit(pageSize) // limit number of results to current page size
    .populate({ // populate related fields with referenced data for author
      path: "author", // specify the field to populate from user collection
      model: User, // use the User model to fetch related author details
    })
    .populate({ // populate related community field
      path: "community", // specify the community field to populate
      model: Community, // use the Community model to fetch community data
    })
    .populate({ // populate nested replies for each thread
      path: "children", // specify child threads (replies)
      populate: { // define nested population for authors of replies
        path: "author", // specify the author field of the reply
        model: User, // use User model to fetch user details of reply authors
        select: "_id name parentId image", // limit fields returned to optimize performance
      },
    });

  const totalPostsCount = await Thread.countDocuments({ // count all root-level threads to determine pagination limits
    parentId: { $in: [null, undefined] }, // ensure counting only top-level posts
  });

  const posts = await postsQuery.exec(); // execute the built mongoose query and retrieve post data

  const isNext = totalPostsCount > skipAmount + posts.length; // determine if more pages exist by comparing total count with retrieved count

  return { posts, isNext }; // return fetched posts along with boolean indicating existence of next page
}

interface Params { // define an interface 'Params' to specify the expected structure of parameters for thread creation
  text: string, // define text property to hold the thread's content
  author: string, // define author property to store the ID of the thread's creator
  communityId: string | null, // define communityId property which can be a string or null depending on whether it's part of a community
  path: string, // define path property to specify the route that should be revalidated after thread creation
}

export async function createThread( // define an async function named createThread to handle creation of new threads in the database
  { text, author, communityId, path }: Params // destructure parameters based on the Params interface to access thread details
) {
  try { // begin try block to safely execute database operations and handle any potential errors
    connectToDB(); // ensure an active database connection before performing any database write operations

    const communityIdObject = await Community.findOne( // attempt to find the community object by its id if provided
      { id: communityId }, // query filter to match the community based on provided communityId
      { _id: 1 } // select only the _id field to use as a reference for thread creation
    );

    const createdThread = await Thread.create({ // create a new thread document in the database
      text, // assign provided text as the thread's main content
      author, // link the thread to the user who created it
      community: communityIdObject, // associate the thread with a community if it exists
    });

    await User.findByIdAndUpdate(author, { // update the user's document to include the new thread reference
      $push: { threads: createdThread._id }, // push the newly created thread ID into the user's threads array
    });

    if (communityIdObject) { // check if the thread is associated with a valid community
      await Community.findByIdAndUpdate(communityIdObject, { // update the community's document to include this new thread
        $push: { threads: createdThread._id }, // push the new thread ID into the community's threads array
      });
    }

    revalidatePath(path); // trigger Next.js to revalidate the specified path to update cached pages with new thread data
  } catch (error: any) { // catch any runtime or database errors that occur during the operation
    throw new Error(`Failed to create thread: ${error.message}`); // throw a descriptive error to aid debugging and tracing
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> { // define an async recursive function to fetch all descendant threads of a given parent thread
  const childThreads = await Thread.find({ parentId: threadId }); // query the database to find all direct child threads that have the given threadId as their parentId

  const descendantThreads = []; // initialize an empty array to collect all descendant threads recursively
  
  for (const childThread of childThreads) { // iterate through each direct child thread to explore deeper hierarchy levels
    const descendants = await fetchAllChildThreads(childThread._id); // recursively fetch all nested child threads for the current child
    descendantThreads.push(childThread, ...descendants); // add the current child and all its descendants to the result array
  }

  return descendantThreads; // return the accumulated list of all descendant threads in the hierarchy
}

export async function deleteThread(id: string, path: string): Promise<void> { // define an async function named deleteThread to remove a thread and all its descendants from the database
  try { // begin try block to handle any potential runtime or database errors
    connectToDB(); // ensure a valid database connection before executing delete operations

    const mainThread = await Thread.findById(id).populate("author community"); // find the main thread by its id and populate author and community data for reference

    if (!mainThread) throw new Error("Thread not found"); // throw an error if no thread exists with the provided id

    const descendantThreads = await fetchAllChildThreads(id); // recursively fetch all nested child threads linked to this main thread

    const descendantThreadIds = [ // create an array of all thread IDs to be deleted including main and descendants
      id, ...descendantThreads.map((thread) => thread._id), // combine main thread id with all descendant thread ids
    ];

    const uniqueAuthorIds = new Set( // create a set of unique author IDs from all threads to avoid duplicate updates
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // collect author IDs from descendant threads
        mainThread.author?._id?.toString(), // include main thread's author ID
      ].filter((id) => id !== undefined) // remove any undefined entries caused by missing authors
    );

    const uniqueCommunityIds = new Set( // create a set of unique community IDs associated with threads to ensure efficient update
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // gather community IDs from all descendant threads
        mainThread.community?._id?.toString(), // include main thread's community ID
      ].filter((id) => id !== undefined) // filter out undefined values from threads without communities
    );

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } }); // delete all threads from the database that match the collected IDs

    await User.updateMany( // update user documents to remove references to deleted threads
      { _id: { $in: Array.from(uniqueAuthorIds) } }, // target only affected users
      { $pull: { threads: { $in: descendantThreadIds } } } // remove deleted thread IDs from users' thread lists
    );

    await Community.updateMany( // update community documents to remove deleted thread references
      { _id: { $in: Array.from(uniqueCommunityIds) } }, // target only affected communities
      { $pull: { threads: { $in: descendantThreadIds } } } // remove thread IDs from community thread arrays
    );

    revalidatePath(path); // trigger revalidation of the given path to refresh frontend with updated thread data
  } catch (error: any) { // catch any exception that occurs during the deletion process
    throw new Error(`Failed to delete thread: ${error.message}`); // rethrow descriptive error to assist in debugging
  }
}

export async function fetchThreadById(threadId: string) { // define an async function named fetchThreadById to retrieve a single thread and all its nested relationships by its unique ID
  connectToDB(); // ensure an active database connection before performing the query

  try { // begin try block to handle errors safely during database operations
    const thread = await Thread.findById(threadId) // query the database to find a thread document matching the provided threadId
      .populate({ // populate related author details for the main thread
        path: "author", // specify the author field to populate with full user information
        model: User, // use the User model for population to retrieve author details
        select: "_id id name image", // select only necessary fields to optimize data retrieval
      })
      .populate({ // populate related community details for the main thread
        path: "community", // specify the community field to populate with related data
        model: Community, // use the Community model for population to access community information
        select: "_id id name image", // include only essential fields for efficiency
      })
      .populate({ // populate the child threads and their nested data
        path: "children", // specify the field that stores child threads
        populate: [ // define multiple population rules for nested relationships
          {
            path: "author", // populate each child thread’s author details
            model: User, // use the User model for user information
            select: "_id id name parentId image", // select key identifying and display fields only
          },
          {
            path: "children", // populate deeper nested replies for multi-level discussion threads
            model: Thread, // use the Thread model to fetch nested child threads
            populate: { // further populate author details for those nested children
              path: "author", // specify author field of the nested reply
              model: User, // use User model to populate nested reply authors
              select: "_id id name parentId image", // include limited fields for performance optimization
            },
          },
        ],
      })
      .exec(); // execute the fully built query to retrieve the complete thread document with all nested data

    return thread; // return the fully populated thread object for use in the application
  } catch (err) { // handle any error that occurs during the query execution
    console.error("Error while fetching thread:", err); // log the error to console for debugging
    throw new Error("Unable to fetch thread"); // throw a new descriptive error to signal fetch failure
  }
}

export async function addCommentToThread( // define an async function named addCommentToThread to add a user comment as a child thread to an existing post
  threadId: string, // define parameter threadId to specify the parent thread under which the comment will be added
  commentText: string, // define parameter commentText to contain the text content of the comment
  userId: string, // define parameter userId to identify which user is making the comment
  path: string // define parameter path to indicate which route should be revalidated after the comment is added
) {
  connectToDB(); // ensure an active database connection before interacting with collections

  try { // begin try block to manage database operations safely
    const originalThread = await Thread.findById(threadId); // attempt to find the parent thread by its unique ID to attach the comment

    if (!originalThread) throw new Error("Thread not found"); // throw an error if the provided thread ID does not exist in the database

    const commentThread = new Thread({ // create a new Thread document to represent the comment
      text: commentText, // assign the provided comment text as the body of the comment
      author: userId, // associate the comment with the user who authored it
      parentId: threadId, // link the comment to its parent thread by storing the thread’s ID
    });

    const savedCommentThread = await commentThread.save(); // save the newly created comment thread document to the database

    originalThread.children.push(savedCommentThread._id); // add the ID of the saved comment to the parent thread’s list of child threads

    await originalThread.save(); // update and persist the parent thread to reflect the newly added comment

    revalidatePath(path); // trigger Next.js path revalidation to refresh any cached pages showing this thread
  } catch (err) { // catch any errors that occur during the comment creation process
    console.error("Error while adding comment:", err); // log the error to console for debugging
    throw new Error("Unable to add comment"); // throw a descriptive error to indicate that comment creation failed
  }
}
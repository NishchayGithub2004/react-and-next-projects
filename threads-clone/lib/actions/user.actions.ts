"use server"; // specify that this file should execute on the server side in a Next.js environment

import { FilterQuery, SortOrder } from "mongoose"; // import type definitions for advanced query and sorting support from mongoose
import { revalidatePath } from "next/cache"; // import function to manually trigger page cache revalidation in next.js

import Community from "../models/community.model"; // import mongoose model representing community documents
import Thread from "../models/thread.model"; // import mongoose model representing discussion threads
import User from "../models/user.model"; // import mongoose model representing users

import { connectToDB } from "../mongoose"; // import custom helper function to establish a connection with the mongoDB database

export async function fetchUser(userId: string) { // define an async function named fetchUser to retrieve user data and related communities
  try { // begin try block to handle potential errors during database interaction
    connectToDB(); // ensure an active mongoDB connection before querying data

    return await User.findOne({ id: userId }).populate({ // query database to find a user document matching the given userId and populate its related communities
      path: "communities", // specify the field to populate with related community data
      model: Community, // use the Community model to fetch corresponding community details
    });
  } catch (error: any) { // catch and handle any runtime or database errors
    throw new Error(`Failed to fetch user: ${error.message}`); // throw a descriptive error message to indicate fetch failure
  }
}

interface Params { // define an interface named Params to specify the structure of input data for user update operation
  userId: string; // define userId property to identify which user record to update
  username: string; // define username property to store the user's unique handle
  name: string; // define name property to store the user's display name
  bio: string; // define bio property to hold the user's short biography text
  image: string; // define image property to store the user's profile image URL
  path: string; // define path property to determine which page should be revalidated after update
}

export async function updateUser({ // define an async function named updateUser to create or update a user record in the database
  userId, // extract userId from parameters to identify the target user
  bio, // extract bio to update the user's biography
  name, // extract name to update the user's display name
  path, // extract path to determine post-update page revalidation
  username, // extract username to update the user's handle
  image, // extract image to update the user's profile picture
}: Params): Promise<void> { // specify that the function returns no value but performs async operations
  try { // begin try block to safely handle potential database or runtime errors
    connectToDB(); // ensure an active database connection before attempting to modify user records

    await User.findOneAndUpdate( // perform a database update to either modify existing user or create a new one if missing
      { id: userId }, // query filter to find the user by their unique id
      { // define update fields to modify or set user properties
        username: username.toLowerCase(), // convert username to lowercase for consistent storage and lookups
        name, // assign updated display name
        bio, // assign updated biography text
        image, // assign updated profile image URL
        onboarded: true, // mark user as onboarded after updating details
      },
      { upsert: true } // create the user record if it doesn’t exist already
    );

    if (path === "/profile/edit") { // check if the update occurred on the profile edit page
      revalidatePath(path); // trigger page revalidation in Next.js to refresh cached profile data
    }
  } catch (error: any) { // catch any exceptions that occur during user update or database connection
    throw new Error(`Failed to create/update user: ${error.message}`); // rethrow a descriptive error message for debugging
  }
}

export async function fetchUserPosts(userId: string) { // define an async function named fetchUserPosts to retrieve all threads authored by a specific user
  try { // begin try block to safely handle potential runtime or database errors
    connectToDB(); // ensure an active database connection before performing any queries

    const threads = await User.findOne({ id: userId }).populate({ // query the User collection to find a user by id and populate their threads
      path: "threads", // specify the threads field in the User schema to populate with detailed thread data
      model: Thread, // use the Thread model to retrieve thread documents linked to the user
      populate: [ // define nested population for related entities within each thread
        {
          path: "community", // specify that each thread's community data should be populated
          model: Community, // use the Community model for population to include community details
          select: "name id image _id", // limit the fields returned from the community to essential ones for performance
        },
        {
          path: "children", // specify that each thread’s child replies should be populated
          model: Thread, // use the Thread model to fetch child threads
          populate: { // define nested population for each child thread’s author
            path: "author", // specify the author field within each child thread
            model: User, // use the User model to retrieve information about the reply authors
            select: "name image id", // select minimal fields to identify authors and display avatars
          },
        },
      ],
    });

    return threads; // return the fully populated user document with all threads and related data
  } catch (error) { // catch any errors encountered during the process
    console.error("Error fetching user threads:", error); // log the error to the console for debugging purposes
    throw error; // rethrow the error to allow higher-level handling
  }
}

export async function fetchUsers({ // define an async function named fetchUsers to retrieve paginated user lists with search and sorting functionality
  userId, // extract userId to exclude the current user from search results
  searchString = "", // extract optional searchString with default empty string for user search filtering
  pageNumber = 1, // extract pageNumber with default value 1 for pagination
  pageSize = 20, // extract pageSize with default value 20 to limit number of users per page
  sortBy = "desc", // extract sortBy with default descending order to control sorting by creation date
}: { // define the input parameter structure using an inline type definition
  userId: string; // specify the unique ID of the current user
  searchString?: string; // optional search string to filter users by name or username
  pageNumber?: number; // optional page number for pagination control
  pageSize?: number; // optional page size for pagination control
  sortBy?: SortOrder; // optional sorting order for query results
}) {
  try { // begin try block to handle runtime or database errors gracefully
    connectToDB(); // ensure an active database connection before performing queries

    const skipAmount = (pageNumber - 1) * pageSize; // calculate number of users to skip based on page number for pagination

    const regex = new RegExp(searchString, "i"); // create a case-insensitive regular expression for searching names or usernames

    const query: FilterQuery<typeof User> = { // define a mongoose filter query for retrieving users
      id: { $ne: userId }, // exclude the current user from the result set
    };

    if (searchString.trim() !== "") { // check if a search term was provided by the user
      query.$or = [ // apply logical OR filter to match either username or name fields against the regex
        { username: { $regex: regex } }, // allow partial and case-insensitive username matches
        { name: { $regex: regex } }, // allow partial and case-insensitive name matches
      ];
    }

    const sortOptions = { createdAt: sortBy }; // define sorting order based on the user creation date and requested order

    const usersQuery = User.find(query) // build the query to find users based on search and exclusion filters
      .sort(sortOptions) // apply sorting to order the users by createdAt field
      .skip(skipAmount) // skip already fetched records for pagination
      .limit(pageSize); // limit number of returned users per page to control load

    const totalUsersCount = await User.countDocuments(query); // count total users matching search and filter criteria for pagination

    const users = await usersQuery.exec(); // execute the query and fetch the resulting user documents

    const isNext = totalUsersCount > skipAmount + users.length; // check if more users exist beyond the current page for next-page indication

    return { users, isNext }; // return the list of users along with a boolean indicating next-page availability
  } catch (error) { // catch any exceptions that occur during query execution or database operations
    console.error("Error fetching users:", error); // log the error to the console for debugging
    throw error; // rethrow the error to allow higher-level error handling
  }
}

export async function getActivity(userId: string) { // define an async function named getActivity to fetch replies made by other users on a given user's threads
  try { // begin try block to handle runtime and database errors safely
    connectToDB(); // ensure an active database connection before performing operations

    const userThreads = await Thread.find({ author: userId }); // query the database to find all threads authored by the given user

    const childThreadIds = userThreads.reduce((acc, userThread) => { // iterate over user's threads to collect IDs of their child threads (replies)
      return acc.concat(userThread.children); // concatenate the children IDs of each thread into a single array
    }, []); // initialize accumulator as an empty array to store all reply thread IDs

    const replies = await Thread.find({ // query the database to fetch all replies related to the user's threads
      _id: { $in: childThreadIds }, // filter only threads whose IDs exist in the collected child thread list
      author: { $ne: userId }, // exclude replies authored by the same user to get external engagement only
    }).populate({ // populate author details for each fetched reply
      path: "author", // specify the field to populate with related user information
      model: User, // use the User model to access details about the reply authors
      select: "name image _id", // select minimal fields to include only essential author info
    });

    return replies; // return the list of replies to the user's threads
  } catch (error) { // catch any exception that occurs during the fetch or query process
    console.error("Error fetching replies: ", error); // log the error to the console for debugging
    throw error; // rethrow the error to allow higher-level error handling by the caller
  }
}
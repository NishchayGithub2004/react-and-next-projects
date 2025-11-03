"use server"; // declare this module to run on the server side within Next.js server actions environment

import { FilterQuery, SortOrder } from "mongoose"; // import Mongoose types for filtering and sorting operations

import Community from "../models/community.model"; // import Community model to interact with 'communities' collection
import Thread from "../models/thread.model"; // import Thread model to interact with 'threads' collection (not used in this function)
import User from "../models/user.model"; // import User model to access and modify user data

import { connectToDB } from "../mongoose"; // import function to establish a MongoDB database connection

export async function createCommunity( // define an asynchronous function 'createCommunity' to create and store a new community document
  id: string, // 'id' is a string representing unique identifier for the community
  name: string, // 'name' is a string representing display name of the community
  username: string, // 'username' is a string representing unique community handle
  image: string, // 'image' is a string representing URL or path to the community’s image
  bio: string, // 'bio' is a string representing short description about the community
  createdById: string // 'createdById' is a string representing unique ID of the user who creates the community
) {
  try { // start try block to handle database operations safely
    connectToDB(); // connect to MongoDB database before performing operations

    const user = await User.findOne({ id: createdById }); // find the user document whose 'id' matches the provided creator ID

    if (!user) throw new Error("User not found"); // if user document is not found, throw an error to stop the process

    const newCommunity = new Community({ // create a new community document using provided input data
      id, // assign provided unique ID to community
      name, // assign provided name to community
      username, // assign provided username to community
      image, // assign provided image URL to community
      bio, // assign provided description to community
      createdBy: user._id, // link the community with the creator's MongoDB ObjectId reference
    });

    const createdCommunity = await newCommunity.save(); // save the newly created community document in MongoDB and store the result

    user.communities.push(createdCommunity._id); // push the created community’s ObjectId into the creator’s 'communities' array

    await user.save(); // save updated user document to persist the association with new community

    return createdCommunity; // return the created community document as the function result
  } catch (error) { // catch any errors that occur during community creation process
    console.error("Error creating community:", error); // log detailed error message for debugging
    throw error; // rethrow the caught error to be handled by the caller
  }
}

export async function fetchCommunityDetails(id: string) { // define an asynchronous function 'fetchCommunityDetails' to retrieve full details of a specific community
  try { // start try block to safely handle database operations
    connectToDB(); // connect to MongoDB database before executing any query

    const communityDetails = await Community.findOne({ id }).populate([ // find a single community document matching provided 'id' and populate related fields
      "createdBy", // populate 'createdBy' field to include full user document who created the community
      { // populate 'members' field to include user details for each member
        path: "members", // specify path to populate members data
        model: User, // use 'User' model to resolve ObjectId references in 'members' field
        select: "name username image _id id", // include only essential user fields for cleaner and safer data response
      },
    ]);

    return communityDetails; // return the populated community document containing creator and members information
  } catch (error) { // handle any error that occurs during query or population
    console.error("Error fetching community details:", error); // log detailed error for debugging
    throw error; // rethrow the error to propagate it for higher-level handling
  }
}

export async function fetchCommunityPosts(id: string) { // define an asynchronous function 'fetchCommunityPosts' to retrieve all threads associated with a given community
  try { // start try block to handle asynchronous database operations safely
    connectToDB(); // connect to MongoDB before executing query to ensure active database connection

    const communityPosts = await Community.findById(id).populate({ // find community document by its ObjectId and populate thread data
      path: "threads", // specify the field 'threads' to populate posts belonging to this community
      model: Thread, // use 'Thread' model to populate data for each thread reference
      populate: [ // define nested population to fetch additional related data
        { // populate thread author details
          path: "author", // specify path to access the author of each thread
          model: User, // use 'User' model to fetch user information for the author
          select: "name image id", // select only specific user fields to limit data exposure and improve performance
        },
        { // populate replies or nested threads data
          path: "children", // specify path to populate replies under each thread
          model: Thread, // use 'Thread' model again for nested thread documents
          populate: { // define nested population to include author info of each reply
            path: "author", // specify path to access author of each reply
            model: User, // use 'User' model to resolve author references
            select: "image _id", // select minimal user fields for displaying avatars of reply authors
          },
        },
      ],
    });

    return communityPosts; // return fully populated community document with all related threads and nested author data
  } catch (error) { // catch any runtime or query errors
    console.error("Error fetching community posts:", error); // log detailed error message for debugging
    throw error; // rethrow the error so it can be handled by the calling function
  }
}

export async function fetchCommunities({ // define an asynchronous function 'fetchCommunities' to retrieve a paginated and filtered list of community documents
  searchString = "", // optional search text used to filter communities by name or username
  pageNumber = 1, // page number for pagination, defaults to 1 if not provided
  pageSize = 20, // number of communities to return per page, defaults to 20
  sortBy = "desc", // sorting order for results, defaults to descending order
}: { // define the expected structure and types of input parameters
  searchString?: string; // optional string used for keyword-based search
  pageNumber?: number; // optional number specifying current page index
  pageSize?: number; // optional number specifying how many results per page
  sortBy?: SortOrder; // optional sorting order type provided by mongoose ('asc' or 'desc')
}) {
  try { // start try block to safely execute asynchronous operations
    connectToDB(); // connect to MongoDB database before performing queries

    const skipAmount = (pageNumber - 1) * pageSize; // calculate number of documents to skip for pagination offset

    const regex = new RegExp(searchString, "i"); // create case-insensitive regular expression for searching community names or usernames

    const query: FilterQuery<typeof Community> = {}; // initialize an empty mongoose query object for filtering communities

    if (searchString.trim() !== "") { // check if search string is not empty to apply search filter
      query.$or = [ // define 'OR' condition to match either username or name fields
        { username: { $regex: regex } }, // match communities whose username matches the search text
        { name: { $regex: regex } }, // match communities whose name matches the search text
      ];
    }

    const sortOptions = { createdAt: sortBy }; // define sorting order based on community creation time

    const communitiesQuery = Community.find(query) // execute mongoose find query with defined filters
      .sort(sortOptions) // apply sorting order to retrieved documents
      .skip(skipAmount) // skip a set number of documents based on current page
      .limit(pageSize) // limit number of returned documents to 'pageSize'
      .populate("members"); // populate 'members' field to include user details for each community

    const totalCommunitiesCount = await Community.countDocuments(query); // count total number of communities matching the query for pagination logic

    const communities = await communitiesQuery.exec(); // execute the prepared query and retrieve the resulting community documents

    const isNext = totalCommunitiesCount > skipAmount + communities.length; // determine if there is another page of results beyond the current one

    return { communities, isNext }; // return retrieved communities along with pagination flag indicating if more data exists
  } catch (error) { // catch any error that occurs during fetching or query execution
    console.error("Error fetching communities:", error); // log detailed error message for debugging
    throw error; // rethrow error to propagate it up to the caller for handling
  }
}

export async function addMemberToCommunity( // define an asynchronous function 'addMemberToCommunity' to add a user to a community
  communityId: string, // 'communityId' is a string representing the unique identifier of the community
  memberId: string // 'memberId' is a string representing the unique identifier of the user being added
) {
  try { // start try block to safely handle async database operations
    connectToDB(); // establish a connection to MongoDB before executing queries

    const community = await Community.findOne({ id: communityId }); // find the community document whose 'id' matches the provided communityId

    if (!community) throw new Error("Community not found"); // throw error if no community is found with given id

    const user = await User.findOne({ id: memberId }); // find the user document whose 'id' matches the provided memberId

    if (!user) throw new Error("User not found"); // throw error if no user is found with given id

    if (community.members.includes(user._id)) throw new Error("User is already a member of the community"); // check if user's ObjectId already exists in community's member list and throw error to prevent duplication

    community.members.push(user._id); // add the user's ObjectId to the community's 'members' array to include them as a member
    
    await community.save(); // save updated community document to persist new membership data

    user.communities.push(community._id); // add the community's ObjectId to the user's 'communities' array to record their participation
    
    await user.save(); // save updated user document to persist the association with the community

    return community; // return the updated community document containing new member data
  } catch (error) { // catch any error that occurs during the add member process
    console.error("Error adding member to community:", error); // log detailed error message for debugging
    throw error; // rethrow the caught error for higher-level handling
  }
}

export async function removeUserFromCommunity( // define an asynchronous function 'removeUserFromCommunity' to remove a user from a community
  userId: string, // 'userId' is a string representing the unique identifier of the user being removed
  communityId: string // 'communityId' is a string representing the unique identifier of the community
) {
  try { // start try block to safely execute database operations
    connectToDB(); // establish a connection to MongoDB before performing any queries

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 }); // find user document matching 'id' and retrieve only its '_id' field for internal reference
    
    const communityIdObject = await Community.findOne( // find community document matching 'id' and retrieve only its '_id' field for internal reference
      { id: communityId }, // filter by given communityId
      { _id: 1 } // project only '_id' field to minimize data load
    );

    if (!userIdObject) throw new Error("User not found"); // throw error if no user document exists with given id

    if (!communityIdObject) throw new Error("Community not found"); // throw error if no community document exists with given id

    await Community.updateOne( // update the community document to remove the user from 'members' list
      { _id: communityIdObject._id }, // filter by community's ObjectId
      { $pull: { members: userIdObject._id } } // remove user's ObjectId from 'members' array using MongoDB $pull operator
    );

    await User.updateOne( // update the user document to remove the community from their 'communities' list
      { _id: userIdObject._id }, // filter by user's ObjectId
      { $pull: { communities: communityIdObject._id } } // remove community's ObjectId from user's 'communities' array using $pull
    );

    return { success: true }; // return a success object to confirm that the removal was completed
  } catch (error) { // catch any error that occurs during the removal process
    console.error("Error removing user from community:", error); // log detailed error message for debugging
    throw error; // rethrow the caught error for higher-level error handling
  }
}

export async function updateCommunityInfo( // define an asynchronous function 'updateCommunityInfo' to modify community details
  communityId: string, // 'communityId' is a string representing the unique identifier of the community
  name: string, // 'name' is a string containing the new display name for the community
  username: string, // 'username' is a string representing the unique username/handle for the community
  image: string // 'image' is a string containing the URL for the community’s image
) {
  try { // start try block to handle any runtime or database errors
    connectToDB(); // establish a connection to the MongoDB database before performing operations

    const updatedCommunity = await Community.findOneAndUpdate( // find a community by 'id' and update its details
      { id: communityId }, // filter to match the community document with the given id
      { name, username, image } // specify fields to update with new values
    );

    if (!updatedCommunity) throw new Error("Community not found"); // throw error if no matching community document is found

    return updatedCommunity; // return the updated community document after successful update
  } catch (error) { // catch any errors that occur during the update
    console.error("Error updating community information:", error); // log detailed error for debugging purposes
    throw error; // rethrow the error for higher-level handling
  }
}

export async function deleteCommunity(communityId: string) { // define an asynchronous function 'deleteCommunity' to remove a community and related data
  try { // start try block to safely execute database operations
    connectToDB(); // ensure MongoDB connection is established before performing deletion

    const deletedCommunity = await Community.findOneAndDelete({ // find and delete a community document by 'id'
      id: communityId, // match the given community id to locate the record
    });

    if (!deletedCommunity) throw new Error("Community not found"); // throw error if the community with provided id does not exist

    await Thread.deleteMany({ community: communityId }); // delete all threads that belong to the deleted community to maintain data integrity

    const communityUsers = await User.find({ communities: communityId }); // find all users who are members of the deleted community

    const updateUserPromises = communityUsers.map((user) => { // iterate through each user and remove the deleted community from their 'communities' array
      user.communities.pull(communityId); // remove the communityId reference from user's list of communities
      return user.save(); // save updated user document to persist the change
    });

    await Promise.all(updateUserPromises); // execute all user updates in parallel to optimize performance

    return deletedCommunity; // return the deleted community document after complete cleanup
  } catch (error) { // handle any error that occurs during deletion
    console.error("Error deleting community: ", error); // log the specific error message for debugging
    throw error; // rethrow the error to be handled by the calling function
  }
}
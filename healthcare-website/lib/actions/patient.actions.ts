"use server"; // mark this file as a server-side module to allow use of server actions in Next.js

// from node-appwrite SDK import the following things
import { 
  ID, // 'ID' for generating unique identifiers
  InputFile, // 'InputFile' for handling file uploads
  Query // 'Query' for constructing structured database queries
} from "node-appwrite";

import {
  BUCKET_ID, // import the bucket ID to identify the storage bucket where patient documents are stored
  DATABASE_ID, // import the database ID to identify which Appwrite database to interact with
  ENDPOINT, // import the Appwrite API endpoint used to build document URLs
  PATIENT_COLLECTION_ID, // import the collection ID used to store patient data
  PROJECT_ID, // import the project ID for API calls
  databases, // import the Appwrite database client for CRUD operations
  storage, // import the Appwrite storage client to handle file uploads
  users, // import the Appwrite user client for authentication and user creation
} from "../appwrite.config"; // import all Appwrite configuration details from a centralized config file

import { parseStringify } from "../utils"; // import a helper function that safely parses and stringifies Appwrite response objects

export const createUser = async (user: CreateUserParams) => { // define an async function to create a new Appwrite user using provided user parameters
  try {
    const newuser = await users.create( // call the Appwrite users.create method to create a new user record
      ID.unique(), // generate a unique user ID to ensure no duplication
      user.email, // assign the user’s email to the new Appwrite user
      user.phone, // assign the user’s phone number to the new Appwrite user
      undefined, // skip password since it’s not being directly handled here (Appwrite allows passwordless user creation)
      user.name // assign the user’s display name to the Appwrite user record
    );

    return parseStringify(newuser); // return the created user after converting to JSON-safe format
  } catch (error: any) { // handle any errors that occur during user creation
    if (error && error?.code === 409) { // check if the error code indicates a user already exists (Appwrite error 409)
      const existingUser = await users.list([ // search for the existing user with the same email
        Query.equal("email", [user.email]), // filter by the given email address
      ]);

      return existingUser.users[0]; // return the first matched existing user to avoid duplication
    }
    
    console.error("An error occurred while creating a new user:", error); // log unexpected errors to console for debugging
  }
};

export const getUser = async (userId: string) => { // define an async function to fetch user details by their unique ID
  try {
    const user = await users.get(userId); // call Appwrite users.get to retrieve user data for the given ID
    return parseStringify(user); // return the fetched user after safely parsing and stringifying
  } catch (error) {
    console.error("An error occurred while retrieving the user details:", error); // log errors if fetching fails
  }
};

export const registerPatient = async ({ // define an async function to register a patient with optional ID document upload
  identificationDocument, // destructure the identificationDocument for file upload
  ...patient // collect the rest of the patient fields
}: RegisterUserParams) => {
  try {
    let file; // declare a variable to store the uploaded file reference if available
    
    if (identificationDocument) { // check if a document file was provided for upload
      const inputFile = // prepare the file for upload using Appwrite’s InputFile utility
        identificationDocument &&
        InputFile.fromBlob( // convert browser blob into an Appwrite InputFile instance
          identificationDocument?.get("blobFile") as Blob, // extract the raw binary data (Blob) from FormData
          identificationDocument?.get("fileName") as string // extract the file name for storage identification
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile); // upload the file to the Appwrite storage bucket with a unique ID
    }

    const newPatient = await databases.createDocument( // create a new patient record in the Appwrite database
      DATABASE_ID!, // specify the database ID where the patient data should be saved
      PATIENT_COLLECTION_ID!, // specify the collection ID that holds patient records
      ID.unique(), // generate a unique ID for this patient document
      {
        identificationDocumentId: file?.$id ? file.$id : null, // store the file ID if uploaded, else set null
        identificationDocumentUrl: file?.$id // construct the file URL if uploaded
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}` // dynamically build the accessible file URL
          : null, // otherwise leave it as null
        ...patient, // spread and include all other patient form data fields
      }
    );

    return parseStringify(newPatient); // return the newly created patient record in a parsed-safe format
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error); // log any error that happens during registration or upload
  }
};

export const getPatient = async (userId: string) => { // define an async function to fetch a patient record using associated user ID
  try {
    const patients = await databases.listDocuments( // list all documents in the patient collection matching the given user ID
      DATABASE_ID!, // specify which database to query
      PATIENT_COLLECTION_ID!, // specify which collection contains patient records
      [Query.equal("userId", [userId])] // filter the documents where the userId matches
    );

    return parseStringify(patients.documents[0]); // return the first matching patient record after parsing safely
  } catch (error) {
    console.error("An error occurred while retrieving the patient details:", error); // log any database query error for debugging
  }
};

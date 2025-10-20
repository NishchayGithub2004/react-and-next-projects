'use server'; // mark this file to run only on the server, enabling server-side execution of functions and Next.js server actions

import { currentUser } from '@clerk/nextjs/server'; // import currentUser function from Clerk to fetch the currently authenticated user on the server
import { StreamClient } from '@stream-io/node-sdk'; // import StreamClient class from Stream SDK to interact with Stream API on the backend

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY; // store the Stream API key from environment variables into a constant
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY; // store the Stream API secret key from environment variables into a constant

export const tokenProvider = async () => { // define an asynchronous function named tokenProvider that generates a user token for Stream
    const user = await currentUser(); // call currentUser() to fetch the logged-in user data asynchronously from Clerk

    if (!user) throw new Error('User is not authenticated'); // check if user data is missing and throw an error if the user is not logged in
    
    if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing'); // check if Stream API key is missing and throw an error if not found
    
    if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing'); // check if Stream API secret is missing and throw an error if not found

    const streamClient = new StreamClient( // create a new instance of StreamClient to interact with Stream API
        STREAM_API_KEY, // pass Stream API key as the first argument to authenticate the client
        STREAM_API_SECRET // pass Stream API secret as the second argument to authorize the client
    );

    const issuedAt = Math.floor(Date.now() / 1000) - 60; // calculate token issue time as 60 seconds before current UNIX timestamp to allow slight time drift
    
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // calculate token expiration time as current UNIX timestamp plus one hour (3600 seconds)
    
    const token = streamClient.createToken( // call createToken() method on streamClient to generate a user token
        user.id, // pass the authenticated user's unique ID as the first argument
        expirationTime, // pass the calculated token expiration timestamp as the second argument
        issuedAt // pass the calculated issued-at timestamp as the third argument
    );

    return token; // return the generated Stream authentication token
};

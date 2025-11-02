"use server"; // enable server-side execution context to ensure sensitive operations like auth and DB access run securely

import { eq } from "drizzle-orm"; // import equality operator to define conditional queries for drizzle ORM
import { db } from "@/database/drizzle"; // import drizzle ORM instance to perform SQL operations
import { users } from "@/database/schema"; // import users table schema for defining user-related database operations
import { hash } from "bcryptjs"; // import hash function to securely encrypt passwords before storing
import { signIn } from "@/auth"; // import authentication method to handle credential-based sign-in
import { headers } from "next/headers"; // import headers utility to access request metadata such as IP address
import ratelimit from "@/lib/ratelimit"; // import rate limiting instance to prevent abuse by limiting repeated requests
import { redirect } from "next/navigation"; // import redirect utility to navigate users when rate limits or errors occur
import { workflowClient } from "@/lib/workflow"; // import workflow client to trigger background onboarding workflows after signup
import config from "@/lib/config"; // import configuration object to access environment variables like API URLs

export const signInWithCredentials = async ( // define async function to handle user sign-in via credentials
  params: Pick<AuthCredentials, "email" | "password">, // specify function expects only email and password fields from AuthCredentials type
) => {
  const { email, password } = params; // destructure email and password for easier access during sign-in

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; // extract client IP from request headers to enforce rate limiting, fallback to localhost
  const { success } = await ratelimit.limit(ip); // apply rate limit check for this IP to prevent excessive login attempts

  if (!success) return redirect("/too-fast"); // if limit exceeded, redirect user to rate-limit warning page

  try { // wrap logic in try-catch to gracefully handle sign-in errors
    const result = await signIn("credentials", { // attempt to sign in user using credentials-based provider
      email, // pass provided email for authentication
      password, // pass provided password for verification
      redirect: false, // disable automatic redirection to handle result manually
    });

    if (result?.error) { // check if authentication result contains an error
      return { success: false, error: result.error }; // return failure response with error message for frontend handling
    }

    return { success: true }; // return success response indicating successful sign-in
  } catch (error) { // handle unexpected runtime or network errors
    console.log(error, "Signin error"); // log error details for debugging
    return { success: false, error: "Signin error" }; // return structured failure response
  }
};

export const signUp = async (params: AuthCredentials) => { // define async function to register a new user with given credentials
  const { fullName, email, universityId, password, universityCard } = params; // destructure required fields from signup parameters

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; // extract client IP for rate limiting
  const { success } = await ratelimit.limit(ip); // apply rate limit on signup to avoid spam registration

  if (!success) return redirect("/too-fast"); // redirect user if rate limit threshold exceeded

  const existingUser = await db // check if a user with same email already exists in database
    .select() // select records from users table
    .from(users) // specify users table as source
    .where(eq(users.email, email)) // filter rows where email matches provided email
    .limit(1); // limit result to one record for efficiency

  if (existingUser.length > 0) { // if user record exists, prevent duplicate registration
    return { success: false, error: "User already exists" }; // return descriptive error message
  }

  const hashedPassword = await hash(password, 10); // securely hash user password with salt rounds for safe database storage

  try { // wrap database and workflow operations in try-catch for reliability
    await db.insert(users).values({ // insert new user record into users table
      fullName, // store full name provided during registration
      email, // store user email as unique identifier
      universityId, // store university ID to verify academic affiliation
      password: hashedPassword, // store hashed password instead of plaintext for security
      universityCard, // store uploaded university card for verification purposes
    });

    await workflowClient.trigger({ // trigger onboarding workflow to send welcome or verification email
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`, // use production API endpoint to start workflow
      body: { // include user details required for onboarding process
        email, // send registered email to workflow system
        fullName, // include user's full name for personalization
      },
    });

    await signInWithCredentials({ email, password }); // automatically log user in after successful registration

    return { success: true }; // return success response to confirm signup completed
  } catch (error) { // catch any unexpected issues during signup or workflow execution
    console.log(error, "Signup error"); // log detailed error for debugging
    return { success: false, error: "Signup error" }; // return standardized error response to frontend
  }
};

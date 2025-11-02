import NextAuth, { User } from "next-auth"; // import NextAuth for authentication handling and User type for consistent user object typing
import { compare } from "bcryptjs"; // import compare function to securely verify user-entered password against stored hash
import CredentialsProvider from "next-auth/providers/credentials"; // import credentials provider to enable username-password based login
import { db } from "@/database/drizzle"; // import database connection instance from drizzle ORM for querying data
import { users } from "@/database/schema"; // import users table schema definition for type-safe database operations
import { eq } from "drizzle-orm"; // import equality operator to form SQL where conditions in drizzle ORM

export const { handlers, signIn, signOut, auth } = NextAuth({ // initialize NextAuth and destructure handlers, signIn, signOut, and auth utilities for external use
  session: { // define session configuration for authentication persistence
    strategy: "jwt", // use jwt strategy to store session data in JSON Web Tokens instead of database sessions
  },
  providers: [ // specify authentication providers to be used in the app
    CredentialsProvider({ // configure credentials provider to authenticate using custom username and password logic
      async authorize(credentials) { // define async authorize function to verify user credentials during login attempt
        if (!credentials?.email || !credentials?.password) { // check if both email and password are provided, else reject authentication
          return null; // return null to indicate failed login when input credentials are incomplete
        }

        const user = await db // query the database for a user matching the provided email
          .select() // select all columns from users table
          .from(users) // specify the table to fetch from
          .where(eq(users.email, credentials.email.toString())) // filter rows where email equals provided credential email
          .limit(1); // restrict query to one record to optimize lookup

        if (user.length === 0) return null; // if no matching user is found, return null to deny authentication

        const isPasswordValid = await compare( // securely compare input password with stored hashed password
          credentials.password.toString(), // convert entered password to string to ensure valid comparison input
          user[0].password, // retrieve stored password hash from fetched user record
        );

        if (!isPasswordValid) return null; // if password validation fails, return null to reject login

        return { // return sanitized user object to establish authenticated session
          id: user[0].id.toString(), // assign user id as string for JWT token storage consistency
          email: user[0].email, // include user email in session payload for identity reference
          name: user[0].fullName, // include user full name to personalize session data
        } as User; // cast return object to User type for type safety
      },
    }),
  ],
  pages: { // define custom page routes for authentication flows
    signIn: "/sign-in", // specify custom route for sign-in page to override default NextAuth UI
  },
  callbacks: { // define custom callback functions for token and session customization
    async jwt({ token, user }) { // handle jwt callback triggered during token creation or update
      if (user) { // check if a new user object is available after successful login
        token.id = user.id; // attach user id to JWT token for persistent user identification
        token.name = user.name; // attach user name to JWT token to use in session-level personalization
      }

      return token; // return modified token to be stored in session
    },
    async session({ session, token }) { // handle session callback to customize session data returned to frontend
      if (session.user) { // ensure session.user object exists before modifying it
        session.user.id = token.id as string; // propagate user id from JWT token to session for client-side reference
        session.user.name = token.name as string; // propagate user name from JWT token to session for display or logic use
      }

      return session; // return updated session object for frontend access
    },
  },
});

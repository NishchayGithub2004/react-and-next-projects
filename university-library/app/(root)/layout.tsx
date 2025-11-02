import { ReactNode } from "react"; // import ReactNode type to define the type of children prop expected by the layout component
import Header from "@/components/Header"; // import Header component to display site navigation and branding at the top of the layout
import { auth } from "@/auth"; // import authentication utility to check and retrieve the currently logged-in user session
import { redirect } from "next/navigation"; // import redirect function to programmatically navigate users to a specific route
import { after } from "next/server"; // import after hook to run asynchronous background logic after page rendering
import { db } from "@/database/drizzle"; // import database instance configured with drizzle ORM to interact with the database
import { users } from "@/database/schema"; // import users schema to reference user table columns and structure in queries
import { eq } from "drizzle-orm"; // import equality condition helper from drizzle ORM to build precise query filters

// define an asynchronous functional component named 'Layout' that wraps protected routes and manages user session and header display
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth(); // retrieve the current user's session to verify authentication status

  if (!session) redirect("/sign-in"); // if no valid session exists, redirect the user to the sign-in page to restrict unauthorized access

  after(async () => { // define a background process to execute after the page has been rendered
    if (!session?.user?.id) return; // exit early if session lacks a valid user id to avoid unnecessary database queries

    const user = await db // query the database to fetch the current user's record for activity tracking
      .select() // select all columns from the users table to access last activity date
      .from(users) // specify users table as the source of the query
      .where(eq(users.id, session?.user?.id)) // add condition to find the record matching the current user's id
      .limit(1); // limit the result to one record for efficiency

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) return; // skip update if user activity is already recorded for today

    await db // update the user's record to log the latest activity date
      .update(users) // specify users table for the update operation
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) }) // set the lastActivityDate field to today's date in ISO format
      .where(eq(users.id, session?.user?.id)); // apply update only to the record that matches the current user's id
  });

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header/> {/* render Header component at the top of the layout for navigation and branding */}
        <div className="mt-20 pb-20">{children}</div> {/* render all nested page content passed as children within layout spacing */}
      </div>
    </main>
  );
};

export default Layout; // export Layout component as default so it wraps all authenticated routes in Next.js

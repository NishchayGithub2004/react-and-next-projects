import React, { ReactNode } from "react"; // import react and ReactNode type to define a functional component that accepts children elements
import { auth } from "@/auth"; // import authentication utility to verify and retrieve the current user session
import { redirect } from "next/navigation"; // import redirect function to programmatically navigate users if access control fails

import "@/styles/admin.css"; // import admin-specific CSS file to apply consistent styling to the admin layout
import Sidebar from "@/components/admin/Sidebar"; // import Sidebar component to display admin navigation and links
import Header from "@/components/admin/Header"; // import Header component to display admin controls and user info
import { db } from "@/database/drizzle"; // import configured drizzle ORM database instance to perform queries
import { users } from "@/database/schema"; // import users table schema to reference database fields like user role
import { eq } from "drizzle-orm"; // import equality helper from drizzle ORM to define where conditions in queries

// define an asynchronous functional component named 'Layout' that wraps all admin pages and enforces admin-only access control
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth(); // retrieve current user session to determine authentication status and access level

  if (!session?.user?.id) redirect("/sign-in"); // if session is missing or invalid, redirect user to sign-in page for authentication

  const isAdmin = await db // query the database to check whether the current user has an admin role
    .select({ isAdmin: users.role }) // select only the role column to minimize query load and focus on access verification
    .from(users) // specify users table as the query source
    .where(eq(users.id, session.user.id)) // match current user's id with database record
    .limit(1) // limit result to one record for efficiency
    .then((res) => res[0]?.isAdmin === "ADMIN"); // interpret query result to determine if the user has admin privileges

  if (!isAdmin) redirect("/"); // if user is not an admin, redirect them to home page to prevent unauthorized admin access

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} /> {/* render Sidebar component to provide admin navigation and contextual links based on session */}

      <div className="admin-container">
        <Header session={session} /> {/* render Header component to display admin tools, user info, and navigation shortcuts */}
        {children} {/* render dynamic page content passed as children within the protected admin layout */}
      </div>
    </main>
  );
};

export default Layout; // export Layout component as default so Next.js uses it to wrap all admin-related pages

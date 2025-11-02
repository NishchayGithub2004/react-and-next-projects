import { ReactNode } from "react"; // import ReactNode type to define the expected children type for layout components
import Image from "next/image"; // import Next.js Image component to handle optimized image rendering
import { auth } from "@/auth"; // import authentication function to verify user session state on the server
import { redirect } from "next/navigation"; // import redirect utility to navigate users to another route programmatically

// define an asynchronous functional component named 'Layout' to wrap authentication pages and manage session-based access
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth(); // retrieve current user session to check if the user is already authenticated

  if (session) redirect("/"); // if session exists, redirect authenticated user to home page to prevent access to auth pages

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={37} height={37} /> 
            <h1 className="text-2xl font-semibold text-white">BookWise</h1>
          </div>

          <div>{children}</div> {/* render nested components such as sign-in or sign-up forms inside the layout */}
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout; // export Layout as default so it wraps authentication routes in Next.js

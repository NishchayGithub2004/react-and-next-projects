import {
  isRouteErrorResponse, // import helper to detect router-specific error objects for conditional error handling
  Links, // import component that injects link tags into the document head
  Meta, // import component that injects meta tags into the document head
  Outlet, // import component that renders the active child route element
  Scripts, // import component that injects required script tags for the router runtime
  ScrollRestoration, // import component that restores scroll position between navigations
} from "react-router"; // import all this from react-router to use them

import type { Route } from "./+types/root"; // import route types to ensure correct typing for links function
import "./app.css";
import { usePuterStore } from "~/lib/puter"; // import store hook to access puter init function for backend environment setup
import { useEffect } from "react"; // import useEffect to run initialization when layout mounts

export const links: Route.LinksFunction = () => [ // export links function to inject external fonts into document head
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) { // define a functional component named 'Layout' to wrap the document structure which takes following props
  return ( // return the full HTML document structure because this component runs outside the react tree
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppInitializer /> {/* inject a child component that can safely run react hooks inside the react tree */}
        <script src="https://js.puter.com/v2/"></script>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppInitializer() { // define a functional component named 'AppInitializer' to run initialization logic inside the valid react hook context
  const { init } = usePuterStore(); // extract init function so the backend environment can be initialized properly

  useEffect(() => { // run init when the component mounts so puter environment is ready before any app operations
    init() // call the init function to bootstrap the backend environment
  }, [init]); // depend on init reference so effect stays stable and avoids redundant runs

  return null // return nothing because this component only exists to run initialization logic
}

export default function App() { // define functional component 'App' that serves as root render container
  return <Outlet />; // render the nested route component selected by current URL
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) { // define functional component 'ErrorBoundary' to show fallback UI when errors occur which takes following props
  let message = "Oops!"; // create message container to display primary error heading
  let details = "An unexpected error occurred."; // create details container to describe the error
  let stack: string | undefined; // create variable to optionally hold stack trace in development

  if (isRouteErrorResponse(error)) { // detect whether router produced a known structured error for proper messaging
    message = error.status === 404 ? "404" : "Error"; // set heading based on HTTP code for better UX
    details =
      error.status === 404 // check if the error code is 404 so we can show a specific not-found message
        ? "The requested page could not be found." // return a user-friendly 404 message because the page doesn't exist
        : error.statusText || details // fall back to router's status text or previous details to show accurate error info
  } else if (import.meta.env.DEV && error && error instanceof Error) { // check if running in dev mode with proper error to show debugging info
    details = error.message; // assign full error message for debugging readability
    stack = error.stack; // capture stack trace to show detailed error location
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && ( // conditionally render stack trace only in development to avoid exposing details in production
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

import React from "react"; // import react library to define and render the root layout component
import type { Metadata } from "next"; // import next.js type for defining metadata of the page
import { Inter } from "next/font/google"; // import Inter font from google fonts for consistent typography
import { ClerkProvider } from "@clerk/nextjs"; // import clerk provider to wrap app with authentication context
import { dark } from "@clerk/themes"; // import dark theme for clerk authentication components

import "../globals.css"; // import global stylesheet to apply base styles across the app
import LeftSidebar from "@/components/shared/LeftSidebar"; // import left sidebar component for navigation and user controls
import Bottombar from "@/components/shared/Bottombar"; // import bottom bar component for mobile navigation
import RightSidebar from "@/components/shared/RightSidebar"; // import right sidebar component for suggestions or extra info
import Topbar from "@/components/shared/Topbar"; // import top bar component for app header and profile menu

const inter = Inter({ subsets: ["latin"] }); // load Inter font subset 'latin' and assign its class for consistent usage across body

export const metadata: Metadata = { // define page metadata for SEO and browser title
  title: "Threads", // specify title for the app to appear in browser tab
  description: "A Next.js 13 Meta Threads application", // provide app description for SEO and metadata
};

export default function RootLayout({ // define default exported functional component 'RootLayout' as base layout
  children, // destructure 'children' prop to render nested components inside the layout
}: {
  children: React.ReactNode; // specify type of children as React.ReactNode for type safety
}) {
  return ( // return jsx layout structure for the application
    <ClerkProvider // wrap entire app inside clerk provider to handle authentication and user state
      appearance={{ // configure appearance settings for clerk components
        baseTheme: dark, // apply dark theme globally to match app’s UI style
      }}
    >
      <html lang='en'> {/* define HTML document language as English for accessibility and SEO */}
        <body className={inter.className}> {/* apply Inter font to the entire app body */}
          <Topbar /> {/* render top navigation bar for app header and main controls */}

          <main className='flex flex-row'> {/* create main container with horizontal flex layout */}
            <LeftSidebar /> {/* render left sidebar containing app navigation links */}
            <section className='main-container'> {/* define central section for primary page content */}
              <div className='w-full max-w-4xl'>{children}</div> {/* limit max width and render nested pages/components */}
            </section>
            {/* @ts-ignore */}
            <RightSidebar /> {/* render right sidebar showing user suggestions or related threads */}
          </main>

          <Bottombar /> {/* render bottom navigation bar for mobile view */}
        </body>
      </html>
    </ClerkProvider>
  );
}

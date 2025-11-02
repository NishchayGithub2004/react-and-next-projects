"use client"; // mark this file as a client component to enable use of React hooks and client-side features

import Image from "next/image"; // import next.js image component for optimized image loading and rendering
import Link from "next/link"; // import next.js link component for fast client-side routing
import { usePathname, useRouter } from "next/navigation"; // import hooks for getting current route and programmatic navigation
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs"; // import clerk components and hooks for authentication and sign-out logic

import { sidebarLinks } from "@/constants"; // import predefined array of sidebar link objects containing route, label, and image details

const LeftSidebar = () => { // define a functional component named 'LeftSidebar' to render the application's left navigation sidebar
  const router = useRouter(); // get router instance to enable navigation after sign-out
  
  const pathname = usePathname(); // get current URL path to identify active sidebar link

  const { userId } = useAuth(); // extract currently authenticated user's ID for building profile link dynamically

  return ( // return jsx layout for sidebar rendering
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => { // iterate over sidebarLinks array to render each sidebar navigation option
          const isActive = // determine whether current link corresponds to active route
            (pathname.includes(link.route) && link.route.length > 1) || // check partial match for nested paths
            pathname === link.route; // or exact match for top-level route

          if (link.route === "/profile") link.route = `${link.route}/${userId}`; // append userId to profile route to navigate to specific user profile

          return ( // return jsx for rendering each sidebar link
            <Link
              href={link.route} // set navigation path for the link
              key={link.label} // assign unique key based on label for React reconciliation
              className={`leftsidebar_link ${isActive && "bg-primary-500 "}`} // apply active background if link is currently selected
            >
              <Image
                src={link.imgURL} // render the link’s associated icon
                alt={link.label} // add descriptive alt text for accessibility
                width={24} // set icon width
                height={24} // set icon height
              />

              <p className='text-light-1 max-lg:hidden'>{link.label}</p> {/* render label text for the link, hidden on smaller screens */}
            </Link>
          );
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn> {/* ensure sign-out option is only visible to signed-in users */}
          <SignOutButton signOutCallback={() => router.push("/sign-in")}> {/* define sign-out button and redirect to sign-in after logout */}
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src='/assets/logout.svg' // show logout icon image
                alt='logout' // provide alt text for accessibility
                width={24} // define icon width
                height={24} // define icon height
              />

              <p className='text-light-2 max-lg:hidden'>Logout</p> {/* display logout label, hidden on smaller devices */}
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar; // export LeftSidebar as default component for use in layout or navigation
"use client"; // mark this file as a client component to allow React hooks and client-side interactivity

import Image from "next/image"; // import next.js optimized image component for fast and responsive image rendering
import Link from "next/link"; // import next.js link component for client-side navigation without full page reloads
import { usePathname } from "next/navigation"; // import hook to get current pathname for identifying active route

import { sidebarLinks } from "@/constants"; // import predefined sidebar link data containing route, label, and image info

function Bottombar() { // define a functional component named 'Bottombar' to render a bottom navigation bar
  const pathname = usePathname(); // get the current URL path to determine which link is active

  return ( // return jsx structure for rendering the bottom bar layout
    <section className='bottombar'> 
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => { // iterate through each link object in sidebarLinks array to dynamically render navigation links
          const isActive = // determine if current link should appear active
            (pathname.includes(link.route) && link.route.length > 1) || // check if current route includes link path and ensure it's not root
            pathname === link.route; // or check for exact route match

          return ( // return jsx for each navigation link
            <Link
              href={link.route} // define destination route for the link
              key={link.label} // provide unique key using label to optimize rendering
              className={`bottombar_link ${isActive && "bg-primary-500"}`} // apply active styling if link is currently selected
            >
              <Image
                src={link.imgURL} // load the link's associated icon image
                alt={link.label} // provide alt text for accessibility
                width={16} // set image width
                height={16} // set image height
                className='object-contain' // ensure image maintains aspect ratio
              />

              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {link.label.split(/\s+/)[0]} {/* display only first word of label for cleaner text appearance */}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar; // export Bottombar component as default for use in other parts of the app

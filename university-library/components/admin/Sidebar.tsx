"use client"; // enable client-side rendering to allow dynamic navigation and session-based UI updates

import Image from "next/image"; // import optimized image component for rendering sidebar icons and logos
import { adminSideBarLinks } from "@/constants"; // import sidebar navigation link definitions from constants for admin dashboard
import Link from "next/link"; // import Next.js Link component to enable client-side navigation
import { cn, getInitials } from "@/lib/utils"; // import utility functions: cn for merging class names and getInitials for user avatar display
import { usePathname } from "next/navigation"; // import hook to get current URL path for highlighting active link
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // import avatar components for user profile display
import { Session } from "next-auth"; // import Session type for type-safe access to authenticated user data

const Sidebar = ({ session }: { session: Session }) => { // define Sidebar component to render admin navigation and user info, receiving session as prop
  const pathname = usePathname(); // get current URL pathname to determine which sidebar link is active

  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>BookWise</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => { // iterate through sidebar link definitions to dynamically render navigation items
            const isSelected = // define a variable to determine if the current sidebar link should appear as selected
            (link.route !== "/admin" && // check that the link route is not equal to "/admin" to avoid falsely matching the root admin dashboard
              pathname.includes(link.route) && // check if the current URL path contains the link route to highlight links for subpages
              link.route.length > 1) || // ensure that the route length is greater than 1 to exclude empty or invalid routes
            pathname === link.route; // also check if the current path exactly matches the link route for precise active state detection          

            return (
              <Link href={link.route} key={link.route}> {/* render navigation link for each admin section */}
                <div
                  className={cn(
                    "link",
                    isSelected && "bg-primary-admin shadow-sm", // conditionally apply selected styles when link matches current route
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isSelected ? "brightness-0 invert" : ""}  object-contain`}
                    />
                  </div>

                  <p className={cn(isSelected ? "text-white" : "text-dark")}> {/* dynamically change text color for selected link */}
                    {link.text} {/* display the sidebar link text label */}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        <Avatar> {/* display user avatar section at the bottom of the sidebar */}
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "IN")} {/* display initials derived from user's name when profile image is unavailable */}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p> {/* display logged-in user's full name */}
          <p className="text-xs text-light-500">{session?.user?.email}</p> {/* display logged-in user's email address */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; // export Sidebar component for rendering in admin layout or dashboard pages

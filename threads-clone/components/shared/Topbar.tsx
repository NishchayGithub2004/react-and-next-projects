import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs"; // import authentication and organization management components from clerk
import { dark } from "@clerk/themes"; // import dark theme configuration for consistent visual appearance
import Image from "next/image"; // import next.js image component for optimized rendering
import Link from "next/link"; // import next.js link component for client-side navigation

function Topbar() { // define a functional component named 'Topbar' to render the top navigation bar
  return ( // return jsx for rendering top navigation structure
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'> {/* link to home page with logo and title */}
        <Image src='/logo.svg' alt='logo' width={28} height={28} /> {/* render app logo image */}
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p> {/* display app name, hidden on very small screens */}
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'> {/* render logout option only on mobile view */}
          <SignedIn> {/* ensure logout button only appears when user is signed in */}
            <SignOutButton> {/* render button to handle sign-out action */}
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher // render clerk organization switcher to allow switching between user organizations
          appearance={{ // customize its visual appearance
            baseTheme: dark, // apply dark theme styling for consistency with app's dark mode
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar; // export Topbar component as default for use in main layout or header section

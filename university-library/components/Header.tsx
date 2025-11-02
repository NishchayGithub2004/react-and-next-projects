import Link from "next/link"; // import next.js link component to enable client-side navigation without page reload
import Image from "next/image"; // import next.js image component for optimized and responsive image rendering
import { signOut } from "@/auth"; // import signOut function to log the user out securely via server action
import { Button } from "@/components/ui/button"; // import reusable button component to maintain UI consistency

// define a functional component named 'Header' to display the top navigation section with logout functionality
const Header = () => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/"> 
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} /> 
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => { // define inline async server action to handle logout logic when form is submitted
              "use server"; // specify that this block executes on the server to maintain secure authentication handling

              await signOut(); // call signOut function to terminate the user's session securely
            }}
            className="mb-10"
          >
            <Button>Logout</Button> {/* render logout button that triggers the form’s server action on click */}
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header; // export header component as default so it can be imported into other layouts or pages

import { Home, List, MessageCircle } from "lucide-react"; // import Home to display home navigation icon, List to display categories icon, MessageCircle to display contact icon
import LoginButton from "./LoginButton"; // import LoginButton to render login or logout actions based on auth state
import AuthContextProvider from "@/lib/contexts/AuthContext"; // import AuthContextProvider to supply authentication context to descendant components
import Link from "next/link"; // import Link to enable client-side navigation without full page reloads

export default function Header() { // define a header component to render the main top navigation bar
    return (
        <nav className="flex justify-between items-center px-7 py-3 border-b">
            <Link href={"/"}> {/* navigate to the home page when the logo is clicked */}
                <img className="h-10" src="/logo.png" alt="" />
            </Link>
            
            <ul className="flex gap-6 items-center">
                <Link href={"/"}> {/* navigate to the home page from the navigation menu */}
                    <li className="flex items-center gap-2">
                        <Home />
                        Home
                    </li>
                </Link>
                
                <Link href={"/categories"}> {/* navigate to the categories listing page */}
                    <li className="flex items-center gap-2">
                        <List />
                        Categories
                    </li>
                </Link>
                
                <Link href={"/"}> {/* navigate to the contact page route */}
                    <li className="flex items-center gap-2">
                        <MessageCircle />
                        Contact Us
                    </li>
                </Link>
            </ul>
            
            <AuthContextProvider> {/* provide authentication context so LoginButton can read and react to auth state */}
                <LoginButton />
            </AuthContextProvider>
        </nav>
    )
}
"use client"

import { useAuth } from "@/lib/contexts/AuthContext"; // import useAuth to access authentication state and auth action handlers from context
import Link from "next/link"; // import Link to enable client-side navigation to protected routes

export default function LoginButton() { // define a component responsible for rendering login, logout, and user info UI based on auth state

    const {
        user, // extract user to determine whether a user is authenticated and display profile information
        isLoading, // extract isLoading to handle interim UI state while auth status is resolving
        handleSignInWithGoogle, // extract handleSignInWithGoogle to trigger Google OAuth login flow
        handleLogout, // extract handleLogout to sign the current user out
    } = useAuth(); // use 'useAuth' hook to access auth-related state and actions

    if (isLoading) return <h1>Loading...</h1> // show loading feedback while auth state is initializing

    if (user) { // check whether an authenticated user exists to decide whether to render logged-in or logged-out UI
        return <div className="flex gap-4 items-center">
            <button
                onClick={() => { // attach click handler to trigger logout action when button is pressed
                    handleLogout(); // invoke logout logic to terminate the user session
                }}
                className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full"
            >
                Logout
            </button>

            <Link href="/admin"> {/* navigate authenticated users to the admin dashboard */}
                <div className="flex gap-4 rounded-xl bg-blue-100 px-3 py-2">
                    <img className="object-cover h-12 w-12 rounded-full" src={user?.photoURL} alt="" /> {/* render user's profile photo from data */}

                    <div>
                        <h1 className="font-bold">{user?.displayName}</h1> {/* display the authenticated user's name */}
                        <h1 className="text-sm text-gray-500">{user?.email}</h1> {/* display the authenticated user's email */}
                    </div>
                </div>
            </Link>
        </div>
    }

    return (
        <section>
            <button
                onClick={() => { // attach click handler to initiate Google sign-in flow when this button is pressed
                    handleSignInWithGoogle(); // invoke Google authentication logic
                }}
                className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full">
                <img className="h-7" src="/google.png" alt="" />
                Login With Google
            </button>
        </section>
    )
}
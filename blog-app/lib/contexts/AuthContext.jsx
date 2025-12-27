"use client"

import { 
    GoogleAuthProvider, // import GoogleAuthProvider to enable Google-based authentication with Firebase
    onAuthStateChanged, // import onAuthStateChanged to listen for authentication state changes in real time
    signInWithPopup, // import signInWithPopup to authenticate users via a popup-based OAuth flow
    signOut // import signOut to log the currently authenticated user out
} from "firebase/auth";

import {
    createContext, // import createContext to create a React context for sharing auth state across the app
    useContext, // import useContext to consume the authentication context in child components
    useEffect, // import useEffect to run side effects
    useState // import useState to manage local variables
} from "react";

import { auth } from "../firebase"; // import the initialized Firebase auth instance to perform authentication operations

const AuthContext = createContext(); // create an authentication context to store and provide auth-related state and actions

export default function AuthContextProvider({ children }) { // define a context provider component to wrap the app and supply auth state to descendants
    const [user, setUser] = useState(null); // store the current authenticated user object or null when not logged in
    const [isLoading, setIsLoading] = useState(false); // track whether an authentication-related operation is in progress
    const [error, setError] = useState(null); // store authentication error messages for UI feedback or debugging

    useEffect(() => { // run authentication state subscription logic
        setIsLoading(true) // mark the auth state as loading while checking the current user session
        
        const unsub = onAuthStateChanged(auth, (user) => { // subscribe to Firebase auth state changes and receive the current user on updates
            if (user) {
                setUser(user); // store the authenticated user object when a session exists
            } else {
                setUser(null); // explicitly clear user state when no authenticated session exists
            }
            
            setIsLoading(false) // mark loading as complete after the auth state is resolved
        });
        
        return () => unsub(); // clean up the auth state listener when the provider unmounts
    }, []) // provide an empty dependency array to ensure this effect runs only once on mount

    const handleSignInWithGoogle = async () => { // define a function to initiate Google sign-in when triggered by the UI
        setIsLoading(true) // indicate that a sign-in operation is currently in progress
        
        try {
            await signInWithPopup(auth, new GoogleAuthProvider()); // open a Google OAuth popup and authenticate the user via Firebase
        } catch (error) {
            setError(error?.message) // capture and store any authentication error message for display or logging
        }
        
        setIsLoading(false) // reset loading state after the sign-in attempt completes
    }

    const handleLogout = async () => { // define a function to log the current user out of the application
        setIsLoading(true) // indicate that a logout operation is currently in progress
        
        try {
            await signOut(auth); // sign the user out of Firebase and invalidate the local auth session
        } catch (error) {
            setError(error?.message) // capture and store any logout-related error message
        }
        
        setIsLoading(false) // reset loading state after the logout attempt completes
    }

    return <AuthContext.Provider
        value={{ // provide authentication state and actions to all descendant components via context
            user, // expose the current authenticated user for conditional rendering and logic
            isLoading, // expose loading state so consumers can display spinners or disable UI
            error, // expose error state so consumers can show error messages
            handleSignInWithGoogle, // expose the Google sign-in handler for login actions
            handleLogout, // expose the logout handler for sign-out actions
        }}
    >
        {children /* render wrapped child components so they can access the auth context */}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext); // define and export a custom hook to simplify consuming the auth context
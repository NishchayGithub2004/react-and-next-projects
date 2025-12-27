"use client"

import AuthContextProvider, { useAuth } from "@/lib/contexts/AuthContext"; // import AuthContextProvider to supply auth state and useAuth to consume authenticated user data
import Sidebar from "./components/Sidebar"; // import Sidebar component to render admin navigation UI
import { useAdmin } from "@/lib/firebase/admin/read"; // import useAdmin to verify whether the current user has admin privileges

export default function Layout({ children }) { // define a layout component to wrap admin pages with authentication context
    return (
        <AuthContextProvider>
            <InnerLayout>{children} {/* render nested routes within authenticated admin layout */}</InnerLayout>
        </AuthContextProvider>
    )
}

function InnerLayout({ children }) { // define inner layout to gate content based on auth and admin validation
    const { user, isLoading: authIsLoading } = useAuth(); // retrieve authenticated user and auth loading state from context

    const { data, error, isLoading } = useAdmin({ uid: user?.uid }); // fetch admin record using current user uid to validate access

    if (authIsLoading || isLoading) return <h2>Loading ...</h2> // block rendering until auth and admin checks complete

    if (error) return <p>{error}</p> // render error message if admin lookup fails

    if (!data) return <h1>You are not admin</h1> // deny access when user is not registered as admin

    return (
        <>
            <section className="flex">
                <Sidebar />
                {children} {/* render protected admin content once authorization succeeds */}
            </section>
        </>
    )
}
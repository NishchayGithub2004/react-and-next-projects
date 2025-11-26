import { usePuterStore } from "~/lib/puter"; // import custom store hook to access authentication and loading state, needed for auth logic
import { useEffect } from "react"; // import useEffect to run side-effects such as redirecting after authentication
import { useLocation, useNavigate } from "react-router"; // import routing hooks to read current URL and programmatically navigate

export const meta = () => ([ // define meta function to supply page metadata to the framework
    { title: 'Resumind | Auth' }, // specify document title for browser tab and SEO
    { name: 'description', content: 'Log into your account' }, // add description meta tag for search engines and previews
]);

const Auth = () => { // define Auth component responsible for handling login/logout UI and redirects
    const { isLoading, auth } = usePuterStore(); // extract loading state and auth object from store to manage UI and authentication
    
    const location = useLocation(); // get current location object to access query parameters from URL
    
    const next = location.search.split('next=')[1]; // extract the redirect target from query string to know where to send user post-login
    
    const navigate = useNavigate(); // initialize navigation function to programmatically redirect users

    useEffect(() => { // run effect to redirect user when authentication status changes
        if (auth.isAuthenticated) navigate(next); // if user is authenticated, navigate to the 'next' path to continue workflow
    }, [auth.isAuthenticated, next]); // re-run effect when authentication status or next path changes

    return ( // return UI for authentication screen
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center"> 
            <div className="gradient-border shadow-lg"> 
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10"> 
                    <div className="flex flex-col items-center gap-2 text-center"> 
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    <div> 
                        {isLoading ? ( // conditionally render loading state to inform user and disable interactions
                            <button className="auth-button animate-pulse"> 
                                <p>Signing you in...</p>
                            </button>
                        ) : ( // branch when not loading to allow login or logout actions
                            <>
                                {auth.isAuthenticated ? ( // conditionally check if user is logged in to show logout button
                                    <button className="auth-button" onClick={auth.signOut}> 
                                        <p>Log Out</p>
                                    </button>
                                ) : ( // branch when user is not authenticated to provide login option
                                    <button className="auth-button" onClick={auth.signIn}> 
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth; // export Auth component as default so it can be used by routes and other modules

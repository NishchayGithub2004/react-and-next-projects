'use client'; // enable client-side rendering for this Next.js component

import { useState } from 'react'; // import useState hook to manage local component state
import { useUser } from '@clerk/nextjs'; // import useUser hook to access the authenticated user's data from Clerk
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'; // import components from Stream SDK to handle video call context and theming
import { useParams } from 'next/navigation'; // import useParams hook to access dynamic route parameters in Next.js
import { Loader } from 'lucide-react'; // import Loader icon component from lucide-react for loading indication

import { useGetCallById } from '@/hooks/useGetCallById'; // import custom hook to fetch call details by ID
import Alert from '@/components/Alert'; // import Alert component to display warning or error messages
import MeetingSetup from '@/components/MeetingSetup'; // import MeetingSetup component for meeting setup UI
import MeetingRoom from '@/components/MeetingRoom'; // import MeetingRoom component for the actual meeting room UI

const MeetingPage = () => { // define MeetingPage functional component
    const { id } = useParams(); // extract meeting ID from URL parameters using useParams hook

    const { isLoaded, user } = useUser(); // destructure isLoaded (boolean for user data load state) and user (authenticated user info) from useUser hook

    const { call, isCallLoading } = useGetCallById(id as string); // call custom hook useGetCallById with id cast to string to fetch call details; destructure call data and isCallLoading state

    const [isSetupComplete, setIsSetupComplete] = useState(false); // initialize local state isSetupComplete with false to track if setup is done, and setIsSetupComplete function to update it

    if (!isLoaded || isCallLoading) return <Loader />; // if user data or call data is still loading, render Loader icon to indicate loading state

    if (!call) return ( // if call data is not found, render message indicating that call was not found
        <p className="text-center text-3xl font-bold text-white">
            Call Not Found
        </p>
    );

    const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id)); // define notAllowed variable to check if the user is invited but not present in the call’s members list; ensures only invited members can join

    if (notAllowed) return <Alert title="You are not allowed to join this meeting" />; // if user is not allowed to join, render Alert component with a restriction message

    return ( // render main meeting UI after all checks pass
        <main className="h-screen w-full">
            <StreamCall call={call}> {/* wrap child components with StreamCall to provide video call context using the call object */}
                <StreamTheme> {/* apply Stream SDK theme for consistent UI styling */}
                    {!isSetupComplete ? ( // check if meeting setup is complete
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete} /> // if setup is incomplete, render MeetingSetup component and pass setIsSetupComplete to update setup status
                    ) : (
                        <MeetingRoom /> // if setup is complete, render the main MeetingRoom component
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    );
};

export default MeetingPage; // export MeetingPage component as default for use in routing

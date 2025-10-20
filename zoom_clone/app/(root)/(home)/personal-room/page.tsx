"use client"; // enable client-side rendering for this Next.js component

import { useUser } from "@clerk/nextjs"; // import useUser hook to access authenticated user information from Clerk
import { useStreamVideoClient } from "@stream-io/video-react-sdk"; // import hook to interact with Stream video API client
import { useRouter } from "next/navigation"; // import useRouter hook for programmatic navigation between routes in Next.js

import { useGetCallById } from "@/hooks/useGetCallById"; // import custom hook to retrieve call details by call ID
import { Button } from "@/components/ui/button"; // import reusable Button UI component
import { useToast } from "@/components/ui/use-toast"; // import hook to trigger toast notifications

const Table = ({ // define Table component that accepts title and description props
    title, // title prop represents the label to display on the left
    description, // description prop represents the content value corresponding to the title
}: {
    title: string; // define prop type for title as string
    description: string; // define prop type for description as string
}) => {
    return ( 
        <div className="flex flex-col items-start gap-2 xl:flex-row">
            <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
                {title}:
            </h1>
            <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
                {description}
            </h1>
        </div>
    );
};

const PersonalRoom = () => { // define PersonalRoom functional component
    const router = useRouter(); // initialize router instance to allow navigation using push()

    const { user } = useUser(); // destructure user object from useUser hook to get current authenticated user's data

    const client = useStreamVideoClient(); // initialize Stream video client instance to handle call operations

    const { toast } = useToast(); // destructure toast function from useToast hook to show notification messages

    const meetingId = user?.id; // assign meetingId as the authenticated user's unique ID to represent their personal meeting room

    const { call } = useGetCallById(meetingId!); // call custom hook useGetCallById with non-null meetingId to fetch any existing call data for this user

    const startRoom = async () => { // define async function to start or create a personal meeting room
        if (!client || !user) return; // exit early if Stream client or user data is missing to avoid runtime errors

        const newCall = client.call("default", meetingId!); // create a new call object using Stream client, specifying type "default" and meetingId as identifier

        if (!call) { // check if no existing call is found for this meetingId
            await newCall.getOrCreate({ // create a new call on Stream if none exists
                data: {
                    starts_at: new Date().toISOString(), // set current timestamp as the meeting's start time in ISO format
                },
            });
        }

        router.push(`/meeting/${meetingId}?personal=true`); // navigate programmatically to the meeting page route with query param personal=true
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`; // construct the complete meeting invite link using environment base URL and meetingId

    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
            <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
                <Table title="Topic" description={`${user?.username}'s Meeting Room`} /> {/* render Table showing topic as user's meeting room name */}
                <Table title="Meeting ID" description={meetingId!} /> {/* render Table displaying user's unique meeting ID */}
                <Table title="Invite Link" description={meetingLink} /> {/* render Table displaying generated meeting invite link */}
            </div>
            <div className="flex gap-5">
                <Button className="bg-blue-1" onClick={startRoom}> {/* render button that triggers startRoom function to start or create meeting */}
                    Start Meeting
                </Button>
                <Button
                    className="bg-dark-3"
                    onClick={() => { // define onClick handler for copying invite link
                        navigator.clipboard.writeText(meetingLink); // copy meetingLink to system clipboard using Clipboard API
                        toast({ // call toast function to show confirmation message
                            title: "Link Copied", // display toast title text indicating success
                        });
                    }}
                >
                    Copy Invitation
                </Button>
            </div>
        </section>
    );
};

export default PersonalRoom; // export PersonalRoom component as default for route rendering

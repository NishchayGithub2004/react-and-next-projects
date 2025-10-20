'use client'; // mark this file to run only on the client side in Next.js since it uses hooks and browser APIs

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'; // import useCall to access the active call instance and useCallStateHooks to get real-time state hooks like participants, call status, and connection info

import { Button } from './ui/button'; // import reusable Button component from local UI directory
import { useRouter } from 'next/navigation'; // import Next.js hook for programmatic navigation

const EndCallButton = () => { // define functional component EndCallButton with no props
    const call = useCall(); // get the current call object from Stream SDK context to manage and interact with the call
    const router = useRouter(); // initialize Next.js router to allow page redirection

    if (!call) { // check if call object is undefined or null
        throw new Error( // throw an error to ensure the component is only used inside a valid StreamCall provider
            'useStreamCall must be used within a StreamCall component.',
        );
    }

    const { useLocalParticipant } = useCallStateHooks(); // destructure useLocalParticipant hook from call state hooks to get current user info
    
    const localParticipant = useLocalParticipant(); // get the local participant object representing the user in the call

    const isMeetingOwner = // determine if the current user is the meeting owner
        localParticipant && // ensure a local participant exists
        call.state.createdBy && // ensure the call has a creator assigned
        localParticipant.userId === call.state.createdBy.id; // compare current user's ID with the creator's ID

    if (!isMeetingOwner) return null; // hide the button if the current user is not the meeting owner

    const endCall = async () => { // define asynchronous function to end the meeting
        await call.endCall(); // end the current call for all participants using SDK method
        router.push('/'); // navigate back to the homepage after ending the call
    };

    return (
        <Button onClick={endCall} className="bg-red-500"> 
            End call for everyone
        </Button>
    );
};

export default EndCallButton;
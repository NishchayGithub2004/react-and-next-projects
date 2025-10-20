'use client';

import { useEffect, useState } from 'react'; // import hooks for local state management and side effects
import {
    DeviceSettings, // import component to configure camera, microphone, and audio devices
    VideoPreview, // import component to show live preview of user's video before joining call
    useCall, // import hook to access the current call object
    useCallStateHooks, // import hook to access call state like start/end times
} from '@stream-io/video-react-sdk';

import Alert from './Alert'; // import Alert component to display call status messages
import { Button } from './ui/button'; // import reusable Button component

const MeetingSetup = ({
    setIsSetupComplete, // function to update parent state when setup is complete
}: {
    setIsSetupComplete: (value: boolean) => void; // define prop type for setIsSetupComplete
}) => {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks(); // extract hooks to get call start and end times

    const callStartsAt = useCallStartsAt(); // get scheduled call start time
    const callEndedAt = useCallEndedAt(); // get actual call end time

    const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date(); // check if call has not started yet
    const callHasEnded = !!callEndedAt; // check if call has already ended

    const call = useCall(); // get current call object

    if (!call) {
        throw new Error(
            'useStreamCall must be used within a StreamCall component.', // ensure call hook is used inside correct context
        );
    }

    const [isMicCamToggled, setIsMicCamToggled] = useState(false); // manage state for joining with mic/camera off

    useEffect(() => {
        if (isMicCamToggled) {
            call.camera.disable(); // disable camera when toggled off
            call.microphone.disable(); // disable microphone when toggled off
        } else {
            call.camera.enable(); // enable camera when toggled on
            call.microphone.enable(); // enable microphone when toggled on
        }
    }, [isMicCamToggled, call.camera, call.microphone]); // re-run effect when toggle state or call devices change

    if (callTimeNotArrived)
        return (
            <Alert
                title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`} // show message if meeting has not started
            />
        );

    if (callHasEnded)
        return (
            <Alert
                title="The call has been ended by the host" // show message if meeting already ended
                iconUrl="/icons/call-ended.svg"
            />
        );

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
            <h1 className="text-center text-2xl font-bold">Setup</h1>
            <VideoPreview /> {/* show live video preview */}
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        checked={isMicCamToggled} // bind checkbox to mic/cam toggle state
                        onChange={(e) => setIsMicCamToggled(e.target.checked)} // update toggle state on change
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings /> {/* allow user to configure devices */}
            </div>
            <Button
                className="rounded-md bg-green-500 px-4 py-2.5"
                onClick={() => {
                    call.join(); // join the call when button is clicked
                    setIsSetupComplete(true); // mark setup as complete in parent component
                }}
            >
                Join meeting
            </Button>
        </div>
    );
};

export default MeetingSetup;

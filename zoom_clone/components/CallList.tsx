'use client'; // mark this file to run only on the client, enabling access to React hooks and browser-side interactivity

import { Call, CallRecording } from '@stream-io/video-react-sdk'; // import Call and CallRecording types from Stream Video SDK for typing video call data

import Loader from './Loader'; // import Loader component to display a loading spinner while data is being fetched
import { useGetCalls } from '@/hooks/useGetCalls'; // import custom hook useGetCalls to fetch and categorize Stream calls
import MeetingCard from './MeetingCard'; // import MeetingCard component to display call or recording details in a card format
import { useEffect, useState } from 'react'; // import useEffect and useState React hooks for managing side effects and component state
import { useRouter } from 'next/navigation'; // import useRouter hook from Next.js for programmatic navigation between routes

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => { // define CallList component that takes a prop 'type' to determine which call list to display
    const router = useRouter(); // initialize router instance to enable navigation on button click

    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls(); // destructure call categories and loading state from useGetCalls hook

    const [recordings, setRecordings] = useState<CallRecording[]>([]); // create a state variable 'recordings' to store fetched call recordings

    const getCalls = () => { // define a function to return the appropriate set of calls based on the provided type
        switch (type) { // use switch-case to select call list
            case 'ended': // if type is 'ended'
                return endedCalls; // return list of ended calls
            case 'recordings': // if type is 'recordings'
                return recordings; // return list of call recordings
            case 'upcoming': // if type is 'upcoming'
                return upcomingCalls; // return list of upcoming calls
            default: // default case
                return []; // return an empty array if type doesn't match
        }
    };

    const getNoCallsMessage = () => { // define function to return message when no calls exist for a type
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };

    useEffect(() => { // use useEffect to fetch call recordings when dependencies change
        const fetchRecordings = async () => { // define async function to retrieve call recordings
            const callData = await Promise.all( // use Promise.all to execute multiple asynchronous queries simultaneously
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [] // map over callRecordings to fetch each recording, or use empty array if undefined
            );

            const recordings = callData // process the fetched call data
                .filter((call) => call.recordings.length > 0) // keep only calls that contain one or more recordings
                .flatMap((call) => call.recordings); // flatten arrays of recordings into a single array

            setRecordings(recordings); // update state with all fetched recordings
        };

        if (type === 'recordings') { // conditionally fetch recordings only when the type is 'recordings'
            fetchRecordings(); // call the fetchRecordings function
        }
    }, [type, callRecordings]); // run effect whenever type or callRecordings changes

    if (isLoading) return <Loader />; // show Loader component while calls are being fetched

    const calls = getCalls(); // get the list of calls to display based on current type

    const noCallsMessage = getNoCallsMessage(); // get the appropriate no-calls message for current type

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? ( // check if there are calls to display
                calls.map((meeting: Call | CallRecording) => ( // iterate through each meeting (either Call or CallRecording)
                    <MeetingCard
                        key={(meeting as Call).id} // use call ID as unique key for each MeetingCard
                        icon={
                            type === 'ended' // check if the current list type is 'ended'
                                ? '/icons/previous.svg' // if yes, use the 'previous' icon to represent past meetings
                                : type === 'upcoming' // if not, check if the list type is 'upcoming'
                                    ? '/icons/upcoming.svg' // if yes, use the 'upcoming' icon to represent future meetings
                                    : '/icons/recordings.svg' // otherwise, use the 'recordings' icon for recorded meetings
                        }
                        title={
                            (meeting as Call).state?.custom?.description || // try to get a custom description from the call state if it exists
                            (meeting as CallRecording).filename?.substring(0, 20) || // if not available, use the first 20 characters of the recording filename
                            'No Description' // if neither exists, display a default 'No Description' text
                        }
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() || // if the meeting is a live call, format and display its start time in local format
                            (meeting as CallRecording).start_time?.toLocaleString() // otherwise, format and display the start time of the recording
                        }
                        isPreviousMeeting={type === 'ended'} // set this flag to true if the current list type is 'ended', helping the card adjust its display for past meetings
                        link={
                            type === 'recordings' // check if the list type is 'recordings'
                                ? (meeting as CallRecording).url // if yes, use the recording’s URL as the navigation link
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}` // otherwise, build the meeting link using its ID and base URL
                        }
                        buttonIcon1={
                            type === 'recordings' // check if the current list type is 'recordings'
                                ? '/icons/play.svg' // if yes, display a play icon on the button to indicate playback
                                : undefined // if not, omit the button icon
                        }
                        buttonText={
                            type === 'recordings' // check if the current list type is 'recordings'
                                ? 'Play' // if yes, set button text to "Play" to indicate playing the recording
                                : 'Start' // otherwise, set button text to "Start" for joining an upcoming or live meeting
                        }
                        handleClick={
                            type === 'recordings' // check if the list type is 'recordings'
                                ? () => router.push(`${(meeting as CallRecording).url}`) // if yes, navigate to the recording URL when the button is clicked
                                : () => router.push(`/meeting/${(meeting as Call).id}`) // otherwise, navigate to the meeting page using its unique ID
                        }
                    />
                ))
            ) : ( // if no calls found
                <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1> // display appropriate message when no calls exist
            )}
        </div>
    );
};

export default CallList; // export CallList component as default for use in other parts of the app

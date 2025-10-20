import { useEffect, useState } from 'react'; // import useEffect and useState hooks from React to handle side effects and component state
import { useUser } from '@clerk/nextjs'; // import useUser hook from Clerk to access the authenticated user's information
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'; // import Call type and useStreamVideoClient hook from Stream Video SDK to manage video calls

export const useGetCalls = () => { // define a custom hook named useGetCalls to fetch and categorize the user's calls
    const { user } = useUser(); // destructure the user object from useUser() to get the currently logged-in user
    
    const client = useStreamVideoClient(); // call useStreamVideoClient() to get an instance of the Stream video client for API operations
    
    const [calls, setCalls] = useState<Call[]>(); // create a state variable 'calls' to store an array of fetched calls and a setter 'setCalls' to update it
    
    const [isLoading, setIsLoading] = useState(false); // create a boolean state 'isLoading' to track whether the calls are being fetched

    useEffect(() => { // use useEffect to fetch calls whenever the client or user ID changes
        const loadCalls = async () => { // define an asynchronous function to handle fetching calls from the Stream API
            if (!client || !user?.id) return; // if the client instance or user ID is not available, exit early to prevent errors

            setIsLoading(true); // set loading state to true before starting the API request

            try { // start try block to handle any potential API request errors
                const { calls } = await client.queryCalls({ // call queryCalls() on the client to retrieve call data from the Stream backend
                    sort: [ // define the sorting order for returned calls
                        { field: 'starts_at', direction: -1 } // sort calls by 'starts_at' field in descending order (newest first)
                    ],
                    filter_conditions: { // define conditions to filter calls related to the logged-in user
                        starts_at: { $exists: true }, // include only calls that have a 'starts_at' value
                        $or: [ // apply an OR condition to match calls either created by the user or where the user is a member
                            { created_by_user_id: user.id }, // include calls created by the current user
                            { members: { $in: [user.id] } }, // include calls in which the current user is a participant
                        ],
                    },
                });

                setCalls(calls); // update the 'calls' state with the fetched list of calls
            } catch (error) { // handle any errors that occur during the API request
                console.error(error); // log the error to the console for debugging purposes
            } finally { // execute this block whether or not an error occurs
                setIsLoading(false); // set loading state to false after the API operation completes
            }
        };

        loadCalls(); // invoke the asynchronous function to start fetching calls
    }, [client, user?.id]); // run this effect whenever the client instance or user ID changes

    const now = new Date(); // create a Date object representing the current time to compare call timings

    const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => { // filter calls to extract those that have ended or started before the current time
        return (startsAt && new Date(startsAt) < now) || !!endedAt; // include calls that started before now or have a non-null 'endedAt' value
    });

    const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => { // filter calls to extract those scheduled for future times
        return startsAt && new Date(startsAt) > now; // include calls whose 'startsAt' timestamp is later than the current time
    });

    return { endedCalls, upcomingCalls, callRecordings: calls, isLoading }; // return categorized calls and loading state for use in components
};

import { useEffect, useState } from 'react'; // import useEffect and useState hooks from React to handle state and side effects
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'; // import Call type and useStreamVideoClient hook from Stream Video SDK to manage video calls

export const useGetCallById = (id: string | string[]) => { // define a custom hook named useGetCallById that accepts an id (string or array of strings) to fetch a specific call
    const [call, setCall] = useState<Call>(); // create a state variable 'call' to store the fetched 'Call' object and a setter 'setCall' to update it
    
    const [isCallLoading, setIsCallLoading] = useState(true); // create a boolean state 'isCallLoading' to indicate if the call is currently being loaded

    const client = useStreamVideoClient(); // call useStreamVideoClient() hook to get the Stream video client instance for API interactions

    useEffect(() => { // use useEffect to run side effects whenever dependencies (client or id) change
        if (!client) return; // if the client is not yet initialized, exit early to prevent runtime errors

        const loadCall = async () => { // define an asynchronous function to fetch the call details from Stream API
            try { // start a try block to handle API request errors gracefully
                const { calls } = await client.queryCalls({ // call queryCalls() method on the client to fetch calls from Stream backend
                    filter_conditions: { id } // pass an object with filter_conditions where id matches the provided id to retrieve the specific call
                });

                if (calls.length > 0) setCall(calls[0]); // if one or more calls are returned, update the 'call' state with the first call object

                setIsCallLoading(false); // set the loading state to false after the query completes successfully
            } catch (error) { // catch any errors that occur during the API request
                console.error(error); // log the error to the console for debugging
                
                setIsCallLoading(false); // set the loading state to false even if an error occurs to stop showing the loading indicator
            }
        };

        loadCall(); // invoke the loadCall function to start fetching the call
    }, [client, id]); // include client and id as dependencies so the effect re-runs when either changes

    return { call, isCallLoading }; // return both the call data and loading state so they can be used by components consuming this hook
};

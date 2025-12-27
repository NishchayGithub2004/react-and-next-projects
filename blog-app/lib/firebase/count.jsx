"use client"

import { collection, getCountFromServer } from "firebase/firestore"; // import collection to reference a firestore collection by path, getCountFromServer to fetch the server-side document count without reading all documents
import useSWR from "swr"; // import useSWR to handle data fetching, caching, and revalidation logic
import { db } from "../firebase"; // import the initialized firestore database instance to execute queries against the correct project

const fetcher = path => getCountFromServer(collection(db, path)).then((value) => value.data().count) // define a fetcher function that takes path of a firestore collection and returns only its document count ie number of documents in that collection for lightweight reads

export default function useCollectionCount({ path }) { // define a custom react hook to retrieve and track the document count of a firestore collection
    const { data, error, isLoading } = useSWR(path, fetcher); // use swr to fetch, cache, and revalidate the collection count based on the path key

    return { // return the following properties
        data, // resolved document count so consumers can render or compute against it
        error, // any firestore error for handling or display
        isLoading // loading state so consumers can manage skeletons or spinners
    }
}
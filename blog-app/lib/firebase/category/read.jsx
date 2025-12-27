"use client"

import { db } from "@/lib/firebase"; // import db to access the initialized firestore database instance
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"; // import collection to reference firestore collections, doc to reference a single document, getDoc to fetch a document once, onSnapshot to listen for realtime updates
import useSWRSubscription from "swr/subscription"; // import useSWRSubscription to manage realtime firestore subscriptions with swr

export function useCategories() { // define a custom hook to subscribe to and retrieve all authors in realtime
    const { data, error } = useSWRSubscription(["categories"], ([path], { next }) => { // initialize an swr subscription keyed by the authors collection path
        const ref = collection(db, path); // create a firestore collection reference pointing to authors
        
        const unsub = onSnapshot(ref, (snaps) => { // subscribe to realtime updates on the authors collection
            next(null, snaps.docs.map((v) => v.data())) // push an array of author data payloads whenever the collection changes
        }, (error) => {
            next(error?.message) // push any firestore subscription error message to swr
        })
        
        return () => unsub(); // return a cleanup function to unsubscribe when the subscription is disposed
    })
    
    return { // return the following properties
        data, // array of authors data consuming components
        error, // any error for handling or display
        isLoading: data === undefined ? true : false, // loading state based on whether initial data has resolved
    }
}

export const getAuthor = async (id) => { // define an async function to fetch a single author document by id
    return await getDoc(doc(db, `categories/${id}`)); // retrieve the author document snapshot (headers, metadata only) from firestore
}
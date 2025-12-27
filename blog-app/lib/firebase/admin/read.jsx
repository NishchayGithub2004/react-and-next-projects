"use client"

import { db } from "@/lib/firebase"; // import db to access the initialized firestore database instance
import { doc, onSnapshot } from "firebase/firestore"; // import doc to create a document reference by path, onSnapshot to listen to realtime updates from firestore
import useSWRSubscription from "swr/subscription"; // import useSWRSubscription to manage realtime data subscriptions with swr

export function useAdmin({ uid }) { // define a custom hook to subscribe to and retrieve admin data for a given user id
    const { data, error } = useSWRSubscription([`admins/${uid}`], ([path], { next }) => { // initialize an swr subscription keyed by the admin document path and define how realtime updates are handled
        const ref = doc(db, path); // create a firestore document reference pointing to the admin document for the given user
        
        const unsub = onSnapshot(ref, (snaps) => { // subscribe to realtime updates on the admin document
            next(null, snaps.exists() ? snaps.data() : null) // push document data if it exists or null if the document is missing
        }, (error) => {
            next(error?.message) // push any firestore subscription error message to swr
        })
        
        return () => unsub(); // return a cleanup function to unsubscribe from firestore when the subscription is disposed
    })
    
    return { // return the following properties
        data, // admin document data so consumers can check admin status or permissions
        error, // any firestore error for handling or display
        isLoading: data === undefined ? true : false, // loading state based on whether data has been resolved/found yet
    }
}
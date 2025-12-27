import { db } from "@/lib/firebase"; // import db to access the initialized firestore database instance

import { 
    collection, // import collection to create a reference to a firestore collection
    doc, // import doc to create a reference to a specific firestore document
    getDoc, // import getDoc to fetch a single document snapshot (headers, metadata, etc.) from firestore
    getDocs // import getDocs to fetch all document snapshots from a firestore collection
} from "firebase/firestore"; // import firestore helpers to read documents and collections from the database

export const getCategory = async (id) => { // define an async function to fetch a single category by its id
    return await getDoc(doc(db, `categories/${id}`)).then((snap) => snap.data()); // retrieve the category document and return only its data payload
}

export const getAllCategories = async () => { // define an async function to fetch all categories from the collection
    return await getDocs(collection(db, "categories")).then((snaps) => snaps.docs.map((d) => d.data())); // fetch all category documents and map them to their data payloads
}
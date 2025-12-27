import { db } from "@/lib/firebase"; // import db to access the initialized firestore database instance
import { doc, getDoc } from "firebase/firestore"; // import doc to create a document reference by path, getDoc to fetch a single document snapshot from firestore

export const getAuthor = async (id) => { // define an async function to retrieve author data for a given author id
    return await getDoc(doc(db, `authors/${id}`)).then((snap) => snap.data()); // fetch the author document by id and return only its data excluding headers, metadata, etc.
}
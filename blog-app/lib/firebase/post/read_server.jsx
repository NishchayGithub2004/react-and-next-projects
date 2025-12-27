import { db } from "@/lib/firebase"; // import db to access the initialized firestore database instance

import {
    collection, // import collection to create references to firestore collections
    doc, // import doc to create references to specific firestore documents
    getDoc, // import getDoc to fetch a single document snapshot from firestore
    getDocs, // import getDocs to fetch multiple document snapshots from a collection or query
    query, // import query to build filtered or constrained firestore queries
    where // import where to apply conditional filters to firestore queries
} from "firebase/firestore"; // import firestore utilities required for reading documents and collections

export const getAllPosts = async () => { // define an async function to fetch all posts without any filtering
    return await getDocs(collection(db, "posts")).then((snaps) => snaps.docs.map((d) => d.data())); // retrieve all post documents and map them to their data payloads (data excluding headers, metadata, etc.)
}

export const getAllPostsWithCategory = async (categoryId) => { // define an async function to fetch posts belonging to a specific category
    const q = query(collection(db, "posts"), where("categoryId", "==", categoryId)); // construct a firestore query that filters posts by matching categoryId
    
    return await getDocs(q).then((snaps) => snaps.docs.map((d) => d.data())); // execute the query and map matching documents to their data payloads
}

export const getPost = async (id) => { // define an async function to fetch a single post by its document id
    return await getDoc(doc(db, `posts/${id}`)).then((snap) => snap.data()); // retrieve the post document and return only its data payload
}
import { db, storage } from "@/lib/firebase"; // import db to interact with firestore database, storage to manage post image uploads in firebase storage

import { 
    Timestamp, // import Timestamp to generate server-side firestore timestamps
    deleteDoc, // import deleteDoc to remove post documents from firestore
    doc, // import doc to create references to specific firestore documents
    setDoc, // import setDoc to create or overwrite firestore documents
    updateDoc // import updateDoc to partially update existing firestore documents
} from "firebase/firestore"; // import firestore write utilities required for post CRUD operations

import { 
    getDownloadURL, // import getDownloadURL to retrieve a public URL for an uploaded post image
    ref, // import ref to create references to files in firebase storage
    uploadBytes // import uploadBytes to upload binary image data to storage
} from "firebase/storage"; // import storage helpers required for post image handling

export const createNewPost = async ({ data, image }) => { // define an async function to create a new post with metadata and a featured image
    if (!data?.title) throw new Error("Name is undefined"); // validate that a post title exists to ensure meaningful content
    
    if (!data?.slug) throw new Error("Slug is undefined"); // validate that a slug exists to uniquely identify the post
    
    if (!image) throw new Error("Image is not selected"); // validate that a featured image is provided for the post
    
    const imageRef = ref(storage, `posts/${data?.slug}.png`); // create a storage reference for the post image using the slug as filename
    
    await uploadBytes(imageRef, image); // upload the post image file to firebase storage
    
    const imageURL = await getDownloadURL(imageRef); // retrieve a publicly accessible URL for the uploaded post image

    const firestoreRef = doc(db, `posts/${data?.slug}`); // create a firestore document reference using the slug as the post id
    
    await setDoc(firestoreRef, { // write the new post document to firestore
        ...data, // spread provided post data fields into the document
        id: data?.slug, // explicitly store the slug as the post id for consistency
        imageURL: imageURL, // store the download URL of the uploaded post image
        timestamp: Timestamp.now(), // attach a server-generated timestamp to track creation time
    });
}

export const updatePost = async ({ data, image }) => { // define an async function to update an existing post and optionally replace its image
    if (!data?.title) throw new Error("Name is undefined"); // validate that the post title exists before updating
    
    if (!data?.slug) throw new Error("Slug is undefined"); // validate that the slug exists to correctly reference storage and data
    
    let imageURL = data?.imageURL; // initialize the image URL with the existing value as a fallback

    if (image) { // check whether a new image was provided for replacement
        const imageRef = ref(storage, `posts/${data?.slug}.png`); // create a storage reference for overwriting the existing post image
        
        await uploadBytes(imageRef, image); // upload the new image to storage, replacing the previous file
        
        imageURL = await getDownloadURL(imageRef); // retrieve the updated download URL for the new image
    }

    const firestoreRef = doc(db, `posts/${data?.id}`); // create a firestore document reference for the existing post
    
    await updateDoc(firestoreRef, { // update the post document with new data and timestamp
        ...data, // spread updated post fields into the document
        imageURL: imageURL, // persist either the new or existing image URL
        timestamp: Timestamp.now(), // update the timestamp to reflect the modification time
    });
}

export const deletePost = async (id) => { // define an async function to delete a post by its document id
    if (!id) throw new Error("Id is required"); // validate that an id is provided to avoid deleting an undefined document
    
    await deleteDoc(doc(db, `posts/${id}`)); // remove the post document from firestore using its id
}
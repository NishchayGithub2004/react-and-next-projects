import { db, storage } from "@/lib/firebase"; // import db to interact with firestore database, storage to manage file uploads in firebase storage

import { 
    Timestamp, // import Timestamp to generate server-side firestore timestamps
    collection, // import collection to reference firestore collections for id generation
    deleteDoc, // import deleteDoc to remove documents from firestore
    doc, // import doc to create references to specific firestore documents
    setDoc, // import setDoc to create or overwrite firestore documents
    updateDoc // import updateDoc to partially update existing firestore documents
} from "firebase/firestore"; // import firestore write utilities required for author CRUD operations

import { 
    getDownloadURL, // import getDownloadURL to retrieve a public URL for an uploaded storage file
    ref, // import ref to create references to files in firebase storage
    uploadBytes // import uploadBytes to upload binary image data to storage
} from "firebase/storage"; // import storage helpers required for author image handling

export const createNewAuthor = async ({ data, image }) => { // define an async function to create a new author with profile data and photo
    if (!data?.name) throw new Error("Name is undefined"); // validate that the author name exists to ensure meaningful records
    
    if (!image) throw new Error("Image is not selected"); // validate that a profile image is provided since authors require photos
    
    const id = doc(collection(db, "ids")).id; // generate a unique firestore-compatible id without creating a document

    const imageRef = ref(storage, `authors/${id}.png`); // create a storage reference for the author's profile image using the generated id
    
    await uploadBytes(imageRef, image); // upload the author image file to firebase storage
    
    const imageURL = await getDownloadURL(imageRef); // retrieve a publicly accessible URL for the uploaded author image

    const firestoreRef = doc(db, `authors/${id}`); // create a firestore document reference for the new author using the generated id
    
    await setDoc(firestoreRef, { // write the new author document to firestore
        ...data, // spread provided author data fields into the document
        id: id, // persist the generated id inside the document for reference consistency
        photoURL: imageURL, // store the download URL of the uploaded author image
        timestamp: Timestamp.now(), // attach a server-generated timestamp to track creation time
    });
}

export const updateAuthor = async ({ data, image }) => { // define an async function to update an existing author and optionally replace the photo
    if (!data?.name) throw new Error("Name is undefined"); // validate that the author name exists before updating

    let imageURL = data?.photoURL; // initialize the image URL with the existing photo as a fallback

    if (image) { // check whether a new image was provided for replacement
        const imageRef = ref(storage, `authors/${data?.id}.png`); // create a storage reference for overwriting the existing author image
        
        await uploadBytes(imageRef, image); // upload the new image to storage, replacing the previous file
        
        imageURL = await getDownloadURL(imageRef); // retrieve the updated download URL for the new image
    }

    const firestoreRef = doc(db, `authors/${data?.id}`); // create a firestore document reference for the existing author
    
    await updateDoc(firestoreRef, { // update the author document with new data and timestamp
        ...data, // spread updated author fields into the document
        photoURL: imageURL, // persist either the new or existing photo URL
        timestamp: Timestamp.now(), // update the timestamp to reflect the modification time
    });
}

export const deleteAuthor = async (id) => { // define an async function to delete an author by document id
    if (!id) throw new Error("Id is required"); // validate that an id is provided to avoid deleting an undefined document
    
    await deleteDoc(doc(db, `authors/${id}`)); // remove the author document from firestore using its id
}
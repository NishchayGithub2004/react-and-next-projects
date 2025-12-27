import { db, storage } from "@/lib/firebase"; // import db to access the firestore database, storage to interact with firebase cloud storage

import { 
    Timestamp, // import Timestamp to generate server-side firestore timestamps
    deleteDoc, // import deleteDoc to remove a document from firestore
    doc, // import doc to create references to specific firestore documents
    setDoc, // import setDoc to create or overwrite a firestore document
    updateDoc // import updateDoc to partially update an existing firestore document
} from "firebase/firestore"; // import firestore write utilities for category CRUD operations

import { 
    getDownloadURL, // import getDownloadURL to retrieve a public URL for an uploaded storage file
    ref, // import ref to create references to files in firebase storage
    uploadBytes // import uploadBytes to upload binary image data to storage
} from "firebase/storage"; // import storage helpers required for image upload and retrieval

export const createNewCategory = async ({ data, image }) => { // define an async function to create a new category with metadata and an uploaded icon image
    if (!data?.name) throw new Error("Name is undefined"); // validate that a category name exists to ensure meaningful category records
    
    if (!data?.slug) throw new Error("Slug is undefined"); // validate that a slug exists to uniquely identify the category
    
    if (!image) throw new Error("Image is not selected"); // validate that an image is provided since categories require an icon
    
    const imageRef = ref(storage, `categories/${data?.slug}.png`); // create a storage reference for the category icon using the slug as filename
    
    await uploadBytes(imageRef, image); // upload the image file to firebase storage at the defined path
    
    const imageURL = await getDownloadURL(imageRef); // retrieve a publicly accessible URL for the uploaded image

    const firestoreRef = doc(db, `categories/${data?.slug}`); // create a firestore document reference using the slug as the document id
    
    await setDoc(firestoreRef, { // write a new category document to firestore with metadata and image reference
        ...data, // spread provided category data fields into the document
        id: data?.slug, // explicitly store the slug as the category id for consistency
        iconURL: imageURL, // store the image download URL to reference the uploaded icon
        timestamp: Timestamp.now(), // attach a server-generated timestamp to track creation time
    });
}

export const updateCategory = async ({ data, image }) => { // define an async function to update an existing category and optionally replace its icon
    if (!data?.name) throw new Error("Name is undefined"); // validate that the category name still exists before updating
    
    if (!data?.slug) throw new Error("Slug is undefined"); // validate that the slug exists to correctly reference storage and data
    
    let imageURL = data?.iconURL; // initialize the image URL with the existing icon URL as a fallback

    if (image) { // check whether a new image was provided for replacement
        const imageRef = ref(storage, `categories/${data?.slug}.png`); // create a storage reference for overwriting the existing category icon
        
        await uploadBytes(imageRef, image); // upload the new image to storage, replacing the previous file
        
        imageURL = await getDownloadURL(imageRef); // retrieve the updated download URL for the new image
    }

    const firestoreRef = doc(db, `categories/${data?.id}`); // create a firestore document reference targeting the existing category
    
    await updateDoc(firestoreRef, { // update the category document with new data and timestamp
        ...data, // spread updated category fields into the document
        iconURL: imageURL, // persist either the new or existing icon URL
        timestamp: Timestamp.now(), // update the timestamp to reflect the modification time
    });
}

export const deleteCategory = async (id) => { // define an async function to delete a category by its document id
    if (!id) throw new Error("Id is required"); // validate that an id is provided to avoid deleting an undefined document

    await deleteDoc(doc(db, `categories/${id}`)); // remove the category document from firestore using its id
}
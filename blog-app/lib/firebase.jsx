import { initializeApp } from "firebase/app"; // import initializeApp to bootstrap and configure a Firebase application instance
import { getFirestore } from "firebase/firestore"; // import getFirestore to initialize and access the Firestore database service
import { getAuth } from "firebase/auth"; // import getAuth to initialize and access Firebase Authentication for user auth flows
import { getStorage } from "firebase/storage"; // import getStorage to initialize and access Firebase Cloud Storage for file handling

const firebaseConfig = { // define the Firebase configuration object required to connect this app to the correct Firebase project
    apiKey: process.env.NEXT_PUBLIC_API_KEY, // read the public API key from environment variables to securely identify the Firebase project
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN, // read the auth domain to configure authentication redirects and domains
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID, // read the project ID to associate database and services with the correct Firebase project
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET, // read the storage bucket name to connect Cloud Storage for file uploads and downloads
    messagingSenderId: process.env.NEXT_PUBLIC_MESSANGING_ID, // read the messaging sender ID to enable Firebase Cloud Messaging if used
    appId: process.env.NEXT_PUBLIC_APP_ID, // read the app ID to uniquely identify this Firebase app instance
};

export const app = initializeApp(firebaseConfig); // initialize Firebase with the configuration and export the app instance for shared use
export const db = getFirestore(); // initialize and export a Firestore instance to enable database operations across the app
export const auth = getAuth(); // initialize and export the authentication service to manage user sign-in and identity
export const storage = getStorage(); // initialize and export the storage service to handle file uploads, downloads, and media assets
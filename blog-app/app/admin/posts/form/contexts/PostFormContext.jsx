"use client"

import { getPost } from "@/lib/firebase/post/read"; // import getPost to fetch a single post record for editing or pre-filling the form

import { 
    createNewPost, // import createNewPost function to persist a newly created post to the database
    deletePost, // import deletePost function to remove an existing post from the database
    updatePost // import updatePost function to apply updates to an existing post record
} from "@/lib/firebase/post/write";

import { useRouter } from "next/navigation"; // import useRouter to programmatically navigate after form actions like save or delete

import { 
    createContext, // import createContext to create a shared context for post form state
    useContext, // import useContext to allow child components to consume the post form context
    useState // import useState to manage local reactive state within the context provider
} from "react";

const PostFormContext = createContext(); // create a context to hold post form state and actions for descendant components

export default function PostFormContextProvider({ children }) { // define a context provider component to wrap post form UI with shared state
    const router = useRouter(); // initialize router instance to handle navigation based on form outcomes

    const [data, setData] = useState({}); // store post form field values and metadata as a mutable state object
    const [isLoading, setIsLoading] = useState(false); // track async operation status to control loading indicators and prevent duplicate actions
    const [error, setError] = useState(null); // store error information to surface validation or request failures to the UI
    const [isDone, setIsDone] = useState(false); // indicate successful completion of a form action such as create or update
    const [image, setImage] = useState(null); // hold the selected image file or image reference associated with the post

    const handleData = (key, value) => { // define a helper to update individual post fields dynamically
        setIsDone(false) // reset completion state when form data changes to avoid stale success indicators
        
        setData({
            ...data, // preserve existing post fields while updating a specific key
            [key]: value, // update the targeted field based on input changes
        })
    }

    const handleCreate = async () => { // define function to create a new post record in firebase
        setError(null) // clear previous errors before starting a new create operation
        setIsLoading(true) // mark operation as in progress to update UI state
        setIsDone(false) // reset completion state before attempting creation
        
        try {
            await createNewPost({ data: data, image: image }); // persist new post data and image to firebase
            setIsDone(true) // mark operation successful to allow UI success feedback
        } catch (error) {
            setError(error?.message) // capture and expose error message if creation fails
        }
        
        setIsLoading(false) // conclude loading state after operation completes
    }

    const handleUpdate = async () => { // define function to update an existing post record
        setError(null) // clear previous errors before starting update
        setIsLoading(true) // indicate update operation is in progress
        setIsDone(false) // reset completion state before update attempt
        
        try {
            await updatePost({ data: data, image: image }); // send updated post data and image to firebase
            setIsDone(true) // mark update as successful for UI handling
        } catch (error) {
            setError(error?.message) // surface update failure reason to the UI
        }
        
        setIsLoading(false) // stop loading indicator after update completes
    }

    const handleDelete = async (id) => { // define function to delete a post by id
        setError(null) // clear existing errors before deletion
        setIsLoading(true) // flag deletion operation as in progress
        setIsDone(false) // reset completion state prior to deletion
        
        try {
            await deletePost(id); // remove post record from firebase by id
            setIsDone(true); // mark deletion as successful
            router.push("/admin/posts"); // redirect back to posts list after successful deletion
        } catch (error) {
            setError(error?.message) // expose deletion error message if operation fails
        }
        
        setIsLoading(false) // end loading state after delete attempt
    }

    const fetchData = async (id) => { // define function to fetch a post record for edit mode
        setError(null) // clear previous errors before fetching data
        setIsLoading(true) // indicate fetch operation is running
        setIsDone(false) // reset completion state before data retrieval
        
        try {
            const res = await getPost(id); // retrieve post document snapshot from firebase by id
            
            if (res.exists()) setData(res.data()); // populate form state with fetched post data if record exists
            
            else throw new Error(`No Post found from id ${id}`) // fail explicitly when no matching post is found
        } catch (error) {
            setError(error?.message) // capture fetch error or missing record message
        }

        setIsLoading(false) // conclude loading state after fetch attempt
    }

    return <PostFormContext.Provider
        value={{ // provide following values and functions to rendered content
            data, // current post form data to consuming components
            isLoading, // loading state to coordinate UI behavior
            error, // error message for rendering feedback
            isDone, // completion flag for success indicators
            handleData, // field update helper to form inputs
            handleCreate, // create handler to submission controls
            handleUpdate, // update handler for edit workflows
            handleDelete, // delete handler for destructive actions
            image, // selected image file for previews or validation
            setImage, // setter to allow image selection updates
            fetchData, // fetch function to load post data by id
        }}
    >
        {children} {/* render nested components that consume the post form context */}
    </PostFormContext.Provider>
}

export const usePostForm = () => useContext(PostFormContext); // define a custom hook to expose post form context values to consuming components
"use client"

import { getAuthor } from "@/lib/firebase/author/read"; // import function to fetch a single author record from firebase for read operations

import { 
    createNewAuthor, // import createNewAuthor function to create a new author record in firebase
    deleteAuthor, // import deleteAuthor function to remove an existing author record from firebase
    updateAuthor // import updateAuthor function to update an existing author record in firebase
} from "@/lib/firebase/author/write";

import { useRouter } from "next/navigation"; // import router hook to programmatically navigate after author operations

import { 
    createContext, // import createContext to define a react context for sharing author-related state
    useContext, // import useContext to consume the author context within child components
    useState // import useState to manage local mutable state for author data
} from "react";

const AuthorFormContext = createContext(); // create a react context to share author form state and actions across related components

export default function AuthorFormContextProvider({ children }) { // define a context provider component to manage and expose author form state and actions
    const router = useRouter(); // initialize next.js router to enable programmatic navigation after author actions

    const [data, setData] = useState({}); // store author form field values collected from inputs
    const [isLoading, setIsLoading] = useState(false); // track async operation state to control loading indicators and button disabling
    const [error, setError] = useState(null); // store error messages from failed create, update, delete, or fetch operations
    const [isDone, setIsDone] = useState(false); // indicate successful completion of an operation to trigger UI feedback
    const [image, setImage] = useState(null); // store selected image file to upload along with author data

    const handleData = (key, value) => { // define a helper to update individual author fields dynamically
        setIsDone(false) // reset completion state when form data changes to avoid stale success indicators
        
        setData({
            ...data, // preserve existing author fields while updating a specific key
            [key]: value, // update the targeted field based on input changes
        })
    }

    const handleCreate = async () => { // define function to create a new author record in firebase
        setError(null) // clear previous errors before starting a new create operation
        setIsLoading(true) // mark operation as in progress to update UI state
        setIsDone(false) // reset completion state before attempting creation
        
        try {
            await createNewAuthor({ data: data, image: image }); // persist new author data and image to firebase
            setIsDone(true) // mark operation successful to allow UI success feedback
        } catch (error) {
            setError(error?.message) // capture and expose error message if creation fails
        }
        
        setIsLoading(false) // conclude loading state after operation completes
    }

    const handleUpdate = async () => { // define function to update an existing author record
        setError(null) // clear previous errors before starting update
        setIsLoading(true) // indicate update operation is in progress
        setIsDone(false) // reset completion state before update attempt
        
        try {
            await updateAuthor({ data: data, image: image }); // send updated author data and image to firebase
            setIsDone(true) // mark update as successful for UI handling
        } catch (error) {
            setError(error?.message) // surface update failure reason to the UI
        }
        
        setIsLoading(false) // stop loading indicator after update completes
    }

    const handleDelete = async (id) => { // define function to delete an author by id
        setError(null) // clear existing errors before deletion
        setIsLoading(true) // flag deletion operation as in progress
        setIsDone(false) // reset completion state prior to deletion
        
        try {
            await deleteAuthor(id); // remove author record from firebase by id
            setIsDone(true); // mark deletion as successful
            router.push('/admin/authors'); // redirect back to authors list after successful deletion
        } catch (error) {
            setError(error?.message) // expose deletion error message if operation fails
        }
        
        setIsLoading(false) // end loading state after delete attempt
    }

    const fetchData = async (id) => { // define function to fetch an author record for edit mode
        setError(null) // clear previous errors before fetching data
        setIsLoading(true) // indicate fetch operation is running
        setIsDone(false) // reset completion state before data retrieval
        
        try {
            const res = await getAuthor(id) // retrieve author document snapshot from firebase by id   
            
            if (res.exists()) setData(res.data()) // populate form state with fetched author data if record exists
            
            else throw new Error(`No Category found from id ${id}`) // fail explicitly when no matching author is found
        } catch (error) {
            setError(error?.message) // capture fetch error or missing record message
        }

        setIsLoading(false) // conclude loading state after fetch attempt
    }

    return <AuthorFormContext.Provider
        value={{ // provide following values and functions to rendered content
            data, // current author form data to consuming components
            isLoading, // loading state to coordinate UI behavior
            error, // error message for rendering feedback
            isDone, // completion flag for success indicators
            handleData, // field update helper to form inputs
            handleCreate, // create handler to submission controls
            handleUpdate, // update handler for edit workflows
            handleDelete, // delete handler for destructive actions
            image, // selected image file for previews or validation
            setImage, // setter to allow image selection updates
            fetchData, // fetch function to load author data by id
        }}
    >
        {children} {/* render nested components that consume the author form context */}
    </AuthorFormContext.Provider>
}

export const useAuthorForm = () => useContext(AuthorFormContext); // define a custom hook to consume author form context safely and consistently
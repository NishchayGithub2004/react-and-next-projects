"use client"

import { getCategory } from "@/lib/firebase/category/read"; // import getCategory to fetch a single category record for editing or pre-filling the form

import { 
    createNewCategory, // import createNewCategory function to persist a newly created category to the database
    deleteCategory, // import deleteCategory function to remove an existing category from the database
    updateCategory // import updateCategory function to apply updates to an existing category record
} from "@/lib/firebase/category/write";

import { useRouter } from "next/navigation"; // import useRouter to programmatically navigate after form actions like save or delete

import { 
    createContext, // import createContext to create a shared context for category form state
    useContext, // import useContext to allow child components to consume the category form context
    useState // import useState to manage local reactive state within the context provider
} from "react";

const CategoryFormContext = createContext(); // create a context to hold category form state and actions for descendant components

export default function CategoryFormContextProvider({ children }) { // define a context provider component to wrap category form UI with shared state
    const router = useRouter(); // initialize router instance to handle navigation based on form outcomes

    const [data, setData] = useState({}); // store category form field values and metadata as a mutable state object
    const [isLoading, setIsLoading] = useState(false); // track async operation status to control loading indicators and prevent duplicate actions
    const [error, setError] = useState(null); // store error information to surface validation or request failures to the UI
    const [isDone, setIsDone] = useState(false); // indicate successful completion of a form action such as create or update
    const [image, setImage] = useState(null); // hold the selected image file or image reference associated with the category

    const handleData = (key, value) => { // define a helper to update individual category fields dynamically
        setIsDone(false) // reset completion state when form data changes to avoid stale success indicators
    
        setData({
            ...data, // preserve existing category fields while updating a specific key
            [key]: value, // update the targeted field based on input changes
        })
    }
    
    const handleCreate = async () => { // define function to create a new category record in firebase
        setError(null) // clear previous errors before starting a new create operation
        setIsLoading(true) // mark operation as in progress to update UI state
        setIsDone(false) // reset completion state before attempting creation
    
        try {
            await createNewCategory({ data: data, image: image }) // persist new category data and image to firebase
            setIsDone(true) // mark operation successful to allow UI success feedback
        } catch (error) {
            setError(error?.message) // capture and expose error message if creation fails
        }
    
        setIsLoading(false) // conclude loading state after operation completes
    }
    
    const handleUpdate = async () => { // define function to update an existing category record
        setError(null) // clear previous errors before starting update
        setIsLoading(true) // indicate update operation is in progress
        setIsDone(false) // reset completion state before update attempt
    
        try {
            await updateCategory({ data: data, image: image }) // send updated category data and image to firebase
            setIsDone(true) // mark update as successful for UI handling
        } catch (error) {
            setError(error?.message) // surface update failure reason to the UI
        }
    
        setIsLoading(false) // stop loading indicator after update completes
    }
    
    const handleDelete = async (id) => { // define function to delete a category by id
        setError(null) // clear existing errors before deletion
        setIsLoading(true) // flag deletion operation as in progress
        setIsDone(false) // reset completion state prior to deletion
    
        try {
            await deleteCategory(id) // remove category record from firebase by id
            setIsDone(true) // mark deletion as successful
            router.push('/admin/categories') // redirect back to categories list after successful deletion
        } catch (error) {
            setError(error?.message) // expose deletion error message if operation fails
        }
    
        setIsLoading(false) // end loading state after delete attempt
    }
    
    const fetchData = async (id) => { // define function to fetch a category record for edit mode
        setError(null) // clear previous errors before fetching data
        setIsLoading(true) // indicate fetch operation is running
        setIsDone(false) // reset completion state before data retrieval
    
        try {
            const res = await getCategory(id) // retrieve category document snapshot from firebase by id
    
            if (res.exists()) setData(res.data()) // populate form state with fetched category data if record exists
            
            else throw new Error(`No Category found from id ${id}`) // fail explicitly when no matching category is found
        } catch (error) {
            setError(error?.message) // capture fetch error or missing record message
        }
    
        setIsLoading(false) // conclude loading state after fetch attempt
    }
    
    return <CategoryFormContext.Provider
        value={{ // provide following values and functions to rendered content
            data, // current category form data to consuming components
            isLoading, // loading state to coordinate UI behavior
            error, // error message for rendering feedback
            isDone, // completion flag for success indicators
            handleData, // field update helper to form inputs
            handleCreate, // create handler to submission controls
            handleUpdate, // update handler for edit workflows
            handleDelete, // delete handler for destructive actions
            image, // selected image file for previews or validation
            setImage, // setter to allow image selection updates
            fetchData, // fetch function to load category data by id
        }}
    >
        {children} {/* render nested components that consume the category form context */}
    </CategoryFormContext.Provider>    
}

export const useCategoryForm = () => useContext(CategoryFormContext); // define a custom hook to expose category form context values to consuming components
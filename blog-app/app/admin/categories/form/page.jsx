"use client"

import { useSearchParams } from "next/navigation"; // import useSearchParams to read query parameters from the current route
import { useCategoryForm } from "./contexts/CategoryFormContext"; // import custom hook to access category form context state and handlers
import { useEffect } from "react"; // import useEffect to run side effects based on query parameter changes

export default function Page() { // define page component to handle create and update category workflows
    const searchParams = useSearchParams(); // initialize search params reader for accessing url query values

    const updateCategoryId = searchParams.get('id'); // extract category id from query params to determine edit mode

    const { // extract the following things from categories form context
        data, // current category form data consumed by the page
        isLoading, // loading flag to control UI feedback during async operations
        error, // error message state for rendering failure feedback
        isDone, // completion flag to indicate successful operations
        handleData, // handler to update individual form fields
        handleCreate, // handler to create a new category
        handleUpdate, // handler to update an existing category
        handleDelete, // handler to delete a category
        image, // selected image associated with the category
        setImage, // setter to update selected image state
        fetchData, // function to fetch category data by id for edit mode
    } = useCategoryForm();

    useEffect(() => { // run side effect when category id changes in the url
        if (updateCategoryId) {
            fetchData(updateCategoryId); // fetch existing category data when editing an existing record
        }
    }, [updateCategoryId]); // re-run effect only when the category id query param changes

    return (
        <main className="w-full p-6 flex flex-col gap-3">
            <div className="flex gap-5 items-center">
                {updateCategoryId && ( // conditionally render update badge when an existing category id is present
                    <div className="flex">
                        <h3 className="text-white bg-orange-500 px-4 py-2 rounded-full text-xs font-bold">Update</h3>
                    </div>
                )}
    
                {!updateCategoryId && ( // conditionally render create badge when no category id is present
                    <div className="flex">
                        <h3 className="text-white bg-green-500 px-4 py-2 rounded-full text-xs font-bold">Create</h3>
                    </div>
                )}
    
                <h1 className="font-bold">Category | Form</h1>
            </div>
    
            <section className="flex">
                <form
                    onSubmit={(e) => { // handle form submission for both create and update flows
                        e.preventDefault(); // prevent default browser form submission behavior
    
                        if (updateCategoryId) handleUpdate(); // trigger update logic when editing an existing category
                        else handleCreate(); // trigger create logic when adding a new category
                    }}
                    className="flex flex-col gap-2 bg-blue-50 rounded-xl p-7"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Category Name <span className="text-red-500">*</span></label>
    
                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Category Name"
                            type="text"
                            onChange={(e) => { // capture name input changes to update form state
                                handleData('name', e.target.value); // update category name field in context state
                            }}
                            value={data?.name} // bind input value to category name from form state
                            required
                        />
                    </div>
    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Category Slug <span className="text-red-500">*</span></label>
    
                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Category Slug"
                            type="text"
                            onChange={(e) => { // capture slug input changes to update form state
                                handleData('slug', e.target.value); // update category slug field in context state
                            }}
                            value={data?.slug} // bind input value to category slug from form state
                            required
                        />
                    </div>
    
                    {data?.iconURL && ( // conditionally render existing category image when available
                        <div>
                            <img className="h-40" src={data?.iconURL} alt="" /> {/* render the existing category image using the stored icon url when available */}
                        </div>
                    )}
    
                    {image && ( // conditionally render preview of newly selected image file
                        <div>
                            <img className="h-40" src={URL.createObjectURL(image)} alt="" /> {/* generate and display a temporary preview url for the selected image file before upload */}
                        </div>
                    )}
    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Image</label>
    
                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            type="file"
                            accept="image/*"
                            onChange={(e) => { // handle image file selection from file input
                                e.preventDefault(); // prevent default file input behavior side effects
                                setImage(e.target.files[0]); // store selected image file in context state
                            }}
                        />
                    </div>
    
                    {error && <p className="text-red-500 text-sm">{error}</p>} {/* conditionally render error message when an error exists */}
    
                    {!isDone && ( // hide submit button once operation is completed successfully
                        <button
                            type="submit"
                            disabled={isLoading || isDone} // disable button while loading or after completion
                            className="bg-blue-500 rounded-full px-4 py-2 text-white"
                        >
                            {isLoading ? "Loading..." : updateCategoryId ? "Update" : "Create"} {/* switch button label based on state */}
                        </button>
                    )}
    
                    {updateCategoryId && !isDone && ( // conditionally render delete button only in update mode before completion
                        <button
                            onClick={(e) => { // handle delete button click explicitly
                                e.preventDefault(); // prevent form submission when clicking delete
                                handleDelete(updateCategoryId); // trigger delete logic with current category id
                            }}
                            disabled={isLoading || isDone} // disable delete button during loading or after completion
                            className="bg-red-500 rounded-full px-4 py-2 text-white"
                        >
                            {isLoading ? "Loading..." : "Delete"} {/* update delete button label based on loading state */}
                        </button>
                    )}
    
                    {isDone && ( // conditionally render success message when operation completes
                        <h3 className="text-green-500 font-bold text-center">
                            Successfully {updateCategoryId ? "Updated" : "Created"} ! {/* display success message based on whether category was updated or created */}
                        </h3>
                    )}
                </form>
            </section>
        </main>
    )    
}
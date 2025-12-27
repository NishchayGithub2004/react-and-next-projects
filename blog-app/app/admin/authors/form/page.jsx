"use client"

import { useSearchParams } from "next/navigation"; // import hook to read query parameters from the current url
import { useEffect } from "react"; // import effect hook to run side effects based on dependency changes
import { useAuthorForm } from "./contexts/AuthorFormContext"; // import custom hook to access author form context state and actions

export default function Page() { // define page component to handle create and update author workflows
    const searchParams = useSearchParams(); // initialize search params reader to access query values

    const updateAuthorId = searchParams.get('id') // extract author id from query params to determine edit mode

    const { // extract the following things from author form context
        data, // current author form data
        isLoading, // loading state for async operations
        error, // error message from failed operations
        isDone, // completion flag for successful actions
        handleData, // function to update form fields
        handleCreate, // function to create a new author
        handleUpdate, // function to update an existing author
        handleDelete, // function to delete an author
        image, // selected image file for the author
        setImage, // setter to update selected image
        fetchData, // function to fetch author data by id
    } = useAuthorForm();

    useEffect(() => { // run side effect when author id changes to load existing author data
        if (updateAuthorId) {
            fetchData(updateAuthorId); // fetch author data to populate form when editing
        }
    }, [updateAuthorId]) // re-run effect whenever the query id changes

    return (
        <main className="w-full p-6 flex flex-col gap-3">
            <div className="flex gap-5 items-center">
                {updateAuthorId && ( // conditionally render update badge when page is in edit mode
                    <div className="flex">
                        <h3 className="text-white bg-orange-500 px-4 py-2 rounded-full text-xs font-bold">Update</h3>
                    </div>
                )}

                {!updateAuthorId && ( // conditionally render create badge when page is in create mode
                    <div className="flex">
                        <h3 className="text-white bg-green-500 px-4 py-2 rounded-full text-xs font-bold">Create</h3>
                    </div>
                )}

                <h1 className="font-bold">Author | Form</h1>
            </div>

            <section className="flex">
                <form
                    onSubmit={(e) => { // handle form submission for both create and update workflows
                        e.preventDefault(); // prevent default form submission to control behavior manually
                        if (updateAuthorId) {
                            handleUpdate(); // trigger update logic when editing an existing author
                        } else {
                            handleCreate(); // trigger create logic when adding a new author
                        }
                    }}
                    className="flex flex-col gap-2 bg-blue-50 rounded-xl p-7">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">
                            Author Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Author Name"
                            type="text"
                            onChange={(e) => { // capture name input changes to keep form state in sync
                                handleData('name', e.target.value); // update name field in form state
                            }}
                            value={data?.name} // bind input value to current author name from state
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">
                            Author Email <span className="text-red-500">*</span>
                        </label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Author Email"
                            type="email"
                            onChange={(e) => { // capture email input changes to update form state
                                handleData('email', e.target.value); // update email field in form state
                            }}
                            value={data?.email} // bind input value to current author email from state
                            required
                        />
                    </div>

                    {data?.photoURL && ( // render existing author image when editing an author with saved photo
                        <div>
                            <img className="h-40" src={data?.photoURL} alt="" /> {/* render the existing category image using the stored icon url when available */}
                        </div>
                    )}

                    {image && ( // render preview of newly selected image before submission
                        <div>
                            <img className="h-40" src={URL.createObjectURL(image)} alt="" /> {/* generate and display a temporary preview url for the selected image file before upload */}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Image</label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Author Slug"
                            type="file"
                            accept="image/*"
                            onChange={(e) => { // handle image file selection from local device
                                e.preventDefault(); // prevent default file input behavior side effects
                                setImage(e.target.files[0]); // store selected image file in state for upload
                            }}
                        />
                    </div>

                    {error && ( // conditionally render error message when an operation fails
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {!isDone && ( // render submit button only while operation is not completed
                        <button
                            type="submit"
                            disabled={isLoading || isDone} // disable button during async operation or after completion
                            className="bg-blue-500 rounded-full px-4 py-2 text-white">
                            {isLoading ? "Loading..." : updateAuthorId ? "Update" : "Create"} {/* switch button label based on state and mode */}
                        </button>
                    )}

                    {updateAuthorId && !isDone && ( // render delete button only in edit mode before completion
                        <button
                            onClick={(e) => { // handle delete action separately from form submission
                                e.preventDefault(); // prevent form submission when deleting
                                handleDelete(updateAuthorId); // trigger delete logic for current author
                            }}
                            disabled={isLoading || isDone} // disable delete during async operation or after completion
                            className="bg-red-500 rounded-full px-4 py-2 text-white">
                            {isLoading ? "Loading..." : "Delete"} {/* reflect loading state in delete button label */}
                        </button>
                    )}

                    {isDone && ( // render success message once create, update, or delete completes
                        <h3 className="text-green-500 font-bold text-center">
                            Successfully {updateAuthorId ? "Updated" : "Created"} ! {/* display success message based on whether author was updated or created */}
                        </h3>
                    )}
                </form>
            </section>
        </main>
    )
}
"use client"

import { useSearchParams } from "next/navigation"; // import useSearchParams to read query parameters from the URL
import { useEffect } from "react"; // import useEffect to perform side effects based on component lifecycle and dependencies
import { usePostForm } from "./contexts/PostFormContext"; // import usePostForm to access post form state and actions from context
import { useCategories } from "@/lib/firebase/category/read"; // import useCategories to fetch available categories for post assignment
import { useAuthors } from "@/lib/firebase/author/read"; // import useAuthors to fetch available authors for post attribution
import { RTEField } from "./components/RTEField"; // import RTEField to render a rich text editor for post content input

export default function Page() { // define the page component responsible for creating or editing a post
    const searchParams = useSearchParams(); // initialize searchParams to access URL query values

    const updatePostId = searchParams.get("id"); // extract post id from query params to determine edit mode

    const { // extract the following things from posts form context
        data, // current post form data state
        isLoading, // loading state to control UI feedback and disable actions
        error, // error message state to display failures
        isDone, // completion flag indicating successful operations
        handleData, // helper function to update individual post fields
        handleCreate, // handler to create a new post
        handleUpdate, // handler to update an existing post
        handleDelete, // handler to delete a post by id
        image, // selected image associated with the post
        setImage, // setter to update the selected post image
        fetchData, // function to fetch post data when editing an existing post
    } = usePostForm();

    useEffect(() => { // run side effect when edit mode is detected or query id changes
        if (updatePostId) {
            fetchData(updatePostId); // fetch existing post data to pre-fill the form when editing
        }
    }, [updatePostId]); // re-run effect only when the post id query parameter changes

    return (
        <main className="w-full p-6 flex flex-col gap-3">
            <div className="flex gap-5 items-center">
                {updatePostId && ( // conditionally render update indicator when a post id exists to signal edit mode
                    <div className="flex">
                        <h3 className="text-white bg-orange-500 px-4 py-2 rounded-full text-xs font-bold">Update</h3>
                    </div>
                )}

                {!updatePostId && ( // conditionally render create indicator when no post id exists to signal create mode
                    <div className="flex">
                        <h3 className="text-white bg-green-500 px-4 py-2 rounded-full text-xs font-bold">Create</h3>
                    </div>
                )}

                <h1 className="font-bold">Posts | Form</h1>
            </div>

            <section className="flex gap-5">
                <form
                    onSubmit={(e) => { // handle form submission to route between create or update logic
                        e.preventDefault(); // prevent default browser form submission behavior
                        if (updatePostId) {
                            handleUpdate(); // trigger update flow when post id exists
                        } else {
                            handleCreate(); // trigger create flow when no post id exists
                        }
                    }}
                    className="flex flex-col gap-2 bg-blue-50 rounded-xl p-7"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Title <span className="text-red-500">*</span></label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Title"
                            type="text"
                            onChange={(e) => { // update title field in form state on user input
                                handleData("title", e.target.value); // store current title value into shared form state
                            }}
                            value={data?.title} // bind input value to title field from form state
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Post Slug <span className="text-red-500">*</span></label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            placeholder="Enter Post Slug"
                            type="text"
                            disabled={updatePostId} // disable slug editing when updating an existing post
                            onChange={(e) => { // update slug field in form state on user input
                                handleData("slug", e.target.value); // store current slug value into shared form state
                            }}
                            value={data?.slug} // bind input value to slug field from form state
                            required
                        />
                    </div>

                    <SelectCategoryField />

                    <SelectAuthorField />

                    {data?.imageURL && ( // conditionally render existing post image when imageURL is available
                        <div>
                            <img className="h-40" src={data?.imageURL} alt="" /> {/* render existing post image using dynamic imageURL from form state */}
                        </div>
                    )}

                    {image && ( // conditionally render preview of newly selected image file
                        <div>
                            <img className="h-40" src={URL.createObjectURL(image)} alt="" /> {/* generate and render a temporary preview URL for the newly selected image file */}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Image</label>

                        <input
                            className="px-4 py-2 rounded-full border bg-gray-50"
                            type="file"
                            accept="image/*"
                            onChange={(e) => { // handle image file selection from file input
                                e.preventDefault(); // prevent unintended default file input behavior
                                setImage(e.target.files[0]); // store selected image file in form state
                            }}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>} {/* render error message when an error exists */}

                    {!isDone && ( // render submit button only when operation is not completed
                        <button
                            type="submit"
                            disabled={isLoading || isDone} // disable button during loading or after completion
                            className="bg-blue-500 rounded-full px-4 py-2 text-white"
                        >
                            {isLoading ? "Loading..." : updatePostId ? "Update" : "Create"} {/* dynamically change button label based on state */}
                        </button>
                    )}

                    {updatePostId && !isDone && ( // render delete button only in update mode before completion
                        <button
                            onClick={(e) => { // handle delete button click
                                e.preventDefault(); // prevent form submission on delete action
                                handleDelete(updatePostId); // trigger delete flow for current post
                            }}
                            disabled={isLoading || isDone} // disable delete during loading or after completion
                            className="bg-red-500 rounded-full px-4 py-2 text-white"
                        >
                            {isLoading ? "Loading..." : "Delete"} {/* update label based on loading state */}
                        </button>
                    )}

                    {isDone && ( // render success message when create or update operation completes
                        <h3 className="text-green-500 font-bold text-center">
                            Successfully {updatePostId ? "Updated" : "Created"} ! {/* display success message based on whether post was updated or created */}
                        </h3>
                    )}
                </form>

                <RTEField />
            </section>
        </main>
    )
}

function SelectCategoryField() { // define a helper component to select a category and bind it to post form state
    const {
        data, // current post form data containing selected category id
        handleData, // helper function to update post form fields
    } = usePostForm(); // consume post form context to read and update shared state

    const { data: categories } = useCategories(); // fetch available categories list for selection input

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">Category <span className="text-red-500">*</span></label>

            <select
                className="px-4 py-2 rounded-full border bg-gray-50"
                value={data?.categoryId} // bind selected value to categoryId stored in form state
                onChange={(e) => { // handle category selection change from dropdown
                    handleData("categoryId", e.target.value); // update selected category id in shared form state
                }}
                required
            >
                <option value="">Select Category</option>

                {categories && categories?.map((item) => { // iterate over fetched categories to render selectable options
                    return <option value={item?.id}>{item?.name}</option>; // render option using dynamic category id and name
                })}
            </select>
        </div>
    );
}

function SelectAuthorField() { // define a helper component to select an author and bind it to post form state
    const {
        data, // current post form data containing selected author id
        handleData, // helper function to update post form fields
    } = usePostForm(); // consume post form context to read and update shared state

    const { data: authors } = useAuthors(); // fetch available authors list for selection input

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">Authors <span className="text-red-500">*</span></label>

            <select
                className="px-4 py-2 rounded-full border bg-gray-50"
                value={data?.authorId} // bind selected value to authorId stored in form state
                onChange={(e) => { // handle author selection change from dropdown
                    handleData("authorId", e.target.value); // update selected author id in shared form state
                }}
                required
            >
                <option value="">Select Author</option>

                {authors && authors?.map((item) => { // iterate over fetched authors to render selectable options
                    return <option value={item?.id}>{item?.name}</option>; // render option using dynamic author id and name
                })}
            </select>
        </div>
    );
}
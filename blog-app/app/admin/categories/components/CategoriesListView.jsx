"use client"

import { useCategories } from "@/lib/firebase/category/read"; // import useCategories to fetch category data from firebase for rendering the list
import Link from "next/link"; // import Link to enable client-side navigation to the category edit form

export default function CategoriesListView() { // define a functional component named 'CategoriesListView' to display a table view of all categories
    const { data, error, isLoading } = useCategories(); // invoke the categories hook to retrieve category data along with loading and error states

    if (isLoading) return <h1>Loading...</h1>; // short-circuit render to show loading state while data is being fetched

    if (error) return <h1>{error}</h1>; // short-circuit render to display error message when data fetching fails

    if (!data) return <h1>Data not found!</h1>; // short-circuit render to handle the edge case where no data is returned

    return (
        <section>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-blue-50">Sr.</th>
                        <th className="border px-4 py-2 bg-blue-50">Icon</th>
                        <th className="border px-4 py-2 bg-blue-50">Name</th>
                        <th className="border px-4 py-2 bg-blue-50">Slug</th>
                        <th className="border px-4 py-2 bg-blue-50">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map( // iterate over the category list to render one table row per category
                        (
                            item, // represent the current category object being rendered
                            key // represent the index of the current category for serial numbering
                        ) => {
                            return (
                                <tr>
                                    <td className="border px-4 py-2">{key + 1}</td> {/* display a human-readable serial number based on array index */}
                                    <td className="border px-4 py-2">
                                        <img className="h-10" src={item?.iconURL} alt="" /> {/* render the category icon image using its stored url */}
                                    </td>
                                    <td className="border px-4 py-2">{item?.name}</td> {/* display the category name from fetched data */}
                                    <td className="border px-4 py-2">{item?.slug}</td> {/* display the category slug used for identification or routing */}
                                    <td className="border px-4 py-2">
                                        <Link href={`/admin/categories/form?id=${item?.id}`}> {/* navigate to the category form with the selected category id */}
                                            <button className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                                                Action
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </section>
    );
}
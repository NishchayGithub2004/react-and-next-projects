"use client"

import { useAuthors } from "@/lib/firebase/author/read"; // import custom hook to fetch authors data from firebase for listing
import Link from "next/link" // import Link to enable client-side navigation to author edit form

export default function AuthorsListView() { // define a functional component named 'AuthorsListView' to render a table of authors
    const { data, error, isLoading } = useAuthors(); // invoke authors hook to retrieve authors data along with loading and error states

    if (isLoading) return <h1>Loading...</h1> // render loading state to block UI until authors data is fetched

    if (error) return <h1>{error}</h1> // render error message to surface data-fetching failures to the user

    if (!data) return <h1>Data not found!</h1> // guard against empty or undefined data to prevent rendering invalid UI

    return (
        <section>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-blue-50">Sr.</th>
                        <th className="border px-4 py-2 bg-blue-50">Photo</th>
                        <th className="border px-4 py-2 bg-blue-50">Name</th>
                        <th className="border px-4 py-2 bg-blue-50">Email</th>
                        <th className="border px-4 py-2 bg-blue-50">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map( // iterate over authors data to render a table row for each author
                        (
                            item, // represent a single author record used to populate row data
                            key // represent the current index used for serial numbering
                        ) => {
                            return (
                                <tr>
                                    <td className="border px-4 py-2">{key + 1}</td> {/* display serial number to indicate row order */}
                                    <td className="border px-4 py-2">
                                        <img className="h-10" src={item?.photoURL} alt="" /> {/* render author's photo using dynamic photo url */}
                                    </td>
                                    <td className="border px-4 py-2">{item?.name}</td> {/* display author's name from fetched data */}
                                    <td className="border px-4 py-2">{item?.email}</td> {/* display author's email for identification */}
                                    <td className="border px-4 py-2">
                                        <Link href={`/admin/authors/form?id=${item?.id}`}> {/* navigate to author form with author id for editing */}
                                            <button className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                                                Action
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </section>
    )
}
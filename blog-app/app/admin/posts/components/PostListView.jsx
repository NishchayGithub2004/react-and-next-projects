"use client" // mark this module as a client-side component to enable React hooks and browser-only APIs

import { usePosts } from "@/lib/firebase/post/read"; // import usePosts hook to fetch post data, loading state, and error state from firebase
import Link from "next/link" // import Link component to enable client-side navigation in Next.js

export default function PostListView() { // define a React component named PostListView to render a list of posts in a table
    const { data, error, isLoading } = usePosts(); // call usePosts hook to retrieve posts data along with loading and error states

    if (isLoading) return <h1>Loading...</h1> // immediately render a loading state while posts are being fetched

    if (error) return <h1>{error}</h1> // immediately render the error message if the fetch operation fails

    if (!data) return <h1>Data not found!</h1> // handle the edge case where no data is returned after loading completes

    return (
        <section>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-blue-50">Sr.</th>
                        <th className="border px-4 py-2 bg-blue-50">Image</th>
                        <th className="border px-4 py-2 bg-blue-50">Title</th>
                        <th className="border px-4 py-2 bg-blue-50">Slug</th>
                        <th className="border px-4 py-2 bg-blue-50">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((item, key) => { // iterate over posts data array to generate a table row for each post
                        return (
                            <tr>
                                <td className="border px-4 py-2">{key + 1}</td> {/* display a human-readable serial number based on array index */}
                                <td className="border px-4 py-2">
                                    <img className="h-10" src={item?.imageURL} alt="" /> {/* render post thumbnail using the dynamic imageURL value */}
                                </td>
                                <td className="border px-4 py-2">{item?.title}</td> {/* display the post title retrieved from the current item */}
                                <td className="border px-4 py-2">{item?.slug}</td> {/* display the post slug used for identification or routing */}
                                <td className="border px-4 py-2">
                                    <Link href={`/admin/posts/form?id=${item?.id}`}> {/* generate a dynamic admin edit link using the post id */}
                                        <button className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">Action</button>
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
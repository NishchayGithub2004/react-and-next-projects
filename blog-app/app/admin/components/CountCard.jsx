"use client"

import useCollectionCount from "@/lib/firebase/count"; // import custom hook to fetch document count for a given firestore collection path

export default function CountCard( // define a card component to display collection count summary
    { 
        path, // represent firestore collection path used to calculate document count
        name, // represent display label for the counted entity
        icon // represent visual icon element passed from parent for contextual display
    }
) {
    const { data, isLoading, error } = useCollectionCount({ path: path }); // invoke count hook to retrieve collection size with loading and error states

    if (isLoading) return <h2>Loading ...</h2>; // show loading indicator while count is being fetched

    if (error) return <p>{error}</p>; // display error message when count retrieval fails

    return (
        <div className="flex gap-2 bg-gray-50 items-center rounded px-8 py-2">
            {icon} {/* render provided icon element to visually represent the collection */}

            <div>
                <h1 className="font-bold">{name}</h1> {/* display collection name label */}
                <h2 className="text-xl font-bold">{data}</h2> {/* display resolved document count from firestore */}
            </div>
        </div>
    );
}
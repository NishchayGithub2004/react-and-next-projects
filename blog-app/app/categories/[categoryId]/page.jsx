import { PostCard } from "@/app/components/PostListView"; // import PostCard to render individual post previews in a grid layout
import { getCategory } from "@/lib/firebase/category/read_server"; // import getCategory to fetch category data by category id on the server
import { getAllPostsWithCategory } from "@/lib/firebase/post/read_server"; // import getAllPostsWithCategory to fetch posts filtered by category id

export default async function Page({ params }) { // define a server page component to render all posts belonging to a specific category
    const { categoryId: categoryIdEncoded } = params; // extract and rename encoded category id from route parameters

    const categoryId = decodeURI(categoryIdEncoded); // decode the category id to handle URL-encoded characters safely

    const posts = await getAllPostsWithCategory(categoryId); // fetch all posts that belong to the resolved category id

    return (
        <main className="p-10">
            <div className="flex p-5 gap-3">
                <h1 className="font-bold">Categories /</h1>
                <CategoryCard categoryId={categoryId} /> {/* pass categoryId to render the active category badge */}
            </div>
            
            <div className="grid grid-cols-4 gap-5">
                {posts?.map((post, key) => { // iterate over fetched posts to render a PostCard for each entry
                    return <PostCard post={post} key={key} /> // render a post preview card using post data and index as key
                })}
            </div>
        </main>
    );
}

async function CategoryCard({ categoryId }) { // define a server component to render category metadata for a given category id
    const category = await getCategory(categoryId); // fetch category data associated with the provided category id

    return (
        <div className="flex gap-2 items-center bg-white bg-opacity-60 rounded-full px-2 py-1 border">
            <img className="h-4 w-4 rounded-full object-cover" src={category?.iconURL} alt="" /> {/* render the category icon using the stored icon URL */}
            <h4 className="text-xs text-gray-500">{category?.name}</h4> {/* render the category name for identification */}
        </div>
    );
}
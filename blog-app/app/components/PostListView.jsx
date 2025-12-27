import { getAuthor } from "@/lib/firebase/author/read_server"; // import getAuthor to fetch author data by author id on the server
import { getCategory } from "@/lib/firebase/category/read_server"; // import getCategory to fetch category data by category id on the server
import { getAllPosts } from "@/lib/firebase/post/read_server"; // import getAllPosts to fetch all post documents from firestore
import Link from "next/link"; // import Link to enable client-side navigation to post detail pages

export const dynamic = "force-dynamic"; // force dynamic rendering to ensure posts are fetched fresh on each request

export default async function PostListView() { // define a server component to render a grid view of all posts
    const posts = await getAllPosts(); // fetch all posts from the database to display in the list

    if (!posts) { // render a fallback UI if no posts are available to display
        return (
            <div>
                <h3>Posts Not Available!</h3>
            </div>
        )
    }

    return <section className="p-10">
        <div className="grid grid-cols-4 gap-5">
            {posts?.map((post, key) => { // iterate over posts to render a card for each post
                return <PostCard post={post} key={key} /> // render a PostCard component for each post item
            })}
        </div>
    </section>
}

export function PostCard({ post }) { // define a component to render a single post preview card
    return (
        <Link href={`/posts/${post?.id}`}> {/* navigate to the post detail page using the post id */}
            <div className="flex flex-col gap-3 p-5 rounded">
                <div className="relative">
                    <div className="absolute flex justify-end w-full p-3">
                        <CategoryCard categoryId={post?.categoryId} /> {/* render the post category badge using categoryId */}
                    </div>

                    <img className="h-[200px] w-full object-cover" src={post?.imageURL} alt="" /> {/* render the post featured image */}
                </div>

                <h1 className="font-bold">{post?.title}</h1> {/* render the post title */}

                <div className="flex justify-between">
                    <AuthorCard authorId={post?.authorId} /> {/* render author information using authorId */}
                    <h5 className="text-xs text-gray-500">{post?.timestamp?.toDate()?.toLocaleDateString()}</h5> {/* format and display post publish date */}
                </div>
            </div>
        </Link>
    )
}

async function AuthorCard({ authorId }) { // define a server component to render author details for a post
    const author = await getAuthor(authorId); // fetch author data using the provided author id

    return (
        <div className="flex gap-2 items-center">
            <img className="h-6 w-6 rounded-full object-cover" src={author?.photoURL} alt="" /> {/* render author's profile image */}
            <h4 className="text-sm text-gray-500">{author?.name}</h4> {/* render author's display name */}
        </div>
    )
}

async function CategoryCard({ categoryId }) { // define a server component to render category details for a post
    const category = await getCategory(categoryId); // fetch category data using the provided category id

    return (
        <div className="flex gap-2 items-center bg-white bg-opacity-60 rounded-full px-2 py-1">
            <img className="h-4 w-4 rounded-full object-cover" src={category?.iconURL} alt="" /> {/* render category icon image */}
            <h4 className="text-xs text-gray-500">{category?.name}</h4> {/* render category name */}
        </div>
    )
}
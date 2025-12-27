import { getAuthor } from "@/lib/firebase/author/read_server"; // import getAuthor to fetch author data by author id on the server
import { getCategory } from "@/lib/firebase/category/read_server"; // import getCategory to fetch category data by category id on the server
import { getPost } from "@/lib/firebase/post/read_server"; // import getPost to fetch post data by post id on the server

export async function generateMetadata({ params }) { // define a metadata generator to build dynamic page metadata based on post data
    const { postId } = params; // extract postId from route parameters to identify which post to fetch

    const post = await getPost(postId); // fetch the post data needed to populate metadata fields

    return {
        title: post?.title, // set the page title dynamically based on the post title
        openGraph: {
            images: [post?.imageURL], // set open graph image using the post's featured image for link previews
        },
    };
}

export default async function Page({ params }) { // define the main page component to render a single post view
    const { postId } = params; // extract postId from route parameters to load the correct post

    const post = await getPost(postId); // fetch the post data to render its content

    return (
        <main className="flex justify-center">
            <section className="flex flex-col gap-5 px-16 py-10 max-w-[800px]">
                <CategoryCard categoryId={post?.categoryId} /> {/* pass categoryId to render the associated category badge */}
                <h1 className="text-2xl font-bold">{post?.title}</h1> {/* render the post title from fetched post data */}
                <img className="w-full object-cover" src={post?.imageURL} alt="" /> {/* render the post image using the stored image URL */}
                <div className="flex justify-between items-center">
                    <AuthorCard authorId={post?.authorId} /> {/* pass authorId to render author details */}
                    <h5 className="text-xs text-gray-500">{post?.timestamp?.toDate()?.toLocaleDateString()}</h5> {/* format and display the post publish date */}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post?.content }}></div> {/* inject stored HTML content directly for rich text rendering */}
            </section>
        </main>
    );
}

async function AuthorCard({ authorId }) { // define a server component to render author information for a given author id
    const author = await getAuthor(authorId); // fetch author data associated with the post

    return (
        <div className="flex gap-2 items-center">
            <img className="h-6 w-6 rounded-full object-cover" src={author?.photoURL} alt="" /> {/* render the author's profile image */}
            <h4 className="text-sm text-gray-500">{author?.name}</h4> {/* render the author's display name */}
        </div>
    );
}

async function CategoryCard({ categoryId }) { // define a server component to render category information for a given category id
    const category = await getCategory(categoryId); // fetch category data associated with the post

    return (
        <div className="flex">
            <div className="flex gap-2 items-center bg-white bg-opacity-60 rounded-full px-2 py-1 border">
                <img className="h-4 w-4 rounded-full object-cover" src={category?.iconURL} alt="" /> {/* render the category icon image */}
                <h4 className="text-xs text-gray-500">{category?.name}</h4> {/* render the category name */}
            </div>
        </div>
    );
}
import { getAllCategories } from "@/lib/firebase/category/read_server"; // import getAllCategories to fetch all category documents from firestore on the server
import Link from "next/link"; // import Link to enable client-side navigation between category pages

export const dynamic = "force-dynamic"; // force dynamic rendering to ensure categories are always fetched fresh on each request

export default async function Page() { // define a server page component to render the categories listing
    const categories = await getAllCategories(); // fetch all available categories from the database

    return (
        <main className="p-10">
            <section className="grid grid-cols-5">
                {categories?.map((category, key) => { // iterate over categories to render a card for each category
                    return <CategoryCard category={category} key={key} /> // render a CategoryCard with category data and a stable list key
                })}
            </section>
        </main>
    );
}

function CategoryCard({ category }) { // define a presentational component to display a single category
    return (
        <Link href={`/categories/${category?.id}`}> {/* build a dynamic route to the category page using its id */}
            <div className="flex flex-col items-center justify-center gap-2 hover:bg-blue-50 rounded-xl p-6">
                <img className="h-28 w-28 object-cover rounded-full" src={category?.iconURL} alt="" /> {/* render the category icon image */}
                <h1 className="font-bold">{category?.name}</h1> {/* render the category name for identification */}
            </div>
        </Link>
    );
}
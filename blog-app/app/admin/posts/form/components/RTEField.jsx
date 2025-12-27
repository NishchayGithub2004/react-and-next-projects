import dynamic from "next/dynamic"; // import dynamic to enable lazy loading of client-only components in Next.js
import "react-quill/dist/quill.snow.css"; // import react-quill snow theme styles to apply default editor UI styling
import { usePostForm } from "../contexts/PostFormContext"; // import usePostForm hook to access and update post form state via context

const ReactQuill = dynamic( // dynamically import ReactQuill to avoid server-side rendering issues
    () => import("react-quill"), // load the react-quill rich text editor only on the client
    { ssr: false } // explicitly disable server-side rendering for this component
);

const modules = { // define configuration object to control the behavior and toolbar options of the rich text editor
    toolbar: { // configure the toolbar layout and available formatting actions
        container: [ // specify toolbar groups and their respective controls
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: ["extra-small", "small", "medium", "large"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }],
            ["clean"],
        ],
    },
};

export function RTEField() { // define a reusable rich text editor field component for post content input
    const { data, handleData } = usePostForm(); // extract current form data and updater function from post form context

    const handleChange = (value) => { // define a handler to sync editor content changes with form state
        handleData("content", value); // update the post content field in shared form state
    };

    return (
        <div>
            <ReactQuill
                value={data?.content} // bind editor value to current post content from form state
                onChange={handleChange} // propagate editor changes back to form state
                modules={modules} // apply predefined toolbar and editor configuration
                placeholder="Enter your content here..."
            />
        </div>
    );
}
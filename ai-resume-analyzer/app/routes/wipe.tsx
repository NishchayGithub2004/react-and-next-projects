import { useEffect, useState } from "react"; // import hooks to manage component state and run side effects when dependencies change
import { useNavigate } from "react-router"; // import navigation helper to programmatically redirect users
import { usePuterStore } from "~/lib/puter"; // import global store hook providing auth state, filesystem, errors, AI API, and KV storage

const WipeApp = () => { // define WipeApp component responsible for listing files and clearing app data
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore(); // extract authentication info, loading flag, error state, filesystem API, AI API, and KV storage API
    
    const navigate = useNavigate(); // create navigation function to redirect based on authentication state
    
    const [files, setFiles] = useState<FSItem[]>([]); // maintain list of filesystem items so UI can render existing files

    const loadFiles = async () => { // define async function to load directory contents from filesystem
        const files = (await fs.readDir("./")) as FSItem[]; // read root directory to fetch list of stored files
        setFiles(files); // update component state with fetched file entries
    };

    useEffect(() => { // load files when component mounts to populate initial listing
        loadFiles(); // call loader function to retrieve file list
    }, []); // run once on mount

    useEffect(() => { // run authentication guard whenever loading completes
        if (!isLoading && !auth.isAuthenticated) { // check if user is unauthenticated once loading is done
            navigate("/auth?next=/wipe"); // redirect unauthenticated users to login page with return path
        }
    }, [isLoading]); // rerun only when loading state changes

    const handleDelete = async () => { // define handler to delete all files and clear KV storage
        files.forEach(async (file) => { // iterate through each file returned earlier
            await fs.delete(file.path); // delete file from filesystem using its path
        });
        await kv.flush(); // clear all key-value entries to fully wipe stored app data
        loadFiles(); // reload files to refresh UI after deletion
    };

    if (isLoading) return <div>Loading...</div>; // guard: show loading UI while authentication or store is initializing

    if (error) return <div>Error {error}</div>; // guard: display error message when store flags an error

    return ( // return interactive UI allowing user to view and delete all stored data
        <div>
            Authenticated as: {auth.user?.username} {/* dynamically displays the authenticated user's username by reading it from the auth state */}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => ( // iterates through the list of filesystem items and returns UI elements for each entr
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p> {/* inserts the current file's name dynamically so each rendered item displays its own filename */}
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => handleDelete()} // call deletion handler to wipe filesystem and KV data
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp; // export component so route system or parent components can render it
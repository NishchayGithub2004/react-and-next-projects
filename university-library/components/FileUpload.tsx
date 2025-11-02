"use client"; // enable client-side rendering to allow browser interactivity and file uploads

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next"; // import imagekit components for handling image/video uploads and rendering
import config from "@/lib/config"; // import configuration file to access API endpoints and environment variables
import { useRef, useState } from "react"; // import react hooks for state management and DOM references
import Image from "next/image"; // import next.js image component for optimized icon rendering
import { toast } from "@/hooks/use-toast"; // import toast utility to show notifications
import { cn } from "@/lib/utils"; // import helper to combine conditional class names dynamically

interface Props { // define an interface named 'Props' to strongly type the properties accepted by the FileUpload component
  type: "image" | "video"; // type determines whether the upload is for an image or a video
  accept: string; // accept specifies allowed MIME types for the file input
  placeholder: string; // placeholder shows label text inside the upload button before file selection
  folder: string; // folder specifies upload destination path within ImageKit
  variant: "dark" | "light"; // variant determines visual theme for button styling (dark or light)
  onFileChange: (filePath: string) => void; // onFileChange is a callback to pass uploaded file path back to parent component
  value?: string; // value holds pre-existing file path if already uploaded (optional)
}

const { // destructure imagekit public key and endpoint from config for provider setup
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => { // define async function to authenticate imagekit uploads securely via server
  try { 
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`); // make a request to backend route that returns auth parameters

    if (!response.ok) { // check if response failed to ensure proper error handling
      const errorText = await response.text(); // extract text from error response for debugging
      throw new Error( // throw custom error message with HTTP status and details for clarity
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json(); // parse successful response into JSON to access keys
    const { signature, expire, token } = data; // destructure required credentials for imagekit upload
    return { token, expire, signature }; // return credentials to be used by imagekit authenticator
  } catch (error: any) { 
    throw new Error(`Authentication request failed: ${error.message}`); // rethrow detailed error message for debugging
  }
};

// define a functional component named 'FileUpload' to handle secure uploads of images or videos to ImageKit with validation
const FileUpload = ({ 
  type, // type determines whether the upload is for an image or a video
  accept, // accept specifies allowed MIME types for the file input
  placeholder, // placeholder shows label text inside the upload button before file selection
  folder, // folder specifies upload destination path within ImageKit
  variant, // variant determines visual theme for button styling (dark or light)
  onFileChange, // onFileChange is a callback to pass uploaded file path back to parent component
  value, // value holds pre-existing file path if already uploaded
}: Props) => {
  const ikUploadRef = useRef(null); // create ref to access hidden IKUpload element programmatically
  const [file, setFile] = useState<{ filePath: string | null }>({ // define state to store current uploaded file path
    filePath: value ?? null, // initialize with existing value or null if not provided
  });
  const [progress, setProgress] = useState(0); // define state to track upload progress percentage

  const styles = { // create dynamic styles object to apply theme-specific class names
    button:
      variant === "dark" // check theme variant for button styling
        ? "bg-dark-300" // use dark background when variant is dark
        : "bg-light-600 border-gray-100 border", // use light background and border for light mode
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500", // set placeholder text color based on theme
    text: variant === "dark" ? "text-light-100" : "text-dark-400", // set file name text color according to variant
  };

  const onError = (error: any) => { // define callback to handle upload failure scenarios
    console.log(error); // log error for debugging
    toast({ // display toast notification to inform user about failure
      title: `${type} upload failed`, // indicate which type failed
      description: `Your ${type} could not be uploaded. Please try again.`, // explain error cause to user
      variant: "destructive", // use destructive variant to visually represent error
    });
  };

  const onSuccess = (res: any) => { // define callback triggered on successful upload
    setFile(res); // update local file state with response data containing filePath
    onFileChange(res.filePath); // call parent callback with uploaded file path to propagate state
    toast({ // show success notification for user feedback
      title: `${type} uploaded successfully`, // dynamically display upload type
      description: `${res.filePath} uploaded successfully!`, // show full path to confirm completion
    });
  };

  const onValidate = (file: File) => { // define validation function to ensure file size constraints before upload
    if (type === "image") { // check if file type is image
      if (file.size > 20 * 1024 * 1024) { // enforce 20MB size limit for images
        toast({ // show toast message if file exceeds allowed limit
          title: "File size too large", // title for size warning
          description: "Please upload a file that is less than 20MB in size", // provide guidance to user
          variant: "destructive", // visually emphasize error
        });
        return false; // stop upload by returning false
      }
    } else if (type === "video") { // validate video uploads separately
      if (file.size > 50 * 1024 * 1024) { // set 50MB limit for video uploads
        toast({ // show size warning for videos
          title: "File size too large", 
          description: "Please upload a file that is less than 50MB in size", 
          variant: "destructive", 
        });
        return false; // block upload
      }
    }
    return true; // allow upload if file passes validation checks
  };

  return (
    <ImageKitProvider
      publicKey={publicKey} // provide public key for ImageKit authentication
      urlEndpoint={urlEndpoint} // set upload base endpoint for asset hosting
      authenticator={authenticator} // assign authentication function to get secure credentials
    >
      <IKUpload
        ref={ikUploadRef} // attach ref for manual triggering of file picker
        onError={onError} // assign callback for error handling
        onSuccess={onSuccess} // assign callback for success handling
        useUniqueFileName={true} // ensure uploaded files have unique names to prevent overwriting
        validateFile={onValidate} // connect custom validation function to check file size before upload
        onUploadStart={() => setProgress(0)} // reset progress bar to zero when upload begins
        onUploadProgress={({ loaded, total }) => { // track real-time upload progress
          const percent = Math.round((loaded / total) * 100); // calculate progress percentage
          setProgress(percent); // update state to reflect progress in UI
        }}
        folder={folder} // specify destination folder on ImageKit
        accept={accept} // define accepted file types for input
        className="hidden" // hide upload element from direct user interaction
      />

      <button
        className={cn("upload-btn", styles.button)} // dynamically combine base and theme styles for upload button
        onClick={(e) => { // handle button click to trigger hidden upload input
          e.preventDefault(); // prevent default form submission behavior
          if (ikUploadRef.current) { 
            // @ts-ignore
            ikUploadRef.current?.click(); // programmatically trigger file picker click for user upload
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p> {/* display placeholder text dynamically based on prop */}
        file && ( {/* conditionally render file name only if a file exists */}
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p> {/* show current uploaded file path for user confirmation */}
        )
      </button>

      {progress > 0 && progress !== 100 && ( // show progress bar only during active upload
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file && // render uploaded media preview only if file is available
        (type === "image" ? ( // check if uploaded file is an image
          <IKImage
            alt={file.filePath ?? "uploaded-image"} // set alt text dynamically for accessibility
            path={file.filePath ?? undefined} // set image path for rendering
            width={500} // define display width for image
            height={300} // define display height for image
          />
        ) : type === "video" ? ( // render video component if uploaded file is a video
          <IKVideo
            path={file.filePath ?? undefined} // assign video source path
            controls={true} // enable playback controls for user interaction
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload; // export component for use in other parts of the app such as forms or dashboards

"use client"; // mark this file as a client-side component in Next.js to enable browser-side interactivity

import Image from "next/image"; // import Next.js optimized Image component for efficient image rendering and optimization
import React, { useCallback } from "react"; // import React to enable JSX and component creation, and import useCallback hook to memoize functions for performance optimization and prevent unnecessary re-renders
import { useDropzone } from "react-dropzone"; // import useDropzone hook to handle drag-and-drop file uploads easily

import { convertFileToUrl } from "@/lib/utils"; // import custom utility function to convert a file object into a temporary URL for preview

type FileUploaderProps = { // define a TypeScript type for props passed into the FileUploader component
  files: File[] | undefined; // define a prop to hold the array of uploaded files or undefined if none are uploaded
  onChange: (files: File[]) => void; // define a callback prop that updates parent component state when files change
};

export const FileUploader = ( // define a functional component named 'FileUploader' to handle and display file uploads
  { 
    files, // destructure files prop to access currently uploaded files for preview and state management
    onChange // destructure onChange prop to handle updates when user uploads or removes files
  }: FileUploaderProps // enforce prop types using FileUploaderProps type definition for safety
) => {
  const onDrop = useCallback( // define a memoized callback to handle dropped files efficiently without re-creating function unnecessarily
    (acceptedFiles: File[]) => { // define an inline function that receives array of accepted files after drag-and-drop or manual upload
      onChange(acceptedFiles); // call onChange callback to update uploaded file state in parent component with new files
    }, [] // provide empty dependency array to ensure this callback is created only once since it doesn't depend on external variables
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop }); // initialize useDropzone hook with onDrop handler to manage file drag-and-drop logic and input properties

  return ( // return JSX to render upload area with file preview or placeholder instructions
    <div {...getRootProps()} className="file-upload"> {/* spread dropzone root props to enable drag-and-drop behavior and file input event handling on this div container */}
      <input {...getInputProps()} /> {/* spread dropzone input props to link native file input functionality with dropzone logic for file selection and validation */}
      {files && files?.length > 0 ? ( // check if files exist and at least one file is uploaded to determine whether to display preview image
        <Image
          src={convertFileToUrl(files[0])} // dynamically generate a temporary URL for first uploaded file to display preview image
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

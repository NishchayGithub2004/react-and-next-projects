import { useCallback } from 'react' // import useCallback to memoize the drop handler so it doesn't recreate unnecessarily
import { useDropzone } from 'react-dropzone' // import useDropzone to handle drag-and-drop logic for file uploads
import { formatSize } from '../lib/utils' // import helper to format bytes into human-readable text for UI display

interface FileUploaderProps { // define a props interface to enforce type-safe inputs for the file uploader component
    onFileSelect?: (file: File | null) => void; // define optional callback so parent can receive the selected or cleared file
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => { // define FileUploader component to allow user to choose a PDF and notify parent when selection changes
    const onDrop = useCallback((acceptedFiles: File[]) => { // create stable drop handler so dropzone uses same reference for performance
        const file = acceptedFiles[0] || null; // retrieve first file or null to ensure only a single file is processed
        onFileSelect?.(file); // notify parent of selected file so state can be stored externally
    }, [onFileSelect]); // re-create callback only when onFileSelect changes to avoid unnecessary re-renders

    const maxFileSize = 20 * 1024 * 1024; // define maximum file size in bytes to restrict uploads to 20MB

    const {
        getRootProps, // obtain function that binds required props onto the root dropzone container so it handles drag/drop
        getInputProps, // obtain props for hidden input element so it integrates with dropzone logic transparently
        isDragActive, // track whether user is currently dragging over dropzone for possible UI changes
        acceptedFiles // hold the list of successfully selected files to allow display of chosen file info
    } = useDropzone({ // initialize dropzone logic to handle drag-and-drop file selection using configured settings
        onDrop, // connect drop handler so dropzone can process uploaded files
        multiple: false, // enforce single-file uploads to keep component predictable
        accept: { 'application/pdf': ['.pdf'] }, // restrict accepted file types to PDFs to ensure correct format
        maxSize: maxFileSize, // apply maximum size limit so oversized files are rejected automatically
    })

    const file = acceptedFiles[0] || null; // select first accepted file or null so UI can display selected file state

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}> {/* attach dropzone root props so container becomes interactive drag/drop zone */}
                <input {...getInputProps()} /> {/* attach dropzone input props so hidden input integrates with drop logic */}

                <div className="space-y-4 cursor-pointer">
                    {file ? ( // conditionally render file-preview UI if a file has been selected
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}> {/* stop propagation so clicking inside does not re-trigger uploader */}
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name} {/* show file name so user sees what they uploaded */}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)} {/* format file size for readability so user understands file size */}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => { // allow user to remove file without reopening dialog
                                onFileSelect?.(null) // clear file selection so parent can reset its state
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div> {/* show upload instructions when no file is selected */}
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload {/* communicate click-based upload interaction */}
                                </span> or drag and drop {/* communicate drag-and-drop upload interaction */}
                            </p>
                            <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)}) {/* show max size so user knows file limit */}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader // export component so it can be used in other screens requiring file uploads
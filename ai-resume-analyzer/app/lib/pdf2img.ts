export interface PdfConversionResult { // define an interface 'PdfConversionResult' to specify the structure of the PDF conversion outcome
    imageUrl: string; // declare a string holding the generated image's object URL returned after conversion
    file: File | null; // declare a property storing the generated File object or null when no image could be produced
    error?: string; // declare an optional string used to report an error message when conversion fails
}

let pdfjsLib: any = null; // initialize a variable to hold the loaded pdf.js library instance so it can be reused
let isLoading = false; // track whether the library is currently loading to avoid redundant imports
let loadPromise: Promise<any> | null = null; // store the ongoing import promise to prevent duplicate loading operations

async function loadPdfJs(): Promise<any> { // define an async function returning a promise that loads and returns the pdf.js library
    if (pdfjsLib) return pdfjsLib; // return the already loaded library to skip redundant initialization
    
    if (loadPromise) return loadPromise; // return the existing loading promise if a load is in progress to ensure reuse

    isLoading = true; // set loading flag to true indicating that a library import is starting

    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => { // dynamically import pdf.js library to load it on demand
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"; // assign a custom worker script path so pdf.js can spawn its worker correctly
        pdfjsLib = lib; // store the loaded library for future calls avoiding repeated imports
        isLoading = false; // mark loading as finished once the import resolves
        return lib; // return the loaded library from the promise chain for consumers awaiting it
    });

    return loadPromise; // return the promise so callers can await library availability
}

export async function convertPdfToImage( // export an async function 'convertPdfToImage' to convert a PDF's first page into an image
    file: File // receive the PDF file object representing the user's uploaded PDF
): Promise<PdfConversionResult> { // specify that this function returns a promise resolving to a PdfConversionResult
    try { // begin a try block to catch and handle conversion errors cleanly
        const lib = await loadPdfJs(); // await the loading of pdf.js to ensure the library is ready before use

        const arrayBuffer = await file.arrayBuffer(); // read the PDF file into memory as an ArrayBuffer so pdf.js can parse it
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise; // load the PDF document using pdf.js and wait for its internal promise
        const page = await pdf.getPage(1); // fetch the first page of the PDF document which will be rendered to an image

        const viewport = page.getViewport({ scale: 4 }); // create a viewport with a high scale factor to render a high-resolution image
        const canvas = document.createElement("canvas"); // create a canvas element to draw the rendered PDF page
        const context = canvas.getContext("2d"); // obtain a 2D rendering context for drawing the page image

        canvas.width = viewport.width; // set canvas width to match the viewport width ensuring accurate rendering size
        canvas.height = viewport.height; // set canvas height to match the viewport height ensuring aspect ratio correctness

        if (context) { // check if a valid 2D context was obtained before applying settings
            context.imageSmoothingEnabled = true; // enable smoothing so the rendered image looks less pixelated
            context.imageSmoothingQuality = "high"; // set the smoothing quality to high to improve final render clarity
        }

        await page.render({ canvasContext: context!, viewport }).promise; // instruct pdf.js to render the page into the canvas and await its completion

        return new Promise((resolve) => { // return a new promise wrapping the asynchronous canvas-to-blob conversion
            canvas.toBlob( // convert the canvas content into a PNG blob so it can be saved or displayed
                (blob) => { // receive the generated blob or null depending on browser support and success
                    if (blob) { // check if a valid image blob was produced
                        const originalName = file.name.replace(/\.pdf$/i, ""); // extract the base file name without the .pdf extension for naming the PNG
                        
                        const imageFile = new File([blob], `${originalName}.png`, { // create a new File object from the blob for download or upload
                            type: "image/png", // set the MIME type to PNG so consumers recognize it correctly
                        });

                        resolve({ // resolve the promise with a successful conversion result
                            imageUrl: URL.createObjectURL(blob), // generate a temporary object URL pointing to the blob for previewing
                            file: imageFile, // return the created PNG File object for further use
                        });
                    } else { // handle the case where blob creation fails
                        resolve({ // resolve with an error result rather than throwing to keep output consistent
                            imageUrl: "", // return an empty string since no preview URL can be produced
                            file: null, // provide null for the file to indicate failure
                            error: "Failed to create image blob", // include an error message to inform the caller of the issue
                        });
                    }
                },
                "image/png", // specify the output format for the blob conversion to ensure PNG output
                1.0 // set quality parameter though mostly unused for PNG but included for completeness
            );
        });
    } catch (err) { // catch any error thrown during loading or rendering of the PDF
        return { // return a structured error result to match the defined interface
            imageUrl: "", // leave imageUrl empty since no image is produced
            file: null, // set file to null indicating no file output
            error: `Failed to convert PDF: ${err}`, // include the error message to aid debugging
        };
    }
}

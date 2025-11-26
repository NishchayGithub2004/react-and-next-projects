import { type FormEvent, useState } from 'react' // import react utilities to access FormEvent type and create stateful values needed for form logic
import Navbar from "~/components/Navbar"; // import navbar component so it can be rendered in the layout
import FileUploader from "~/components/FileUploader"; // import file uploader component to let user select files
import { usePuterStore } from "~/lib/puter"; // import store hook to access backend services like fs, ai, kv
import { useNavigate } from "react-router"; // import navigation hook to programmatically change routes
import { convertPdfToImage } from "~/lib/pdf2img"; // import helper to convert uploaded PDF to an image for analysis
import { generateUUID } from "~/lib/utils"; // import uuid generator to uniquely identify resume uploads
import { prepareInstructions } from "../../constants"; // import instruction generator used for AI feedback

const Upload = () => { // define a functional component named 'Upload' to handle resume uploading and analysis logic
    const { auth, isLoading, fs, ai, kv } = usePuterStore(); // destructure backend services from store so they can be used for upload, AI calls, and storage

    const navigate = useNavigate(); // create navigate function to redirect user after analysis

    const [isProcessing, setIsProcessing] = useState(false); // create state flag to track whether processing is ongoing for conditional UI rendering

    const [statusText, setStatusText] = useState(''); // create state to hold step-by-step progress messages for user feedback

    const [file, setFile] = useState<File | null>(null); // create state to store the selected resume file so it can be processed later

    const handleFileSelect = (file: File | null) => { // define function to handle file selection from uploader
        setFile(file) // update state with chosen file so later steps know what to analyze
    }

    const handleAnalyze = async ({ // define a functional handler named 'handleAnalyze' to process resume and request AI feedback which takes following props
        companyName, // receive provided company name to include in AI instruction context
        jobTitle, // receive job title to include in AI instruction context
        jobDescription, // receive job description for detailed feedback request
        file // receive resume file to upload and analyze
    }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true); // enable processing mode to update UI and block further input

        setStatusText('Uploading the file...'); // update status so user sees current step
        const uploadedFile = await fs.upload([file]); // upload pdf file to backend storage so AI can access it
        if (!uploadedFile) return setStatusText('Error: Failed to upload file'); // update status on failure because further steps require a successful upload

        setStatusText('Converting to image...'); // update status before transformation begins
        const imageFile = await convertPdfToImage(file); // convert pdf to image so AI can visually analyze resume
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image'); // show error if conversion failed because AI needs the image

        setStatusText('Uploading the image...'); // show next step in workflow
        const uploadedImage = await fs.upload([imageFile.file]); // upload converted image so AI can reference it
        if (!uploadedImage) return setStatusText('Error: Failed to upload image'); // stop further steps because missing image breaks instructions

        setStatusText('Preparing data...'); // indicate data bundling step
        const uuid = generateUUID(); // generate unique id to store and fetch resume analysis record later
        const data = { // prepare resume metadata to store progress and feedback for user viewing
            id: uuid, // store id to become the resume path parameter
            resumePath: uploadedFile.path, // store backend path of uploaded resume for AI reference
            imagePath: uploadedImage.path, // store path of uploaded resume image for AI
            companyName, jobTitle, jobDescription, // store job-related user input because AI uses it for contextual feedback
            feedback: '', // initialize feedback section to fill after AI generates it
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data)); // persist initial data in key-value store for retrieval

        setStatusText('Analyzing...'); // update UI to show AI analysis is running

        const feedback = await ai.feedback( // request AI to analyze resume and generate structured feedback
            uploadedFile.path, // give AI the resume path so it can read content
            prepareInstructions({ jobTitle, jobDescription }) // supply generated AI instructions tailored to job information
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume'); // show error if AI didn't return any feedback

        const feedbackText = typeof feedback.message.content === 'string' // determine if feedback is string or array so it can be parsed safely
            ? feedback.message.content // if string, use directly so parsing works
            : feedback.message.content[0].text; // otherwise extract first content block because that's where feedback resides

        data.feedback = JSON.parse(feedbackText); // parse JSON feedback to structured format to store for display page

        await kv.set(`resume:${uuid}`, JSON.stringify(data)); // store updated data so resume page can render the feedback

        setStatusText('Analysis complete, redirecting...'); // show final message before redirect

        console.log(data); // output data to console for debugging to inspect stored structure

        navigate(`/resume/${uuid}`); // navigate to detailed resume analysis page for viewing results
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => { // define form submit handler to extract user input and invoke analysis
        e.preventDefault(); // stop default form submission behavior because processing is handled manually
        
        const form = e.currentTarget.closest('form'); // get reference to actual form element to extract values
        if (!form) return; // exit if form not found because processing cannot continue
        const formData = new FormData(form); // build FormData object to retrieve input values efficiently

        const companyName = formData.get('company-name') as string; // read company name from form to pass into analysis
        const jobTitle = formData.get('job-title') as string; // read job title for context
        const jobDescription = formData.get('job-description') as string; // read job description for AI instruction generation

        if (!file) return; // block submission if no file selected because analysis needs a resume file

        handleAnalyze({ companyName, jobTitle, jobDescription, file }); // call analysis pipeline with collected form values
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
    
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
    
                    {isProcessing ? ( // choose processing UI when resume analysis is running
                        <>
                            <h2>{statusText}</h2> {/* render dynamic status text to show current analysis step */}
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
    
                    {!isProcessing && ( // show form only when not processing to prevent duplicate submissions
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8"> {/* attach submit handler to trigger analysis */}
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} /> {/* capture resume file and store it for analysis */}
                            </div>
                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )    
}

export default Upload // export component so routing system can use it

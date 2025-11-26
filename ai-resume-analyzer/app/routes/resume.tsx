import { Link, useNavigate, useParams } from "react-router"; // import routing utilities to read route parameters and perform navigations
import { useEffect, useState } from "react"; // import hooks for state management and side effects within the component
import { usePuterStore } from "~/lib/puter"; // import custom store hook to access auth, filesystem, and key-value storage
import Summary from "~/components/Summary"; // import Summary component for displaying resume summary (static JSX, no comment needed)
import ATS from "~/components/ATS"; // import ATS component for applicant tracking system scoring (static JSX, no comment needed)
import Details from "~/components/Details"; // import Details component for detailed resume metrics (static JSX, no comment needed)


export const meta = () => ([ // define meta information for this route for SEO and browser metadata
    { title: 'Resumind | Review ' }, // set page title for the review page
    { name: 'description', content: 'Detailed overview of your resume' }, // set description for search engine previews
]);


const Resume = () => { // define Resume page component responsible for loading and showing resume data
    const { auth, isLoading, fs, kv } = usePuterStore(); // extract auth state, loading flag, filesystem API, and key-value DB API from global store


    const { id } = useParams(); // get dynamic resume ID from route parameters for data fetching


    const [imageUrl, setImageUrl] = useState(''); // store object URL for rendered resume image to display in the UI


    const [resumeUrl, setResumeUrl] = useState(''); // store object URL for PDF resume blob for embedding or downloading


    const [feedback, setFeedback] = useState<Feedback | null>(null); // maintain AI-generated feedback related to the resume for the UI


    const navigate = useNavigate(); // get navigation function to redirect unauthenticated users


    useEffect(() => { // run authentication guard whenever loading completes
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`); // redirect user to login page if not authenticated
    }, [isLoading]); // effect depends on loading state only


    useEffect(() => { // load resume data from storage whenever resume ID changes
        const loadResume = async () => { // define async function to fetch, parse, and prepare resume data
            const resume = await kv.get(`resume:${id}`); // retrieve stored resume record from key-value store using prefixed key


            if (!resume) return; // exit early if no resume data is found for this ID


            const data = JSON.parse(resume); // parse stored JSON string into a structured data object


            const resumeBlob = await fs.read(data.resumePath); // read PDF resume binary from filesystem using stored path
            if (!resumeBlob) return; // ensure resume file exists before proceeding


            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' }); // create proper PDF blob for browser handling
            const resumeUrl = URL.createObjectURL(pdfBlob); // generate unique object URL for embedding the PDF
            setResumeUrl(resumeUrl); // update local state with generated PDF URL


            const imageBlob = await fs.read(data.imagePath); // read resume preview image from filesystem
            if (!imageBlob) return; // stop if image file is missing
            const imageUrl = URL.createObjectURL(imageBlob); // create object URL for the image blob
            setImageUrl(imageUrl); // update state so UI components can render the resume preview


            setFeedback(data.feedback); // set AI feedback retrieved from stored data
            console.log({ resumeUrl, imageUrl, feedback: data.feedback }); // log fetched resume details for debugging
        };


        loadResume(); // invoke resume loader function immediately when effect runs
    }, [id]); // re-run whenever resume ID in route changes

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume
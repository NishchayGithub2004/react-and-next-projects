import { Link } from "react-router"; // import Link to enable client-side navigation to the resume details page
import ScoreCircle from "~/components/ScoreCircle"; // import ScoreCircle component to visually display the overall score
import { useEffect, useState } from "react"; // import hooks to manage component state and perform side effects
import { usePuterStore } from "~/lib/puter"; // import custom store hook to access puter filesystem utilities

const ResumeCard = ( // define ResumeCard to show a preview of a stored resume including metadata and score
    { resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume } // destructure resume props so each value is directly accessible for rendering
) => {
    const { fs } = usePuterStore(); // extract filesystem API from store so component can load resume image blobs

    const [resumeUrl, setResumeUrl] = useState(''); // store the generated object URL so the resume image can be previewed in the UI

    useEffect(() => {
        const loadResume = async () => { // define async loader to read the resume file from the fs so it can be rendered
            const blob = await fs.read(imagePath); // read the file blob from storage using the provided path so content can be displayed
            
            if (!blob) return; // exit when blob doesn't exist to avoid creating invalid URLs
            
            let url = URL.createObjectURL(blob); // create a temporary URL from the blob so it can be used as an image source
            
            setResumeUrl(url); // store generated URL so component can show the resume preview image
        }

        loadResume(); // trigger the async file load so the component displays resume image when available
    }, [imagePath]); // rerun effect when imagePath changes to refresh preview when underlying file updates

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} /> {/* pass overall score dynamically so ScoreCircle can compute display color and arc */}
                </div>
            </div>
            {resumeUrl && ( // conditionally render preview only when URL is loaded so UI doesn't show broken image
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl} // use generated object URL so browser can display the local file blob
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    </div>
                </div>
            )}
        </Link>
    )
}

export default ResumeCard // export ResumeCard so it can be used in listings and dashboard views

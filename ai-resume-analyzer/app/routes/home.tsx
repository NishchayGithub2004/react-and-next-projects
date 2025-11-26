import type { Route } from "./+types/home"; // import generated Remix route types to enforce correct typing for loader/meta args
import Navbar from "~/components/Navbar"; // import Navbar component for displaying site-wide navigation
import ResumeCard from "~/components/ResumeCard"; // import card component used to render individual resume entries
import { usePuterStore } from "~/lib/puter"; // import custom store hook to access authentication and key-value storage logic
import { Link, useNavigate } from "react-router"; // import router utilities to navigate and create internal links
import { useEffect, useState } from "react"; // import hooks to manage component state and lifecycle side-effects

export function meta({ }: Route.MetaArgs) { // export meta function to provide SEO metadata for the Home route
  return [ // return array of meta tag descriptors used by Remix
    { title: "Resumind" }, // set page title shown in browser tab
    { name: "description", content: "Smart feedback for your dream job!" }, // set SEO description for search engines
  ];
}

export default function Home() { // define Home component that manages dashboard data and redirects
  const { auth, kv } = usePuterStore(); // extract authentication object and key-value storage instance from global store

  const navigate = useNavigate(); // create navigation function to perform programmatic route transitions

  const [resumes, setResumes] = useState<Resume[]>([]); // maintain list of resumes fetched from storage for display

  const [loadingResumes, setLoadingResumes] = useState(false); // track whether resumes are currently being loaded to control UI states

  useEffect(() => { // run effect to protect the route by checking authentication state
    if (!auth.isAuthenticated) navigate('/auth?next=/'); // redirect unauthenticated users to login page with return path parameter
  }, [auth.isAuthenticated]); // rerun when authentication status changes

  useEffect(() => { // run effect once on mount to load resumes from key-value store
    const loadResumes = async () => { // define async loader function to fetch and parse stored resumes
      setLoadingResumes(true); // set loading state so UI can show a spinner or placeholder

      const resumes = (await kv.list('resume:*', true)) as KVItem[]; // query all keys matching resume prefix to retrieve stored resume items

      const parsedResumes = resumes?.map((resume) => ( // transform raw KV items into typed Resume objects by parsing JSON payload
        JSON.parse(resume.value) as Resume // parse resume JSON text into structured Resume object
      ));

      setResumes(parsedResumes || []); // update local resume list to render in UI, using empty array fallback

      setLoadingResumes(false); // mark loading as complete to update UI state
    };

    loadResumes(); // invoke loader function immediately on mount
  }, []); // run only once on component mount

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? ( // conditionally display empty-state heading when no resumes exist
          <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ) : ( // display alternate heading when some resumes exist
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && ( // render loading animation while resume data is being fetched
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" />
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && ( // render resume list section only when resumes exist
        <div className="resumes-section">
          {resumes.map((resume) => ( // iterate over resume list to render each card
            <ResumeCard key={resume.id} resume={resume} /> // pass resume object to ResumeCard to display details
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && ( // render prompt to upload resume when none exist
        <div className="flex flex-col items-center justify-center -mt-1 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Resume
          </Link>
        </div>
      )}

      <div className="flex flex-col items-center justify-center -mt-1 gap-4">
        <Link to="/wipe" className="primary-button w-fit text-xl font-semibold">
          Remove All Resumes
        </Link>
      </div>
    </section>
  </main>;
}

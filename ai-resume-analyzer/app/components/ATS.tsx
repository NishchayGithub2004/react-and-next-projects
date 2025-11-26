import React from 'react'; // import React so JSX syntax can be used in this component

interface Suggestion { // define shape of a suggestion entry
  type: "good" | "improve"; // indicate whether a suggestion is positive or needs improvement
  tip: string; // store text describing the recommendation
}

interface ATSProps { // define props expected by ATS component
  score: number; // numerical ATS score to determine visuals and messages
  suggestions: Suggestion[]; // list of suggestion objects rendered in the UI
}

const ATS: React.FC<ATSProps> = ({ // define ATS component to display score, messages, and suggestions
  score, // receive ATS score value
  suggestions, // receive list of suggestion objects
}) => {
  const gradientClass = score > 69 // calculate background color gradient class based on score tiers
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  const iconSrc = score > 69 // determine the icon path to display based on score
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  const subtitle = score > 69 // compute message header derived from score category
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      <div className="flex items-center gap-4 mb-6"> {/* static flex layout */}
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" /> {/* dynamic icon */}
        <div>
          <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2> {/* dynamic interpolation for score */}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3> {/* dynamic subtitle selection */}
        <p className="text-gray-600 mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => ( // iterate through suggestions array to render each entry
            <div key={index} className="flex items-start gap-3"> {/* use index as key since suggestions are simple */}
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} // use conditional icon depending on suggestion type
                alt={suggestion.type === "good" ? "Check" : "Warning"} // set alt text consistently with type
                className="w-5 h-5 mt-1"
              />
              <p className={suggestion.type === "good" ? "text-green-700" : "text-amber-700"}> {/* color determined dynamically by suggestion type */}
                {suggestion.tip} {/* show tip text */}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  );
};

export default ATS; // export ATS component for external usage
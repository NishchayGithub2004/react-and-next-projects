interface ScoreBadgeProps { // define the props contract so the component receives a strictly typed score value
  score: number; // define numeric score prop so badge can compute style and text based on performance category
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => { // create functional component to render a styled badge reflecting score level
  let badgeColor = ''; // store dynamic css classes so badge visually changes according to score thresholds
  
  let badgeText = ''; // store descriptive text so the user understands the meaning behind the score range

  if (score > 70) { // check if score qualifies for highest category to assign strong-status visuals
    badgeColor = 'bg-badge-green text-green-600'; // apply green color scheme to signal strong performance
    badgeText = 'Strong'; // assign label that shows high-quality score
  } else if (score > 49) { // handle mid-range score to categorize as moderate performance
    badgeColor = 'bg-badge-yellow text-yellow-600'; // apply yellow styling to indicate an average or developing state
    badgeText = 'Good Start'; // set text that reflects moderate progress
  } else { // default to lowest score range to indicate need for improvement
    badgeColor = 'bg-badge-red text-red-600'; // apply red styling to represent weak performance
    badgeText = 'Needs Work'; // assign label that signals the score requires improvement
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}> {/* inject dynamic style classes so badge matches score category */}
      <p className="text-sm font-medium">{badgeText}</p> {/* display computed label so user sees the score interpretation */}
    </div>
  );
};

export default ScoreBadge // export component so it can be reused in score displays across the app

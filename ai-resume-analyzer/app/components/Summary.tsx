import ScoreGauge from "~/components/ScoreGauge"; // import score gauge component to show circular visual representation of the overall score
import ScoreBadge from "~/components/ScoreBadge"; // import badge component to show score category label beside each category title

const Category = ( // define the Category component to display a resume section with its score and badge
    {
        title, // receive title so the component knows which resume category it represents
        score, // receive numeric score so the component can compute color and display category performance
    }: {
        title: string;
        score: number;
    }
) => {
    const textColor = score > 70 ? 'text-green-600' // compute text color for scores above 70 to visually show strong category performance
            : score > 49
        ? 'text-yellow-600' // apply yellow for mid-range scores to show moderate performance
        : 'text-red-600'; // default to red for low scores to signal weak performance

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} /> {/* pass score so badge can compute category label and color dynamically */}
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/100 {/* apply computed textColor so score visually reflects its category */}
                </p>
            </div>
        </div>
    )
}

const Summary = ( // define the Summary component to show overall resume performance and all category breakdowns
    {
        feedback, // receive full feedback object so the component can extract scores for each category
    }: {
        feedback: Feedback;
    }
) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} /> {/* send overallScore so gauge can compute progress arc */}

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} /> {/* load tone/style score so section displays corresponding data */}
            <Category title="Content" score={feedback.content.score} /> {/* load content score for category breakdown */}
            <Category title="Structure" score={feedback.structure.score} /> {/* load structural score so user can evaluate document organization */}
            <Category title="Skills" score={feedback.skills.score} /> {/* load skills score to show competency-based evaluation */}
        </div>
    )
}

export default Summary // export Summary so it can be used in resume review pages

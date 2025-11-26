interface Resume { // define structure for a stored resume record used throughout the app
    id: string; // unique identifier linking this resume to its KV entry
    companyName?: string; // optional company name included for AI context
    jobTitle?: string; // optional job title included for AI context
    imagePath: string; // backend path to the generated image version of the resume
    resumePath: string; // backend path to the uploaded PDF resume
    feedback: Feedback; // structured AI-generated feedback associated with this resume
}

interface Feedback { // define structure of all AI feedback categories returned after analysis
    overallScore: number; // combined AI rating computed from all category scores

    // ATS, toneAndStyle, content, structure, and skills share the same pattern:
    // each section has a numeric score and an array of tips with a type and explanation (when applicable)

    ATS: { // feedback about applicant-tracking-system compatibility
        score: number; // category score assessing ATS friendliness
        tips: { // list of targeted tips to improve or validate ATS compliance
            type: "good" | "improve"; // indicates whether this tip praises or suggests improvement
            tip: string; // text describing the tip itself
        }[];
    };

    toneAndStyle: { // feedback about writing tone, clarity, and professionalism
        score: number; // category score reflecting tone and style quality
        tips: { // detailed suggestions or positive notes related to tone
            type: "good" | "improve"; // identifies whether the tip is positive or corrective
            tip: string; // the suggestion or praise
            explanation: string; // explains why this tip matters for tone/style
        }[];
    };

    content: { // feedback about resume content strength and completeness
        score: number; // score representing content quality and relevance
        tips: { // actionable guidance specific to content
            type: "good" | "improve"; // marks this tip as strength or improvement area
            tip: string; // describes what is good or what needs work
            explanation: string; // clarifies the reasoning behind the tip
        }[];
    };

    structure: { // feedback regarding layout, formatting, and overall organization
        score: number; // score evaluating the resume's structural clarity
        tips: { // guidance for format improvements or confirmations
            type: "good" | "improve"; // labels the type of feedback
            tip: string; // short description of the structural advice
            explanation: string; // reason why this structure issue or strength matters
        }[];
    };

    skills: { // feedback about the skills section and skill relevance
        score: number; // numeric rating evaluating the quality of listed skills
        tips: { // suggestions aimed at improving skill representation
            type: "good" | "improve"; // identifies whether it's praise or critique
            tip: string; // the actionable tip text
            explanation: string; // explanation providing context for the tip
        }[];
    };
}

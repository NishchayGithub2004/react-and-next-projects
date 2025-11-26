import { cn } from "~/lib/utils"; // import the utility function 'cn' which conditionally joins class names so dynamic styling can be applied
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion"; // import accordion components to render collapsible UI sections

const ScoreBadge = ( // define functional component 'ScoreBadge' to display colored badge and icon representing score quality
  { 
    score, // receive score value to decide badge color and icon based on numeric ranges for visual feedback
  }: { 
    score: number;
  }
) => {
  return (
      <div
          className={cn( // evaluate proper background color based on score thresholds to visually classify score quality
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"} // dynamically choose icon to reflect whether score is good or not
            alt="score"
            className="size-4"
        />
        <p
            className={cn( // dynamically apply text color to match badge color category for consistent visual grouping
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score} / 100 {/* insert numeric score so user can see exact value */}
        </p>
      </div>
  );
};

const CategoryHeader = ( // define component 'CategoryHeader' to show section title along with its score badge
  {
    title, // read the title for the category to identify which section is being shown
    categoryScore, // read the category score to pass to ScoreBadge for visual representation
  }: {
    title: string;
    categoryScore: number;
  }
) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p> {/* place category title so user knows which aspect the score belongs to */}
        <ScoreBadge score={categoryScore} /> {/* render badge to visualize quality of this specific category */}
      </div>
  );
};

const CategoryContent = ( // define component 'CategoryContent' to display categorized tips and explanations for user feedback
  {
    tips, // receive list of tips to show what is good or what needs improvement
  }: {
    tips: { type: "good" | "improve"; tip: string; explanation: string }[]; // constrain each tip to contain its type, title, and explanation
  }
) => {
  return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
          {tips.map((tip, index) => ( // iterate over tips so each brief tip can be displayed in a two-column summary layout
              <div className="flex flex-row gap-2 items-center" key={index}>
                <img
                    src={
                      tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg" // choose icon to mark tip as good or needing improvement
                    }
                    alt="score"
                    className="size-5"
                />
                <p className="text-xl text-gray-500 ">{tip.tip}</p> {/* display short description so user sees high-level feedback */}
              </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => ( // iterate again to show full explanation for each tip so user understands reasons and remedies
              <div
                  key={index + tip.tip}
                  className={cn( // apply different contextual backgrounds based on tip type to visually distinguish good vs needs improvement
                      "flex flex-col gap-2 rounded-2xl p-4",
                      tip.type === "good"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                  )}
              >
                <div className="flex flex-row gap-2 items-center">
                  <img
                      src={
                        tip.type === "good"
                            ? "/icons/check.svg"
                            : "/icons/warning.svg" // dynamically select icon matching tip category
                      }
                      alt="score"
                      className="size-5"
                  />
                  <p className="text-xl font-semibold">{tip.tip}</p> {/* show the main tip for clarity when reading long explanations */}
                </div>
                <p>{tip.explanation}</p> {/* show detailed guidance so user knows why the tip matters and how to improve */}
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ( // define main component 'Details' to display all feedback categories using accordion UI for collapsible organization
  {
    feedback, // receive full feedback object to supply data to each category section
  }: { 
    feedback: Feedback; // enforce correct type so structure of tone/style/content/structure/skills is maintained
  }
) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score} // pass the score to visually reflect category quality
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} /> {/* pass list of tips to explain strengths and areas for improvement */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score} // show numeric strength or weakness of content clarity/accuracy
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} /> {/* load content feedback so user sees actionable guidance */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score} // display numeric score to represent organization strength
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} /> {/* provide structural advice to help improve clarity and flow */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score} // show skill score to indicate overall execution quality
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} /> {/* show skill-related suggestions so user can improve technical writing ability */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details; // export details component so it can be used throughout the application

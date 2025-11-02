import Image from "next/image"; // import Next.js Image component to render optimized images, used here for the loading spinner
import { Button } from "./ui/button"; // import the reusable Button component for consistent styling and form submission behavior

interface ButtonProps { // define TypeScript interface to strongly type the properties accepted by SubmitButton
  isLoading: boolean; // flag determining whether to display the loading state or normal button content
  className?: string; // optional string to allow overriding or extending the default button styles
  children: React.ReactNode; // node representing button content, which can be text or other JSX
}

const SubmitButton = ( // define a functional component named 'SubmitButton' to handle form submissions with a built-in loading state
  { isLoading, className, children }: ButtonProps // destructure props to access isLoading, className, and children for logic and rendering control
) => {
  return ( // return the Button element that changes its display depending on loading state
    <Button
      type="submit"
      disabled={isLoading} // disable button during loading to prevent multiple submissions
      className={className ?? "shad-primary-btn w-full"} // use custom or default styling depending on whether className is provided
    >
      {isLoading ? ( // conditionally render spinner and text if the component is in loading state
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading... {/* display loading text next to the spinner to indicate ongoing action */}
        </div>
      ) : (
        children // render children normally when not in loading state
      )}
    </Button>
  );
};

export default SubmitButton; // export SubmitButton as default so it can be imported easily elsewhere

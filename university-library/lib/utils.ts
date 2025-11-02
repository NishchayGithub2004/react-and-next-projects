import { clsx, type ClassValue } from "clsx"; // import clsx utility to conditionally combine class names based on truthy values
import { twMerge } from "tailwind-merge"; // import twMerge to intelligently merge TailwindCSS class names and resolve conflicts

export function cn(...inputs: ClassValue[]) { // define utility function 'cn' to combine multiple class values into one clean string
  return twMerge(clsx(inputs)); // merge and deduplicate conditional class names to ensure consistent styling output
}

export const getInitials = (name: string): string => // define function to generate initials from a full name for user avatars or identifiers
  name // take the input name string
    .split(" ") // split name into parts by spaces to separate first, middle, and last names
    .map((part) => part[0]) // extract the first letter from each name part to form initials
    .join("") // join all initials into a single string without spaces
    .toUpperCase() // convert resulting initials to uppercase for uniform display
    .slice(0, 2); // limit initials to maximum of two characters for visual consistency

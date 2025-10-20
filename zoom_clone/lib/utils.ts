import { clsx, type ClassValue } from "clsx" // import the clsx utility and ClassValue type from the clsx library to conditionally merge class names
import { twMerge } from "tailwind-merge" // import twMerge function from tailwind-merge to combine Tailwind CSS classes while resolving conflicts

export function cn(...inputs: ClassValue[]) { // define a function named cn that takes a rest parameter inputs, which is an array of ClassValue items representing class names
  return twMerge( // call twMerge to merge Tailwind classes while handling duplicates or conflicting utilities
    clsx(inputs) // call clsx with the array of class name inputs to conditionally join them into a single string before passing to twMerge
  )
}

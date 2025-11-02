import { type ClassValue, clsx } from "clsx"; // import 'ClassValue' type and 'clsx' utility to conditionally combine class names
import { twMerge } from "tailwind-merge"; // import 'twMerge' to intelligently merge TailwindCSS class names without conflicts

export function cn(...inputs: ClassValue[]) { // define a function 'cn' to merge multiple class name values into a single string
  return twMerge(clsx(inputs)); // call 'clsx' to combine input classes, then 'twMerge' to resolve Tailwind conflicts
}

export function isBase64Image(imageData: string) { // define a function 'isBase64Image' to check if a given string is a valid Base64-encoded image
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/; // create a regex pattern to match supported Base64 image MIME types
  return base64Regex.test(imageData); // test the input string against the regex to return true if it's a valid Base64 image
}

export function formatDateString(dateString: string) { // define a function 'formatDateString' to format an ISO date string into readable time and date
  const options: Intl.DateTimeFormatOptions = { // declare formatting options for the date part (year, month, and day)
    year: "numeric", // set year format as four-digit number
    month: "short", // set month format as abbreviated text
    day: "numeric", // set day format as numeric value
  };

  const date = new Date(dateString); // create a Date object from the input string

  const formattedDate = date.toLocaleDateString(undefined, options); // format the date according to the defined locale and options

  const time = date.toLocaleTimeString([], { // extract formatted time string with specific time components
    hour: "numeric", // include hour in the formatted time
    minute: "2-digit", // include minute in two-digit format
  });

  return `${time} - ${formattedDate}`; // return a concatenated string combining formatted time and date
}

export function formatThreadCount(count: number): string { // define a function 'formatThreadCount' to display thread count with proper wording
  if (count === 0) { // check if count is zero to handle the special case
    return "No Threads"; // return label for zero thread count
  } else { // handle case when count is greater than zero
    const threadCount = count.toString().padStart(2, "0"); // convert count to string and pad with zero for uniform width
    const threadWord = count === 1 ? "Thread" : "Threads"; // determine singular or plural label based on count
    return `${threadCount} ${threadWord}`; // return formatted string combining number and thread label
  }
}

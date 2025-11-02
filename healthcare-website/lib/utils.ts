import { type ClassValue, clsx } from "clsx"; // import 'clsx' utility and its 'ClassValue' type to conditionally join class names in React components
import { twMerge } from "tailwind-merge"; // import 'twMerge' to intelligently merge Tailwind CSS class strings and prevent style conflicts

export function cn(...inputs: ClassValue[]) { // define a function 'cn' to combine and merge multiple class name inputs for consistent Tailwind styling
  return twMerge(clsx(inputs)); // merge all class names after resolving conditional logic to ensure no conflicting Tailwind classes remain
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value)); // define utility to deep-clone a JavaScript object by converting it to JSON and parsing it back, ensuring removal of non-serializable data

export const convertFileToUrl = (file: File) => URL.createObjectURL(file); // define function to generate a temporary URL for a local file so it can be previewed in the browser before upload

export const formatDateTime = ( // define a function 'formatDateTime' to format a date string into multiple human-readable formats based on a given timezone
  dateString: Date | string, // parameter 'dateString' represents a date or ISO string to be formatted
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone // parameter 'timeZone' defaults to the user's current system timezone if not provided
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = { // define formatting options for displaying both date and time together
    weekday: "short", // specify short weekday name for concise output
    month: "short", // specify short month name for concise output
    day: "numeric", // include numeric day of the month
    year: "numeric", // include full year value
    hour: "numeric", // include hour in the output
    minute: "numeric", // include minutes in the output
    hour12: true, // use 12-hour time format for readability
    timeZone: timeZone, // apply provided timezone for accurate local conversion
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = { // define formatting options for weekday and date display
    weekday: "short", // show abbreviated weekday name
    year: "numeric", // include numeric year
    month: "2-digit", // display two-digit month format for consistency
    day: "2-digit", // display two-digit day format
    timeZone: timeZone, // ensure formatting respects the provided timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = { // define formatting options for displaying only date
    month: "short", // show short month name
    year: "numeric", // include numeric year
    day: "numeric", // include numeric day of the month
    timeZone: timeZone, // use the provided timezone for accuracy
  };

  const timeOptions: Intl.DateTimeFormatOptions = { // define formatting options for displaying only time
    hour: "numeric", // include hour in output
    minute: "numeric", // include minutes in output
    hour12: true, // use 12-hour format for human readability
    timeZone: timeZone, // apply the specified timezone for proper local time
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString("en-US", dateTimeOptions); // format input date as combined date and time string for full timestamp display

  const formattedDateDay: string = new Date(dateString).toLocaleString("en-US", dateDayOptions); // format input date to show weekday, month, and day for calendar-like presentation

  const formattedDate: string = new Date(dateString).toLocaleString("en-US", dateOptions); // format input date to display only date without time component

  const formattedTime: string = new Date(dateString).toLocaleString("en-US", timeOptions); // format input date to display only time for use in time-specific contexts

  return { // return multiple formatted string versions to allow flexible usage in UI
    dateTime: formattedDateTime, // formatted combination of date and time
    dateDay: formattedDateDay, // formatted version including weekday
    dateOnly: formattedDate, // formatted version showing only date
    timeOnly: formattedTime, // formatted version showing only time
  };
};

export function encryptKey(passkey: string) { // define function 'encryptKey' to encode a given string into base64 for simple reversible encryption
  return btoa(passkey); // use browser's 'btoa' method to convert plain text to base64 encoding
}

export function decryptKey(passkey: string) { // define function 'decryptKey' to decode a base64-encoded string back into its original text
  return atob(passkey); // use browser's 'atob' method to decode base64 back to human-readable text
}

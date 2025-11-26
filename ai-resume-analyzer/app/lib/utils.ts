import { type ClassValue, clsx } from "clsx"; // import 'ClassValue' type and the 'clsx' utility to compute conditional class names
import { twMerge } from "tailwind-merge"; // import 'twMerge' to merge Tailwind classes intelligently and remove conflicts

export function cn(...inputs: ClassValue[]) { // define function 'cn' to merge multiple class values into a single optimized class string
  return twMerge(clsx(inputs)); // combine classes with clsx then resolve Tailwind conflicts using twMerge
}

export function formatSize(bytes: number): string { // define 'formatSize' to convert byte counts into human-readable size strings
  if (bytes === 0) return '0 Bytes'; // handle zero as a special case to avoid log-based calculations

  const k = 1024; // declare base 1024 to convert bytes into larger binary units
 
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; // list possible unit labels used during readable conversion

  const i = Math.floor(Math.log(bytes) / Math.log(k)); // compute index of the appropriate size unit based on logarithmic scaling

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; // calculate size in chosen unit, round to 2 decimals, and append unit label
}

export const generateUUID = () => crypto.randomUUID(); // define an arrow function using Web Crypto API to return a unique UUID
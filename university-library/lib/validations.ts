import { z } from "zod"; // import zod library to define and validate data schemas for input validation

export const signUpSchema = z.object({ // define schema to validate user input during sign-up process
  fullName: z.string().min(3), // ensure full name is a string with at least 3 characters to prevent incomplete entries
  email: z.string().email(), // validate email format to ensure proper contact and login identification
  universityId: z.coerce.number(), // coerce input to number type for consistent university ID handling
  universityCard: z.string().nonempty("University Card is required"), // require non-empty university card reference for verification
  password: z.string().min(8), // enforce minimum password length for basic security strength
});

export const signInSchema = z.object({ // define schema for validating user input during sign-in process
  email: z.string().email(), // validate email to match correct format for existing user lookup
  password: z.string().min(8), // enforce minimum length on password to match stored hash policy
});

export const bookSchema = z.object({ // define schema for validating book data before insertion or update in database
  title: z.string().trim().min(2).max(100), // ensure title has 2–100 characters after trimming spaces for proper formatting
  description: z.string().trim().min(10).max(1000), // require detailed description between 10–1000 characters for clarity
  author: z.string().trim().min(2).max(100), // validate author's name for appropriate length to avoid empty or invalid entries
  genre: z.string().trim().min(2).max(50), // restrict genre to 2–50 characters for categorization consistency
  rating: z.coerce.number().min(1).max(5), // coerce rating to number and ensure it falls within 1–5 range for standard review scale
  totalCopies: z.coerce.number().int().positive().lte(10000), // ensure total copies is a positive integer capped at 10,000 to prevent unrealistic entries
  coverUrl: z.string().nonempty(), // require valid cover image URL to ensure proper book display
  coverColor: z // validate hexadecimal color code format for consistent UI theming
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i), // enforce regex pattern to match valid 6-character hex colors
  videoUrl: z.string().nonempty(), // ensure non-empty URL for associated book video content
  summary: z.string().trim().min(10), // validate summary to contain meaningful description with minimum 10 characters
});

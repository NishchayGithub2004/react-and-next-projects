import * as z from "zod"; // import entire zod library as 'z' to define and enforce validation schemas for structured input checking

export const ThreadValidation = z.object({ // define a zod object schema named 'ThreadValidation' to validate thread or post data
  thread: z.string() // define 'thread' field as a string type
    .nonempty() // ensure 'thread' is not empty to prevent blank posts
    .min(3, { message: "Minimum 3 characters." }), // enforce at least 3 characters to ensure meaningful thread content
  
  accountId: z.string(), // define 'accountId' field as a string type to associate thread with a valid user account
});

export const CommentValidation = z.object({ // define a zod object schema named 'CommentValidation' to validate comment data
  thread: z.string() // define 'thread' field as a string type
    .nonempty() // ensure comment text is not empty to avoid blank comments
    .min(3, { message: "Minimum 3 characters." }), // enforce minimum 3 characters to guarantee meaningful comment text
});

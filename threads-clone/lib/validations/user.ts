import * as z from "zod"; // import entire zod library as 'z' to perform schema-based input validation

export const UserValidation = z.object({ // define a zod object schema named 'UserValidation' to validate user input data
  profile_photo: z.string() // define 'profile_photo' field as a string type
    .url() // ensure the string is a valid URL format to confirm proper image link structure
    .nonempty(), // enforce that 'profile_photo' field cannot be empty to guarantee presence of a valid photo URL
  
  name: z.string() // define 'name' field as a string type
    .min(3, { message: "Minimum 3 characters." }) // enforce a minimum length of 3 characters to avoid too-short names
    .max(30, { message: "Maximum 30 caracters." }), // enforce a maximum length of 30 characters to maintain reasonable name length
  
  username: z.string() // define 'username' field as a string type
    .min(3, { message: "Minimum 3 characters." }) // enforce a minimum of 3 characters to ensure username validity
    .max(30, { message: "Maximum 30 caracters." }), // enforce a maximum of 30 characters to limit username size
  
  bio: z.string() // define 'bio' field as a string type
    .min(3, { message: "Minimum 3 characters." }) // require at least 3 characters to ensure meaningful bio content
    .max(1000, { message: "Maximum 1000 caracters." }), // restrict to 1000 characters to prevent excessively long bios
});

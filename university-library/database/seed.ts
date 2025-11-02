import dummyBooks from "../dummybooks.json"; // import dummyBooks dataset containing mock book entries to seed into the database
import ImageKit from "imagekit"; // import ImageKit SDK to handle image and video uploads to cloud storage
import { books } from "@/database/schema"; // import books table schema to define database insertion target
import { neon } from "@neondatabase/serverless"; // import neon client for connecting to serverless PostgreSQL database
import { drizzle } from "drizzle-orm/neon-http"; // import drizzle ORM configured for neon-http to perform database operations
import { config } from "dotenv"; // import dotenv to load environment variables from .env file

config({ path: ".env.local" }); // initialize dotenv to read environment variables from local .env.local file for secure configuration

const sql = neon(process.env.DATABASE_URL!); // create neon SQL client instance using database URL to establish connection with PostgreSQL

export const db = drizzle({ client: sql }); // initialize drizzle ORM using neon client to enable SQL operations on the database

const imagekit = new ImageKit({ // create ImageKit instance for managing media uploads and retrieving hosted URLs
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!, // assign public key from environment for client authentication
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!, // assign base URL endpoint for serving uploaded media
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!, // assign private key for secure server-side authentication
});

const uploadToImageKit = async ( // define async helper function to upload files (images/videos) to ImageKit and return hosted path
  url: string, // input parameter for source file URL to upload
  fileName: string, // input parameter for naming the file in cloud storage
  folder: string, // input parameter for specifying target folder in ImageKit
) => {
  try { // attempt file upload and handle potential errors gracefully
    const response = await imagekit.upload({ // call ImageKit API to upload given file
      file: url, // specify file source URL
      fileName, // specify desired filename for stored asset
      folder, // specify target folder to organize uploads
    });

    return response.filePath; // return the cloud file path to store in database for retrieval
  } catch (error) { // catch any upload failure
    console.error("Error uploading image to ImageKit:", error); // log upload errors for debugging
  }
};

const seed = async () => { // define async function to seed database with dummyBooks data
  console.log("Seeding data..."); // log message to indicate seeding process has started

  try { // wrap seeding logic in try-catch to handle runtime errors
    for (const book of dummyBooks) { // iterate over each book entry in dummyBooks JSON data
      const coverUrl = (await uploadToImageKit( // upload book cover image to ImageKit and get hosted URL
        book.coverUrl, // use cover image URL from dummy data as source
        `${book.title}.jpg`, // name uploaded file using book title for easy identification
        "/books/covers", // store uploaded image under books/covers folder
      )) as string; // cast returned path as string to ensure type safety

      const videoUrl = (await uploadToImageKit( // upload promotional video for book and get hosted URL
        book.videoUrl, // use video URL from dummy data as source
        `${book.title}.mp4`, // name uploaded video file using book title
        "/books/videos", // store uploaded video under books/videos folder
      )) as string; // cast returned path as string for insertion

      await db.insert(books).values({ // insert new book record into database
        ...book, // spread existing dummy book fields (title, author, genre, etc.)
        coverUrl, // replace local coverUrl with uploaded hosted URL
        videoUrl, // replace local videoUrl with hosted video URL
      });
    }

    console.log("Data seeded successfully!"); // log success message once all records are inserted
  } catch (error) { // handle potential database or upload errors
    console.error("Error seeding data:", error); // log detailed error for debugging seeding failure
  }
};

seed(); // execute seeding function to populate database with dummyBooks data and upload media assets

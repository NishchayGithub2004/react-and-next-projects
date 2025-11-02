import ImageKit from "imagekit"; // import imagekit SDK to interact with ImageKit service for image upload and authentication
import config from "@/lib/config"; // import centralized config file to access environment variables securely
import { NextResponse } from "next/server"; // import Next.js response helper to return proper JSON HTTP responses from API route

const { // destructure imagekit-related credentials from config to use for SDK initialization
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config; // extract nested keys to avoid repeating config.env.imagekit each time

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint }); // create a new ImageKit instance with credentials for authenticated communication with ImageKit API

export async function GET() { // define GET endpoint handler to generate authentication parameters for client-side uploads
  return NextResponse.json(imagekit.getAuthenticationParameters()); // return JSON response containing signature and token so client can securely upload directly to ImageKit
}

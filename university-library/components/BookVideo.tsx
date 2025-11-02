"use client"; // enable client-side rendering so this component can play and control video in the browser

import React from "react"; // import react to define the functional component
import { IKVideo, ImageKitProvider } from "imagekitio-next"; // import imagekit components to load and stream optimized video
import config from "@/lib/config"; // import configuration to access imagekit public key and endpoint

// define a functional component named 'BookVideo' to display a video related to the book using imagekit streaming that takes video url as a prop
const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey} // use public key from config to authenticate video requests on client side
      urlEndpoint={config.env.imagekit.urlEndpoint} // define imagekit endpoint for serving optimized video assets
    >
      <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl" /> {/* stream video dynamically from provided path with playback controls enabled */}
    </ImageKitProvider>
  );
};

export default BookVideo; // export BookVideo as default so it can be imported and used elsewhere in the app

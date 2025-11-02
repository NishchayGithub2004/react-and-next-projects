"use client"; // enable client-side rendering so the component can run interactive logic in the browser

import React from "react"; // import react to define the component
import { cn } from "@/lib/utils"; // import helper function to merge conditional class names dynamically
import BookCoverSvg from "@/components/BookCoverSvg"; // import svg component that visually represents the book cover background
import { IKImage } from "imagekitio-next"; // import imagekit component for optimized image loading and caching
import config from "@/lib/config"; // import configuration file to access environment variables like imagekit endpoint

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide"; // define allowed cover size variants for consistent styling

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small", // map extraSmall variant to its specific css class
  small: "book-cover_small", // map small variant to its css class
  medium: "book-cover_medium", // map medium variant to its css class
  regular: "book-cover_regular", // map regular variant to its css class
  wide: "book-cover_wide", // map wide variant to its css class
}; // create an object mapping each variant to its css style class for easy lookup

interface Props {
  className?: string; // optional prop for external styling
  variant?: BookCoverVariant; // optional prop determining which cover size to render
  coverColor: string; // color value defining the background color of the book cover
  coverImage: string; // image path or url used for the main book cover visual
} // define expected props for the BookCover component

// define a functional component named 'BookCover' to display a styled book cover with color, image, and variant-based styling
const BookCover = ({
  className, // receive optional custom css class
  variant = "regular", // default to 'regular' variant to maintain consistent layout if none is provided
  coverColor = "#012B48", // default to dark blue color for fallback visual consistency
  coverImage = "https://placehold.co/400x600.png", // default to placeholder image if no cover image is provided
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant], // dynamically apply css based on selected variant for size adjustment
        className,
      )}
    >
      <BookCoverSvg coverColor={coverColor} /> {/* render svg background with provided color to form the visual base layer */}

      <div
        className="absolute z-10" // position overlay container above the svg layer
        style={{ left: "12%", width: "87.5%", height: "88%" }} // define exact image placement inside the cover for alignment
      >
        <IKImage
          path={coverImage} // dynamically load image from the provided url or fallback path
          urlEndpoint={config.env.imagekit.urlEndpoint} // access imagekit endpoint from config to fetch image efficiently
          alt="Book cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        /> {/* render optimized book cover image through imagekit for performance and caching */}
      </div>
    </div>
  );
};

export default BookCover; // export BookCover component as default for use in other modules
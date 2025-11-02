import React from "react"; // import react to enable jsx syntax and functional component creation
import Link from "next/link"; // import next.js link component to handle client-side navigation
import BookCover from "@/components/BookCover"; // import custom book cover component to display book’s visual cover
import { cn } from "@/lib/utils"; // import utility function to conditionally combine class names
import Image from "next/image"; // import optimized image component from next.js for performance and responsive images
import { Button } from "@/components/ui/button"; // import reusable button component for consistent button styling and behavior

// define a functional component named 'BookCard' to display book details and conditionally show loan info which takes following props
const BookCard = ({
  id, // unique identifier of the book used for routing to its detail page
  title, // title of the book displayed under the cover
  genre, // genre of the book displayed below the title
  coverColor, // background color for the book cover for aesthetic variation
  coverUrl, // url of the book’s cover image to visually represent it
  isLoanedBook = false, // boolean flag to indicate if the book is currently loaned out to display loan info
}: Book) => (
  <li className={cn(isLoanedBook && "xs:w-52 w-full")}> {/* conditionally apply different widths if book is loaned to fit layout */}
    <Link
      href={`/books/${id}`} // navigate to detailed page of the selected book using its id
      className={cn(isLoanedBook && "w-full flex flex-col items-center")} // adjust layout for loaned book display alignment
    >
      <BookCover coverColor={coverColor} coverImage={coverUrl} /> {/* render book cover with provided color and image */}

      <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}> {/* set layout width based on whether it’s a loaned book */}
        <p className="book-title">{title}</p> {/* display book title text */}
        <p className="book-genre">{genre}</p> {/* display book genre text */}
      </div>

      {isLoanedBook && ( // conditionally render loan details and actions only when the book is borrowed
        <div className="mt-3 w-full">
          <div className="book-loaned">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={18}
              height={18}
              className="object-contain"
            />
            <p className="text-light-100">11 days left to return</p> {/* show remaining days for returning the book */}
          </div>

          <Button className="book-btn">Download receipt</Button> {/* render button allowing user to download loan receipt */}
        </div>
      )}
    </Link>
  </li>
);

export default BookCard; // export BookCard component for reuse in book listings or profile pages

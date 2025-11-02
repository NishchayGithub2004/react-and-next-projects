import React from "react"; // import react library to define and render the functional component
import BookCard from "@/components/BookCard"; // import BookCard component to display individual book details

interface Props {
  title: string; // title to be displayed above the list section
  books: Book[]; // array of book objects to be rendered as individual cards
  containerClassName?: string; // optional css class name for styling the section container
} // define props that the BookList component expects to receive

// define a functional component named 'BookList' to display a titled list of book cards
const BookList = ({ title, books, containerClassName }: Props) => {
  if (books.length < 2) return; // prevent rendering if fewer than two books exist to avoid incomplete layout

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => ( // iterate over the books array to render each book item as a BookCard
          <BookCard key={book.title} {...book} /> // spread book object props into BookCard for dynamic data rendering
        ))}
      </ul>
    </section>
  );
};

export default BookList; // export BookList component as default for use in other parts of the app
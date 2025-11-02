interface Book { // define a blueprint for 'Book' entity representing complete book-related data in the system

  // identification and classification details
  id: number; // unique numeric ID assigned to each book record
  title: string; // book's title used for listing and search
  author: string; // author's name for attribution and sorting
  genre: string; // category or genre used for classification
  rating: number; // numeric average rating showing popularity or quality

  // inventory and availability tracking
  totalCopies?: number; // total number of copies available in library stock
  availableCopies?: number; // number of copies currently free for borrowing

  // descriptive and visual information
  description: string; // detailed explanation of book's content or theme
  color: string; // color tag used for UI theming or identification
  cover: string; // URL or path pointing to the cover image
  video: string; // video link offering related visual or promotional material
  summary: string; // short overview for preview or quick display

  // metadata and loan status
  createdAt?: Date | null; // timestamp showing when the record was created
  isLoanedBook?: boolean; // flag showing whether the book is currently borrowed
}

interface AuthCredentials { // define structure for authentication and user identity during signup or login

  // personal and credential data
  fullName: string; // user's full legal name for identification
  email: string; // email address used for communication and login
  password: string; // secret key used to verify user identity

  // institutional linkage details
  universityId: number; // numeric ID connecting user to a specific university
  universityCard: string; // card image or code verifying enrollment
}

interface BookParams { // define required parameters for creating or updating a book record in the system

  // essential metadata inputs
  title: string; // book name entered during creation
  author: string; // author field linking writer information
  genre: string; // genre field used for classification
  rating: number; // initial or updated rating value

  // media and presentation fields
  coverUrl: string; // URL to the uploaded book cover
  coverColor: string; // color accent enhancing display consistency

  // content-related inputs
  description: string; // detailed text describing book
  totalCopies: number; // numeric count of available copies at creation
  videoUrl: string; // attached video link for supplementary content
  summary: string; // short synopsis for quick preview
}

interface BorrowBookParams { // define parameters for handling book borrowing transactions
  bookId: string; // identifier of the book to be borrowed
  userId: string; // identifier of the user initiating borrowing
}

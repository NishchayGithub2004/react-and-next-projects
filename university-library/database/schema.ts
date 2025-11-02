import {
  varchar, // import varchar type to define text columns with length limits in PostgreSQL schema
  uuid, // import uuid type to define universally unique identifiers for primary keys
  integer, // import integer type to define whole number columns such as counts or IDs
  text, // import text type for unrestricted-length string fields
  pgTable, // import pgTable to define PostgreSQL tables using drizzle ORM
  date, // import date type for fields storing calendar dates without time
  pgEnum, // import pgEnum to define enumerated constant sets in PostgreSQL
  timestamp, // import timestamp type to define datetime fields with optional timezone
} from "drizzle-orm/pg-core"; // specify that all imports come from drizzle's PostgreSQL core module

export const STATUS_ENUM = pgEnum("status", [ // define enum for user account verification status to restrict allowed values
  "PENDING", // status when user's verification is awaiting approval
  "APPROVED", // status when user has been verified and approved
  "REJECTED", // status when verification has been denied
]);

export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]); // define enum for user roles to control access privileges

export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [ // define enum for tracking borrowing status of books
  "BORROWED", // indicates book is currently borrowed by a user
  "RETURNED", // indicates borrowed book has been returned
]);

export const users = pgTable("users", { // define users table to store information about all registered users
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(), // create unique id column as primary key with random UUID default for unique identification
  fullName: varchar("full_name", { length: 255 }).notNull(), // store user's full name for identification and personalization
  email: text("email").notNull().unique(), // store user email address and ensure uniqueness for login and contact purposes
  universityId: integer("university_id").notNull().unique(), // store numeric university ID to link each user to institutional records
  password: text("password").notNull(), // store hashed password for secure authentication
  universityCard: text("university_card").notNull(), // store path or reference to uploaded university ID card for verification
  status: STATUS_ENUM("status").default("PENDING"), // define user verification status with default as PENDING until approved
  role: ROLE_ENUM("role").default("USER"), // assign user role with default as USER to distinguish from admin accounts
  lastActivityDate: date("last_activity_date").defaultNow(), // track date of user's last activity for analytics and inactivity checks
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(), // record account creation timestamp with timezone for audit purposes
});

export const books = pgTable("books", { // define books table to store information about available books in the system
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(), // generate unique identifier for each book record
  title: varchar("title", { length: 255 }).notNull(), // store title of the book for catalog listing
  author: varchar("author", { length: 255 }).notNull(), // store author's name for reference and filtering
  genre: text("genre").notNull(), // store genre to categorize books for browsing and recommendations
  rating: integer("rating").notNull(), // store numerical rating for user feedback or quality assessment
  coverUrl: text("cover_url").notNull(), // store URL to book's cover image for display in UI
  coverColor: varchar("cover_color", { length: 7 }).notNull(), // store dominant cover color (hex format) for aesthetic UI theming
  description: text("description").notNull(), // store detailed description to inform users about book content
  totalCopies: integer("total_copies").notNull().default(1), // track total number of copies available in inventory
  availableCopies: integer("available_copies").notNull().default(0), // track number of copies currently available for borrowing
  videoUrl: text("video_url").notNull(), // store link to video review or trailer to enhance user engagement
  summary: varchar("summary").notNull(), // store brief summary of book to show in preview listings
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(), // record date and time when book record was added
});

export const borrowRecords = pgTable("borrow_records", { // define borrow_records table to log all borrow and return transactions
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(), // assign unique ID to each borrow record for traceability
  userId: uuid("user_id") // define foreign key to reference borrowing user
    .references(() => users.id) // ensure referential integrity linking to users table
    .notNull(), // make user reference mandatory since each record must belong to a user
  bookId: uuid("book_id") // define foreign key to reference borrowed book
    .references(() => books.id) // ensure referential integrity linking to books table
    .notNull(), // make book reference mandatory to identify which book is borrowed
  borrowDate: timestamp("borrow_date", { withTimezone: true }) // record timestamp of when the book was borrowed
    .defaultNow() // default to current timestamp when record is created
    .notNull(), // ensure date is always recorded for tracking purposes
  dueDate: date("due_date").notNull(), // store due date by which book should be returned
  returnDate: date("return_date"), // store actual return date if returned, null otherwise
  status: BORROW_STATUS_ENUM("status").default("BORROWED").notNull(), // track whether book is currently borrowed or returned
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(), // store record creation timestamp for historical tracking
});

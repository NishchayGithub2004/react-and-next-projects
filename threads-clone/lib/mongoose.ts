import mongoose from "mongoose"; // import mongoose library to interact with MongoDB database

let isConnected = false; // declare a boolean flag to track if a MongoDB connection is already established

export const connectToDB = async () => { // define an asynchronous function 'connectToDB' to establish a connection to MongoDB
  mongoose.set("strictQuery", true); // enable strict query mode to enforce filtering only on schema-defined fields

  if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL"); // check if MongoDB URL is missing in environment variables and log an error if so
  
  if (isConnected) { // check if a MongoDB connection already exists to prevent redundant connections
    console.log("MongoDB connection already established"); // log message indicating reuse of existing connection
    return; // exit function since no new connection is needed
  }

  try { // start try block to handle connection process and possible errors
    await mongoose.connect(process.env.MONGODB_URL); // attempt to connect to MongoDB using connection URL from environment variables

    isConnected = true; // update flag to true once connection is successfully established

    console.log("MongoDB connected"); // log success message confirming database connection
  } catch (error) { // catch any errors that occur during the connection attempt
    console.log(error); // log the error details for debugging purposes
  }
};

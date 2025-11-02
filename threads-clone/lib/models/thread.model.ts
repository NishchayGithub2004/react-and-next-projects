import mongoose from "mongoose"; // import mongoose library to define schema and interact with MongoDB collections

const threadSchema = new mongoose.Schema({ // create a mongoose schema named 'threadSchema' to structure thread or post data
  text: { // define 'text' field to store the main content of the thread
    type: String, // set field type as string to hold text content
    required: true, // make it mandatory to ensure every thread has content
  },
  
  author: { // define 'author' field to store reference to the user who created the thread
    type: mongoose.Schema.Types.ObjectId, // set field type as ObjectId to link to a user document
    ref: "User", // reference 'User' model to establish relationship between thread and its creator
    required: true, // make it required to ensure every thread has an associated author
  },
  
  community: { // define 'community' field to store reference to the community where the thread was posted
    type: mongoose.Schema.Types.ObjectId, // set field type as ObjectId to relate to a community document
    ref: "Community", // reference 'Community' model to associate thread with its respective community
  },
  
  createdAt: { // define 'createdAt' field to store timestamp of when the thread was created
    type: Date, // set field type as date to record creation time
    default: Date.now, // automatically set current date and time as default creation timestamp
  },
  
  parentId: { // define 'parentId' field to identify the parent thread if this is a reply
    type: String, // set field type as string to store parent thread identifier
  },
  
  children: [ // define 'children' field as an array to store references to replies or nested threads
    {
      type: mongoose.Schema.Types.ObjectId, // set each element type as ObjectId to reference thread documents
      ref: "Thread", // reference 'Thread' model to create self-referential relationship for nested replies
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema); // create or reuse mongoose model named 'Thread' from defined schema

export default Thread; // export 'Thread' model as default to use it for database operations related to threads
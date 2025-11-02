import mongoose from "mongoose"; // import mongoose library to define schema structures and interact with MongoDB collections

const userSchema = new mongoose.Schema({ // create a mongoose schema named 'userSchema' to define structure of user documents
  id: { // define 'id' field to store a unique string identifier for each user
    type: String, // set data type as string for user identifier
    required: true, // make this field mandatory to ensure each user record has an id
  },
  
  username: { // define 'username' field to store user's unique handle or identifier
    type: String, // set data type as string for username
    unique: true, // enforce uniqueness so no two users can share the same username
    required: true, // make field required to ensure every user has a username
  },
  
  name: { // define 'name' field to store full name of the user
    type: String, // set data type as string for name
    required: true, // make it required to ensure user profile completeness
  },
  
  image: String, // define optional 'image' field to store URL or path to user's profile picture
  
  bio: String, // define optional 'bio' field to store user's short description or information
  
  threads: [ // define 'threads' field as an array to store references to threads created by this user
    {
      type: mongoose.Schema.Types.ObjectId, // set each array element as ObjectId to link with thread documents
      ref: "Thread", // reference 'Thread' model to establish relationship between user and their posts
    },
  ],
  
  onboarded: { // define 'onboarded' field to track whether user has completed initial setup
    type: Boolean, // set data type as boolean to store true or false value
    default: false, // set default to false indicating new users start un-onboarded
  },
  
  communities: [ // define 'communities' field as an array to store communities the user has joined
    {
      type: mongoose.Schema.Types.ObjectId, // set each array element as ObjectId to link to community documents
      ref: "Community", // reference 'Community' model to associate user with their communities
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema); // create or reuse mongoose model named 'User' from defined schema

export default User; // export 'User' model as default to make it accessible for database operations related to users
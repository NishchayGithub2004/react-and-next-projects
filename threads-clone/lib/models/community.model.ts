import mongoose from "mongoose"; // import mongoose library to define and manage MongoDB schemas and models

const communitySchema = new mongoose.Schema({ // create a new mongoose schema named 'communitySchema' to structure community data
  id: { // define 'id' field to store unique string identifier for each community
    type: String, // set field data type as string
    required: true, // make field mandatory to ensure every community has an identifier
  },
  
  username: { // define 'username' field to store a unique handle for each community
    type: String, // set field data type as string
    unique: true, // ensure no two communities have the same username
    required: true, // make field mandatory for community identification
  },
  
  name: { // define 'name' field to store the display name of the community
    type: String, // set field data type as string
    required: true, // make field required so every community has a visible name
  },
  
  image: String, // define optional 'image' field to store URL or path of community profile image
  
  bio: String, // define optional 'bio' field to store short description or details about the community
  
  createdBy: { // define 'createdBy' field to store reference to the user who created the community
    type: mongoose.Schema.Types.ObjectId, // set field type as ObjectId to link with user documents
    ref: "User", // reference 'User' model to establish relationship between community and its creator
  },
  
  threads: [ // define 'threads' field as an array to store posts associated with this community
    {
      type: mongoose.Schema.Types.ObjectId, // set type as ObjectId to store thread document references
      ref: "Thread", // reference 'Thread' model to link threads belonging to this community
    },
  ],
  
  members: [ // define 'members' field as an array to store users who have joined the community
    {
      type: mongoose.Schema.Types.ObjectId, // set type as ObjectId to store user document references
      ref: "User", // reference 'User' model to link all community members
    },
  ],
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema); // create or reuse existing mongoose model 'Community' from the defined schema

export default Community; // export 'Community' model as default to allow importing it for database operations elsewhere
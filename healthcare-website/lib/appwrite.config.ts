import * as sdk from "node-appwrite"; // import all exports from the 'node-appwrite' SDK to interact with Appwrite services like database, storage, and users

export const { // destructure environment variables to configure Appwrite client and resources
  NEXT_PUBLIC_ENDPOINT: ENDPOINT, // assign the Appwrite server endpoint from environment to a constant for SDK connection
  PROJECT_ID, // assign project ID from environment to identify which Appwrite project to connect to
  API_KEY, // assign API key from environment for authenticated requests to Appwrite backend
  DATABASE_ID, // assign database ID from environment for performing CRUD operations on a specific Appwrite database
  PATIENT_COLLECTION_ID, // assign collection ID for 'patients' to allow querying or modifying patient data
  DOCTOR_COLLECTION_ID, // assign collection ID for 'doctors' to allow querying or modifying doctor data
  APPOINTMENT_COLLECTION_ID, // assign collection ID for 'appointments' to handle scheduling and related records
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID, // assign bucket ID from environment for file uploads or retrievals in Appwrite storage
} = process.env; // retrieve all above configuration values from the Node environment variables

const client = new sdk.Client(); // create a new Appwrite client instance to establish connection with the Appwrite server

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!); // configure client with endpoint, project ID, and API key for authenticated Appwrite communication

export const databases = new sdk.Databases(client); // initialize Appwrite Databases service using configured client to perform database operations
export const users = new sdk.Users(client); // initialize Appwrite Users service using configured client to manage user accounts and authentication
export const messaging = new sdk.Messaging(client); // initialize Appwrite Messaging service using configured client to send notifications or messages
export const storage = new sdk.Storage(client); // initialize Appwrite Storage service using configured client to manage file uploads and downloads

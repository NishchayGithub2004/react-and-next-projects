import { handlers } from "@/auth"; // import predefined authentication route handlers from central auth configuration to manage login and callback requests

export const { GET, POST } = handlers; // export GET and POST methods from auth handlers so Next.js can route authentication requests through its built-in API endpoints
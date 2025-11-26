import { type RouteConfig, index, route } from "@react-router/dev/routes"; // import routing utilities and types to define the application's route structure

export default [
    index("routes/home.tsx"), // register the root path and map it to the home component file
    route('/auth', 'routes/auth.tsx'), // register the /auth path and map it to the authentication component
    route('/upload', 'routes/upload.tsx'), // register the /upload path so users can access the resume upload page
    route('/resume/:id', 'routes/resume.tsx'), // register dynamic resume detail path to load pages based on a unique id
    route('/wipe', 'routes/wipe.tsx'), // register the /wipe path to load the wipe/reset component
] satisfies RouteConfig; // ensure the exported array conforms to the RouteConfig type for type-safety
import AuthorFormContextProvider from "./contexts/AuthorFormContext"; // import context provider to wrap layout with author form state management

export default function Layout({ children }) { // define a layout component to provide author form context to all nested routes
    return <AuthorFormContextProvider>{children}</AuthorFormContextProvider> // wrap rendered children with author form context provider
}
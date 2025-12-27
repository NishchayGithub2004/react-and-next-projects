import CategoryFormContextProvider from "./contexts/CategoryFormContext"; // import category form context provider to supply shared form state to all nested routes

export default function Layout({ children }) { // define a layout component to wrap descendant pages with category form context
    return <CategoryFormContextProvider>{children}</CategoryFormContextProvider> // wrap rendered children with context provider to enable shared access
}
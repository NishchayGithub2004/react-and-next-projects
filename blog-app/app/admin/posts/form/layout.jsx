import PostFormContextProvider from "./contexts/PostFormContext"; // import PostFormContextProvider to wrap descendants with shared post form state

export default function Layout({ children }) { // define a layout component that receives children to be rendered within the post form context
    return <PostFormContextProvider>{children}</PostFormContextProvider>  // render nested layout content within the post form context provider
}
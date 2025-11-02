"use client"; // mark this file as a client component in Next.js to enable client-side rendering and hooks usage

import { ThemeProvider as NextThemesProvider } from "next-themes"; // import ThemeProvider from next-themes and alias it as NextThemesProvider to handle theme context logic
import { type ThemeProviderProps } from "next-themes/dist/types"; // import the type definition for ThemeProviderProps to ensure proper typing of props passed to the component

export function ThemeProvider( // define a functional component named 'ThemeProvider' to wrap the app and manage light/dark theme context
  { children, ...props }: ThemeProviderProps // destructure children and remaining props to pass them to the underlying next-themes provider
) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>; // render NextThemesProvider with all received props and children to apply theme context across the app
}

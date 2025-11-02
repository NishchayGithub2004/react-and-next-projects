import type { Metadata } from "next"; // import metadata type definition from next.js for page-level SEO configuration
import "./globals.css"; // import global css styles that apply to the entire application
import { Plus_Jakarta_Sans as FontSans } from "next/font/google"; // import google font utility from next.js to dynamically load custom fonts
import { ThemeProvider } from "next-themes"; // import theme provider to handle dark/light mode functionality

import { cn } from "@/lib/utils"; // import utility function for conditional className concatenation

const fontSans = FontSans({ // initialize fontSans variable to store the loaded font configuration for Plus Jakarta Sans
  subsets: ["latin"], // specify latin character subset for font loading optimization
  weight: ["300", "400", "500", "600", "700"], // define available font weights for consistent typography styling
  variable: "--font-sans", // assign custom css variable name for referencing this font globally
});

export const metadata: Metadata = { // define static metadata object for SEO and browser tab display
  title: "CarePulse", // set application title for browser tab
  description: // provide brief description to improve SEO visibility
    "A healthcare patient management System designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.",
  icons: { // define favicon and app icon paths
    icon: "/assets/icons/logo-icon.svg", // specify default icon location for browser tab
  },
};

export default function RootLayout({ // define functional component named 'RootLayout' to structure base html for all pages
  children, // accept children prop that represents nested page components rendered within layout
}: Readonly<{ // enforce readonly type for prop destructuring to ensure immutability
  children: React.ReactNode; // declare that children must be valid react nodes
}>) {
  return (
    <html lang="en">
      <body
        className={cn( // dynamically combine base and font-specific class names for body styling
          "min-h-screen bg-dark-300 font-sans antialiased", // define default global styles for body layout and theme
          fontSans.variable // include dynamic font variable reference for applying Plus Jakarta Sans
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark"> {/* wrap all components with ThemeProvider to manage light/dark theme state */}
          {children} {/* render nested page content passed from routing system */}
        </ThemeProvider>
      </body>
    </html>
  );
}

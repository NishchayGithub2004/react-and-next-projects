import type { ReactNode } from "react"; // import ReactNode type to type children for React components
import React, { createContext, useContext, useState } from "react"; // import React core along with context and state hooks
import { cn } from "~/lib/utils"; // import utility 'cn' to merge dynamic class names inside TSX

interface AccordionContextType { // define context shape for accordion behavior
    activeItems: string[]; // store list of currently expanded accordion item IDs
    toggleItem: (id: string) => void; // declare function to toggle a specific item ID
    isItemActive: (id: string) => boolean; // declare function to check if an item ID is active
}

const AccordionContext = createContext<AccordionContextType | undefined>( // create React context to share accordion state and logic across nested components
    undefined // initialize with undefined so consumers must be used inside provider
);

const useAccordion = () => { // define custom hook to access accordion context safely
    const context = useContext(AccordionContext); // retrieve context value from React's context system
    
    if (!context) { // check if context was not provided higher in tree
        throw new Error("Accordion components must be used within an Accordion"); // throw error to enforce proper component usage
    }
    
    return context; // return safe validated context object allowing access to accordion logic
};

interface AccordionProps { // define props accepted by Accordion root component
    children: ReactNode; // children to be rendered inside accordion root
    defaultOpen?: string; // optional ID of item that should be opened by default
    allowMultiple?: boolean; // allow multiple items open at once or restrict to one
    className?: string; // allow custom class overrides
}

export const Accordion: React.FC<AccordionProps> = ({ // define Accordion component as root provider controlling expansion behavior
    children, // receive nested child components
    defaultOpen, // receive default item ID to open
    allowMultiple = false, // default to single‑item mode unless overridden
    className = "", // receive additional classes
}) => {
    const [activeItems, setActiveItems] = useState<string[]>( // track list of currently open item IDs using React state
        defaultOpen ? [defaultOpen] : [] // initialize with default open item or empty list
    );

    const toggleItem = (id: string) => { // define function to toggle item expansion state
        setActiveItems((prev) => { // update active items list based on previous state
            if (allowMultiple) { // check if multiple items can be open simultaneously
                return prev.includes(id) // determine if toggled item is already active
                    ? prev.filter((item) => item !== id) // remove from active list to collapse
                    : [...prev, id]; // add ID to active list to expand
            } else { // single‑item mode behavior
                return prev.includes(id) ? [] : [id]; // collapse if active, otherwise open exclusively
            }
        });
    };

    const isItemActive = (id: string) => activeItems.includes(id); // define utility to check if an item is expanded

    return (
        <AccordionContext.Provider // wrap all accordion children with context provider to supply shared logic
            value={{ activeItems, toggleItem, isItemActive }} // pass state and handlers to all nested components
        >
            <div className={`space-y-2 ${className}`}>{children}</div> {/* render children spaced vertically; static attributes not commented */}
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps { // define props for individual accordion item container
    id: string; // unique identifier for this accordion item
    children: ReactNode; // inner elements of the item
    className?: string; // allow custom styling
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ // define item wrapper component
    id, // receive ID identifying this item
    children, // receive nested child components
    className = "", // allow class overrides
}) => {
    return (
        <div className={`overflow-hidden border-b border-gray-200 ${className}`}> {/* static styling, no comment needed */}
            {children}
        </div>
    );
};

interface AccordionHeaderProps { // define props for clickable accordion header that toggles content
    itemId: string; // ID of accordion item whose state this header controls
    children: ReactNode; // header label content
    className?: string; // optional class overrides
    icon?: ReactNode; // optional custom icon
    iconPosition?: "left" | "right"; // choose icon placement
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({ // define header component controlling item toggling
    itemId, // receive ID of controlled item
    children, // receive header contents
    className = "", // custom classes
    icon, // receive optional custom icon
    iconPosition = "right", // default icon placement on right
}) => {
    const { toggleItem, isItemActive } = useAccordion(); // access accordion logic from context to toggle and check active state
    
    const isActive = isItemActive(itemId); // compute boolean indicating whether item is currently expanded

    const defaultIcon = ( // create default chevron icon used when no custom icon is provided
        <svg
            className={cn("w-5 h-5 transition-transform duration-200", { // apply rotation dynamically depending on state
                "rotate-180": isActive, // rotate icon when item is active to indicate expanded state
            })}
            fill="none"
            stroke="#98A2B3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    const handleClick = () => { // define click handler for header button
        toggleItem(itemId); // call toggleItem with associated ID to expand or collapse item
    };

    return (
        <button
            onClick={handleClick} // attach toggle handler to button click event
            className={`
        w-full px-4 py-3 text-left
        focus:outline-none
        transition-colors duration-200 flex items-center justify-between cursor-pointer
        ${className}
      `}
        >
            <div className="flex items-center space-x-3"> {/* static layout container */}
                {iconPosition === "left" && (icon || defaultIcon)} {/* render icon on left when position matches logic */}
                <div className="flex-1">{children}</div> {/* display header content */}
            </div>
            {iconPosition === "right" && (icon || defaultIcon)} {/* render icon on right using logic value */}
        </button>
    );
};

interface AccordionContentProps { // define props for collapsible content section
    itemId: string; // ID of item controlling visibility
    children: ReactNode; // content to show/hide
    className?: string; // allow style overrides
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ // define collapsible content component
    itemId, // receive controlling item ID
    children, // receive inner elements
    className = "", // allow custom styling
}) => {
    const { isItemActive } = useAccordion(); // get function to check expansion state from context
    
    const isActive = isItemActive(itemId); // determine whether content should be visible

    return (
        <div
            className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0"}
        ${className}
      `}
        >
            <div className="px-4 py-3 ">{children}</div> {/* show inner content when expanded */}
        </div>
    );
};

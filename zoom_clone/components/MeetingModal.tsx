'use client'; // mark this file to run only on the client side since it uses browser-specific APIs and interactivity

import { ReactNode } from "react"; // import ReactNode type to define children prop

import { Dialog, DialogContent } from "./ui/dialog"; // import Dialog components for modal functionality
import { cn } from "@/lib/utils"; // import cn utility to conditionally join classNames
import { Button } from "./ui/button"; // import Button component for interactive buttons
import Image from "next/image"; // import Next.js Image component for optimized images

interface MeetingModalProps { // define TypeScript interface for props expected by MeetingModal
    isOpen: boolean; // flag indicating whether the modal is open
    onClose: () => void; // function to handle modal close
    title: string; // title of the modal
    className?: string; // optional additional classNames for title styling
    children?: ReactNode; // optional children elements to render inside modal
    handleClick?: () => void; // optional function to handle button click
    buttonText?: string; // optional text for the button
    instantMeeting?: boolean; // optional flag for instant meeting logic
    image?: string; // optional image URL to display at top of modal
    buttonClassName?: string; // optional className for button styling
    buttonIcon?: string; // optional icon URL to display inside button
}

const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, instantMeeting, image, buttonClassName, buttonIcon }: MeetingModalProps) => {  // create a functional component that takes props of 'MeetingModalProps' object in destructured form
    return (
        <Dialog open={isOpen} onOpenChange={onClose}> {/* handle modal open/close logic using Dialog component */}
            <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
                <div className="flex flex-col gap-6">
                    {image && ( /* conditionally render image container only if image prop exists */
                        <div className="flex justify-center">
                            <Image src={image} alt="checked" width={72} height={72} />
                        </div>
                    )}
                    <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
                        {title}
                    </h1>
                    {children} 
                    <Button
                        className={
                            "bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        }
                        onClick={handleClick} // call handleClick function when button is clicked
                    >
                        {buttonIcon && ( /* conditionally render icon inside button if buttonIcon prop exists */
                            <Image
                                src={buttonIcon}
                                alt="button icon"
                                width={13}
                                height={13}
                            />
                        )}{" "}
                        &nbsp;
                        {buttonText || "Schedule Meeting"} 
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MeetingModal;
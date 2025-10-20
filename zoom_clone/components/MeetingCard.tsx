'use client'; // mark this file to run only on the client side since it uses browser-specific APIs and interactivity

import Image from "next/image"; // import Image component from next/image for optimized image rendering
import { cn } from "@/lib/utils"; // import cn utility to conditionally join classNames
import { Button } from "./ui/button"; // import Button component for interactive buttons
import { avatarImages } from "@/constants"; // import avatarImages array containing attendee image paths
import { useToast } from "./ui/use-toast"; // import useToast hook to show toast notifications

interface MeetingCardProps { // define TypeScript interface for props expected by MeetingCard
    title: string; // title of the meeting
    date: string; // date of the meeting
    icon: string; // icon path for the meeting
    isPreviousMeeting?: boolean; // optional flag indicating if the meeting is in the past
    buttonIcon1?: string; // optional path for the icon on the primary button
    buttonText?: string; // optional text for the primary button
    handleClick: () => void; // function to handle click events on the primary button
    link: string; // link to be copied using the secondary button
}

const MeetingCard = ({ icon, title, date, isPreviousMeeting, buttonIcon1, handleClick, link, buttonText }: MeetingCardProps) => { // create a functional component that takes props of 'MeetingCardProps' object in destructured form
    const { toast } = useToast(); // get toast function from useToast hook to display notifications

    return (
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col gap-5">
                <Image src={icon} alt="upcoming" width={28} height={28} />
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-base font-normal">{date}</p>
                    </div>
                </div>
            </article>
            <article className={cn("flex justify-center relative", {})}>
                <div className="relative flex w-full max-sm:hidden">
                    {avatarImages.map((img, index) => ( // iterate over avatarImages array and map to JSX elements
                        <Image
                            key={index}
                            src={img}
                            alt="attendees"
                            width={40}
                            height={40}
                            className={cn("rounded-full", { absolute: index > 0 })}
                            style={{ top: 0, left: index * 28 }}
                        />
                    ))}
                </div>
                {!isPreviousMeeting && ( // conditionally render buttons only if the meeting is not previous
                    <div className="flex gap-2">
                        <Button onClick={handleClick} className="rounded bg-blue-1 px-6"> 
                            {buttonIcon1 && (
                                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
                            )}
                            &nbsp; {buttonText}
                        </Button>
                        <Button
                            onClick={() => { // define onClick handler for copy link button
                                navigator.clipboard.writeText(link); // copy the link prop to clipboard
                                toast({ // show toast notification that link has been copied
                                    title: "Link Copied",
                                });
                            }}
                            className="bg-dark-4 px-6"
                        >
                            <Image
                                src="/icons/copy.svg"
                                alt="feature"
                                width={20}
                                height={20}
                            />
                            &nbsp; Copy Link
                        </Button>
                    </div>
                )}
            </article>
        </section>
    );
};

export default MeetingCard;
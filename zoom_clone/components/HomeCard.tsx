'use client'; // mark this file to run only on the client side since it uses browser-specific APIs and interactivity

import Image from 'next/image'; // import Next.js optimized Image component to efficiently render and optimize images

import { cn } from '@/lib/utils'; // import cn utility function used to merge and conditionally combine Tailwind class names

interface HomeCardProps { // define TypeScript interface to specify expected props for the HomeCard component
    className?: string; // optional custom class name string to extend or override default styles
    img: string; // required string path for the image source displayed in the card
    title: string; // required string for the card's title text
    description: string; // required string describing the card's purpose or details
    handleClick?: () => void; // optional callback function executed when the card is clicked
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => { // define functional component and destructure props with their expected types from HomeCardProps interface
    return ( 
        <section
            className={cn( // call cn function to merge base Tailwind CSS classes with optional user-provided className
                'bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer',
                className
            )}
            onClick={handleClick} // attach click handler that triggers the handleClick callback when the section is clicked
        >
            <div className="flex-center glassmorphism size-12 rounded-[10px]">
                <Image src={img} alt="meeting" width={27} height={27} /> {/* render image dynamically using img prop with specified dimensions */}
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{title}</h1> {/* render title text from the title prop */}
                <p className="text-lg font-normal">{description}</p> {/* render description text from the description prop */}
            </div>
        </section>
    );
};

export default HomeCard;

import Link from 'next/link'; // import Link component from Next.js to enable client-side navigation
import Image from 'next/image'; // import Image component from Next.js for optimized image rendering

import { Button } from './ui/button'; // import Button component from the local UI library for consistent styled buttons
import { Card, CardContent } from './ui/card'; // import Card and CardContent components from local UI library to display content inside a styled card

interface PermissionCardProps { // define a TypeScript interface for component props to enforce structure and types
    title: string; // define title property as a string to display text inside the alert
    iconUrl?: string; // define optional iconUrl property as a string to display an image if provided
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => { // define functional component Alert accepting title and iconUrl as props
    return (
        <section className="flex-center h-screen w-full"> 
            <Card className="w-full max-w-[520px] border-none bg-dark-1 p-6 py-9 text-white">
                <CardContent>
                    <div className="flex flex-col gap-9">
                        <div className="flex flex-col gap-3.5">
                            {iconUrl && ( // check if iconUrl prop exists before rendering the Image component
                                <div className="flex-center">
                                    <Image src={iconUrl} width={72} height={72} alt="icon" /> 
                                </div>
                            )}
                            <p className="text-center text-xl font-semibold">{title}</p> 
                        </div>
                        <Button asChild className="bg-blue-1"> 
                            <Link href="/">Back to Home</Link> 
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default Alert; // export Alert component as the default export for use in other files

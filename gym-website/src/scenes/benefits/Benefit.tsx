import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import AnchorLink from "react-anchor-link-smooth-scroll";

// create an animation variant named 'childVariant' for which intial state named 'hidden' is 0 opacity and scale 0.9 and final state named 'visible' is 1 opacity and scale 1.
const childVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

// create a type 'Props' which contains a react node, two strings and a function which takes a selected page as an argument and returns void.
type Props = {
    icon: React.ReactNode;
    title: string;
    description: string;
    setSelectedPage: (value: SelectedPage) => void;
};

// create a function component 'Benefit' which takes four destructured props as arguments
const Benefit = ({ icon, title, description, setSelectedPage }: Props) => {
    return (
        <motion.div // return a motion div from framer motion which uses 'childVariant' animation and tailwind customizations
            variants={childVariant}
            className="mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center"
        >
            {/* also return 'icon' in a div with some tailwind customizations */}
            <div className="mb-4 flex justify-center">
                <div className="rounded-full border-2 border-gray-100 bg-primary-100 p-4">
                    {icon}
                </div>
            </div>

            {/* return 'title' and 'description' in h4 and p tags respectively with some tailwind customizations */}
            <h4 className="font-bold">{title}</h4>
            <p className="my-3">{description}</p>
            
            {/* create an anchor link that reads 'Learn More' clicking which we smoothly scroll to the contact us section using 'setSelectedPage' function */}
            <AnchorLink
                className="text-sm font-bold text-primary-500 underline hover:text-secondary-500"
                onClick={() => setSelectedPage(SelectedPage.ContactUs)}
                href={`#${SelectedPage.ContactUs}`}
            >
                <p>Learn More</p>
            </AnchorLink>
        </motion.div>
    );
};

export default Benefit; // export the component to be used elsewhere
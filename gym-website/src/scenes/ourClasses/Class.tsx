// create a type 'Props' which contains two mandatory strings and one optional string

type Props = {
    name: string;
    description?: string;
    image: string;
};

// create a function component 'Class' which takes three destructured props as arguments
const Class = ({ name, description, image }: Props) => {
    const overlayStyles = `p-5 absolute z-30 flex
    h-[380px] w-[450px] flex-col items-center justify-center
    whitespace-normal bg-primary-500 text-center text-white
    opacity-0 transition duration-500 hover:opacity-90`;

    return (
        <li className="relative mx-5 inline-block h-[380px] w-[450px]">
            <div className={overlayStyles}>
                <p className="text-2xl">{name}</p>
                <p className="mt-5">{description}</p>
            </div>
            <img alt={`${image}`} src={image} />
        </li>
    );
};

export default Class; // export the function component 'Class' to be used in other files
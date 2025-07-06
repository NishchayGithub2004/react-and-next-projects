import { useForm } from "react-hook-form";
import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png";
import HText from "@/shared/HText";

// create a type 'Props' which contains a function 'setSelectedPage' that takes a value of type 'SelectedPage' as its argument and returns nothing.
type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

// create a functional component 'ContactUs' that takes function 'setSelectedPage' of 'Props' as argument
const ContactUs = ({ setSelectedPage }: Props) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300
    px-5 py-3 placeholder-white`;

    // create destructured form of useForm hook to create 'register', 'trigger', and 'formState'
    // 'register' is used to register input fields in the form by connecting inputs to the form
    // 'trigger' is used to trigger validation on form fields and 'formState:{errors}' is used to hold any validation errors
    const {
        register,
        trigger,
        formState: { errors },
    } = useForm();

    // craete a function 'onSubmit' that takes an event 'e' as argument which is async as trigger() returns a Promise
    const onSubmit = async (e: any) => {
        const isValid = await trigger(); // perform input validation on all form fields and await until all input fields are validated
        // if validation fails, prevent the default form submission behavior
        if (!isValid) {
            e.preventDefault();
        }
    };

    return (
        <section id="contactus" className="mx-auto w-5/6 pt-24 pb-32">
            {/* create a motion div that will set selected page to 'ContactUs' when it enters the viewport */}
            <motion.div
                onViewportEnter={() => setSelectedPage(SelectedPage.ContactUs)}
            >
                <motion.div
                    className="md:w-3/5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <HText>
                        <span className="text-primary-500">JOIN NOW</span> TO GET IN SHAPE
                    </HText>
                    <p className="my-5">
                        Congue adipiscing risus commodo placerat. Tellus et in feugiat nisl
                        sapien vel rhoncus. Placerat at in enim pellentesque. Nulla
                        adipiscing leo egestas nisi elit risus sit. Nunc cursus sagittis.
                    </p>
                </motion.div>

                <div className="mt-10 justify-between gap-8 md:flex">
                    <motion.div
                        className="mt-10 basis-3/5 md:mt-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <form
                            target="_blank"
                            onSubmit={onSubmit}
                            action="https://formsubmit.co/e8a5bdfa807605332f809e5656e27c6e"
                            method="POST"
                        >
                            {/* create an input field which apply all registeration properties using spread operator
                            type of this input field is 'text', placeholder is 'NAME', it is necessary to fill this, and maximum length of name is 100 */}
                            <input
                                className={inputStyles}
                                type="text"
                                placeholder="NAME"
                                {...register("name", {
                                    required: true,
                                    maxLength: 100,
                                })}
                            />

                            {/* error display logic is also written here. 'errors.name &&' means that error message is only shown when any error occurs in the field
                            if field is not filled, then "This field is required" message is shown
                            if field value exceeds 100 characters, then "Max length is 100 characters" message is shown */}
                            {errors.name && (
                                <p className="mt-1 text-primary-500">
                                    {errors.name.type === "required" && "This field is required."}
                                    {errors.name.type === "maxLength" && "Max length is 100 characters."}
                                </p>
                            )}

                            {/* create an input field of type text, placeholder 'EMAIL', give it all register properties using spread operators
                            make it necessary to be filled, and give it validation using regex pattern */}
                            <input
                                className={inputStyles}
                                type="text"
                                placeholder="EMAIL"
                                {...register("email", {
                                    required: true,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                })}
                            />

                            {/* provide error handling to this field. If this field is not filled, return paragraph "This field is required".
                            If invalid email address is given, return paragraph "Invalid email address" */}
                            {errors.email && (
                                <p className="mt-1 text-primary-500">
                                    {errors.email.type === "required" &&
                                        "This field is required."}
                                    {errors.email.type === "pattern" && "Invalid email address."}
                                </p>
                            )}

                            {/* create an text field with placeholder "MESSAGE" with 4 rows and 50 columns and all register properties given
                            it is required to fill this, and at max you can give it 2000 characters */}
                            <textarea
                                className={inputStyles}
                                placeholder="MESSAGE"
                                rows={4}
                                cols={50}
                                {...register("message", {
                                    required: true,
                                    maxLength: 2000,
                                })}
                            />

                            {/* handle errors in the input field. If text field is not filled, return paragraph "This field is required".
                            If number of characters is exceeded, return paragraph "Max length is 2000 characters". */}
                            {errors.message && (
                                <p className="mt-1 text-primary-500">
                                    {errors.message.type === "required" &&
                                        "This field is required."}
                                    {errors.message.type === "maxLength" &&
                                        "Max length is 2000 characters."}
                                </p>
                            )}

                            {/* create a button to submit the form */}
                            <button
                                type="submit"
                                className="mt-5 rounded-lg bg-secondary-500 px-20 py-3 transition duration-500 hover:text-white"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </motion.div>

                    {/* create a motion div that is initially hidden and then it appears when it enters in viewport, animation occurs only once and starts when
                      user scrolls to the point that half of the element can potentially be visible on vieweport, this animation occurs in 0.5 seconds and the
                      animation is that from intial to final state, opacity goes from 0 to 1 and content appears 50px from top */}
                    <motion.div
                        className="relative mt-16 basis-2/5 md:mt-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <div className="w-full before:absolute before:-bottom-20 before:-right-10 before:z-[-1] md:before:content-evolvetext">
                            <img
                                className="w-full"
                                alt="contact-us-page-graphic"
                                src={ContactUsPageGraphic}
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default ContactUs; // export this component to be used elsewhere in the app
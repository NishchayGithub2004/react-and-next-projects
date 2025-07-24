"use client"; /* content written in this file will be rendered only on client side
since this content is not required to run on server side, and content by default
runs on both client and server side, so running it on server side unnecessarily decreases performance */

import Image from "next/image"; // import in-built 'Image' component from 'next' framework to render images
import CustomButton from "./CustomButton"; // import 'CustomButton' component

const Hero = () => {
  // create a function 'handleScroll' to scroll to the next section
  const handleScroll = () => {
    const nextSection = document.getElementById("discover"); // get element with id 'discover'

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" }); // if it exists, scroll to it smoothly
    }
  };

  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">Find, book, rent a car—quick and super easy!</h1>

        <p className="hero__subtitle">Streamline your car rental experience with our effortless booking process.</p>

        {/* create a custom button clicking which activates 'handleScroll' function */}
        <CustomButton
          title="Explore Cars"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero;
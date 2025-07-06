import Navbar from "@/scenes/navbar";
import Home from "@/scenes/home";
import OurClasses from "@/scenes/ourClasses";
import Benefits from "@/scenes/benefits";
import ContactUs from "@/scenes/contactUs";
import Footer from "@/scenes/footer";
import { useEffect, useState } from "react";
import { SelectedPage } from "@/shared/types";

function App() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home); // create a useState hook with 'selectedPage' having initial
  // value of 'SelectedPage.Home' and 'setSelectedPage' as a function to update the current page selected
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true); // create a useState hook with 'isTopOfPage' having initial value of 'true'
  // and 'setIsTopOfPage' as a function to update the current page selected

  useEffect(() => { // create a useEffect hook that runs a function 'handleScroll'
    const handleScroll = () => {
      if (window.scrollY === 0) { // if we are at the top of the page, set 'isTopOfPage' to 'true' and 'selectedPage' to 'SelectedPage.Home' ie home page
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }

      // if we are not at the top of the page, set 'isTopOfPage' to 'false'
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll); // create an event listener for the 'scroll' event that runs the function 'handleScroll'
    return () => window.removeEventListener("scroll", handleScroll); // create a cleanup function that removes the event listener for the 'scroll' event
  }, []); // empty array which means that the effect will only run once when the component mounts

  return (
    <div className="app bg-gray-20">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Home setSelectedPage={setSelectedPage} />
      <Benefits setSelectedPage={setSelectedPage} />
      <OurClasses setSelectedPage={setSelectedPage} />
      <ContactUs setSelectedPage={setSelectedPage} />
      <Footer />
    </div>
  );
}

export default App;
// in this file, a custom hook names 'useMediaQuery' is created

import { useState, useEffect } from "react"; // these two hooks will be used to create the custom hook

const useMediaQuery = (query: string) => { // custom hook named 'useMediaQuery' takes a parameter 'query' as argument which is actually CSS media query string
  const [matches, setMatches] = useState(false); // 'matches' is a state variable which is initialized to false, and 'setMatches' is a function to update the state variable 'matches'

  useEffect(() => { // 'useEffect' hooks is used to perform side effects in functional components
    const media = window.matchMedia(query); // an object of 'MediaQueryList' named 'media' is created using 'matchMedia' method which contains two things:
    // 1) 'media' which is the string value given as argument to 'matchMedia' method like "(max-width: 768px)"
    // 2) 'matches' which is a boolean value which tells whether the given media query matches the current device or not
    // for example: if the device width is 768px then 'matches' will be true, and if the device width is 1024px then 'matches' will be false
    
    // if current match state differs from what it was previously, then update the state variable 'matches' using 'setMatches' function
    // for example, if current value of 'matches' is false, in argument max width is 768px, and now we set to 512px, then 'matches' will be true, otherwise it remains false to avoid unnecessary re-render
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches); // define a function 'listener' which updates the state variable 'matches' with the current value of 'matches' property of 'media' object

    window.addEventListener("resize", listener); // add an event listener that activates 'listener' function when the window is resized
    
    return () => window.removeEventListener("resize", listener); // remove the event listener when the component is unmounted
  }, [matches, query]); // 'useEffect' hook is called with a dependency array '[matches, query]' which means the effect will only run when the value of 'matches' or 'query' changes

  return matches; // return current value of 'matches' state variable so that any component using this hook can know if the media query matches with current screen size or not to know if to re-render or not
};

export default useMediaQuery; // export this custom hook to use it in other parts of the application
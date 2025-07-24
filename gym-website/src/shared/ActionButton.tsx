import React from "react"; // import React library
import AnchorLink from "react-anchor-link-smooth-scroll"; // import 'AnchorLink' component from 'react-anchor-link-smooth-scroll' library
import { SelectedPage } from "./types"; // import 'SelectedPage' enum from 'types.tsx'

// define a type 'Props' that contains a react component node's chilren ie content and a function to update current page selected
type Props = {
  children: React.ReactNode;
  setSelectedPage: (value: SelectedPage) => void;
};
  
// create a functional component 'ActionButton' that takes in destructured 'Props' as parameters
// and returns an 'Anchorlink' element with a click event that updates the current page selected to 'ContactUs'
const ActionButton = ({ children, setSelectedPage }: Props) => {
  return (
    <AnchorLink
      className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white"
      onClick={() => setSelectedPage(SelectedPage.ContactUs)}
      href={`#${SelectedPage.ContactUs}`}
    >
        {children}
    </AnchorLink>
  );
};
  
export default ActionButton; // export the component as default for use in other files
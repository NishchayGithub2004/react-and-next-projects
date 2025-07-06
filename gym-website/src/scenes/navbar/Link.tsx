import { SelectedPage } from "@/shared/types";
import AnchorLink from "react-anchor-link-smooth-scroll";

// create a type 'Props' which contains a string, 'SelectedPage' enum, and a function which takes a selected page as an argument and returns void.
type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

// create a function component 'Link' which takes three destructured props as arguments
const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  // convert 'page' string to lowercase, remove white spaces, manually convert it to 'SelectedPage' enum and assign it to 'lowerCasePage' variable
  // we are assuring typescript compiler that 'lowerCasePage' is a value of one of the components of 'SelectedPage' enum
  const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;

  return (
    // return an anchor link that adds tailwind class 'text-primary-500' if 'selectedPage' is equal to 'lowerCasePage' else no tailwind customization is added
    // clicking this anchor link will smoothly scroll to the section with id equal to 'lowerCasePage' and on clicking it, 'setSelectedPage' function is called w
    // with 'lowerCasePage' as an argument ie clicking this anchor link will set the 'selectedPage' state to 'lowerCasePage'
    <AnchorLink
      className={`${selectedPage === lowerCasePage ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300
      `}
      href={`#${lowerCasePage}`}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
    </AnchorLink>
  );
};

export default Link; // export 'Link' component to be used in other files
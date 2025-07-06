import React from "react";

// define a datatype 'Props' that has a property 'children' of type 'React.ReactNode' ie it expects a React component
type Props = {
  children: React.ReactNode;
};

// create a functional component 'HText' that takes in a prop of type 'Props' and returns a JSX element of type 'h1' and the children prop passed in as the child element of the 'h1' element
const HText = ({ children }: Props) => {
  return (
    <h1 className="basis-3/5 font-montserrat text-3xl font-bold">{children}</h1>
  );
};

export default HText; // export the component
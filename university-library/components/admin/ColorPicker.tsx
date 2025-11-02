import { HexColorInput, HexColorPicker } from "react-colorful"; // import color picker components to enable users to select and input colors in hex format

interface Props { // define TypeScript interface to specify expected props for the ColorPicker component
  value?: string; // define optional value prop to hold currently selected color in hexadecimal format
  onPickerChange: (color: string) => void; // define callback function prop triggered when color changes to update parent component state
}

const ColorPicker = ({ value, onPickerChange }: Props) => { // define functional component to render interactive color picker and input field
  return ( // return JSX structure that provides both manual input and visual selection options for color
    <div className="relative">
      <div className="flex flex-row items-center">
        <p>#</p> {/* display static '#' symbol to indicate hexadecimal color format */}
        <HexColorInput
          color={value} // bind current color value to input field for two-way color state reflection
          onChange={onPickerChange} // trigger parent handler whenever user types or pastes a new hex value
          className="hex-input"
        />
      </div>
      <HexColorPicker color={value} onChange={onPickerChange} /> {/* render color picker allowing users to visually choose a hex color */}
    </div>
  );
};

export default ColorPicker; // export component as default for reuse in forms where color selection is needed

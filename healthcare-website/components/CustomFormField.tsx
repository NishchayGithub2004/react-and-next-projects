/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core"; // import the E164Number type from libphonenumber-js/core to ensure phone numbers conform to international E.164 format for validation and formatting
import Image from "next/image"; // import next.js Image component to optimize and handle responsive image rendering efficiently
import ReactDatePicker from "react-datepicker"; // import date picker component from react-datepicker to allow users to select dates in form fields
import { Control } from "react-hook-form"; // import Control type from react-hook-form to manage form state and validation logic
import PhoneInput from "react-phone-number-input"; // import phone input component to handle user phone number entry with automatic formatting and validation

import { Checkbox } from "./ui/checkbox"; // import custom Checkbox component for boolean user input in form
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"; // import modular form components to structure and validate form inputs consistently
import { Input } from "./ui/input"; // import custom Input component for text-based user input fields
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"; // import Select-related components for dropdown form field creation and interaction
import { Textarea } from "./ui/textarea"; // import custom Textarea component for multi-line text input within forms

export enum FormFieldType { // define an enum named FormFieldType to categorize possible input field types for dynamic form rendering
  INPUT = "input", // define enum value representing a standard text input field
  TEXTAREA = "textarea", // define enum value representing a multiline text area input field
  PHONE_INPUT = "phoneInput", // define enum value representing a phone number input field
  CHECKBOX = "checkbox", // define enum value representing a checkbox input field
  DATE_PICKER = "datePicker", // define enum value representing a date picker input field
  SELECT = "select", // define enum value representing a dropdown select input field
  SKELETON = "skeleton", // define enum value representing a placeholder or loading state for a form field
}

interface CustomProps { // define an interface named CustomProps to specify structure and types of props accepted by a custom form field component
  control: Control<any>; // define a prop to pass react-hook-form's control object for managing field state and validation
  name: string; // define a prop for the unique field name to link input with form state
  label?: string; // define an optional prop for descriptive label text displayed alongside the field
  placeholder?: string; // define an optional prop for placeholder text to guide users before they enter a value
  iconSrc?: string; // define an optional prop for specifying the image source if an icon is displayed in the field
  iconAlt?: string; // define an optional prop for alternative text to describe the field icon for accessibility
  disabled?: boolean; // define an optional prop to disable user interaction with the field when true
  dateFormat?: string; // define an optional prop to customize displayed date format in date picker fields
  showTimeSelect?: boolean; // define an optional prop to toggle inclusion of time selection in date picker fields
  children?: React.ReactNode; // define an optional prop to include nested React elements or components inside the field
  renderSkeleton?: (field: any) => React.ReactNode; // define an optional prop as a function to render a skeleton UI when the field is loading
  fieldType: FormFieldType; // define a required prop that specifies which field type to render based on the FormFieldType enum
}

const RenderInput = ( // define a functional component named 'RenderInput' to render different form field types dynamically based on 'fieldType' prop
  { 
    field, // destructure 'field' to access field value and event handlers provided by react-hook-form
    props // destructure 'props' to access additional configuration and field type information
  }: { 
    field: any; // specify that 'field' can be any type since react-hook-form provides dynamic structure
    props: CustomProps; // specify that 'props' follows the structure defined by the CustomProps interface
  }
) => {
  switch (props.fieldType) { // perform a conditional check on fieldType prop to determine which input component to render
    case FormFieldType.INPUT: // handle rendering logic when fieldType equals 'INPUT'
      return ( // return a standard text input component with optional icon
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && ( // conditionally render icon only if iconSrc is provided to visually enhance input
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"} // use custom alt text if provided, otherwise default to "icon" for accessibility
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field} // spread field properties to bind input value and event handlers with react-hook-form
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.TEXTAREA: // handle rendering logic when fieldType equals 'TEXTAREA'
      return ( // return a textarea input for multiline text entry
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field} // bind field value and event handlers to the textarea for form state control
            className="shad-textArea"
            disabled={props.disabled} // disable textarea if disabled prop is true to prevent user input
          />
        </FormControl>
      );

    case FormFieldType.PHONE_INPUT: // handle rendering logic when fieldType equals 'PHONE_INPUT'
      return ( // return a phone number input field for capturing international numbers
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined} // cast field value to E164Number type for phone formatting consistency
            onChange={field.onChange} // update field value when user changes phone input to sync with form state
            className="input-phone"
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX: // handle rendering logic when fieldType equals 'CHECKBOX'
      return ( // return a checkbox input field with label for boolean user selection
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value} // bind checkbox checked state to form field value for synchronization
              onCheckedChange={field.onChange} // handle checkbox state changes and update form control
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER: // handle rendering logic when fieldType equals 'DATE_PICKER'
      return ( // return a date picker field allowing users to select a date and optionally time
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false} // enable time selection if showTimeSelect is true, otherwise disable
              selected={field.value} // set currently selected date from form field value
              onChange={(date: Date) => field.onChange(date)} // update form state with selected date when user picks a new one
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"} // apply custom date format if provided, otherwise use default
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT: // handle rendering logic when fieldType equals 'SELECT'
      return ( // return a dropdown select component allowing users to choose predefined options
        <FormControl>
          <Select 
            onValueChange={field.onChange} // update form field value when user selects a new option
            defaultValue={field.value} // initialize select field with existing form value
          >
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.SKELETON: // handle rendering logic when fieldType equals 'SKELETON'
      return props.renderSkeleton ? props.renderSkeleton(field) : null; // render skeleton loader if renderSkeleton function is provided, otherwise render nothing

    default: // define default behavior if fieldType does not match any known type
      return null; // return null to render nothing in case of unknown fieldType
  }
};

const CustomFormField = ( // define a functional component named 'CustomFormField' to render a dynamic form field based on provided configuration
  props: CustomProps // specify that the component receives props following the CustomProps interface structure for consistency
) => {
  const { 
    control, // extract the control object from props to connect this field to react-hook-form’s state management and validation system
    name, // extract the name string from props to uniquely identify and register this field within the form structure
    label // extract the optional label from props to display descriptive text for the form field, improving clarity and accessibility
  } = props;  

  return ( // return JSX that defines how the form field should be rendered using react-hook-form and custom UI components
    <FormField 
      control={control} // bind react-hook-form control object to link form state management
      name={name} // assign unique name for field registration and validation tracking
      render={({ field }) => ( // provide a render function that receives 'field' object to connect component with react-hook-form state and handlers
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && ( // conditionally render label only when fieldType is not checkbox and label text is provided to prevent redundant checkbox labels
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput 
            field={field} // pass field object containing form control handlers and value to child input renderer for synchronization
            props={props} // pass all field configuration props to RenderInput for dynamic input type selection
          />

          <FormMessage className="shad-error" /> {/* display validation error message if form field fails validation */}
        </FormItem>
      )}
    />
  );
};

export default CustomFormField; // export CustomFormField as default so it can be imported and used in other components
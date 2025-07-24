"use client"; /* content written in this file will be rendered only on client side
since this content is not required to run on server side, and content by default
runs on both client and server side, so running it on server side unnecessarily decreases performance */

import { Fragment, useState } from "react";
import Image from "next/image"; // import in-built 'Image' component from 'next' framework to render images
import { useRouter } from "next/navigation"; // import in-built 'useRouter' hook from 'next' framework to navigate between pages
import { Listbox, Transition } from "@headlessui/react"; // import 'Listbox' component from '@headlessui/react' library to create custom dropdowns and 'Transition' also to create transitions
import { CustomFilterProps } from "@types"; // import 'CustomFilterProps' type from '@types' directory
import { updateSearchParams } from "@utils"; // import 'updateSearchParams' function from '@utils' directory

// create a functional component 'CustomFilter' and give 'title' and 'options' from 'CustomFilterProps' type as props
export default function CustomFilter({ title, options }: CustomFilterProps) {
    const router = useRouter(); // create an object named 'router' of 'useRouter' hook
    const [selected, setSelected] = useState(options[0]); // create a state named 'selected' and set its initial value to first value in 'options' array and a function named 'setSelected' to update its value

    // create a function named 'handleUpdateParams' that takes an object with 'title' and 'value' as props and creates a new URL with these new parameters and push them to router for navigation
    const handleUpdateParams = (e: { title: string; value: string }) => {
        const newPathName = updateSearchParams(title, e.value.toLowerCase());
        router.push(newPathName);
    };
    
    return (
        <div className='w-fit'>
          {/* create a 'Listbox' dropdown menu with an item selected depending on value of 'selected' and clicking on any other option of dropdown menu selects it and updates URL parameters as per that option */}
          <Listbox value={selected} onChange={(e) => {setSelected(e); handleUpdateParams(e);}}>
            <div className='relative w-fit z-10'>
              <Listbox.Button className='custom-filter__btn'>
                <span className='block truncate'>{selected.title}</span>
                <Image src='/chevron-up-down.svg' width={20} height={20} className='ml-4 object-contain' alt='chevron_up-down' />
              </Listbox.Button>
              {/* create a transition which is a fragment ie all contents in the transition are not wrapped in another DOM element
              it transitions with opacity from 100 to 0 when leaving, in a smooth manner and in 100 millisecond duration */}
              <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                <Listbox.Options className='custom-filter__options'>
                  {/* show all elements of 'options' in their own individual 'ListBox' by iteration 'options' as 'option' with 'title' as key and it's value as value */}
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 px-4 ${
                          active ? "bg-primary-blue text-white" : "text-gray-900"
                        }`
                      }
                      value={option}
                    >
                      {/* selected item is shown in this CSS style */}
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`} >
                            {option.title}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
    );
}
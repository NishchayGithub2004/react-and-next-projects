import { Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { CarProps } from "@types";
import { generateCarImageUrl } from "@utils";

/* create an interface named 'CarDetailsProps' with properties 'isOpen' which takes boolean value, 'closeModal' which takes a void returning function
and 'car' which takes 'CarProps' type and it's properties as values */
interface CarDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: CarProps;
}

const excludedKeys = ['city_mpg', 'combination_mpg', 'highway_mpg']; // since free API doesn't provide these values, we exclude them from the API response

// create a functional component 'CarDetails' which takes destructured props of 'CarDetailsProps' interface
const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => (
  <>
    {/* create a transition that loads as soon as web page mounts but appears only when value of 'isOpen' is true
    and the transition is a framgement ie all elements in the transition are not enclosed in another DOM */}
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        {/* transition is a fragment, which enters in 300 milliseconds from opacity 0 to 100 and leaves in 200 milliseconds from opacity 100 to 0 */}
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            {/* transition is a fragment that enters in 300 milliseconds with opacity 0 to 100 and size from 95% to 100% and leaves in 300
            milliseconds from opacity 100 to 0 and size from 100% to 95% */}
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-out duration-300'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5'>
                <button
                  type='button'
                  className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
                  onClick={closeModal}
                >
                  <Image
                    src='/close.svg'
                    alt='close'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </button>

                <div className='flex-1 flex flex-col gap-3'>
                  <div className='relative w-full h-40 bg-pattern bg-cover bg-center rounded-lg'>
                    <Image src={generateCarImageUrl(car)} alt='car model' fill priority className='object-contain' />
                  </div>
                </div>

                <div className='flex-1 flex flex-col gap-2'>
                  <h2 className='font-semibold text-xl capitalize'>
                    {car.make} {car.model}
                  </h2>

                  <div className='mt-3 flex flex-wrap gap-4'>
                  
                  {Object.entries(car).filter(([key]) => !excludedKeys.includes(key)).map(([key, value]) => (
                      <div className='flex justify-between gap-5 w-full text-right' key={key} >
                        <h4 className='text-grey capitalize'>
                          {key.split("_").join(" ")}
                        </h4>
                        <p className='text-black-100 font-semibold'>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
);

export default CarDetails;
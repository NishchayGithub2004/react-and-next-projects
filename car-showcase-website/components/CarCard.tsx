"use client";

import { useState } from "react";
import Image from "next/image";
import { generateCarImageUrl } from "@utils";
import { CarProps } from "@types";
import CustomButton from "./CustomButton";
import CarDetails from "./CarDetails";

// create an interface 'CarCardProps' having properties of 'CarProps' 
interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => { // create a functional components 'CarCard' having 'CarCardProps' as props
  const { make, model, transmission, drive } = car; // destructure the props

  const [isOpen, setIsOpen] = useState(false); // using 'useState' hook, create a variable 'isOpen' having initial value 'false' and a function 'setIsOpen' to change this value

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>
      </div>

      <div className='relative w-full h-40 -my-10 object-contain'>
        <Image src={generateCarImageUrl(car)} alt='car model' fill priority className='object-contain' />
      </div>

      <div className='relative flex w-full mt-10'>
        <div className='flex group-hover:invisible w-full justify-around text-grey'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image src='/steering-wheel.svg' width={20} height={20} alt='steering wheel' />
            <p className='text-[14px] leading-[17px]'>
              {transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{drive.toUpperCase()}</p>
          </div>
        </div>

        <div className="car-card__btn-container">
          {/* use 'CustomButton' component clicking which sets 'setIsOpen' to true */}
          <CustomButton
            title='View More'
            containerStyles='w-full py-[16px] rounded-full bg-primary-blue'
            textStyles='text-white text-[14px] leading-[17px] font-bold'
            rightIcon='/right-arrow.svg'
            handleClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      
      {/* use 'CarDetails' components clicking which sets 'setIsOpen' to false */}
      <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
    </div>
  );
};

export default CarCard;
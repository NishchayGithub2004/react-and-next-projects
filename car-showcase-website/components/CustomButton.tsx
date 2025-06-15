"use client"; /* content written in this file will be rendered only on client side
since this content is not required to run on server side, and content by default
runs on both client and server side, so running it on server side unnecessarily decreases performance */

import Image from "next/image"; // import in-built 'Image' component from 'next' framework to render images
import { CustomButtonProps } from "@types"; // import 'CustomButtonProps' interface from '@types' directory

const CustomButton = ({ isDisabled, btnType, containerStyles, textStyles, title, rightIcon, handleClick }: CustomButtonProps) => (
    <button disabled={isDisabled} type={btnType || "button"} className={`custom-btn ${containerStyles}`} onClick={handleClick}>
        <span className={`flex-1 ${textStyles}`}>{title}</span>
        {rightIcon && (
            <div className="relative w-6 h-6">
                <Image src={rightIcon} alt="arrow_left" fill className="object-contain"
                />
            </div>
        )}
    </button>
);

export default CustomButton;
"use client"; // mark this file as a Next.js client component to enable hooks and client-side logic

import Image from "next/image"; // import optimized Image component from Next.js for rendering images efficiently
import { usePathname, useRouter } from "next/navigation"; // import hooks to access current route and programmatically navigate between pages
import { useEffect, useState } from "react"; // import React hooks to manage component state and lifecycle side effects

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"; // import custom UI dialog components for modal presentation
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"; // import custom OTP input components for passkey entry
import { decryptKey, encryptKey } from "@/lib/utils"; // import utility functions to handle secure encryption and decryption of stored keys

export const PasskeyModal = () => { // define a functional component named PasskeyModal to manage and verify admin access using a secure passkey
  const router = useRouter(); // initialize router hook to enable client-side navigation actions
  const path = usePathname(); // retrieve current route path to verify access context
  const [open, setOpen] = useState(false); // create state variable to control visibility of modal, initially closed
  const [passkey, setPasskey] = useState(""); // create state variable to store user-entered passkey for validation
  const [error, setError] = useState(""); // create state variable to store error messages when validation fails

  const encryptedKey = // define variable to read encrypted access key from localStorage when running in browser
    typeof window !== "undefined" // check if code is executing in browser environment to safely access localStorage
      ? window.localStorage.getItem("accessKey") // retrieve previously stored encrypted access key from localStorage for authentication
      : null; // set to null when not running in client environment to prevent errors

  useEffect(() => { // use effect to validate stored key and determine whether modal should open or redirect
    const accessKey = encryptedKey && decryptKey(encryptedKey); // decrypt stored key if available to verify user access

    if (path) // ensure pathname is available before performing route-based logic
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) { // check if decrypted key matches admin passkey stored in environment variable for secure access control
        setOpen(false); // close modal when valid passkey is detected to allow admin access
        router.push("/admin"); // navigate user to admin dashboard after successful authentication
      } else {
        setOpen(true); // open modal if no valid access key exists to prompt for passkey entry
      }
  }, [encryptedKey]); // re-run validation whenever encryptedKey changes to reflect updates in localStorage

  const closeModal = () => { // define function to close modal and redirect to home page when user cancels or exits
    setOpen(false); // set modal visibility to false to close it
    router.push("/"); // redirect user to homepage for safe exit
  };

  const validatePasskey = ( // define function to validate user-entered passkey and handle authentication logic
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> // accept click event argument to prevent default form submission behavior
  ) => {
    e.preventDefault(); // prevent default button click behavior to manage validation manually

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) { // compare entered passkey with environment-stored admin passkey for secure validation
      const encryptedKey = encryptKey(passkey); // encrypt entered passkey before saving to localStorage to maintain security

      localStorage.setItem("accessKey", encryptedKey); // persist encrypted access key in localStorage for future access sessions

      setOpen(false); // close modal after successful validation
    } else {
      setError("Invalid passkey. Please try again."); // set error message when user input fails validation to provide feedback
    }
  };

  return ( // return JSX to render passkey modal for admin authentication
    <AlertDialog open={open} onOpenChange={setOpen}> 
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()} // attach click handler to trigger modal close function when user clicks close icon
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)} // update local passkey state whenever user enters or edits OTP digits
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && ( // conditionally render error text only when error message exists to inform user of incorrect passkey entry
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)} // trigger passkey validation process when user clicks the confirm button
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

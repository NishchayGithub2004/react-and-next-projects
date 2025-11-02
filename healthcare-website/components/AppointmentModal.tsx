"use client"; // enable client-side rendering so the component runs in the browser environment

import { useState } from "react"; // import React hook to manage local component state

import { Button } from "@/components/ui/button"; // import reusable Button component for user interaction
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // import Dialog UI components for modal functionality
import { Appointment } from "@/types/appwrite.types"; // import Appointment type for type safety and prop validation

import { AppointmentForm } from "./forms/AppointmentForm"; // import custom form component used inside the modal

import "react-datepicker/dist/react-datepicker.css"; // import CSS styles for datepicker used within appointment form

// define a functional component named 'AppointmentModal' to display a modal for scheduling or canceling appointments which takes following props
export const AppointmentModal = ({
  patientId, // unique identifier for the patient related to this appointment
  userId, // unique identifier of the logged-in user performing the action
  appointment, // optional appointment object for editing or canceling existing booking
  type, // defines action type — either "schedule" or "cancel"
}: {
  patientId: string; // declare prop type as string for patient identifier
  userId: string; // declare prop type as string for user identifier
  appointment?: Appointment; // make appointment prop optional to allow new scheduling
  type: "schedule" | "cancel"; // restrict action type to two valid string options
  title: string; // specify title text prop to show on modal header
  description: string; // specify descriptive text to explain modal purpose
}) => {
  const [open, setOpen] = useState(false); // define state to track modal open/close status and allow controlled behavior

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* render modal dialog that opens or closes based on state value */}
      <DialogTrigger asChild> {/* render trigger element as child to enable button to control modal */}
        <Button
          variant="ghost" // set button style to minimal ghost variant
          className={`capitalize ${type === "schedule" && "text-green-500"}`} // dynamically apply green text if scheduling
        >
          {type} {/* display button text as action type (schedule or cancel) */}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md"> {/* define modal content container with custom styling */}
        <DialogHeader className="mb-4 space-y-3"> {/* render header section for title and description */}
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle> {/* display modal title with capitalized action */}
          <DialogDescription>
            Please fill in the following details to {type} appointment {/* show dynamic instruction text for chosen action */}
          </DialogDescription>
        </DialogHeader>

        {/* define a functional component named 'AppointmentForm' to render the interactive form inside modal which takes following props */}
        <AppointmentForm
          userId={userId} // pass current user’s ID to associate the appointment with correct account
          patientId={patientId} // pass patient ID so form knows which patient data to link
          type={type} // pass form action type (schedule or cancel) to change behavior accordingly
          appointment={appointment} // provide appointment object when editing or canceling existing appointment
          setOpen={setOpen} // pass function to allow form to close modal upon submission or cancel
        />
      </DialogContent>
    </Dialog>
  );
};

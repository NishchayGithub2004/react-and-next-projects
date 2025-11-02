"use client"; // enable client-side rendering so this module executes in the browser

import { ColumnDef } from "@tanstack/react-table"; // import type to define column structure for react-table
import Image from "next/image"; // import Next.js image component for optimized doctor images

import { Doctors } from "@/constants"; // import constant array containing doctor details
import { formatDateTime } from "@/lib/utils"; // import helper function to format appointment dates
import { Appointment } from "@/types/appwrite.types"; // import Appointment type for consistent data typing

import { AppointmentModal } from "../AppointmentModal"; // import modal component used for scheduling or canceling appointments
import { StatusBadge } from "../StatusBadge"; // import component to display appointment status visually

export const columns: ColumnDef<Appointment>[] = [ // define an array of column configurations for Appointment table
  {
    header: "#", // define column header label for row index
    cell: ({ row }) => { // render function for each cell in this column
      return <p className="text-14-medium ">{row.index + 1}</p>; // display 1-based row number inside a paragraph
    },
  },
  {
    accessorKey: "patient", // define data key to access patient information in appointment object
    header: "Patient", // label the column as 'Patient'
    cell: ({ row }) => { // render each patient name dynamically
      const appointment = row.original; // extract full appointment data from current row
      return <p className="text-14-medium ">{appointment.patient.name}</p>; // display patient's name with medium text style
    },
  },
  {
    accessorKey: "status", // define data key to access status value
    header: "Status", // label column header as 'Status'
    cell: ({ row }) => { // render function for status badge
      const appointment = row.original; // extract appointment object from row
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} /> {/* render status badge to visually indicate appointment status */}
        </div>
      );
    },
  },
  {
    accessorKey: "schedule", // define key to access appointment schedule
    header: "Appointment", // label header for appointment date and time
    cell: ({ row }) => { // render formatted date and time
      const appointment = row.original; // extract appointment data from row
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime} {/* format and display readable date/time using utility */}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician", // define key for accessing doctor's name
    header: "Doctor", // label column as 'Doctor'
    cell: ({ row }) => { // render doctor details for each appointment
      const appointment = row.original; // extract full appointment data from current row

      const doctor = Doctors.find( // find matching doctor object from constants list
        (doctor) => doctor.name === appointment.primaryPhysician // match doctor name with appointment’s assigned physician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!} // render doctor’s image dynamically based on matched record
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p> {/* display doctor's name prefixed with Dr. */}
        </div>
      );
    },
  },
  {
    id: "actions", // assign custom column ID for action buttons
    header: () => <div className="pl-4">Actions</div>, // render static header element labeled 'Actions'
    cell: ({ row }) => { // render interactive action buttons for each appointment
      const appointment = row.original; // extract appointment data for modal props

      return (
        <div className="flex gap-1">
          {/* define a functional component named 'AppointmentModal' to open scheduling modal which takes following props */}
          <AppointmentModal
            patientId={appointment.patient.$id} // pass patient’s unique ID for scheduling action
            userId={appointment.userId} // pass logged-in user ID to associate with action
            appointment={appointment} // provide complete appointment data to modal
            type="schedule" // specify modal action type as scheduling
            title="Schedule Appointment" // set modal title for scheduling confirmation
            description="Please confirm the following details to schedule." // define descriptive text for scheduling modal
          />
          {/* define another 'AppointmentModal' component for canceling appointment */}
          <AppointmentModal
            patientId={appointment.patient.$id} // pass patient ID for cancel action
            userId={appointment.userId} // include user ID for validation
            appointment={appointment} // send current appointment data
            type="cancel" // specify modal type as cancellation
            title="Cancel Appointment" // title shown on cancel modal
            description="Are you sure you want to cancel your appointment?" // ask confirmation before canceling
          />
        </div>
      );
    },
  },
];

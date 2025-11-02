import Image from "next/image"; // import optimized image component from Next.js for efficient image rendering
import Link from "next/link"; // import client-side navigation component for internal routing

import { Button } from "@/components/ui/button"; // import reusable button component for consistent styling
import { Doctors } from "@/constants"; // import static list of doctor information for lookups
import { getAppointment } from "@/lib/actions/appointment.actions"; // import async function to fetch appointment data by ID
import { formatDateTime } from "@/lib/utils"; // import utility to format appointment date and time into readable text

const RequestSuccess = async ({ // define asynchronous functional component named 'RequestSuccess' to show confirmation screen
  searchParams, // object containing query parameters from URL, used to get appointment ID
  params: { userId }, // extract dynamic route parameter 'userId' for linking new appointment action
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || ""; // extract appointment ID from search params or set empty string if missing
  const appointment = await getAppointment(appointmentId); // fetch appointment data from database using ID to display confirmation details

  const doctor = Doctors.find( // find doctor record corresponding to the appointment’s primary physician
    (doctor) => doctor.name === appointment.primaryPhysician // match doctor by name to retrieve associated info and image
  );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/"> {/* render clickable logo to return to homepage */}
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted! {/* confirm appointment request submission */}
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p> {/* notify user about upcoming confirmation */}
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p> {/* introduce details section */}
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!} // dynamically render doctor’s image based on fetched record
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p> {/* show doctor's name dynamically */}
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p> {/* format and display appointment schedule using helper function */}
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild> {/* render styled button linking to new appointment page */}
          <Link href={`/patients/${userId}/new-appointment`}> {/* dynamically link to new appointment page for the same user */}
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess; // export component as default for routing

import Image from "next/image"; // import optimized image component from Next.js for automatic image optimization

import { AppointmentForm } from "@/components/forms/AppointmentForm"; // import appointment form component to handle creating or editing appointments
import { getPatient } from "@/lib/actions/patient.actions"; // import async action to fetch patient data by ID

const Appointment = async ({ // define asynchronous functional component named 'Appointment' to render appointment creation screen
  params: { userId }, // extract 'userId' from dynamic route parameters for fetching specific patient data
}: SearchParamProps) => {
  const patient = await getPatient(userId); // fetch patient record using the provided userId to prefill appointment form data

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient?.$id} // dynamically pass patient ID from fetched data to prepopulate form
            userId={userId} // pass user ID to associate appointment with the correct user
            type="create" // specify form mode as 'create' to handle new appointment creation
          />

          <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment; // export Appointment component as default for page routing

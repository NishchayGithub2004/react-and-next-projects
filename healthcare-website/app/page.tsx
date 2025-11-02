import Image from "next/image"; // import next.js image component for optimized image rendering
import Link from "next/link"; // import link component for client-side navigation without page reload

import { PatientForm } from "@/components/forms/PatientForm"; // import patient form component for collecting patient details
import { PasskeyModal } from "@/components/PasskeyModal"; // import modal component used for admin authentication via passkey

const Home = ({ searchParams }: SearchParamProps) => { // define functional component named 'Home' for landing page which accepts searchParams to check admin mode
  const isAdmin = searchParams?.admin === "true"; // check if query parameter 'admin' is set to 'true' to determine if admin mode should be enabled

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />} {/* conditionally render passkey modal only when admin mode is active */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm /> {/* render form for user to input personal or medical details */}

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link> {/* link to reload page with admin mode enabled */}
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home; // export Home component as default for routing entry point

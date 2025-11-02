import Image from "next/image"; // import optimized image component from Next.js for better performance
import { redirect } from "next/navigation"; // import redirect helper to programmatically navigate on the server

import RegisterForm from "@/components/forms/RegisterForm"; // import registration form component for new patient signup
import { getPatient, getUser } from "@/lib/actions/patient.actions"; // import async actions to fetch user and patient data from backend

const Register = async ({ // define asynchronous functional component named 'Register' to handle patient registration flow
  params: { userId }, // extract 'userId' from dynamic route parameters for identifying the current user
}: SearchParamProps) => {
  const user = await getUser(userId); // fetch user details using userId to populate registration form with user info
  
  const patient = await getPatient(userId); // fetch patient record using userId to check if user already registered

  if (patient) redirect(`/patients/${userId}/new-appointment`); // if patient already exists, redirect to appointment creation page

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} /> {/* render registration form component and pass fetched user data as prop */}

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register; // export Register component as default for routing in Next.js

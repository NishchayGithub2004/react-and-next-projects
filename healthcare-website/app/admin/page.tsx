import Image from "next/image"; // import Next.js optimized image component for rendering the logo
import Link from "next/link"; // import Link component to enable client-side navigation

import { StatCard } from "@/components/StatCard"; // import reusable card component for displaying statistics
import { columns } from "@/components/table/columns"; // import column definitions for the data table
import { DataTable } from "@/components/table/DataTable"; // import table component to render appointment data
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions"; // import server-side action to fetch recent appointment data

const AdminPage = async () => { // define asynchronous functional component to render admin dashboard
  const appointments = await getRecentAppointmentList(); // fetch recent appointment list and counts from database for display

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer"> {/* create clickable logo linking to home page */}
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p> {/* display dashboard title */}
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1> {/* greet admin user */}
          <p className="text-dark-700">
            Start the day with managing new appointments {/* provide dashboard context */}
          </p>
        </section>

        <section className="admin-stat">
          {/* define a functional component named 'StatCard' to display key statistics for appointments which takes following props */}
          <StatCard
            type="appointments" // specify type for identifying stat card category
            count={appointments.scheduledCount} // pass total number of scheduled appointments dynamically from data
            label="Scheduled appointments" // provide label text for the statistic
            icon={"/assets/icons/appointments.svg"} // specify icon path for visual context
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount} // pass dynamically fetched pending appointment count
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount} // pass dynamically fetched cancelled appointment count
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} /> {/* render data table using fetched appointment data */}
      </main>
    </div>
  );
};

export default AdminPage; // export AdminPage as default component for admin route

import { Session } from "next-auth"; // import Session type from next-auth to type-check session data received as prop

const Header = ({ session }: { session: Session }) => { // define Header component that takes a session object to display user-specific information
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          {session?.user?.name} {/* dynamically display the logged-in user's name from session for personalized header */}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and books here
        </p>
      </div>
    </header>
  );
};
export default Header; // export Header component for use in admin layout or dashboard pages

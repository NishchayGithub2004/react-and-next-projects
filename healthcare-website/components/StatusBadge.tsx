import clsx from "clsx"; // import clsx to dynamically merge class names based on the current status value for conditional styling
import Image from "next/image"; // import Next.js Image component to efficiently render and optimize icons or images

import { StatusIcon } from "@/constants"; // import StatusIcon mapping object that associates each status type with its corresponding icon path

export const StatusBadge = ( // define a functional component named 'StatusBadge' to display a colored badge and icon representing a status
  { status }: { status: Status } // destructure status prop from props and type it as 'Status' to enforce valid status values
) => {
  return ( // return JSX that visually displays a badge indicating current status type through color and icon
    <div
      className={clsx("status-badge", { // dynamically assign background color class based on the current status to visually differentiate states
        "bg-green-600": status === "scheduled", // apply green background when status is 'scheduled' to signify confirmed or active
        "bg-blue-600": status === "pending", // apply blue background when status is 'pending' to indicate waiting or in-progress
        "bg-red-600": status === "cancelled", // apply red background when status is 'cancelled' to mark it as inactive or terminated
      })}
    >
      <Image
        src={StatusIcon[status]} // dynamically select the appropriate icon based on the current status from StatusIcon mapping
        alt="doctor" // define alt text for accessibility and SEO compliance
        width={24} // specify image width to maintain layout stability and optimize performance
        height={24} // specify image height for consistent image sizing within the badge
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", { // dynamically apply text color based on current status to visually match its background
          "text-green-500": status === "scheduled", // apply green text color for scheduled status to match visual context
          "text-blue-500": status === "pending", // apply blue text color for pending status to indicate process state
          "text-red-500": status === "cancelled", // apply red text color for cancelled status to reflect error or termination
        })}
      >
        {status} {/* render the actual status text so the user can read the current state of this item */}
      </p>
    </div>
  );
};

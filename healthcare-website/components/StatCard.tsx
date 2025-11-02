import clsx from "clsx"; // import clsx utility to conditionally combine multiple class names dynamically based on logic
import Image from "next/image"; // import Next.js Image component to render optimized images for better performance and responsiveness

type StatCardProps = { // define TypeScript type for props accepted by the StatCard component to ensure proper prop structure
  type: "appointments" | "pending" | "cancelled"; // define prop to specify the category type which affects background color and visual style
  count: number; // define numeric prop to display count value representing quantity or total
  label: string; // define text prop for descriptive label explaining what the count represents
  icon: string; // define string prop for icon path to visually represent the card’s type
};

export const StatCard = ( // define functional component named 'StatCard' to display a styled statistics card with dynamic background and content
  { 
    count = 0, // destructure count prop with default value 0 to ensure a valid numeric display when undefined
    label, // destructure label prop to show descriptive text for the statistic
    icon, // destructure icon prop to render associated icon image for the stat type
    type // destructure type prop to determine background color class dynamically
  }: StatCardProps // apply the StatCardProps type to enforce prop type safety
) => {
  return ( // return JSX that renders a styled card displaying statistical data and icon
    <div
      className={clsx("stat-card", { // use clsx to dynamically assign background class based on stat type for contextual color coding
        "bg-appointments": type === "appointments", // apply appointments background if type is 'appointments' for visual distinction
        "bg-pending": type === "pending", // apply pending background if type is 'pending' to indicate items awaiting completion
        "bg-cancelled": type === "cancelled", // apply cancelled background if type is 'cancelled' to reflect inactive or removed entries
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon} // provide dynamic source path for the icon image to visually represent this stat card type
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

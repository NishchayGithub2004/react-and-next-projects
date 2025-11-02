import Link from "next/link"; // import next.js link component for client-side navigation
import Image from "next/image"; // import next.js optimized image component for efficient image rendering

interface Props { // define type for props to ensure strong typing of component inputs
  accountId: string; // unique id of the profile being viewed
  authUserId: string; // unique id of the currently authenticated user
  name: string; // full name of the profile owner
  username: string; // username handle of the profile owner
  imgUrl: string; // url of the profile image
  bio: string; // short biography or description of the user
  type?: string; // optional prop to identify profile type (e.g., Community or User)
}

function ProfileHeader({ // define a functional component named 'ProfileHeader' to display user profile header details
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) {
  return ( // return jsx structure for profile header layout
    <div className='flex w-full flex-col justify-start'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={imgUrl} // set profile image source from provided imgUrl
              alt='logo'
              fill // fill container area with image for responsive scaling
              className='rounded-full object-cover shadow-2xl' // apply circular crop and shadow for visual design
            />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-light-1'>
              {name} {/* render user's display name */}
            </h2>
            <p className='text-base-medium text-gray-1'>@{username}</p> {/* render user's username with '@' prefix */}
          </div>
        </div>

        {accountId === authUserId && type !== "Community" && ( // check if authenticated user owns this profile and is not a community profile
          <Link href='/profile/edit'> {/* navigate to profile edit page when clicked */}
            <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={16}
                height={16}
              />

              <p className='text-light-2 max-sm:hidden'>Edit</p> {/* render 'Edit' text label, hidden on small screens */}
            </div>
          </Link>
        )}
      </div>

      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p> {/* render user's biography text */}

      <div className='mt-12 h-0.5 w-full bg-dark-3' /> {/* render visual divider below profile section */}
    </div>
  );
}

export default ProfileHeader; // export ProfileHeader component for use in user or community profile pages

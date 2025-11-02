import Image from "next/image"; // import next/image for optimized image rendering and lazy loading
import Link from "next/link"; // import next/link for client-side navigation between community pages

import { Button } from "../ui/button"; // import reusable button component for consistent design and interaction

interface Props { // define Props interface to specify expected input data for the component
  id: string; // store unique community id for linking and identification
  name: string; // store display name of the community
  username: string; // store handle or username associated with the community
  imgUrl: string; // store URL of community’s logo or image
  bio: string; // store short description or bio of the community
  members: { // define list of community members to display profile pictures
    image: string; // store URL of each member’s profile image
  }[];
}

// define a functional component named 'CommunityCard' to display community info and member previews which takes following props
function CommunityCard({ id, name, username, imgUrl, bio, members }: Props) {
  return (
    <article className='community-card'>
      <div className='flex flex-wrap items-center gap-3'>
        <Link href={`/communities/${id}`} className='relative h-12 w-12'> 
          <Image
            src={imgUrl} // use community image from props to visually represent the group
            alt='community_logo' // provide alt text for accessibility
            fill // enable automatic width and height adjustment to container size
            className='rounded-full object-cover'
          />
        </Link>

        <div>
          <Link href={`/communities/${id}`}> 
            <h4 className='text-base-semibold text-light-1'>{name}</h4> 
          </Link>
          <p className='text-small-medium text-gray-1'>@{username}</p> 
        </div>
      </div>

      <p className='mt-4 text-subtle-medium text-gray-1'>{bio}</p> 

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Link href={`/communities/${id}`}> 
          <Button size='sm' className='community-card_btn'> 
            View 
          </Button> 
        </Link>

        {members.length > 0 && ( // conditionally render member avatars only if community has members
          <div className='flex items-center'>
            {members.map((member, index) => ( // iterate over members array to render each member image
              <Image
                key={index} // assign unique key to each image for React list rendering
                src={member.image} // display each member’s profile image from the list
                alt={`user_${index}`} // dynamically label each image for accessibility
                width={28} // set fixed width to maintain uniform avatar size
                height={28} // set fixed height matching width for a circular avatar
                className={`${index !== 0 && "-ml-2"} rounded-full object-cover`} // slightly overlap images to show group effect
              />
            ))}
            {members.length > 3 && ( // if more than 3 members exist, show member count summary
              <p className='ml-1 text-subtle-medium text-gray-1'>
                {members.length}+ Users 
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard; // export the component for use in community list or search pages

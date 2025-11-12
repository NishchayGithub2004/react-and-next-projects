"use client"; // mark this file as a client component to allow use of hooks and client-side navigation

import Image from "next/image"; // import next/image to optimize user or community image rendering
import { useRouter } from "next/navigation"; // import useRouter hook for programmatic page navigation

import { Button } from "../ui/button"; // import custom button component for consistent design

interface Props { // define Props interface specifying data required to render a user or community card
  id: string; // store unique id of the user or community for routing
  name: string; // store display name to show on the card
  username: string; // store username to display with '@' prefix
  imgUrl: string; // store image URL to display profile or logo
  personType: string; // determine whether the card belongs to a 'User' or 'Community'
}

// define a functional component named 'UserCard' to display a user or community card with navigation based on type which takes following props
function UserCard({ id, name, username, imgUrl, personType }: Props) {
  const router = useRouter(); // initialize next.js router to enable redirecting on button click

  const isCommunity = personType === "Community"; // check if current card represents a community to decide navigation path

  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <div className='relative h-12 w-12'>
          <Image
            src={imgUrl} // display user or community profile image
            alt='user_logo'
            fill
            className='rounded-full object-cover'
          />
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4> 
          <p className='text-small-medium text-gray-1'>@{username}</p> 
        </div>
      </div>

      <Button
        className='user-card_btn'
        onClick={() => { // attach click event handler to navigate dynamically
          if (isCommunity) { // check if entity is a community before routing
            router.push(`/communities/${id}`); // navigate to community page using its id
          } else { 
            router.push(`/profile/${id}`); // navigate to user profile page using user id
          }
        }}
      >
        View 
      </Button>
    </article>
  );
}

export default UserCard; // export component for use in people and community lists

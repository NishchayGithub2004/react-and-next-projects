'use client';

import { useState } from 'react'; // import useState hook to manage local state

import { 
    CallControls, // import component to provide call control buttons like mute, leave, etc.
    CallParticipantsList, // import component to display the list of participants in the call
    CallStatsButton, // import component to show call statistics like network and quality
    CallingState, // import enum to track different calling states like JOINED, LEFT, etc.
    PaginatedGridLayout, // import layout component for grid view of participants
    SpeakerLayout, // import layout component for speaker-focused view of participants
    useCallStateHooks, // import hook to access call state hooks like useCallCallingState
} from '@stream-io/video-react-sdk'; // import all above from the Stream Video React SDK

import { useRouter, useSearchParams } from 'next/navigation'; // import router and URL query hooks
import { Users, LayoutList } from 'lucide-react'; // import icons
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'; // import dropdown menu components
import Loader from './Loader'; // import Loader component for loading state
import EndCallButton from './EndCallButton'; // import button to end call
import { cn } from '@/lib/utils'; // import utility function for conditional classNames

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'; // define type for layout options

const MeetingRoom = () => {
    const searchParams = useSearchParams(); // get URL search parameters

    const isPersonalRoom = !!searchParams.get('personal'); // determine if the room is personal

    const router = useRouter(); // initialize router for programmatic navigation

    const [layout, setLayout] = useState<CallLayoutType>('speaker-left'); // manage current call layout

    const [showParticipants, setShowParticipants] = useState(false); // manage participants list visibility

    const { useCallCallingState } = useCallStateHooks(); // get hook to check calling state

    const callingState = useCallCallingState(); // retrieve current calling state

    if (callingState !== CallingState.JOINED) return <Loader />; // show loader until call is joined

    const CallLayout = () => {
        switch (layout) { // switch layout based on current state
            case 'grid':
                return <PaginatedGridLayout />; 
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />; 
            default:
                return <SpeakerLayout participantsBarPosition="right" />; 
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <div className="relative flex size-full items-center justify-center">
                <div className=" flex size-full max-w-[1000px] items-center">
                    <CallLayout /> 
                </div>
                <div
                    className={cn('h-[calc(100vh-86px)] hidden ml-2', {
                        'show-block': showParticipants, // show/hide participants list based on state
                    })}
                >
                    <CallParticipantsList onClose={() => setShowParticipants(false)} /> 
                </div>
            </div>
            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
                <CallControls onLeave={() => router.push(`/`)} /> {/* navigate home on leave */}
                <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
                            <LayoutList size={20} className="text-white" />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setLayout(item.toLowerCase() as CallLayoutType) // update layout state when menu item is clicked
                                    }
                                >
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="border-dark-1" />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton /> 
                <button onClick={() => setShowParticipants((prev) => !prev)}> {/* toggle participants list visibility */}
                    <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
                        <Users size={20} className="text-white" />
                    </div>
                </button>
                {!isPersonalRoom && <EndCallButton />} {/* conditionally show end call button for non-personal rooms */}
            </div>
        </section>
    );
};

export default MeetingRoom;

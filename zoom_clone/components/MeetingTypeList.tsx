'use client';

import { useState } from 'react'; // import useState hook to manage local state
import { useRouter } from 'next/navigation'; // import router for programmatic navigation

import HomeCard from './HomeCard'; // import card component for meeting options
import MeetingModal from './MeetingModal'; // import modal component for creating/joining meetings
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'; // import Call type and Stream Video client hook
import { useUser } from '@clerk/nextjs'; // import hook to get current authenticated user
import Loader from './Loader'; // import Loader component for loading state
import { Textarea } from './ui/textarea'; // import custom Textarea component
import ReactDatePicker from 'react-datepicker'; // import date picker component
import { useToast } from './ui/use-toast'; // import custom toast hook for notifications
import { Input } from './ui/input'; // import custom Input component

const initialValues = {
    dateTime: new Date(), // default date/time to current date/time
    description: '', // default description is empty
    link: '', // default meeting link is empty
};

const MeetingTypeList = () => {
    const router = useRouter(); // initialize router for navigation
    const [meetingState, setMeetingState] = useState<
        'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
    >(undefined); // track which type of meeting modal is open
    const [values, setValues] = useState(initialValues); // store user input for meeting details
    const [callDetail, setCallDetail] = useState<Call>(); // store created call object
    const client = useStreamVideoClient(); // get Stream Video client instance
    const { user } = useUser(); // get current authenticated user
    const { toast } = useToast(); // initialize toast for notifications

    const createMeeting = async () => {
        if (!client || !user) return; // ensure client and user are available
        try {
            if (!values.dateTime) {
                toast({ title: 'Please select a date and time' }); // show error if date/time is missing
                return;
            }
            const id = crypto.randomUUID(); // generate unique meeting ID
            const call = client.call('default', id); // create call instance
            if (!call) throw new Error('Failed to create meeting'); // throw error if call creation fails
            const startsAt =
                values.dateTime.toISOString() || new Date(Date.now()).toISOString(); // get ISO string for meeting start
            const description = values.description || 'Instant Meeting'; // fallback description if empty
            await call.getOrCreate({
                data: {
                    starts_at: startsAt, // set meeting start time
                    custom: {
                        description, // set custom meeting description
                    },
                },
            });
            setCallDetail(call); // store call object in state
            if (!values.description) {
                router.push(`/meeting/${call.id}`); // navigate directly if it's an instant meeting
            }
            toast({
                title: 'Meeting Created', // show success toast
            });
        } catch (error) {
            console.error(error); // log error
            toast({ title: 'Failed to create Meeting' }); // show failure toast
        }
    };

    if (!client || !user) return <Loader />; // show loader until client and user are available

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`; // construct meeting link if call exists

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')} // open instant meeting modal
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                className="bg-blue-1"
                handleClick={() => setMeetingState('isJoiningMeeting')} // open join meeting modal
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                className="bg-purple-1"
                handleClick={() => setMeetingState('isScheduleMeeting')} // open schedule meeting modal
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Meeting Recordings"
                className="bg-yellow-1"
                handleClick={() => router.push('/recordings')} // navigate to recordings page
            />

            {!callDetail ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'} // open modal only if schedule meeting is selected
                    onClose={() => setMeetingState(undefined)} // reset modal state on close
                    title="Create Meeting"
                    handleClick={createMeeting} // call function to create meeting
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base font-normal leading-[22.4px] text-sky-2">
                            Add a description
                        </label>
                        <Textarea
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) =>
                                setValues({ ...values, description: e.target.value }) // update description in state
                            }
                        />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label className="text-base font-normal leading-[22.4px] text-sky-2">
                            Select Date and Time
                        </label>
                        <ReactDatePicker
                            selected={values.dateTime} // bind date picker to state
                            onChange={(date) => setValues({ ...values, dateTime: date! })} // update date/time in state
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink); // copy meeting link to clipboard
                        toast({ title: 'Link Copied' }); // show toast notification
                    }}
                    image={'/icons/checked.svg'}
                    buttonIcon="/icons/copy.svg"
                    className="text-center"
                    buttonText="Copy Meeting Link"
                />
            )}

            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'} // open modal for joining meeting
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)} // navigate to meeting link typed by user
            >
                <Input
                    placeholder="Meeting link"
                    onChange={(e) => setValues({ ...values, link: e.target.value })} // store meeting link in state
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </MeetingModal>

            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'} // open modal for instant meeting
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting} // create instant meeting on click
            />
        </section>
    );
};

export default MeetingTypeList;

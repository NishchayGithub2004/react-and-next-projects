import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
    return (
        <section className="flex size-full flex-col gap-5 text-white">
            <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
                <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold lg:text-7xl">ZOOM</h1>
                        <p className="text-lg font-medium text-sky-1 lg:text-2xl">Bringing the world closer</p>
                    </div>
                </div>
            </div>
            <MeetingTypeList />
        </section>
    );
};

export default Home;
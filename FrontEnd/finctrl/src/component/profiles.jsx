import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { LoadingIcon } from "../components/ui/loading-icon"


const EventCard = ({ eventName, dateofevent, description, status }) => {
  return (
    <div className="border rounded-lg p-4 w-72 shadow-sm h-80">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold mt-5">{eventName}</h3>
        <Eye className="text-gray-500 mt-4" />
      </div>

      <div className="text-xl font-bold mb-10 -mt-3">{new Date(dateofevent).toDateString()}</div>

      <div className="text-sm text-gray-500">{description}</div>

      <div className="flex justify-between items-center mt-30">
        <div className='-mt-20'>
          <div className={`text-sm ${status ? 'text-green-500' : 'text-red-500'}`}>
            status : {status ? 'Active' : 'Inactive'}
          </div>
          <button className="text-blue-500 hover:underline mt-4">
            View Event Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [events, setEvents] = useState([]);
  const [randomEvent, setRandomEvent] = useState(null);

  useEffect(() => {
    fetch('https://fin-ctrl-1.onrender.com/FinCtrl/event?isPublic=true') // Fetch only public events
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) {
          setRandomEvent(data[Math.floor(Math.random() * data.length)]); // Pick a random event
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="p-6">
      <div className=" justify-evenly flex flex-wrap gap-4">
        {events.length > 0 ? (
          events.map((event, index) => <EventCard key={index} {...event} />)
        ) : (
          <div className="col-span-full flex justify-center items-center h-64">
            <LoadingIcon size={58} color="border-l-indigo-500" />
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">
          Show more
        </button>
      </div>
    </div>
  );
};

export default Profile;

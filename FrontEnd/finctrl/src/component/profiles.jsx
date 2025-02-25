import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { LoadingIcon } from "../components/ui/loading-icon";

const EventCard = ({ eventName, dateofevent, description, ispublic }) => {
  return (
    <div className="border rounded-lg p-4 w-72 shadow-sm hover:shadow-md transition-shadow duration-200 h-70">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold mt-5 line-clamp-2">{eventName}</h3>
        <Eye className="text-gray-500 mt-4 h-5 w-5" />
      </div>

      <div className="text-xl font-bold mb-10 -mt-3">
        {new Date(dateofevent).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      <div className="text-sm text-gray-500 line-clamp-3">{description}</div>

      <div className="absolute mt-6 -ml-3">
        <button 
          className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2"
        >
          View Event Details
        </button>
      </div>
    </div>
  );
};

const Profiles = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event?ispublic=true");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const publicEvents = data.filter(event => event.ispublic);
        setEvents(publicEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">😕</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Public Events</h1>
      
      <div className="justify-evenly flex flex-wrap gap-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <LoadingIcon size={58} color="border-l-indigo-500" />
          </div>
        ) : events.length > 0 ? (
          events.map(event => (
            <EventCard
              key={event._id}
              {...event}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 w-full py-12">
            <p className="text-xl mb-2">No public events found</p>
            <p className="text-sm">Check back later for upcoming events</p>
          </div>
        )}
      </div>

      {events.length > 0 && (
        <div className="text-center mt-8">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default Profiles;
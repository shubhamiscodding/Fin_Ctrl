import React, { useEffect, useState } from "react";
import { Eye, Calendar, Clock, MapPin, Users } from "lucide-react";
import { LoadingIcon } from "../components/ui/loading-icon";
import { Link } from "react-router-dom";

const EventCard = ({ eventName, dateofevent, description, _id, location, participants }) => {
  const formattedDate = new Date(dateofevent).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(dateofevent).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 line-clamp-2">{eventName}</h3>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">Public</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">{formattedTime}</span>
          </div>
          {location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          {participants && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">{participants} participants</span>
            </div>
          )}
        </div>

        <div className="text-gray-500 text-sm line-clamp-3 mb-6">{description}</div>

        <Link to={`/publicevent/${_id}`}>
          <button className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

const Profiles = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view public events.");
        }

        const response = await fetch("https://fin-ctrl-1.onrender.com/events/public", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
          if (response.status === 404) throw new Error("No public events found.");
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const eventList = Array.isArray(data) ? data : data.events || [];
        if (!Array.isArray(eventList)) {
          throw new Error("Invalid response format: Expected an array of events");
        }

        setEvents(eventList);
        setFilteredEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message || "Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg border border-gray-100 max-w-md w-full text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-50 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">Public Events</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Discover and join exciting public events. Connect with others and make the most of your time.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-md border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all duration-200 bg-gray-50"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <LoadingIcon size={48} color="border-l-gray-400" />
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} {...event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white p-6 rounded-lg border border-gray-100 max-w-md mx-auto">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No events found</h3>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for upcoming events"}
                </p>
              </div>
            </div>
          )}
        </div>

        {filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-gray-50 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;
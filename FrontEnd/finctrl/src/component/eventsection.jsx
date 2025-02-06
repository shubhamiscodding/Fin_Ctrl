import { useState, useEffect } from "react";
import { Trash } from "lucide-react"
import "../App.css"

const EventSection = () => {
  const [eventCards, setEventCards] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    dateofevent: "",
    ispublic: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

 

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const events = await response.json();
      const formattedEvents = events.map((event) => ({
        id: event._id,
        title: event.eventName,
        date: new Date(event.dateofevent).toLocaleDateString(),
        ispublic: event.ispublic,
      }));
      setEventCards(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const apiUrl = "https://fin-ctrl-1.onrender.com/FinCtrl/event";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      await fetchEvents();
      setShowModal(false);
      setNewEvent({ eventName: "", dateofevent: "", ispublic: false });
      navigate("/event");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`;
      const response = await fetch(apiUrl, { method: "DELETE" });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      setEventCards((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      if (!editingEvent) return;

      const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${editingEvent.id}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: editingEvent.title,
          dateofevent: editingEvent.date,
          ispublic: editingEvent.ispublic,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      await fetchEvents();
      setShowEditModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="grid grid-cols-3 gap-7">
        {eventCards.map((card) => (
          <div key={card.id} className={`bg-white p-4 rounded-lg shadow ${card.ispublic ? "border border-green-500" : "border border-blue-500"}`}>
            <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-sm">{card.date}</p>
              </div>
              <span className="text-blue-500">{card.ispublic ? "Public" : "Private"}</span>
            </div>
            <button onClick={() => handleEditEvent(card)} className="text-blue-500">Edit</button>
            <button onClick={() => handleDeleteEvent(card.id)} className="mt-2 text-red-500 flex items-center gap-2">
              <Trash size={16} /> Delete
            </button>
          </div>
        ))}
        <div className="bg-gray-100 p-4 rounded-lg shadow flex items-center justify-center border border-dashed border-gray-500 ">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(true)}>
            Place
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                className="w-full p-2 border rounded-lg"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, eventName: e.target.value }))}
              />
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={newEvent.dateofevent}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, dateofevent: e.target.value }))}
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={newEvent.ispublic ? "Public" : "Private"}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, ispublic: e.target.value === "Public" }))}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <button onClick={handleAddEvent} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                Add Event
              </button>
              <button onClick={() => setShowModal(false)} className="text-red-500 px-4 py-2 rounded-lg w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={editingEvent.date}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, date: e.target.value }))}
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={editingEvent.ispublic ? "Public" : "Private"}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, ispublic: e.target.value === "Public" }))}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <button onClick={handleUpdateEvent} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                Update Event
              </button>
              <button onClick={() => setShowEditModal(false)} className="text-red-500 px-4 py-2 rounded-lg w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSection;

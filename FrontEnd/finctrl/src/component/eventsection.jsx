// import { useState, useEffect } from "react";
// import { Trash } from "lucide-react"
// import "../App.css"

// const EventSection = () => {
//   const [eventCards, setEventCards] = useState([]);
//   const [newEvent, setNewEvent] = useState({
//     eventName: "",
//     dateofevent: "",
//     ispublic: false,
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);



//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event");
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }
//       const events = await response.json();
//       const formattedEvents = events.map((event) => ({
//         id: event._id,
//         title: event.eventName,
//         date: new Date(event.dateofevent).toLocaleDateString(),
//         ispublic: event.ispublic,
//       }));
//       setEventCards(formattedEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   const handleAddEvent = async () => {
//     try {
//       const apiUrl = "https://fin-ctrl-1.onrender.com/FinCtrl/event";
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newEvent),
//       });

//       if (!response.ok) throw new Error(`API error: ${response.status}`);

//       await fetchEvents();
//       setShowModal(false);
//       setNewEvent({ eventName: "", dateofevent: "", ispublic: false });
//       navigate("/event");
//     } catch (error) {
//       console.error("Error adding event:", error);
//     }
//   };

//   const handleDeleteEvent = async (id) => {
//     try {
//       const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`;
//       const response = await fetch(apiUrl, { method: "DELETE" });

//       if (!response.ok) throw new Error(`API error: ${response.status}`);

//       setEventCards((prev) => prev.filter((event) => event.id !== id));
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };

//   const handleEditEvent = (event) => {
//     setEditingEvent(event);
//     setShowEditModal(true);
//   };

//   const handleUpdateEvent = async () => {
//     try {
//       if (!editingEvent) return;

//       const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${editingEvent.id}`;
//       const response = await fetch(apiUrl, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           eventName: editingEvent.title,
//           dateofevent: editingEvent.date,
//           ispublic: editingEvent.ispublic,
//         }),
//       });

//       if (!response.ok) throw new Error(`API error: ${response.status}`);

//       await fetchEvents();
//       setShowEditModal(false);
//       setEditingEvent(null);
//     } catch (error) {
//       console.error("Error updating event:", error);
//     }
//   };

//   return (
//     <div className="flex-1 p-8">
//       <div className="grid grid-cols-3 gap-7">
//         {eventCards.map((card) => (
//           <div key={card.id} className={`bg-white p-4 rounded-lg shadow ${card.ispublic ? "border border-green-500" : "border border-blue-500"}`}>
//             <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
//               <span className="text-gray-400">No Image</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">{card.title}</p>
//                 <p className="text-sm">{card.date}</p>
//               </div>
//               <span className="text-blue-500">{card.ispublic ? "Public" : "Private"}</span>
//             </div>
//             <button onClick={() => handleEditEvent(card)} className="text-blue-500">Edit</button>
//             <button onClick={() => handleDeleteEvent(card.id)} className="mt-2 text-red-500 flex items-center gap-2">
//               <Trash size={16} /> Delete
//             </button>
//           </div>
//         ))}
//         <div className="bg-gray-100 p-4 rounded-lg shadow flex items-center justify-center border border-dashed border-gray-500 ">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(true)}>
//             Place
//           </button>
//         </div>
//       </div>

//       {/* Add Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Event Name"
//                 className="w-full p-2 border rounded-lg"
//                 value={newEvent.eventName}
//                 onChange={(e) => setNewEvent((prev) => ({ ...prev, eventName: e.target.value }))}
//               />
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-lg"
//                 value={newEvent.dateofevent}
//                 onChange={(e) => setNewEvent((prev) => ({ ...prev, dateofevent: e.target.value }))}
//               />
//               <select
//                 className="w-full p-2 border rounded-lg"
//                 value={newEvent.ispublic ? "Public" : "Private"}
//                 onChange={(e) => setNewEvent((prev) => ({ ...prev, ispublic: e.target.value === "Public" }))}
//               >
//                 <option value="Public">Public</option>
//                 <option value="Private">Private</option>
//               </select>
//               <button onClick={handleAddEvent} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
//                 Add Event
//               </button>
//               <button onClick={() => setShowModal(false)} className="text-red-500 px-4 py-2 rounded-lg w-full">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editingEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-lg"
//                 value={editingEvent.title}
//                 onChange={(e) => setEditingEvent((prev) => ({ ...prev, title: e.target.value }))}
//               />
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-lg"
//                 value={editingEvent.date}
//                 onChange={(e) => setEditingEvent((prev) => ({ ...prev, date: e.target.value }))}
//               />
//               <select
//                 className="w-full p-2 border rounded-lg"
//                 value={editingEvent.ispublic ? "Public" : "Private"}
//                 onChange={(e) => setEditingEvent((prev) => ({ ...prev, ispublic: e.target.value === "Public" }))}
//               >
//                 <option value="Public">Public</option>
//                 <option value="Private">Private</option>
//               </select>
//               <button onClick={handleUpdateEvent} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
//                 Update Event
//               </button>
//               <button onClick={() => setShowEditModal(false)} className="text-red-500 px-4 py-2 rounded-lg w-full">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventSection;



// import { useState, useEffect } from "react"
// import { Trash, Calendar, Globe, Lock, Plus, Edit2 } from "lucide-react"
// import { Link } from "react-router-dom"
// import { LoadingIcon } from "../components/ui/loading-icon"
// import "../App.css"

// const EventSection = () => {
//   const [eventCards, setEventCards] = useState([])
//   const [newEvent, setNewEvent] = useState({
//     eventName: "",
//     dateofevent: "",
//     ispublic: false,
//   })
//   const [showModal, setShowModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [editingEvent, setEditingEvent] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     fetchEvents()
//   }, [])

//   const fetchEvents = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event")
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`)
//       }
//       const events = await response.json()
//       const formattedEvents = events.map((event) => ({
//         id: event._id,
//         title: event.eventName,
//         dateofevent: event.dateofevent ? new Date(event.dateofevent).toISOString().split("T")[0] : "No Date",
//         ispublic: event.ispublic,
//       }))
//       console.log("Date of new event:", formattedEvents)
//       setEventCards(formattedEvents)
//     } catch (error) {
//       console.error("Error fetching events:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleAddEvent = async () => {
//     try {
//       console.log("Date of new event:", newEvent.dateofevent)
//       const apiUrl = "https://fin-ctrl-1.onrender.com/FinCtrl/event"
//       const formattedEvent = {
//         ...newEvent, // Ensure correct format
//       }

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedEvent),
//       })

//       if (!response.ok) throw new Error(`API error: ${response.status}`)

//       await fetchEvents()
//       setShowModal(false)
//       setNewEvent({ eventName: "", dateofevent: "", ispublic: false })
//       console.log(newEvent)
//     } catch (error) {
//       console.error("Error adding event:", error)
//     }
//   }

//   const handleDeleteEvent = async (id) => {
//     try {
//       const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`
//       const response = await fetch(apiUrl, { method: "DELETE" })

//       if (!response.ok) throw new Error(`API error: ${response.status}`)

//       setEventCards((prev) => prev.filter((event) => event.id !== id))
//     } catch (error) {
//       console.error("Error deleting event:", error)
//     }
//   }

//   const handleEditEvent = (event) => {
//     setEditingEvent({
//       ...event,
//       date: event.dateofevent,
//     })
//     setShowEditModal(true)
//   }

//   const handleUpdateEvent = async () => {
//     try {
//       if (!editingEvent) return

//       const apiUrl = `https://fin-ctrl-1.onrender.com/FinCtrl/event/${editingEvent.id}`
//       const formattedEvent = {
//         eventName: editingEvent.title,
//         dateofevent: editingEvent.date,
//         ispublic: editingEvent.ispublic,
//       }

//       const response = await fetch(apiUrl, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedEvent),
//       })

//       if (!response.ok) throw new Error(`API error: ${response.status}`)

//       await fetchEvents()
//       setShowEditModal(false)
//       setEditingEvent(null)
//     } catch (error) {
//       console.error("Error updating event:", error)
//     }
//   }

//   const Modal = ({ children, onClose }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
//       <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px] relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           ✕
//         </button>
//         {children}
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Events</h1>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
//           >
//             <Plus size={20} /> Add New Event
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {isLoading ? (
//             <div className="col-span-full flex justify-center items-center h-64">
//               <LoadingIcon size={58} color="border-l-indigo-500" />
//             </div>
//           ) : eventCards.length === 0 ? (
//             <div className="col-span-full text-center text-gray-500">No events found.</div>
//           ) : (
//             eventCards.map((card) => (
//               <Link to={`/event/${card.id}`} key={card.id} className="block">
//                 <div
//                   className={`event-card bg-white p-6 rounded-xl shadow-md border-l-4 ${
//                     card.ispublic ? "border-l-emerald-500" : "border-l-indigo-500"
//                   } transition-transform transform hover:scale-105`}
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="font-semibold text-lg text-gray-900">{card.title}</h3>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault()
//                           handleEditEvent(card)
//                         }}
//                         className="text-gray-400 hover:text-indigo-600 transition-colors"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault()
//                           handleDeleteEvent(card.id)
//                         }}
//                         className="text-gray-400 hover:text-red-600 transition-colors"
//                       >
//                         <Trash size={18} />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <Calendar size={16} />
//                       <span>{card.dateofevent}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {card.ispublic ? (
//                         <Globe size={16} className="text-emerald-500" />
//                       ) : (
//                         <Lock size={16} className="text-indigo-500" />
//                       )}
//                       <span className={card.ispublic ? "text-emerald-500" : "text-indigo-500"}>
//                         {card.ispublic ? "Public Event" : "Private Event"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Add Modal */}
//       {showModal && (
//         <Modal onClose={() => setShowModal(false)}>
//           <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
//               <input
//                 type="text"
//                 placeholder="Event Name"
//                 className="w-full p-2 border rounded-lg"
//                 value={newEvent.eventName}
//                 onChange={(e) => setNewEvent((prev) => ({ ...prev, eventName: e.target.value }))}
//                 autoFocus
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
//               <input
//                 type="date"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={newEvent.dateofevent}
//                 onChange={(e) => setNewEvent((prev) => ({ ...prev, dateofevent: e.target.value }))}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//               <select
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={newEvent.ispublic ? "Public" : "Private"}
//                 onChange={(e) =>
//                   setNewEvent((prev) => ({
//                     ...prev,
//                     ispublic: e.target.value === "Public",
//                   }))
//                 }
//               >
//                 <option value="Public">Public</option>
//                 <option value="Private">Private</option>
//               </select>
//             </div>
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleAddEvent}
//                 className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 Create Event
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editingEvent && (
//         <Modal onClose={() => setShowEditModal(false)}>
//           <h2 className="text-2xl font-semibold mb-6">Edit Event</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={editingEvent.title}
//                 onChange={(e) => setEditingEvent((prev) => ({ ...prev, title: e.target.value }))}
//                 autoFocus
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
//               <input
//                 type="date"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={editingEvent.date}
//                 onChange={(e) => setEditingEvent((prev) => ({ ...prev, date: e.target.value }))}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//               <select
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={editingEvent.ispublic ? "Public" : "Private"}
//                 onChange={(e) =>
//                   setEditingEvent((prev) => ({
//                     ...prev,
//                     ispublic: e.target.value === "Public",
//                   }))
//                 }
//               >
//                 <option value="Public">Public</option>
//                 <option value="Private">Private</option>
//               </select>
//             </div>
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleUpdateEvent}
//                 className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 Update Event
//               </button>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }

// export default EventSection;






import { useState, useEffect } from "react";
import { Trash, Calendar, Globe, Lock, Plus, Edit2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingIcon } from "../components/ui/loading-icon";
import "../App.css";

const getToken = () => localStorage.getItem("token");

const EventSection = () => {
  const [eventCards, setEventCards] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    dateofevent: "",
    ispublic: false,
    budget: 0,
    description: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized - Please log in");
        throw new Error(`API error: ${response.status}`);
      }

      const events = await response.json();
      const formattedEvents = events.map((event) => ({
        id: event._id,
        title: event.eventName,
        dateofevent: event.dateofevent
          ? new Date(event.dateofevent).toISOString().split("T")[0]
          : "No Date",
        ispublic: event.ispublic,
        budget: event.budget,
        description: event.description,
      }));
      setEventCards(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized - Please log in");
        throw new Error(`API error: ${response.status}`);
      }

      await fetchEvents();
      setShowModal(false);
      setNewEvent({ eventName: "", dateofevent: "", ispublic: false, budget: 0, description: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized - Please log in");
        if (response.status === 403) throw new Error("You don't have permission to delete this event");
        throw new Error(`API error: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      setEventCards((prev) => prev.filter((event) => event.id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      setError(error.message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent({
      ...event,
      date: event.dateofevent,
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      if (!editingEvent) return;

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const formattedEvent = {
        eventName: editingEvent.title,
        dateofevent: editingEvent.date,
        ispublic: editingEvent.ispublic,
        budget: editingEvent.budget,
        description: editingEvent.description,
      };

      const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEvent),
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized - Please log in");
        if (response.status === 403) throw new Error("You don't have permission to edit this event");
        throw new Error(`API error: ${response.status}`);
      }

      await fetchEvents();
      setShowEditModal(false);
      setEditingEvent(null);
      setError(null);
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message);
    }
  };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Add New Event
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <LoadingIcon size={58} color="border-l-indigo-500" />
            </div>
          ) : eventCards.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No events found.</div>
          ) : (
            eventCards.map((card) => (
              <Link to={`/event/${card.id}`} key={card.id} className="block">
                <div
                  className={`event-card bg-white p-6 rounded-xl shadow-md border-l-4 ${
                    card.ispublic ? "border-l-emerald-500" : "border-l-indigo-500"
                  } transition-transform transform hover:scale-105`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">{card.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleEditEvent(card);
                        }}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteEvent(card.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>{card.dateofevent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.ispublic ? (
                        <Globe size={16} className="text-emerald-500" />
                      ) : (
                        <Lock size={16} className="text-indigo-500" />
                      )}
                      <span className={card.ispublic ? "text-emerald-500" : "text-indigo-500"}>
                        {card.ispublic ? "Public Event" : "Private Event"}
                      </span>
                    </div>
                    <div className="text-gray-600">Budget: ${card.budget}</div>
                    <div className="text-gray-600 truncate">{card.description}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                placeholder="Event Name"
                className="w-full p-2 border rounded-lg"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, eventName: e.target.value }))}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newEvent.dateofevent}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, dateofevent: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newEvent.budget}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, budget: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newEvent.description}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newEvent.ispublic ? "Public" : "Private"}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    ispublic: e.target.value === "Public",
                  }))
                }
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddEvent}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Event
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showEditModal && editingEvent && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2 className="text-2xl font-semibold mb-6">Edit Event</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, title: e.target.value }))}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editingEvent.date}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editingEvent.budget}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, budget: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editingEvent.description}
                onChange={(e) => setEditingEvent((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editingEvent.ispublic ? "Public" : "Private"}
                onChange={(e) =>
                  setEditingEvent((prev) => ({
                    ...prev,
                    ispublic: e.target.value === "Public",
                  }))
                }
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateEvent}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update Event
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventSection;
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import ReadOnlyDashboard from "./ReadOnlyDashboard";

// Configure date-fns localizer for react-big-calendar
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { "en-US": enUS },
});

export default function CalendarTab() {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // Controls modal visibility

    const handleSelectSlot = ({ start }) => {
        setDate(start);
        setSelectedDate(start); // Open modal for the clicked date
    };

    const closeModal = () => {
        setSelectedDate(null); // Close the modal
    };

    return (
        <div className="flex-1 p-4 h-screen flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-center">Calendar</h2>
            <div className="flex-1 w-full">
                <Calendar
                    localizer={localizer}
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                    events={[]} // No events needed for now
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", width: "100%" }}
                    view="month" // Default to month view
                    onView={() => { }} // Lock to month view
                    onSelectSlot={handleSelectSlot}
                    selectable
                    className="border rounded shadow"
                />
            </div>

            {/* Modal for ReadOnlyDashboard */}
            {selectedDate && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                        >
                            ×
                        </button>
                        <ReadOnlyDashboard selectedDate={selectedDate} />
                    </div>
                </div>
            )}
        </div>
    );
}
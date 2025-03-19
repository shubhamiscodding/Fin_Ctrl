import { useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { startOfDay } from "date-fns/startOfDay";
import { startOfMonth } from "date-fns/startOfMonth";
import { endOfMonth } from "date-fns/endOfMonth";
import { setMonth } from "date-fns/setMonth";
import { setYear } from "date-fns/setYear";
import enUS from "date-fns/locale/en-US";
import ReadOnlyDashboard from "./ReadOnlyDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "react-toastify";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { "en-US": enUS },
});

const CustomToolbar = ({ date, onNavigate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(format(date, "MMMM"));
    const [selectedYear, setSelectedYear] = useState(format(date, "yyyy"));
    const dropdownRef = useRef(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from(
        { length: new Date().getFullYear() - 1999 },
        (_, i) => 2000 + i
    ).reverse();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setSelectedMonth(format(date, "MMMM"));
        setSelectedYear(format(date, "yyyy"));
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleSave = () => {
        const monthIndex = months.indexOf(selectedMonth);
        const year = Number(selectedYear);

        if (monthIndex === -1 || isNaN(year)) {
            toast.error("Invalid month or year");
            setIsDropdownOpen(false);
            return;
        }

        const newDate = setYear(setMonth(new Date(), monthIndex), year);
        const normalizedDate = startOfDay(newDate);

        if (normalizedDate > new Date()) {
            toast.error("Cannot navigate to future dates");
            setIsDropdownOpen(false);
            return;
        }

        onNavigate("DATE", normalizedDate);
        setIsDropdownOpen(false);
    };

    const goToBack = () => onNavigate("PREV");
    const goToNext = () => {
        const nextMonth = setMonth(date, date.getMonth() + 1);
        if (nextMonth <= new Date()) onNavigate("NEXT");
    };

    const goToToday = () => {
        const today = startOfDay(new Date());
        onNavigate("DATE", today);
    };

    const goToThisYear = () => {
        const currentYearStart = setMonth(setYear(new Date(), new Date().getFullYear()), 0);
        onNavigate("DATE", startOfDay(currentYearStart));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="rbc-toolbar flex items-center justify-between p-2 bg-white border-b">
            <div className="rbc-btn-group flex space-x-2">
                <button
                    type="button"
                    onClick={goToBack}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                    &lt;
                </button>
                <button
                    type="button"
                    onClick={goToNext}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                    &gt;
                </button>
            </div>
            <div className="rbc-toolbar-label flex-1 text-center relative">
                <button
                    onClick={toggleDropdown}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition cursor-pointer"
                >
                    {format(date, "MMMM yyyy")}
                </button>
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                <select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="rbc-btn-group flex space-x-2">
                <button
                    type="button"
                    onClick={goToToday}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                    Today
                </button>
                <button
                    type="button"
                    onClick={goToThisYear}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                    This Year
                </button>
            </div>
        </div>
    );
};

export default function CalendarTab() {
    const [date, setDate] = useState(startOfDay(new Date()));
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyData, setMonthlyData] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    });
    const [token, setToken] = useState(localStorage.getItem("token"));

    const fetchMonthlyData = async () => {
        try {
            const currentToken = localStorage.getItem("token");
            if (!currentToken) throw new Error("No authentication token found");

            const currentMonthStart = startOfMonth(date);
            const currentMonthEnd = endOfMonth(date);
            const startStr = format(currentMonthStart, "yyyy-MM-dd");
            const endStr = format(currentMonthEnd, "yyyy-MM-dd");

            const response = await fetch(
                `https://fin-ctrl-1.onrender.com/finance/period?startDate=${startStr}&endDate=${endStr}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentToken}`,
                    },
                }
            );

            const data = await response.json();
            if (!response.ok && response.status !== 404) {
                throw new Error(data.message || "Failed to fetch monthly data");
            }

            let totalExpenses = 0;
            let totalIncome = 0;

            if (response.status === 404 || !data.length) {
                setMonthlyData({
                    totalIncome: 0,
                    totalExpenses: 0,
                    balance: 0,
                });
                return;
            }

            data.forEach((finance) => {
                finance.expenses.forEach((expense) => {
                    totalExpenses += expense.amount;
                });
                finance.financePlans.forEach((plan) => {
                    plan.savingsTransactions.forEach((tx) => {
                        totalIncome += tx.amount;
                    });
                });
            });

            const balance = totalIncome - totalExpenses;

            setMonthlyData({
                totalIncome,
                totalExpenses,
                balance,
            });
        } catch (err) {
            toast.error(err.message || "Error loading monthly summary");
            setMonthlyData({
                totalIncome: 0,
                totalExpenses: 0,
                balance: 0,
            });
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("token");
            if (newToken !== token) {
                setToken(newToken);
                toast.info("Account switched successfully");
                fetchMonthlyData();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        fetchMonthlyData();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [date, token]);

    const handleSelectSlot = ({ start }) => {
        const normalizedDate = startOfDay(start);
        const today = startOfDay(new Date());

        if (normalizedDate > today) {
            toast.error("Cannot access future dates");
            return;
        }

        setDate(normalizedDate);
        setSelectedDate(normalizedDate);
    };

    const closeModal = () => {
        setSelectedDate(null);
    };

    return (
        <div className="flex-1 p-4 h-screen flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-center">
                    {format(date, "MMMM yyyy")} Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    <Card className="relative group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                                INR: {monthlyData.totalIncome.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-red-600">
                                INR: {monthlyData.totalExpenses.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Available Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">
                                INR: {monthlyData.balance.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex-1 w-full">
                <Calendar
                    localizer={localizer}
                    date={date}
                    onNavigate={(newDate) => setDate(startOfDay(newDate))}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", width: "100%" }}
                    view="month"
                    views={["month"]}
                    onView={() => { }}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    className="border rounded shadow"
                    max={new Date()}
                    components={{
                        toolbar: CustomToolbar,
                    }}
                />
            </div>

            {selectedDate && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl cursor-pointer"
                        >
                            ×
                        </button>
                        <ReadOnlyDashboard selectedDate={selectedDate} token={token} />
                    </div>
                </div>
            )}
        </div>
    );
}
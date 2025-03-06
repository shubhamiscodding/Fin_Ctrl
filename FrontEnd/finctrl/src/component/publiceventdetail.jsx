import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function PublicEventDetail() {
  const { id } = useParams(); // Get event ID from URL
  const [eventData, setEventData] = useState({
    eventName: "",
    dateofevent: "",
    description: "",
    budget: 0,
    usedAmount: 0,
    balance: 0,
    expenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event data from backend
  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`https://fin-ctrl-1.onrender.com/events/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch event data");

      // Process event data
      const totalBudget = data.budget || 0;
      let totalExpenses = 0;
      const expenses = data.expenses.map((expense) => {
        totalExpenses += expense.amount;
        return {
          id: expense._id,
          date: new Date(expense.date).toISOString().split("T")[0],
          description: expense.description,
          category: expense.category,
          amount: expense.amount,
        };
      });

      const balance = totalBudget - totalExpenses;

      setEventData({
        eventName: data.eventName,
        dateofevent: new Date(data.dateofevent).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        description: data.description || "No description provided",
        budget: totalBudget,
        usedAmount: totalExpenses,
        balance,
        expenses: expenses.sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort by date descending
      });
    } catch (err) {
      setError(err.message || "Error loading event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const percentage = eventData.budget > 0 ? (eventData.usedAmount / eventData.budget) * 100 : 0;

  const chartData = [
    { name: "Used", value: percentage, fill: "#000" },
    { name: "Remaining", value: 100, fill: "#60a5fa" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventData.eventName}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventData.dateofevent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{eventData.description}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Chart Section */}
        <div className="bg-blue-100 text-black p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Budget</p>
              <p className="text-sm">Total Allocated</p>
              <p className="text-2xl font-bold mt-2">
                INR: {eventData.budget.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center relative mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="85%"
                outerRadius="130%"
                barSize={12}
                data={chartData}
              >
                <RadialBar dataKey="value" data={[chartData[1]]} fill={chartData[1].fill} />
                <RadialBar dataKey="value" data={[chartData[0]]} fill={chartData[0].fill} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">
                INR: {eventData.usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm">Used</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              Balance: INR: {eventData.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Expenses Table Section */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventData.expenses.length > 0 ? (
                    eventData.expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="text-right text-red-600">
                          INR: {expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No expenses recorded for this event.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PlusCircle } from "lucide-react";

export default function Eventdetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Other", // Default category
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`https://fin-ctrl-1.onrender.com/events/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        if (response.status === 403) throw new Error("You don't have permission to view this event.");
        if (response.status === 404) throw new Error("Event not found.");
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvent(data);
      setNewBudget(data.budget || ""); // Ensure newBudget is set even if budget is 0
    } catch (err) {
      setError(err.message || "Failed to fetch event details");
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async () => {
    if (!newBudget || newBudget.trim() === "" || Number(newBudget) < 0) {
      alert("Please enter a valid non-negative budget amount.");
      return;
    }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const response = await fetch(`https://fin-ctrl-1.onrender.com/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ budget: Number(newBudget) }), // Only update budget
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchEventDetails(); // Refresh event data
    } catch (err) {
      setError("Failed to update budget: " + err.message);
      console.error("Error updating budget:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || newExpense.description.trim() === "") {
      alert("Please enter a valid expense description.");
      return;
    }
    if (!newExpense.amount || newExpense.amount.trim() === "" || Number(newExpense.amount) <= 0) {
      alert("Please enter a valid positive expense amount.");
      return;
    }
    if (!newExpense.date) {
      alert("Please select a valid date for the expense.");
      return;
    }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const expenseData = {
        description: newExpense.description,
        amount: Number(newExpense.amount),
        date: new Date(newExpense.date).toISOString(),
        category: newExpense.category,
      };

      const response = await fetch(`https://fin-ctrl-1.onrender.com/events/${id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setNewExpense({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "Other",
      });
      await fetchEventDetails(); // Refresh event data
    } catch (err) {
      setError("Failed to add expense: " + err.message);
      console.error("Error adding expense:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!event) return <div className="text-center py-10">No event data available</div>;

  const totalAmount = event.budget || 0;
  const usedAmount = event.totalSpent || 0;
  const balance = totalAmount - usedAmount;
  const percentage = totalAmount > 0 ? (usedAmount / totalAmount) * 100 : 0;

  const data = [
    { name: "usedAmount", value: percentage, fill: "#000" }, // Corrected to show used percentage
    { name: "totalAmount", value: 100, fill: "#60a5fa" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{event.eventName}</h1>
      <p className="text-gray-600">{event.description}</p>

      {/* Budget Update Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Update Budget</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new budget"
            min="0"
          />
          <button
            onClick={updateBudget}
            disabled={isUpdating}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Budget"}
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR: {usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR: {balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR: {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Expense Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            required
          />
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            min="0"
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            {isUpdating ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Chart & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 text-black p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Available</p>
              <p className="text-sm">for Event</p>
              <p className="text-2xl font-bold mt-2">INR: {balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="flex justify-center items-center relative mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="85%" outerRadius="130%" barSize={12} data={data}>
                <RadialBar dataKey="value" data={[data[1]]} fill={data[1].fill} />
                <RadialBar dataKey="value" data={[data[0]]} fill={data[0].fill} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">INR: {usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(event.expenses || []).map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-red-600">
                          INR: {expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
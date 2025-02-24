import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function Eventdetail() {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  const totalAmount = event.budget;
  const usedAmount = event.totalSpent;
  const balance = totalAmount - usedAmount;
  const percentage = (usedAmount / totalAmount) * 100;

  const data = [
    { name: "Used", value: percentage, fill: "#000" },
    { name: "Remaining", value: 100 - percentage, fill: "#60a5fa" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{event.eventName}</h1>
      <p className="text-gray-600">{event.description}</p>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Available Balance</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${balance.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${usedAmount.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      {/* Chart & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="bg-blue-100 text-black p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Available</p>
              <p className="text-sm">this Month</p>
              <p className="text-2xl font-bold mt-2">${balance.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">${usedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.expenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right">
                        <span className={expense.amount > 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(expense.amount).toFixed(2)}
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

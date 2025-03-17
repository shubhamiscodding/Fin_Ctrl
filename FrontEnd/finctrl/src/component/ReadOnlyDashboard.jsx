import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function ReadOnlyDashboard({ selectedDate = new Date() }) {
    const [financeData, setFinanceData] = useState({
        totalAmount: 0,
        usedAmount: 0,
        balance: 0,
        transactions: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFinanceData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const dateStr = selectedDate.toISOString().split("T")[0];
            const url = `https://fin-ctrl-1.onrender.com/finance/?date=${dateStr}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch finance data");

            let totalExpenses = 0;
            let totalIncome = 0;
            const transactions = [];

            data.forEach((finance) => {
                finance.expenses.forEach((expense) => {
                    totalExpenses += expense.amount;
                    transactions.push({
                        id: expense._id,
                        date: new Date(expense.date).toISOString().split("T")[0],
                        description: expense.description,
                        category: expense.category,
                        amount: -expense.amount,
                    });
                });

                finance.financePlans.forEach((plan) => {
                    totalIncome += plan.totalSaved;
                    plan.savingsTransactions.forEach((tx) => {
                        transactions.push({
                            id: tx._id,
                            date: new Date(tx.date).toISOString().split("T")[0],
                            description: tx.description,
                            category: "Savings",
                            amount: tx.amount,
                        });
                    });
                });
            });

            const totalAmount = totalIncome;
            const usedAmount = totalExpenses;
            const balance = totalAmount - usedAmount;

            setFinanceData({
                totalAmount,
                usedAmount,
                balance,
                transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
            });
        } catch (err) {
            setError(err.message || "Error loading dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, [selectedDate]);

    const percentage = financeData.totalAmount > 0 ? (financeData.usedAmount / financeData.totalAmount) * 100 : 0;

    const chartData = [
        { name: "Used", value: percentage, fill: "#000" },
        { name: "Remaining", value: 100, fill: "#60a5fa" },
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <p className="text-sm sm:text-base">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Available Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            INR: {financeData.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            INR: {financeData.usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            INR: {financeData.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="bg-blue-100 text-black p-4 sm:p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="font-bold text-base sm:text-lg">Available</p>
                            <p className="text-xs sm:text-sm">{selectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}</p>
                            <p className="text-xl sm:text-2xl font-bold mt-2">
                                INR: {financeData.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <button className="text-xs sm:text-sm bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap" disabled>
                            Change
                        </button>
                    </div>
                    <div className="flex justify-center items-center relative mt-4 sm:mt-6">
                        <ResponsiveContainer width="100%" height={180} minHeight={150}>
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="85%"
                                outerRadius="130%"
                                barSize={10}
                                data={chartData}
                            >
                                <RadialBar dataKey="value" data={[chartData[1]]} fill={chartData[1].fill} />
                                <RadialBar dataKey="value" data={[chartData[0]]} fill={chartData[0].fill} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center">
                            <p className="text-lg sm:text-2xl font-bold">
                                INR: {financeData.usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs sm:text-sm">{selectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="border rounded-lg">
                        <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10 shadow">
                                    <TableRow>
                                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Description</TableHead>
                                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Category</TableHead>
                                        <TableHead className="text-xs sm:text-sm text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {financeData.transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-xs sm:text-sm">
                                                No transactions found for this date.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        financeData.transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="text-xs sm:text-sm">{transaction.date}</TableCell>
                                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{transaction.description}</TableCell>
                                                <TableCell className="text-xs sm:text-sm hidden md:table-cell">{transaction.category}</TableCell>
                                                <TableCell className="text-xs sm:text-sm text-right">
                                                    <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                                                        INR: {Math.abs(transaction.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
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
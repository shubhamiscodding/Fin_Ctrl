import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { format } from "date-fns";
import { startOfDay } from "date-fns/startOfDay";
import { toast } from "react-toastify";

export default function ReadOnlyDashboard({ selectedDate, token }) {
    const [financeData, setFinanceData] = useState({
        totalAmount: 0,
        usedAmount: 0,
        balance: 0,
        transactions: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchFinanceData = async () => {
        try {
            if (!token) throw new Error("No authentication token found");

            const normalizedDate = startOfDay(selectedDate);
            const dateStr = format(normalizedDate, "yyyy-MM-dd");

            const response = await fetch(`https://fin-ctrl-1.onrender.com/finance?date=${dateStr}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok && response.status !== 404) {
                throw new Error(data.message || "Failed to fetch finance data");
            }

            let totalExpenses = 0;
            let totalIncome = 0;
            const transactions = [];

            if (response.status === 404 || !data || !data.length) {
                setFinanceData({
                    totalAmount: 0,
                    usedAmount: 0,
                    balance: 0,
                    transactions: [],
                });
                setLoading(false);
                return;
            }

            const financeArray = Array.isArray(data) ? data : [data];
            
            financeArray.forEach((finance) => {
                if (finance.expenses && Array.isArray(finance.expenses)) {
                    finance.expenses.forEach((expense) => {
                        if (!expense || !expense.date) return;
                        
                        totalExpenses += expense.amount || 0;
                        transactions.push({
                            type: "expense",
                            date: format(new Date(expense.date), "yyyy-MM-dd"),
                            description: expense.description || "Expense",
                            category: expense.category || "Other",
                            amount: -(expense.amount || 0),
                        });
                    });
                }

                if (finance.financePlans && Array.isArray(finance.financePlans)) {
                    finance.financePlans.forEach((plan) => {
                        if (!plan || !plan.savingsTransactions || !Array.isArray(plan.savingsTransactions)) return;
                        
                        plan.savingsTransactions.forEach((tx) => {
                            if (!tx || !tx.date) return;
                            
                            totalIncome += tx.amount || 0;
                            transactions.push({
                                type: "income",
                                date: format(new Date(tx.date), "yyyy-MM-dd"),
                                description: tx.description || "Income",
                                category: "Savings",
                                amount: tx.amount || 0,
                            });
                        });
                    });
                }
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
            toast.error(err.message || "Error loading dashboard data");
            setFinanceData({
                totalAmount: 0,
                usedAmount: 0,
                balance: 0,
                transactions: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, [selectedDate, token]);

    const percentage = financeData.totalAmount > 0 ? (financeData.usedAmount / financeData.totalAmount) * 100 : 0;

    const chartData = [
        { name: "Used", value: percentage, fill: "#000" },
        { name: "Remaining", value: 100, fill: "#60a5fa" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-sm sm:text-base">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Available Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            INR: {financeData.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            INR: {financeData.usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-blue-100 text-black p-4 sm:p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="font-bold text-base sm:text-lg">Available</p>
                            <p className="text-xs sm:text-sm">{format(selectedDate, "dd MMMM")}</p>
                            <p className="text-xl sm:text-2xl font-bold mt-2">
                                INR: {financeData.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
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
                            <p className="text-xs sm:text-sm">{format(selectedDate, "dd MMMM")}</p>
                        </div>
                    </div>
                </div>

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
                                        financeData.transactions.map((transaction, index) => (
                                            <TableRow key={index}>
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
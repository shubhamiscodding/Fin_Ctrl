import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function Dashboard({ selectedDate = new Date() }) {
  const [financeData, setFinanceData] = useState({
    totalAmount: 0,
    usedAmount: 0,
    balance: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState({ balance: false, expenses: false, income: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({ amount: "", description: "", category: "Other" });
  const [editingTransaction, setEditingTransaction] = useState(null);

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
            financeId: finance._id,
            type: "expense",
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
              financeId: finance._id,
              planId: plan._id,
              type: "income",
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

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setFormData({ amount: "", description: "", category: "Other" });
    setShowDropdown({ balance: false, expenses: false, income: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const { amount, description, category } = formData;
      if (!amount || amount <= 0) throw new Error("Please enter a valid amount");

      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await fetch("https://fin-ctrl-1.onrender.com/finance/date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: modalType,
          amount: Number(amount),
          description: description || `${modalType === "expense" ? "Expense" : "Income"} Entry`,
          category: modalType === "expense" ? category : undefined,
          date: dateStr,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Failed to add ${modalType}`);

      fetchFinanceData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction.id);
  };

  const handleSaveEdit = async (transaction) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedData = financeData.transactions.find((t) => t.id === transaction.id);
      const url = `https://fin-ctrl-1.onrender.com/finance/${transaction.financeId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          [transaction.type === "expense" ? "expenses" : "savingsTransactions"]: {
            id: transaction.id,
            amount: Number(updatedData.amount > 0 ? updatedData.amount : -updatedData.amount),
            description: updatedData.description,
            category: transaction.type === "expense" ? updatedData.category : undefined,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update transaction");

      fetchFinanceData();
      setEditingTransaction(null);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleTransactionChange = (id, field, value) => {
    setFinanceData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, [field]: field === "amount" ? Number(value) : value } : t
      ),
    }));
  };

  const toggleDropdown = (type) => {
    setShowDropdown((prev) => ({
      balance: type === "balance" ? !prev.balance : false,
      expenses: type === "expenses" ? !prev.expenses : false,
      income: type === "income" ? !prev.income : false,
    }));
  };

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
        <Card className="relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              INR: {financeData.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleDropdown("balance")} className="text-gray-600 text-lg">⋮</button>
          </div>
          {showDropdown.balance && (
            <div className="absolute top-8 right-2 w-32 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => openModal("income")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add Income
              </button>
              <button
                onClick={() => openModal("expense")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add Expense
              </button>
            </div>
          )}
        </Card>
        <Card className="relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              INR: {financeData.usedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleDropdown("expenses")} className="text-gray-600 text-lg">⋮</button>
          </div>
          {showDropdown.expenses && (
            <div className="absolute top-8 right-2 w-32 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => openModal("expense")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add Expense
              </button>
            </div>
          )}
        </Card>
        <Card className="relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              INR: {financeData.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleDropdown("income")} className="text-gray-600 text-lg">⋮</button>
          </div>
          {showDropdown.income && (
            <div className="absolute top-8 right-2 w-32 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => openModal("income")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add Income
              </button>
            </div>
          )}
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
            <button className="text-xs sm:text-sm bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
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
                    <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financeData.transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs sm:text-sm">
                        No transactions found for this date.
                      </TableCell>
                    </TableRow>
                  ) : (
                    financeData.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-xs sm:text-sm">{transaction.date}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {editingTransaction === transaction.id ? (
                            <input
                              type="text"
                              value={transaction.description}
                              onChange={(e) => handleTransactionChange(transaction.id, "description", e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            transaction.description
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {editingTransaction === transaction.id && transaction.type === "expense" ? (
                            <select
                              value={transaction.category}
                              onChange={(e) => handleTransactionChange(transaction.id, "category", e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            >
                              <option value="Other">Other</option>
                              <option value="Food">Food</option>
                              <option value="Transport">Transport</option>
                              <option value="Entertainment">Entertainment</option>
                              <option value="Bills">Bills</option>
                            </select>
                          ) : (
                            transaction.category
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right">
                          {editingTransaction === transaction.id ? (
                            <input
                              type="number"
                              value={Math.abs(transaction.amount)}
                              onChange={(e) =>
                                handleTransactionChange(
                                  transaction.id,
                                  "amount",
                                  transaction.amount > 0 ? e.target.value : -e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                              INR: {Math.abs(transaction.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right">
                          {editingTransaction === transaction.id ? (
                            <button
                              onClick={() => handleSaveEdit(transaction)}
                              className="text-blue-500 hover:underline"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                          )}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Add {modalType === "income" ? "Income" : "Expense"}
            </h2>
            <form onSubmit={handleAddData}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount (INR)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g., 500"
                  required
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g., Salary or Groceries"
                />
              </div>
              {modalType === "expense" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="Other">Other</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
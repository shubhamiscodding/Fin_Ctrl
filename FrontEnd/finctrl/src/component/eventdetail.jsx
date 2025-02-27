// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
// import { PlusCircle, X } from "lucide-react";

// export default function Eventdetail() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newBudget, setNewBudget] = useState("");
//   const [newExpense, setNewExpense] = useState({
//     description: "",
//     amount: "",
//     date: new Date().toISOString().split('T')[0]
//   });
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchEventDetails();
//   }, [id]);

//   const fetchEventDetails = async () => {
//     try {
//       const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setEvent(data);
//       setNewBudget(data.budget);
//     } catch (err) {
//       setError("Failed to fetch event details");
//       console.error("Error fetching event details:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateBudget = async () => {
//     setIsUpdating(true);
//     try {
//       const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...event,
//           budget: parseFloat(newBudget)
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       await fetchEventDetails();
//       setIsModalOpen(false);
//     } catch (err) {
//       setError("Failed to update budget");
//       console.error("Error updating budget:", err);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const addExpense = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     try {
//       const newExpenseData = {
//         ...newExpense,
//         amount: parseFloat(newExpense.amount),
//         date: new Date(newExpense.date).toISOString()
//       };

//       const updatedExpenses = [...event.expenses, newExpenseData];
//       const updatedTotalSpent = event.totalSpent + newExpenseData.amount;

//       const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...event,
//           expenses: updatedExpenses,
//           totalSpent: updatedTotalSpent
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       setNewExpense({
//         description: "",
//         amount: "",
//         date: new Date().toISOString().split('T')[0]
//       });
//       await fetchEventDetails();
//       setIsModalOpen(false);
//     } catch (err) {
//       setError("Failed to add expense");
//       console.error("Error adding expense:", err);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

//   const totalAmount = event.budget;
//   const usedAmount = event.totalSpent;
//   const balance = totalAmount - usedAmount;
//   const percentage = (usedAmount / totalAmount) * 100;

//   const data = [
//     { name: "Used", value: percentage, fill: "#000" },
//     { name: "Remaining", value: 100 - percentage, fill: "#60a5fa" },
//   ];

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-bold">{event.eventName}</h1>
//       <p className="text-gray-600">{event.description}</p>

//       {/* Top Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Available Balance</CardTitle>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//               title="Add Transaction"
//             >
//               <PlusCircle className="w-6 h-6 text-blue-600" />
//             </button>
//           </CardHeader>
//           <CardContent><div className="text-2xl font-bold">INR : {balance.toLocaleString()}</div></CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Total Expenses</CardTitle>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//               title="Add Transaction"
//             >
//               <PlusCircle className="w-6 h-6 text-blue-600" />
//             </button>
//           </CardHeader>
//           <CardContent><div className="text-2xl font-bold">INR : {usedAmount.toLocaleString()}</div></CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Budget</CardTitle>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//               title="Update Budget"
//             >
//               <PlusCircle className="w-6 h-6 text-blue-600" />
//             </button>
//           </CardHeader>
//           <CardContent><div className="text-2xl font-bold">INR : {totalAmount.toLocaleString()}</div></CardContent>
//         </Card>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-blue-950 h-screen flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Add New Transaction</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             <form onSubmit={addExpense} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   value={newExpense.description}
//                   onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
//                   className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter description"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   value={newExpense.amount}
//                   onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
//                   className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter amount"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   value={newExpense.date}
//                   onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
//                   className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {isUpdating ? 'Adding...' : 'Add Transaction'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Chart & Transactions */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart Section */}
//         <div className="bg-blue-100 text-black p-6 rounded-2xl shadow-lg">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="font-bold text-lg">Available</p>
//               <p className="text-sm">this Month</p>
//               <p className="text-2xl font-bold mt-2">INR : {balance.toLocaleString()}</p>
//             </div>
//           </div>

//           <div className="flex justify-center items-center relative mt-6">
//             <ResponsiveContainer width="100%" height={200}>
//               <RadialBarChart cx="50%" cy="50%" innerRadius="85%" outerRadius="130%" barSize={12} data={data}>
//                 <RadialBar dataKey="value" data={[data[1]]} fill={data[1].fill} />
//                 <RadialBar dataKey="value" data={[data[0]]} fill={data[0].fill} />
//               </RadialBarChart>
//             </ResponsiveContainer>
//             <div className="absolute flex flex-col items-center justify-center">
//               <p className="text-2xl font-bold">INR : {usedAmount.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="lg:col-span-2">
//           <div className="border rounded-lg">
//             <div className="max-h-[400px] overflow-y-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Description</TableHead>
//                     <TableHead>Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {event.expenses.map((expense, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
//                       <TableCell>{expense.description}</TableCell>
//                       <TableCell className="text-right">
//                         <span className={expense.amount > 0 ? "text-green-600" : "text-red-600"}>
//                           INR : {Math.abs(expense.amount).toFixed(2)}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { PlusCircle } from "lucide-react"
import { toast } from 'react-toastify';

export default function Eventdetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newBudget, setNewBudget] = useState("")
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setEvent(data)
      setNewBudget(data.budget)
    } catch (err) {
      setError("Failed to fetch event details")
      console.error("Error fetching event details:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateBudget = async () => {
    if (!newBudget || newBudget.trim() === "") {
      toast.error("Please enter a valid budget amount.", {
        position: "top-right",
        autoClose: 3000, // Toast disappears in 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return
    }
    setIsUpdating(true)
    try {
      const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          budget: Number.parseFloat(newBudget),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchEventDetails()
    } catch (err) {
      setError("Failed to update budget")
      console.error("Error updating budget:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const addExpense = async (e) => {
    e.preventDefault()
    if (!newExpense.description || newExpense.description.trim() === "") {
      toast.error("Please enter a valid expense description.", {
        position: "top-right",
        autoClose: 3000, // Toast disappears in 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return
    }
    if (!newExpense.amount || newExpense.amount.trim() === "") {
      toast.error("Please enter a valid expense amount.", {
        position: "top-right",
        autoClose: 3000, // Toast disappears in 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return
    }
    if (!newExpense.date) {
      toast.error("Please select a valid date for the expense.", {
        position: "top-right",
        autoClose: 3000, // Toast disappears in 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return
    }
    setIsUpdating(true)
    try {
      const newExpenseData = {
        ...newExpense,
        amount: Number.parseFloat(newExpense.amount),
        date: new Date(newExpense.date).toISOString(),
      }

      const updatedExpenses = [...event.expenses, newExpenseData]
      const updatedTotalSpent = event.totalSpent + newExpenseData.amount

      const response = await fetch(`https://fin-ctrl-1.onrender.com/FinCtrl/event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          expenses: updatedExpenses,
          totalSpent: updatedTotalSpent,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setNewExpense({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      })
      await fetchEventDetails()
    } catch (err) {
      setError("Failed to add expense")
      console.error("Error adding expense:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>

  const totalAmount = event.budget
  const usedAmount = event.totalSpent
  const balance = totalAmount - usedAmount
  const percentage = (usedAmount / totalAmount) * 100

  const data = [
    { name: "Used", value: percentage, fill: "#000" },
    { name: "Remaining", value: 100 - percentage, fill: "#60a5fa" },
  ]

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
            <div className="text-2xl font-bold">INR : {usedAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR : {balance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR : {totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Expense Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
        {/* Chart Section */}
        <div className="bg-blue-100 text-black p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Available</p>
              <p className="text-sm">this Month</p>
              <p className="text-2xl font-bold mt-2">INR : {balance.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">INR : {usedAmount.toLocaleString()}</p>
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
                          INR : {Math.abs(expense.amount).toFixed(2)}
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
  )
}


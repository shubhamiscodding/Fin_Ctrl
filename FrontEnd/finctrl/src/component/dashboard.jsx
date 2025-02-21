import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

export default function Dashboard() {
  const totalAmount = 18000;
  const usedAmount = 17000;
  const Balance = totalAmount - usedAmount;
  const percentage = (usedAmount / totalAmount) * 100;



  const transactions = [
    {
      id: "1",
      date: "2023-06-01",
      description: "Grocery Shopping",
      category: "Food & Dining",
      amount: -120.5,
    },
    {
      id: "2",
      date: "2023-05-31",
      description: "Salary Deposit",
      category: "Income",
      amount: 3000.0,
    },
    {
      id: "3",
      date: "2023-05-30",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: -14.99,
    },
    {
      id: "4",
      date: "2023-05-29",
      description: "Stock Investment",
      category: "Investment",
      amount: -500.0,
    },
    {
      id: "4",
      date: "2023-05-29",
      description: "Stock Investment",
      category: "Investment",
      amount: -500.0,
    },
    {
      id: "4",
      date: "2023-05-29",
      description: "Stock Investment",
      category: "Investment",
      amount: -500.0,
    },
    {
      id: "4",
      date: "2023-05-29",
      description: "Stock Investment",
      category: "Investment",
      amount: -500.0,
    },
  ]




  const data = [
    { name: "Used", value: percentage, fill: "#111" },
    { name: "Remaining", value: 100, fill: "#fff" },
  ];

  return (
    <>

      <div className="p-8">
        <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="w-70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,234.56</div>
            </CardContent>
          </Card>
          <Card className="w-70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$567.89</div>
            </CardContent>
          </Card>
          <Card className="w-70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,345.67</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Circular Chart Card */}
      <div className="bg-green-100 text-black p-6 rounded-2xl w-64 h-85 shadow-lg flex flex-col relative ml-265 -mt-33">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">Available</p>
            <p className="text-sm">this Month</p>
            <p className="text-2xl font-bold mt-2">${totalAmount.toLocaleString()}</p>
          </div>
          <button className="text-sm bg-white text-gray-800 px-3 py-1 rounded-full">Change</button>
        </div>

        {/* Circular Progress Chart */}
        <div className="flex-grow flex justify-center items-center relative mt-10">
          <ResponsiveContainer width={150} height={150}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={12} data={data}>
              {/* Background Bar */}
              <RadialBar dataKey="value" data={[data[1]]} fill={data[1].fill} />
              {/* Foreground Progress Bar */}
              <RadialBar dataKey="value" data={[data[0]]} fill={data[0].fill} />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">${usedAmount.toLocaleString()}</p>
            <p className="text-sm">17 December</p>
          </div>
        </div>
      </div>
      {/* <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={mockTransactions} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={mockTransactions} />
          </CardContent>
        </Card> */}
      <div className="space-y-6 w-[960px] ml-8 absolute top-50 h-[250px] overflow-y-scroll ">
        {/* <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button>Add New Transaction</Button>
        </div> */}
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </>
  );
}

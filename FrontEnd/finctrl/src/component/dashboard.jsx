import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"


export default function Dashboard() {
    return (
      <div className="p-8">
        <div className="grid md:grid-cols-1 lg:grid-cols-4">
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
    )
  }
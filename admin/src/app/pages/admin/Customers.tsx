import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter } from 'lucide-react';

const customers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', orders: 5, totalSpent: 12500, status: 'active' },
  { id: '2', name: 'Anjali Patel', email: 'anjali@example.com', phone: '+91 98765 43211', orders: 3, totalSpent: 8200, status: 'active' },
  { id: '3', name: 'Neha Kumar', email: 'neha@example.com', phone: '+91 98765 43212', orders: 7, totalSpent: 18900, status: 'active' },
  { id: '4', name: 'Kavya Reddy', email: 'kavya@example.com', phone: '+91 98765 43213', orders: 2, totalSpent: 5400, status: 'inactive' },
];

export function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer relationships</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input placeholder="Search customers..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="size-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{customer.email}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{customer.phone}</td>
                    <td className="py-3 px-4">{customer.orders}</td>
                    <td className="py-3 px-4 font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={customer.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}>
                        {customer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

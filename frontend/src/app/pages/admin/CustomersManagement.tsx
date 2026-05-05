import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';

export function CustomersManagement() {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers from orders
  const customers = Array.from(
    new Map(
      orders.map((order) => [
        order.customer.id,
        {
          ...order.customer,
          totalOrders: orders.filter((o) => o.customer.id === order.customer.id).length,
          totalSpent: orders
            .filter((o) => o.customer.id === order.customer.id)
            .reduce((sum, o) => sum + o.totalWithGST, 0),
          lastOrder: Math.max(
            ...orders
              .filter((o) => o.customer.id === order.customer.id)
              .map((o) => new Date(o.orderDate).getTime())
          ),
          address: order.shippingAddress,
        },
      ])
    ).values()
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your customer database
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Customers
                </p>
                <p className="text-3xl font-bold mt-2">{customers.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Active This Month
              </p>
              <p className="text-3xl font-bold mt-2">{customers.length}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                100% active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Avg Orders per Customer
              </p>
              <p className="text-3xl font-bold mt-2">
                {customers.length > 0
                  ? (orders.length / customers.length).toFixed(1)
                  : '0'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Avg Customer Value
              </p>
              <p className="text-3xl font-bold mt-2">
                ₹
                {customers.length > 0
                  ? Math.round(
                      orders.reduce((sum, o) => sum + o.totalWithGST, 0) /
                        customers.length
                    ).toLocaleString('en-IN')
                  : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {customer.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3 text-muted-foreground" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="size-3 text-muted-foreground" />
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="size-3 text-muted-foreground" />
                        <span>
                          {customer.address.city}, {customer.address.state}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.totalOrders} orders</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{customer.totalSpent.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.lastOrder).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

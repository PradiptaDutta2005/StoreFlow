import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Filter, Download, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  _id: string;
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  orderDate: Date;
  totalAmount: number;
  status: 'pending' | 'completed';
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data.map(order => ({
        ...order,
        orderDate: new Date(order.orderDate)
      })));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const daysDiff = (date: Date) => Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => daysDiff(order.orderDate) === 0);
          break;
        case '7days':
          filtered = filtered.filter(order => daysDiff(order.orderDate) <= 7);
          break;
        case '30days':
          filtered = filtered.filter(order => daysDiff(order.orderDate) <= 30);
          break;
      }
    }

    setFilteredOrders(filtered);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer ID', 'Date', 'Items', 'Total Amount', 'Status'],
      ...filteredOrders.map(order => [
        order.orderId,
        order.customerId,
        order.orderDate.toLocaleDateString(),
        order.items.length.toString(),
        order.totalAmount.toFixed(2),
        order.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported to CSV');
  };

  const generateSalesReport = () => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    
    toast.success(`Sales Report Generated:
    • Total Orders: ${filteredOrders.length}
    • Completed Orders: ${completedOrders}
    • Total Revenue: $${totalRevenue.toFixed(2)}
    • Average Order Value: $${avgOrderValue.toFixed(2)}`);
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-store-blue mb-2">Order Overview</h1>
          <p className="text-gray-600">Monitor all orders and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateSalesReport} variant="outline" className="border-store-blue text-store-blue hover:bg-blue-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sales Report
          </Button>
          <Button onClick={exportOrders} variant="outline" className="border-store-blue text-store-blue hover:bg-blue-50">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {dateFilter === 'all' ? 'All time' : `Last ${dateFilter}`}
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {filteredOrders.length > 0 ? `${((completedOrders / filteredOrders.length) * 100).toFixed(1)}% completion rate` : 'No orders'}
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredOrders.length} orders
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-store-blue">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 store-input"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500 flex items-center">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-store-blue">Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.orderId} className="hover:bg-blue-50">
                      <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                      <TableCell>{order.customerId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{order.orderDate.toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{order.items.length} items</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-store-blue">${order.totalAmount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredOrders.length === 0 && !loading && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
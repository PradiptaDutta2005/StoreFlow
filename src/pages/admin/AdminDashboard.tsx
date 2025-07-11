import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalEmployees: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  pendingAlerts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [products, customers, employees, orders, alerts] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getEmployees(),
        api.getOrders(),
        api.getAlerts()
      ]);

      // Calculate stats
      const lowStockProducts = products.filter(p => p.stockQuantity < 10);
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => 
        new Date(o.orderDate).toISOString().split('T')[0] === today
      );
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingAlerts = alerts.filter(a => a.status === 'pending');

      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStockProducts.length,
        totalCustomers: customers.length,
        totalEmployees: employees.length,
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        totalRevenue,
        pendingAlerts: pendingAlerts.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Products in inventory'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500',
      description: 'Items below 10 units'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      description: 'Registered customers'
    },
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Active employees'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'All time orders'
    },
    {
      title: "Today's Orders",
      value: stats?.todayOrders || 0,
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-cyan-600',
      description: 'Orders processed today'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      description: 'All time revenue'
    },
    {
      title: 'Pending Alerts',
      value: stats?.pendingAlerts || 0,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      description: 'Unresolved alerts'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-store-blue mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete overview of your store operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="store-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-2xl font-bold text-store-blue">
                        {stat.value}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-xl text-store-blue">Quick Actions</CardTitle>
          <CardDescription>
            Administrative tasks and system management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <Package className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Manage Stock</h3>
              <p className="text-sm text-gray-600">Full inventory control and product management</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <Users className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage employees, customers, and access</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <ShoppingCart className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Order Overview</h3>
              <p className="text-sm text-gray-600">Monitor all orders and transactions</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <TrendingUp className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Reports</h3>
              <p className="text-sm text-gray-600">Sales analytics and performance reports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="text-store-blue">System Health</CardTitle>
            <CardDescription>
              Current system status and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">System Status</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Database</span>
                </div>
                <span className="text-blue-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Low Stock Alerts</span>
                </div>
                <span className="text-yellow-600 font-medium">{stats?.lowStockProducts || 0} items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader>
            <CardTitle className="text-store-blue">Recent Activity</CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New customer registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Order completed</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Low stock alert triggered</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Employee alert sent</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
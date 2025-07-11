
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todayOrders: number;
  pendingAlerts: number;
}

const StorekeeperDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products for total and low stock count
      const products = await api.getProducts();
      const lowStockProducts = products.filter(p => p.stockQuantity < 10);
      
      // Fetch today's orders
      const today = new Date().toISOString().split('T')[0];
      const orders = await api.getOrders({ startDate: today });
      
      // Fetch pending alerts (mock for now)
      const alerts = await api.getAlerts();
      const pendingAlerts = alerts.filter(a => a.status === 'pending');

      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStockProducts.length,
        todayOrders: orders.length,
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
      title: "Today's Orders",
      value: stats?.todayOrders || 0,
      icon: ShoppingCart,
      gradient: 'from-green-500 to-green-600',
      description: 'Orders processed today'
    },
    {
      title: 'Pending Alerts',
      value: stats?.pendingAlerts || 0,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Alerts awaiting action'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-store-blue mb-2">Storekeeper Dashboard</h1>
        <p className="text-gray-600">Monitor your store operations and manage inventory</p>
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
                      <Skeleton className="h-8 w-12" />
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
            Common tasks to help you manage your store efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <Package className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Manage Stock</h3>
              <p className="text-sm text-gray-600">Add, update, or remove products from your inventory</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <ShoppingCart className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Register Orders</h3>
              <p className="text-sm text-gray-600">Process customer orders and manage transactions</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue">
              <AlertTriangle className="w-8 h-8 text-store-blue mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Send Alerts</h3>
              <p className="text-sm text-gray-600">Notify employees about important tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorekeeperDashboard;

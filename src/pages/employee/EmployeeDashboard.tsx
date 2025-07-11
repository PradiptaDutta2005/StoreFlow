import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckSquare, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';

interface Alert {
  _id: string;
  alertId: string;
  message: string;
  employeeId: string;
  timestamp: Date;
  status: 'pending' | 'delivered';
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.employeeId) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts({ employeeId: user?.employeeId });
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await api.updateAlert(alertId, { status: 'delivered' });
      setAlerts(alerts.map(alert => 
        alert.alertId === alertId ? { ...alert, status: 'delivered' } : alert
      ));
      toast.success('Alert marked as read');
    } catch (error) {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert');
    }
  };

  const pendingAlerts = alerts.filter(alert => alert.status === 'pending');
  const completedTasks = alerts.filter(alert => alert.status === 'delivered').length;

  const stats = [
    {
      title: 'Pending Alerts',
      value: pendingAlerts.length,
      icon: Bell,
      gradient: 'from-orange-500 to-red-500',
      description: 'Alerts requiring attention'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckSquare,
      gradient: 'from-green-500 to-green-600',
      description: 'Tasks completed today'
    },
    {
      title: 'Total Alerts',
      value: alerts.length,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-600',
      description: 'All alerts received'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-store-blue to-store-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Stay on top of your tasks and alerts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="store-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Alerts */}
      <Card className="store-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-store-blue" />
              Recent Alerts
            </CardTitle>
            <Link to="/employee/alerts">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <CardDescription>
            Latest alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.alertId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <Badge 
                        variant={alert.status === 'pending' ? 'destructive' : 'secondary'}
                        className={alert.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {alert.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => markAlertAsRead(alert.alertId)}
                      className="store-button ml-4"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No alerts yet</p>
              <p className="text-sm">You'll see notifications here when they arrive</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-store-blue">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you stay productive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/employee/alerts" className="group">
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue group-hover:bg-blue-50">
                <Bell className="w-8 h-8 text-store-blue mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">View All Alerts</h3>
                <p className="text-sm text-gray-600">Check all pending and completed alerts</p>
              </div>
            </Link>
            <Link to="/employee/tasks" className="group">
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue group-hover:bg-blue-50">
                <CheckSquare className="w-8 h-8 text-store-blue mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Manage Tasks</h3>
                <p className="text-sm text-gray-600">Track and complete your assigned tasks</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
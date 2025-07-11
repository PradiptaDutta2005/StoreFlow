import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface Alert {
  _id: string;
  alertId: string;
  message: string;
  employeeId: string;
  timestamp: Date;
  status: 'pending' | 'delivered';
}

const EmployeeAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.employeeId) {
      fetchAlerts();
    }
  }, [user]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, statusFilter]);

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

  const filterAlerts = () => {
    let filtered = alerts;
    if (statusFilter !== 'all') {
      filtered = alerts.filter(alert => alert.status === statusFilter);
    }
    setFilteredAlerts(filtered);
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

  const markAllAsRead = async () => {
    const pendingAlerts = alerts.filter(alert => alert.status === 'pending');
    
    if (pendingAlerts.length === 0) {
      toast.info('No pending alerts to mark as read');
      return;
    }

    try {
      await Promise.all(
        pendingAlerts.map(alert => 
          api.updateAlert(alert.alertId, { status: 'delivered' })
        )
      );
      
      setAlerts(alerts.map(alert => ({ ...alert, status: 'delivered' })));
      toast.success(`Marked ${pendingAlerts.length} alerts as read`);
    } catch (error) {
      console.error('Error updating alerts:', error);
      toast.error('Failed to update alerts');
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'pending' ? (
      <AlertTriangle className="w-4 h-4 text-orange-500" />
    ) : (
      <CheckCircle className="w-4 h-4 text-green-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'pending' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-store-blue mb-2">Alerts</h1>
          <p className="text-gray-600">Manage your notifications and alerts</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Bell className="w-5 h-5 text-store-blue" />
          <span className="text-sm text-gray-500">{filteredAlerts.length} alerts</span>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivered">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={markAllAsRead}
              className="store-button"
              disabled={alerts.filter(a => a.status === 'pending').length === 0}
            >
              Mark All as Read
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-store-blue">
            {statusFilter === 'all' ? 'All Alerts' : 
             statusFilter === 'pending' ? 'Pending Alerts' : 'Completed Alerts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.alertId} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(alert.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.message}</h3>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(alert.timestamp).toLocaleDateString()} at{' '}
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Alert ID: {alert.alertId}</p>
                    </div>
                  </div>
                  
                  {alert.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => markAlertAsRead(alert.alertId)}
                        className="store-button min-h-[48px] px-4"
                      >
                        Mark as Read
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {statusFilter === 'pending' ? 'No Pending Alerts' : 
                 statusFilter === 'delivered' ? 'No Completed Alerts' : 'No Alerts'}
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'pending' 
                  ? 'All caught up! No pending alerts at the moment.'
                  : statusFilter === 'delivered'
                  ? 'No completed alerts to show.'
                  : 'You have no alerts yet. They will appear here when received.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAlerts;
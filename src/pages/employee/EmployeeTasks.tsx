import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  alertId: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'delivered';
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const EmployeeTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.employeeId) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const alerts = await api.getAlerts({ employeeId: user?.employeeId });
      
      // Convert alerts to tasks with additional metadata
      const tasksData = alerts.map((alert: any) => ({
        alertId: alert.alertId,
        message: alert.message,
        timestamp: new Date(alert.timestamp),
        status: alert.status,
        priority: getTaskPriority(alert.message),
        category: getTaskCategory(alert.message)
      }));
      
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTaskPriority = (message: string): 'low' | 'medium' | 'high' => {
    const lowPriorityKeywords = ['organize', 'clean', 'arrange'];
    const highPriorityKeywords = ['urgent', 'emergency', 'immediate', 'safety', 'customer complaint'];
    
    const lowerMessage = message.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'high';
    }
    if (lowPriorityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'low';
    }
    return 'medium';
  };

  const getTaskCategory = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('restock') || lowerMessage.includes('inventory')) {
      return 'Inventory';
    }
    if (lowerMessage.includes('clean') || lowerMessage.includes('spill')) {
      return 'Maintenance';
    }
    if (lowerMessage.includes('customer') || lowerMessage.includes('assistance')) {
      return 'Customer Service';
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('check')) {
      return 'Price Management';
    }
    if (lowerMessage.includes('safety') || lowerMessage.includes('inspection')) {
      return 'Safety';
    }
    return 'General';
  };

  const completeTask = async (alertId: string) => {
    try {
      await api.updateAlert(alertId, { status: 'delivered' });
      setTasks(tasks.map(task => 
        task.alertId === alertId ? { ...task, status: 'delivered' } : task
      ));
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Inventory':
        return <Package className="w-4 h-4" />;
      case 'Customer Service':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckSquare className="w-4 h-4" />;
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'delivered');

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-store-blue mb-2">Tasks</h1>
        <p className="text-gray-600">Track and manage your work assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Tasks awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Tasks finished
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-store-blue">{tasks.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              All assigned tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="flex items-center text-store-blue">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Pending Tasks ({pendingTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : pendingTasks.length > 0 ? (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div 
                  key={task.alertId} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:border-store-blue"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.message}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {task.category}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Assigned {task.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => completeTask(task.alertId)}
                    className="store-button min-h-[48px] px-4 ml-4"
                  >
                    Complete Task
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Tasks Completed!</h3>
              <p className="text-gray-500">Great job! You have no pending tasks at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Completed Tasks ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.alertId} 
                  className="flex items-center space-x-4 p-4 border rounded-lg bg-green-50 border-green-200"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{task.message}</h3>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {task.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Completed on {task.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeTasks;
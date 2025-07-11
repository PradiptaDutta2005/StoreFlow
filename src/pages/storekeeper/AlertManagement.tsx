
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Users } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  alerts: Array<{
    alertId: string;
    message: string;
    timestamp: Date;
    status: string;
  }>;
}

const AlertManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  const sendAlert = async () => {
    if (!selectedEmployeeId) {
      toast.error('Please select an employee');
      return;
    }

    if (!alertMessage.trim()) {
      toast.error('Please enter an alert message');
      return;
    }

    try {
      setLoading(true);

      // Create alert
      const alertId = `ALERT${Date.now()}`;
      const alertData = {
        alertId,
        message: alertMessage,
        employeeId: selectedEmployeeId,
        timestamp: new Date(),
        status: 'pending'
      };

      await api.createAlert(alertData);

      // Update employee with new alert
      const employee = employees.find(emp => emp.employeeId === selectedEmployeeId);
      if (employee) {
        const updatedAlerts = [
          ...employee.alerts,
          {
            alertId,
            message: alertMessage,
            timestamp: new Date(),
            status: 'pending'
          }
        ];

        await api.updateEmployee(selectedEmployeeId, { alerts: updatedAlerts });

        // Update local state
        setEmployees(employees.map(emp => 
          emp.employeeId === selectedEmployeeId 
            ? { ...emp, alerts: updatedAlerts }
            : emp
        ));
      }

      // Reset form
      setSelectedEmployeeId('');
      setAlertMessage('');

      toast.success('Alert sent successfully!');
    } catch (error) {
      console.error('Error sending alert:', error);
      toast.error('Failed to send alert');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkAlert = async () => {
    if (!alertMessage.trim()) {
      toast.error('Please enter an alert message');
      return;
    }

    if (!confirm('Send this alert to all employees?')) {
      return;
    }

    try {
      setLoading(true);

      for (const employee of employees) {
        const alertId = `ALERT${Date.now()}_${employee.employeeId}`;
        const alertData = {
          alertId,
          message: alertMessage,
          employeeId: employee.employeeId,
          timestamp: new Date(),
          status: 'pending'
        };

        // Create alert
        await api.createAlert(alertData);

        // Update employee
        const updatedAlerts = [
          ...employee.alerts,
          {
            alertId,
            message: alertMessage,
            timestamp: new Date(),
            status: 'pending'
          }
        ];

        await api.updateEmployee(employee.employeeId, { alerts: updatedAlerts });
      }

      // Refresh employees data
      await fetchEmployees();

      // Reset form
      setAlertMessage('');

      toast.success(`Alert sent to all ${employees.length} employees!`);
    } catch (error) {
      console.error('Error sending bulk alert:', error);
      toast.error('Failed to send bulk alert');
    } finally {
      setLoading(false);
    }
  };

  const alertPresets = [
    "Restock needed in produce section",
    "Customer assistance required at checkout",
    "Clean-up needed in aisle 5",
    "Price check required on dairy products",
    "Inventory count needed for beverages",
    "Safety inspection scheduled for tomorrow",
    "New product delivery arriving soon",
    "Staff meeting at 3 PM today"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-store-blue mb-2">Alert Management</h1>
        <p className="text-gray-600">Send notifications and updates to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Alert Form */}
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center text-store-blue">
              <Bell className="w-5 h-5 mr-2" />
              Send Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employee">Select Employee</Label>
              {employeesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger className="store-input">
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.employeeId} value={employee.employeeId}>
                        {employee.name} ({employee.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="message">Alert Message</Label>
              <Textarea
                id="message"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Enter your alert message..."
                rows={4}
                className="store-input"
              />
            </div>

            <div>
              <Label>Quick Messages</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {alertPresets.slice(0, 4).map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setAlertMessage(preset)}
                    className="text-left justify-start h-auto py-2 px-3 text-sm border-gray-200 hover:bg-blue-50 hover:border-store-blue"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={sendAlert}
                disabled={loading || !selectedEmployeeId || !alertMessage.trim()}
                className="flex-1 store-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send Alert'}
              </Button>
              <Button 
                onClick={sendBulkAlert}
                disabled={loading || !alertMessage.trim()}
                variant="outline"
                className="flex-1 border-store-blue text-store-blue hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Send to All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Status */}
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center text-store-blue">
              <Users className="w-5 h-5 mr-2" />
              Employee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {employees.map((employee) => {
                  const pendingAlerts = employee.alerts?.filter(alert => alert.status === 'pending').length || 0;
                  const totalAlerts = employee.alerts?.length || 0;

                  return (
                    <div key={employee.employeeId} className="p-4 border rounded-lg hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                          <p className="text-sm text-gray-600">{employee.employeeId}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            <span className={`font-medium ${pendingAlerts > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {pendingAlerts} pending
                            </span>
                            <span className="text-gray-500"> / {totalAlerts} total</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {pendingAlerts > 0 ? (
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                            ) : (
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {pendingAlerts > 0 ? 'Has pending alerts' : 'All caught up'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {employees.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No employees found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* More Quick Messages */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-store-blue">More Quick Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {alertPresets.slice(4).map((preset, index) => (
              <Button
                key={index + 4}
                variant="outline"
                size="sm"
                onClick={() => setAlertMessage(preset)}
                className="text-left justify-start h-auto py-2 px-3 text-sm border-gray-200 hover:bg-blue-50 hover:border-store-blue"
              >
                {preset}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertManagement;

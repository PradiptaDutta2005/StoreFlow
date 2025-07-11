import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Trash2, Search, Star, Phone } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  _id: string;
  phoneNumber: string;
  name: string;
  loyaltyPoints: number;
  orderHistory: string[];
}

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

const AdminUsers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [customersData, employeesData] = await Promise.all([
        api.getCustomers(),
        api.getEmployees()
      ]);
      setCustomers(customersData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!newEmployee.name || !newEmployee.employeeId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const employeeData = {
        employeeId: newEmployee.employeeId,
        name: newEmployee.name,
        alerts: []
      };

      const createdEmployee = await api.createEmployee(employeeData);
      setEmployees([...employees, createdEmployee]);
      setNewEmployee({ name: '', employeeId: '' });
      setShowAddEmployee(false);
      toast.success('Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.deleteEmployee(employeeId);
      setEmployees(employees.filter(e => e.employeeId !== employeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-store-blue mb-2">User Management</h1>
          <p className="text-gray-600">Manage customers, employees, and user access</p>
        </div>
        <Button onClick={() => setShowAddEmployee(!showAddEmployee)} className="store-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Add Employee Form */}
      {showAddEmployee && (
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="text-store-blue">Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Enter employee name"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  placeholder="e.g., EMP001"
                  className="store-input"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addEmployee} className="store-button">
                Add Employee
              </Button>
              <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="store-card">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 store-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Tables */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Customers ({filteredCustomers.length})</TabsTrigger>
          <TabsTrigger value="employees">Employees ({filteredEmployees.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card className="store-card">
            <CardHeader>
              <CardTitle className="flex items-center text-store-blue">
                <Users className="w-5 h-5 mr-2" />
                Customer Management
              </CardTitle>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Loyalty Points</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.phoneNumber} className="hover:bg-blue-50">
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{customer.phoneNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{customer.loyaltyPoints}</span>
                              <span className="text-sm text-gray-500">
                                (${(customer.loyaltyPoints * 0.5).toFixed(2)} value)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{customer.orderHistory?.length || 0}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={customer.loyaltyPoints > 50 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {customer.loyaltyPoints > 50 ? 'VIP' : 'Regular'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredCustomers.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No customers found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card className="store-card">
            <CardHeader>
              <CardTitle className="flex items-center text-store-blue">
                <Users className="w-5 h-5 mr-2" />
                Employee Management
              </CardTitle>
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
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Total Alerts</TableHead>
                        <TableHead>Pending Alerts</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => {
                        const pendingAlerts = employee.alerts?.filter(alert => alert.status === 'pending').length || 0;
                        const totalAlerts = employee.alerts?.length || 0;
                        
                        return (
                          <TableRow key={employee.employeeId} className="hover:bg-blue-50">
                            <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{totalAlerts}</TableCell>
                            <TableCell>
                              {pendingAlerts > 0 ? (
                                <Badge variant="destructive">{pendingAlerts}</Badge>
                              ) : (
                                <Badge variant="secondary">0</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={pendingAlerts === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                              >
                                {pendingAlerts === 0 ? 'Available' : 'Busy'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteEmployee(employee.employeeId)}
                                className="w-8 h-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {filteredEmployees.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No employees found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              Current staff members
            </p>
          </CardContent>
        </Card>

        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.loyaltyPoints > 50).length}
            </div>
            <p className="text-xs text-muted-foreground">
              High-value customers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Package, ArrowLeft, Smartphone, Mail, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const defaultPortal = searchParams.get('portal') || 'customer';
  const [selectedPortal, setSelectedPortal] = useState(defaultPortal);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const portals = {
    customer: { title: 'Customer Portal', icon: Smartphone, description: 'Access your orders and loyalty points' },
    storekeeper: { title: 'Storekeeper Portal', icon: Package, description: 'Manage inventory and process orders' },
    employee: { title: 'Employee Portal', icon: KeyRound, description: 'View alerts and manage tasks' },
    admin: { title: 'Admin Portal', icon: Mail, description: 'Complete system administration' }
  };

  const handleCustomerLogin = async () => {
    if (!phoneNumber || !password) {
      toast.error('Please enter both phone number and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify customer credentials
      const customer = await api.getCustomer(phoneNumber);
      
      // In a real app, password would be hashed and compared securely
      if (customer.password !== password) {
        toast.error('Invalid credentials');
        setIsLoading(false);
        return;
      }

      login({
        id: phoneNumber,
        role: 'customer',
        phoneNumber: phoneNumber,
        name: customer.name
      });
      
      toast.success(`Welcome, ${customer.name}!`);
      navigate('/customer');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Demo credentials
    const demoCredentials = {
      storekeeper: { email: 'keeper@store.com', password: 'password', name: 'Demo Storekeeper' },
      employee: { email: 'emp@store.com', password: 'password', name: 'Demo Employee', employeeId: 'EMP001' },
      admin: { email: 'admin@store.com', password: 'password', name: 'Demo Admin' }
    };

    const credentials = demoCredentials[selectedPortal as keyof typeof demoCredentials];
    
    if (!credentials || email !== credentials.email || password !== credentials.password) {
      toast.error('Invalid credentials. Check demo credentials below.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
  const loginPayload: any = {
    id: email,
    role: selectedPortal,
    name: credentials.name
  };

  if (selectedPortal === 'employee' && 'employeeId' in credentials) {
    loginPayload.employeeId = credentials.employeeId;
  }

  login(loginPayload);
  toast.success('Login successful!');
  navigate(`/${selectedPortal}`);
  setIsLoading(false);
}, 1000);

  };

  const isCustomerPortal = selectedPortal === 'customer';
  const PortalIcon = portals[selectedPortal as keyof typeof portals].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-store-blue hover:text-store-blue-dark mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-store-blue to-store-blue-light rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-store-blue to-store-blue-dark bg-clip-text text-transparent">
              StoreFlow
            </h1>
          </div>
        </div>

        <Card className="store-card animate-fade-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-store-blue to-store-blue-light rounded-xl flex items-center justify-center mx-auto mb-4">
              <PortalIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {portals[selectedPortal as keyof typeof portals].title}
            </CardTitle>
            <CardDescription>
              {portals[selectedPortal as keyof typeof portals].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Portal Selection */}
            <div className="space-y-2">
              <Label htmlFor="portal">Select Portal</Label>
              <Select value={selectedPortal} onValueChange={setSelectedPortal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(portals).map(([key, portal]) => (
                    <SelectItem key={key} value={key}>
                      {portal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Login Form */}
            {isCustomerPortal ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="store-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="store-input"
                  />
                </div>
                <Button 
                  onClick={handleCustomerLogin} 
                  className="w-full store-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/customer/signup" className="text-store-blue hover:text-store-blue-dark font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              /* Staff Login Form */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="store-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="store-input"
                  />
                </div>
                <Button 
                  onClick={handleStaffLogin} 
                  className="w-full store-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                {/* Demo Credentials */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-store-blue mb-2">Demo Credentials:</p>
                  <div className="text-xs space-y-1 text-gray-600">
                    {selectedPortal === 'storekeeper' && (
                      <>
                        <p>Email: keeper@store.com</p>
                        <p>Password: password</p>
                      </>
                    )}
                    {selectedPortal === 'employee' && (
                      <>
                        <p>Email: emp@store.com</p>
                        <p>Password: password</p>
                      </>
                    )}
                    {selectedPortal === 'admin' && (
                      <>
                        <p>Email: admin@store.com</p>
                        <p>Password: password</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

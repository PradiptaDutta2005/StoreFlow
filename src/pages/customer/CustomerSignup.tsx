import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, ArrowLeft, UserPlus, Phone, User, Lock, Star } from "lucide-react";
import { api } from '@/services/api';
import { toast } from 'sonner';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    password: '',
    confirmPassword: '',
    loyaltyPoints: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.phoneNumber || !formData.name || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.phoneNumber.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if phone number already exists
      try {
        await api.getCustomer(formData.phoneNumber);
        toast.error('Phone number already exists');
        setIsLoading(false);
        return;
      } catch (error) {
        // Phone number doesn't exist, proceed with signup
      }

      // Create new customer
      const customerData = {
        phoneNumber: formData.phoneNumber,
        name: formData.name,
        password: formData.password,
        loyaltyPoints: formData.loyaltyPoints || 0,
        orderHistory: []
      };

      await api.createCustomer(customerData);
      
      toast.success('Account created successfully!');
      navigate('/login?portal=customer');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login?portal=customer" className="inline-flex items-center text-store-blue hover:text-store-blue-dark mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join StoreFlow to track orders and earn loyalty points
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-store-blue" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="store-input"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-store-blue" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="store-input"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-store-blue" />
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="store-input"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-store-blue" />
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="store-input"
                />
              </div>

              {/* Loyalty Points (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="loyaltyPoints" className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Initial Loyalty Points (Optional)
                </Label>
                <Input
                  id="loyaltyPoints"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.loyaltyPoints}
                  onChange={(e) => handleInputChange('loyaltyPoints', parseInt(e.target.value) || 0)}
                  className="store-input"
                />
                <p className="text-xs text-gray-500">Leave blank to start with 0 points</p>
              </div>
            </div>

            <Button 
              onClick={handleSignup} 
              className="w-full store-button min-h-[48px]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login?portal=customer" className="text-store-blue hover:text-store-blue-dark font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSignup;
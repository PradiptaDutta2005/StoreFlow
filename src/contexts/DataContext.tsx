
import React, { createContext, useContext, useState } from 'react';

// Types for our data models
export interface Customer {
  phoneNumber: string;
  name: string;
  loyaltyPoints: number;
  orderHistory: string[];
}

export interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  aisle: string;
  shelf: string;
}

export interface Order {
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

export interface Employee {
  employeeId: string;
  name: string;
  alerts: Array<{
    alertId: string;
    message: string;
    timestamp: Date;
    status: 'pending' | 'delivered';
  }>;
}

export interface Alert {
  alertId: string;
  message: string;
  employeeId: string;
  timestamp: Date;
  status: 'pending' | 'delivered';
}

interface DataContextType {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  employees: Employee[];
  alerts: Alert[];
  updateCustomer: (phoneNumber: string, updates: Partial<Customer>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (alertId: string, updates: Partial<Alert>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock data - this will later be replaced with API calls
  const [customers, setCustomers] = useState<Customer[]>([
    {
      phoneNumber: '5551234567',
      name: 'John Doe',
      loyaltyPoints: 45,
      orderHistory: ['ORD001', 'ORD002']
    },
    {
      phoneNumber: '5559876543',
      name: 'Jane Smith',
      loyaltyPoints: 78,
      orderHistory: ['ORD003']
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      productId: 'PROD001',
      name: 'Sugar 1kg',
      category: 'Pantry',
      price: 2.99,
      stockQuantity: 50,
      aisle: 'A3',
      shelf: 'B'
    },
    {
      productId: 'PROD002',
      name: 'Whole Milk',
      category: 'Dairy',
      price: 3.49,
      stockQuantity: 25,
      aisle: 'A1',
      shelf: 'A'
    },
    {
      productId: 'PROD003',
      name: 'Basmati Rice 2kg',
      category: 'Grains',
      price: 5.99,
      stockQuantity: 30,
      aisle: 'A3',
      shelf: 'C'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: 'ORD001',
      customerId: '5551234567',
      items: [
        { productId: 'PROD001', name: 'Sugar 1kg', quantity: 2, price: 2.99 },
        { productId: 'PROD002', name: 'Whole Milk', quantity: 1, price: 3.49 }
      ],
      orderDate: new Date('2024-01-15'),
      totalAmount: 9.47,
      status: 'completed'
    }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      employeeId: 'EMP001',
      name: 'Alice Johnson',
      alerts: []
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const updateCustomer = (phoneNumber: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.phoneNumber === phoneNumber ? { ...customer, ...updates } : customer
    ));
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.productId === productId ? { ...product, ...updates } : product
    ));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.orderId === orderId ? { ...order, ...updates } : order
    ));
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [...prev, alert]);
    // Also update the employee's alerts
    setEmployees(prev => prev.map(emp => 
      emp.employeeId === alert.employeeId 
        ? { ...emp, alerts: [...emp.alerts, { 
            alertId: alert.alertId, 
            message: alert.message, 
            timestamp: alert.timestamp, 
            status: alert.status 
          }] }
        : emp
    ));
  };

  const updateAlert = (alertId: string, updates: Partial<Alert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.alertId === alertId ? { ...alert, ...updates } : alert
    ));
  };

  return (
    <DataContext.Provider value={{
      customers,
      products,
      orders,
      employees,
      alerts,
      updateCustomer,
      updateProduct,
      addOrder,
      updateOrder,
      addAlert,
      updateAlert
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

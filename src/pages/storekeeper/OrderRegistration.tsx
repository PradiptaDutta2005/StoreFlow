
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, Trash2, User, Receipt, UserPlus, Phone, Lock, Star } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Product {
  _id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  aisle: string;
  shelf: string;
}

interface Customer {
  _id: string;
  phoneNumber: string;
  name: string;
  loyaltyPoints: number;
  orderHistory: string[];
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

const OrderRegistration = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountPoints, setDiscountPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    phoneNumber: '',
    name: '',
    password: '',
    loyaltyPoints: 0
  });
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data.filter(p => p.stockQuantity > 0));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const searchCustomer = async () => {
    if (!phoneNumber) {
      toast.error('Please enter customer phone number');
      return;
    }

    try {
      setLoading(true);
      const customerData = await api.getCustomer(phoneNumber);
      setCustomer(customerData);
      toast.success('Customer found');
    } catch (error) {
      console.error('Error finding customer:', error);
      
      // Show dialog to create new customer
      setNewCustomerData({ ...newCustomerData, phoneNumber });
      setShowNewCustomerDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const addProductToOrder = () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const product = products.find(p => p.productId === selectedProductId);
    if (!product) return;

    const existingItem = orderItems.find(item => item.productId === selectedProductId);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error('Not enough stock available');
        return;
      }
      setOrderItems(orderItems.map(item =>
        item.productId === selectedProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.productId,
        name: product.name,
        quantity: 1,
        price: product.price
      }]);
    }

    setSelectedProductId('');
    toast.success('Product added to order');
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(productId);
      return;
    }

    const product = products.find(p => p.productId === productId);
    if (product && newQuantity > product.stockQuantity) {
      toast.error('Not enough stock available');
      return;
    }

    setOrderItems(orderItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItemFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
    toast.success('Item removed from order');
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return Math.min(discountPoints * 0.50, calculateSubtotal());
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateLoyaltyPoints = () => {
    return Math.floor(calculateTotal() / 10);
  };

  const submitOrder = async () => {
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    if (discountPoints > (customer.loyaltyPoints || 0)) {
      toast.error('Customer does not have enough loyalty points');
      return;
    }

    try {
      setLoading(true);

      // Create order
      const orderId = `ORD${Date.now()}`;
      const orderData = {
        orderId,
        customerId: customer.phoneNumber,
        items: orderItems,
        orderDate: new Date(),
        totalAmount: calculateTotal(),
        status: 'completed'
      };

      await api.createOrder(orderData);

      // Update customer loyalty points and order history
      const newLoyaltyPoints = (customer.loyaltyPoints || 0) - discountPoints + calculateLoyaltyPoints();
      await api.updateCustomer(customer.phoneNumber, {
        loyaltyPoints: newLoyaltyPoints,
        orderHistory: [...customer.orderHistory, orderId]
      });

      // Update product stock
      for (const item of orderItems) {
        const product = products.find(p => p.productId === item.productId);
        if (product) {
          await api.updateProduct(item.productId, {
            stockQuantity: product.stockQuantity - item.quantity
          });
        }
      }

      // Reset form
      setCustomer(null);
      setPhoneNumber('');
      setOrderItems([]);
      setDiscountPoints(0);
      
      // Refresh products
      await fetchProducts();

      toast.success(`Order ${orderId} submitted successfully!`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    } finally {
      setLoading(false);
    }
  };
  const createNewCustomer = async () => {
  try {
    await api.createCustomer(newCustomerData);
    toast.success('Customer created successfully!');
    setShowNewCustomerDialog(false);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    toast.error(error.message || 'Failed to create customer');
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-store-blue mb-2">Order Registration</h1>
        <p className="text-gray-600">Process customer orders and manage transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center text-store-blue">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="store-input"
                />
              </div>
              <Button 
                onClick={searchCustomer}
                disabled={loading}
                className="mt-6 store-button"
              >
                Search
              </Button>
            </div>

            {customer && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-store-blue">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.phoneNumber}</p>
                <p className="text-sm text-gray-600">
                  Loyalty Points: <span className="font-medium">{customer.loyaltyPoints || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Previous Orders: <span className="font-medium">{customer.orderHistory?.length || 0}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Customer Dialog */}
        <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-store-blue">
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Customer
              </DialogTitle>
              <DialogDescription>
                Customer not found. Create a new customer account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPhone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-store-blue" />
                  Phone Number
                </Label>
                <Input
                  id="newPhone"
                  value={newCustomerData.phoneNumber}
                  onChange={(e) => setNewCustomerData({...newCustomerData, phoneNumber: e.target.value})}
                  className="store-input"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newName" className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-store-blue" />
                  Customer Name *
                </Label>
                <Input
                  id="newName"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({...newCustomerData, name: e.target.value})}
                  placeholder="Enter customer name"
                  className="store-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-store-blue" />
                  Password *
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newCustomerData.password}
                  onChange={(e) => setNewCustomerData({...newCustomerData, password: e.target.value})}
                  placeholder="Create password for customer"
                  className="store-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newLoyalty" className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Initial Loyalty Points
                </Label>
                <Input
                  id="newLoyalty"
                  type="number"
                  min="0"
                  value={newCustomerData.loyaltyPoints}
                  onChange={(e) => setNewCustomerData({...newCustomerData, loyaltyPoints: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  className="store-input"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={createNewCustomer} className="flex-1 store-button">
                  Create Customer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewCustomerDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Products */}
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center text-store-blue">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="product">Select Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="store-input">
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.productId} value={product.productId}>
                        {product.name} - ${product.price.toFixed(2)} (Stock: {product.stockQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={addProductToOrder}
                className="mt-6 store-button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-store-blue">
            <span className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Order Items ({orderItems.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium px-2">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItemFromOrder(item.productId)}
                            className="w-8 h-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Order Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {customer && customer.loyaltyPoints > 0 && (
                    <div className="flex justify-between items-center">
                      <Label htmlFor="discount">Apply Loyalty Points (1 point = $0.50):</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max={customer.loyaltyPoints}
                          value={discountPoints}
                          onChange={(e) => setDiscountPoints(Math.min(parseInt(e.target.value) || 0, customer.loyaltyPoints))}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">/ {customer.loyaltyPoints}</span>
                      </div>
                    </div>
                  )}
                  
                  {discountPoints > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPoints} points):</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-store-blue">
                    <span>Points to earn:</span>
                    <span>+{calculateLoyaltyPoints()} points</span>
                  </div>
                </div>

                <Button 
                  onClick={submitOrder}
                  disabled={loading || !customer || orderItems.length === 0}
                  className="w-full mt-4 store-button"
                >
                  {loading ? 'Processing...' : 'Submit Order'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No items in order</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderRegistration;

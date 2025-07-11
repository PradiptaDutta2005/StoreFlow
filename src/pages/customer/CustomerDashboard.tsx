
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ShoppingBag, Star, MapPin, Search, TrendingUp, Package, Clock, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { customers, orders, products } = useData();
  
  // Find current customer data
  const currentCustomer = customers.find(c => c.phoneNumber === user?.phoneNumber);
  const customerOrders = orders.filter(o => o.customerId === user?.phoneNumber);
  const recentOrders = customerOrders.slice(0, 3);
  
  // Get product recommendations based on order history
  const getRecommendations = () => {
    const orderedCategories = new Set();
    customerOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.productId === item.productId);
        if (product) orderedCategories.add(product.category);
      });
    });
    
    return products
      .filter(p => orderedCategories.has(p.category))
      .slice(0, 4);
  };

  const recommendations = getRecommendations();

  const quickActions = [
    {
      title: "Search Products",
      description: "Find products in our store",
      icon: Search,
      link: "/customer/search",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Store Map",
      description: "Navigate through the store",
      icon: MapPin,
      link: "/customer/map",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Order History",
      description: "View your past orders",
      icon: ShoppingBag,
      link: "/customer/orders",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Loyalty Points",
      description: "Check your rewards",
      icon: Star,
      link: "/customer/loyalty",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-store-blue to-store-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Valued Customer'}!
        </h1>
        <p className="text-blue-100">
          Ready to explore our store and discover great deals?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCustomer?.loyaltyPoints || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${((currentCustomer?.loyaltyPoints || 0) * 0.5).toFixed(2)} in rewards
            </p>
          </CardContent>
        </Card>
        
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customerOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime purchases
            </p>
          </CardContent>
        </Card>
        
        <Card className="store-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <Package className="h-4 w-4 text-store-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customerOrders.length ? (customerOrders.reduce((sum, order) => sum + order.totalAmount, 0) / customerOrders.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="group">
              <Card className="store-card group-hover:scale-105 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-store-blue transition-colors">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="store-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-store-blue" />
                Recent Orders
              </CardTitle>
              <Link to="/customer/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.orderId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items • {order.orderDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet</p>
                <p className="text-sm">Start shopping to see your orders here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Recommendations */}
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-store-blue" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Based on your purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-xs text-gray-400">{product.aisle} - {product.shelf}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-store-blue">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{product.stockQuantity} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recommendations yet</p>
                <p className="text-sm">Make a purchase to get personalized recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;

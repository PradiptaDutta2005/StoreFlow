
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, BarChart3, ArrowRight, Star, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const portals = [
    {
      title: "Customer Portal",
      description: "Browse products, track orders, and manage loyalty points",
      icon: ShoppingCart,
      link: "/login?portal=customer",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Storekeeper Portal",
      description: "Manage inventory, process orders, and handle customer interactions",
      icon: Package,
      link: "/login?portal=storekeeper",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Employee Portal",
      description: "Receive alerts, track tasks, and manage work assignments",
      icon: Users,
      link: "/login?portal=employee",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Admin Portal",
      description: "Complete system management, analytics, and user administration",
      icon: BarChart3,
      link: "/login?portal=admin",
      color: "from-red-500 to-red-600"
    }
  ];

  const features = [
    {
      icon: Star,
      title: "Smart Analytics",
      description: "Get insights into sales, inventory, and customer behavior"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for seamless user experience"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-store-blue to-store-blue-light rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-store-blue to-store-blue-dark bg-clip-text text-transparent">
              StoreFlow
            </h1>
          </div>
          <Link to="/login">
            <Button className="store-button">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-store-blue to-store-blue-dark bg-clip-text text-transparent">
              Smart Store Management
              <br />
              Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your retail operations with our comprehensive management system. 
              From customer engagement to inventory tracking, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="store-button text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:bg-store-blue hover:text-white transition-all duration-300">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose StoreFlow?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and designed for scalability, 
              StoreFlow provides everything you need to run your store efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="store-card animate-scale-in text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-store-blue to-store-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Portal</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access the right tools for your role. Each portal is designed 
              specifically for different user types in your organization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {portals.map((portal, index) => (
              <Link key={index} to={portal.link} className="group">
                <Card className="store-card group-hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${portal.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <portal.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-store-blue transition-colors">
                      {portal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-4">
                      {portal.description}
                    </CardDescription>
                    <Button variant="outline" className="w-full group-hover:bg-store-blue group-hover:text-white transition-all duration-300">
                      Access Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-store-blue to-store-blue-light rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">StoreFlow</h3>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">Smart Store Management Solution</p>
              <p className="text-sm text-gray-500">© 2024 StoreFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

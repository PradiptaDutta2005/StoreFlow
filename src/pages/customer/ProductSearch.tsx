
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from '@/contexts/DataContext';
import { Search, Filter, MapPin, Package, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductSearch = () => {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });

  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-500';
    if (quantity <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStockText = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Search</h1>
          <p className="text-gray-600">Find products and their locations in our store</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Package className="w-5 h-5 text-store-blue" />
          <span className="text-sm text-gray-500">{filteredProducts.length} products found</span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.productId} className="store-card hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-store-blue">${product.price.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${getStockColor(product.stockQuantity)}`}>
                      {getStockText(product.stockQuantity)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Location Info */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-store-blue mr-2" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Aisle {product.aisle}</span>
                      <span className="text-gray-500 ml-2">Shelf {product.shelf}</span>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available Stock:</span>
                    <span className="font-medium">{product.stockQuantity} units</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to="/customer/map" state={{ searchProduct: product }} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Find in Store
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 store-button" 
                      disabled={product.stockQuantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="store-card">
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search terms or filters to see more results.'
                : 'Start typing to search for products in our store.'
              }
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Featured Categories */}
      {!searchTerm && categoryFilter === 'all' && (
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Popular Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                return (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center hover:bg-store-blue hover:text-white transition-all duration-300"
                    onClick={() => setCategoryFilter(category)}
                  >
                    <Package className="w-6 h-6 mb-2" />
                    <span className="font-medium">{category}</span>
                    <span className="text-xs opacity-70">{categoryProducts.length} items</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearch;

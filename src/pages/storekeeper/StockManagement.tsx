
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Minus, Trash2, Search, Package } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

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

const StockManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    aisle: '',
    shelf: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }

    try {
      await api.updateProduct(productId, { stockQuantity: newQuantity });
      setProducts(products.map(p => 
        p.productId === productId ? { ...p, stockQuantity: newQuantity } : p
      ));
      toast.success('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stockQuantity || !newProduct.aisle || !newProduct.shelf) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const productData = {
        productId: `PROD${Date.now()}`,
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        aisle: newProduct.aisle,
        shelf: newProduct.shelf
      };

      const createdProduct = await api.createProduct(productData);
      setProducts([...products, createdProduct]);
      setNewProduct({ name: '', category: '', price: '', stockQuantity: '', aisle: '', shelf: '' });
      setShowAddForm(false);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.productId !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-store-blue mb-2">Stock Management</h1>
          <p className="text-gray-600">Manage your inventory and product catalog</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="store-button"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="store-card">
          <CardHeader>
            <CardTitle className="text-store-blue">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  placeholder="e.g., Dairy, Grains"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                  placeholder="0"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="aisle">Aisle</Label>
                <Input
                  id="aisle"
                  value={newProduct.aisle}
                  onChange={(e) => setNewProduct({...newProduct, aisle: e.target.value})}
                  placeholder="e.g., Aisle 1"
                  className="store-input"
                />
              </div>
              <div>
                <Label htmlFor="shelf">Shelf</Label>
                <Input
                  id="shelf"
                  value={newProduct.shelf}
                  onChange={(e) => setNewProduct({...newProduct, shelf: e.target.value})}
                  placeholder="e.g., Shelf A"
                  className="store-input"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addProduct} className="store-button">
                Add Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="store-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 store-input"
                />
              </div>
            </div>
            <div className="w-full lg:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="store-input">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="store-card">
        <CardHeader>
          <CardTitle className="text-store-blue">Products ({filteredProducts.length})</CardTitle>
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
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.productId} className="hover:bg-blue-50">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(product.productId, Math.max(0, product.stockQuantity - 1))}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className={`font-medium px-2 ${product.stockQuantity < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                            {product.stockQuantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(product.productId, product.stockQuantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {product.aisle}, {product.shelf}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.productId)}
                          className="w-8 h-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManagement;

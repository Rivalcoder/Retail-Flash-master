"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react";
import type { Product } from "@/lib/types";
import { getAdminData, isAdminLoggedIn, getAdminAuthHeaders } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
    imageUrl: ''
  });
  
  const { toast } = useToast();
  const router = useRouter();

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load admin data on client side
  useEffect(() => {
    if (isClient) {
      const loadAdminData = () => {
        const data = getAdminData();
        if (data) {
          setAdminData(data);
        } else {
          setTimeout(() => {
            const retryData = getAdminData();
            if (retryData) {
              setAdminData(retryData);
            }
          }, 50);
        }
      };
      
      loadAdminData();
    }
  }, [isClient]);

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error('Failed to load products:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient && adminData && isAdminLoggedIn()) {
      loadProducts();
    }
  }, [isClient, adminData]);

  // Handle authentication check
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        const currentAdminData = getAdminData();
        if (!currentAdminData || !isAdminLoggedIn()) {
          router.push('/admin/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isClient, router]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((product.category ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => (product.category ?? "") === categoryFilter);
    }

    // Apply low stock filter
    if (showLowStock) {
      filtered = filtered.filter(product => (product.stock ?? 0) < 50);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "stock":
          aValue = a.stock ?? 0;
          bValue = b.stock ?? 0;
          break;
        case "category":
          aValue = (a.category ?? "").toLowerCase();
          bValue = (b.category ?? "").toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy, sortOrder, showLowStock]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleAddProduct = () => {
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
      imageUrl: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      const authHeaders = getAdminAuthHeaders();
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        // Update local state
        setProducts(prev => prev.map(p => 
          p._id === editingProduct._id ? editingProduct : p
        ));
        
        toast({
          title: "Product Updated",
          description: `${editingProduct.name} has been updated successfully.`,
        });
        
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update product. Please try again.",
      });
    }
  };

  const handleSaveNewProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in Name and Price fields.",
      });
      return;
    }

    try {
      const authHeaders = getAdminAuthHeaders();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add to local state
        setProducts(prev => [...prev, result.product]);
        
        toast({
          title: "Product Created",
          description: `${newProduct.name} has been created successfully.`,
        });
        
        setIsAddDialogOpen(false);
        setNewProduct({
          name: '',
          price: 0,
          description: '',
          category: '',
          stock: 0,
          imageUrl: ''
        });
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Failed to create product. Please try again.",
      });
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const authHeaders = getAdminAuthHeaders();
      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (response.ok) {
        // Remove from local state
        setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
        
        toast({
          title: "Product Deleted",
          description: `${productToDelete.name} has been deleted successfully.`,
        });
        
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete product. Please try again.",
      });
    }
  };

  const getCategories = () => {
    return [...new Set(products.map(p => p.category ?? ""))]
      .filter((c): c is string => typeof c === 'string' && c.length > 0)
      .sort();
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "destructive", text: "Out of Stock" };
    if (stock < 10) return { color: "destructive", text: "Low Stock" };
    if (stock < 50) return { color: "secondary", text: "Limited Stock" };
    return { color: "default", text: "In Stock" };
  };

  if (!isClient || adminData === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminData || !isAdminLoggedIn()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your product catalog - {products.length} products total
          </p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategories().map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant={showLowStock ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLowStock(!showLowStock)}
              className="flex items-center gap-2"
            >
              {showLowStock ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Low Stock Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || categoryFilter !== "all" || showLowStock
                ? "Try adjusting your filters or search terms."
                : "Get started by adding your first product."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Product</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Category</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Price</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Stock</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Status</th>
                    <th className="text-right p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock ?? 0);
                    return (
                      <tr key={product._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="link" className="p-0 h-auto font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                  {product.name}
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{product.name}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      {product.description}
                                    </p>
                                    <div className="flex items-center pt-2">
                                      <span className="text-sm text-slate-500 dark:text-slate-400">
                                        ₹{product.price.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                    {product.imageUrl ? (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%2394a3b8' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Package className="h-6 w-6" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">
                            ₹{product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.text}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="h-8 px-3"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information below.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={editingProduct.imageUrl || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product by filling in the information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-name">Product Name *</Label>
                <Input
                  id="new-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="new-price">Price *</Label>
                <Input
                  id="new-price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-category">Category</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Toys">Toys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-stock">Stock</Label>
                <Input
                  id="new-stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="new-imageUrl">Image URL</Label>
              <Input
                id="new-imageUrl"
                value={newProduct.imageUrl || ""}
                onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newProduct.description || ""}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Enter product description..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewProduct}>
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
"use client";

import type { Product } from "@/lib/types";
import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog";
import { 
  Sparkles, 
  Edit3, 
  Copy, 
  Download, 
  RefreshCw, 
  Filter,
  Search,
  Eye,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface PromoGeneratorProps {
  products: Product[];
  onUpdatePromoCopy?: (productId: string, promoCopy: string) => void;
  onGeneratePromoCopy?: (productId: string, tone: string, focus: string) => Promise<string>;
}

type PromoTone = "exciting" | "professional" | "casual" | "luxurious" | "playful";
type PromoFocus = "features" | "benefits" | "price" | "quality" | "urgency";

export default function PromoGenerator({ 
  products, 
  onUpdatePromoCopy,
  onGeneratePromoCopy 
}: PromoGeneratorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<PromoTone>("exciting");
  const [selectedFocus, setSelectedFocus] = useState<PromoFocus>("features");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editedCopy, setEditedCopy] = useState("");
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Generate promo copy for a single product
  const handleGeneratePromoCopy = useCallback(async (productId: string) => {
    if (!onGeneratePromoCopy) return;
    
    setGeneratingIds(prev => new Set(prev).add(productId));
    try {
      const promoCopy = await onGeneratePromoCopy(productId, selectedTone, selectedFocus);
      onUpdatePromoCopy?.(productId, promoCopy);
      toast.success("Promo copy generated successfully!");
    } catch (error) {
      toast.error("Failed to generate promo copy");
    } finally {
      setGeneratingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [onGeneratePromoCopy, onUpdatePromoCopy, selectedTone, selectedFocus]);

  // Generate promo copy for all products (regenerates every time button is clicked)
  const handleGenerateAllPromoCopy = useCallback(async () => {
    if (!onGeneratePromoCopy) return;
    
    const productIds = filteredProducts.map(p => p._id);
    setGeneratingIds(new Set(productIds));
    try {
      const promises = productIds.map(async (productId) => {
        const promoCopy = await onGeneratePromoCopy(productId, selectedTone, selectedFocus);
        onUpdatePromoCopy?.(productId, promoCopy);
      });
      await Promise.all(promises);
      toast.success(`Generated promo copy for ${productIds.length} products!`);
    } catch (error) {
      toast.error("Failed to generate promo copy for some products");
    } finally {
      setGeneratingIds(new Set());
    }
  }, [filteredProducts, onGeneratePromoCopy, onUpdatePromoCopy, selectedTone, selectedFocus]);

  // Copy promo copy to clipboard
  const handleCopyPromoCopy = useCallback((promoCopy: string) => {
    navigator.clipboard.writeText(promoCopy);
    toast.success("Promo copy copied to clipboard!");
  }, []);

  // Export promo copy data
  const handleExportPromoCopy = useCallback(() => {
    const exportData = filteredProducts.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      promoCopy: product.promoCopy || "No promo copy generated"
    }));
    
    const csvContent = [
      ["Product ID", "Product Name", "Category", "Price", "Promo Copy"],
      ...exportData.map(item => [item.id, item.name, item.category, item.price, item.promoCopy])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "promo-copy-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Promo copy exported successfully!");
  }, [filteredProducts]);

  // Handle edit save
  const handleSaveEdit = useCallback(() => {
    if (editingProduct) {
      onUpdatePromoCopy?.(editingProduct, editedCopy);
      setEditingProduct(null);
      setEditedCopy("");
      toast.success("Promo copy updated successfully!");
    }
  }, [editingProduct, editedCopy, onUpdatePromoCopy]);

  // Statistics
  const stats = {
    total: products.length,
    withPromoCopy: products.filter(p => p.promoCopy).length,
    withoutPromoCopy: products.filter(p => !p.promoCopy).length,
    filtered: filteredProducts.length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Promo Copy Generator
            </CardTitle>
            <CardDescription>
              Generate and manage promotional copy for your products using AI
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {stats.withPromoCopy}/{stats.total} Generated
            </Badge>
            <Button 
              onClick={handleExportPromoCopy}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter((c): c is string => typeof c === "string").map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generation Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tone:</label>
              <Select value={selectedTone} onValueChange={value => setSelectedTone(value as PromoTone)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exciting">Exciting</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="luxurious">Luxurious</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Focus:</label>
              <Select value={selectedFocus} onValueChange={value => setSelectedFocus(value as PromoFocus)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="benefits">Benefits</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateAllPromoCopy}
              disabled={generatingIds.size > 0}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${generatingIds.size > 0 ? 'animate-spin' : ''}`} />
              Generate All ({filteredProducts.length})
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Product</TableHead>
                <TableHead>AI-Generated Promo Copy</TableHead>
                <TableHead className="text-right w-[100px]">Price</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[400px]">
                    {product.promoCopy ? (
                      <div className="space-y-2">
                        <p className="text-sm">{product.promoCopy.replace(/\*\*/g, "")}</p>
                        <Badge variant="outline" className="text-xs">
                          Generated
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        No promo copy generated yet
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGeneratePromoCopy(product._id)}
                        disabled={generatingIds.has(product._id)}
                      >
                        <RefreshCw className={`h-3 w-3 ${generatingIds.has(product._id) ? 'animate-spin' : ''}`} />
                      </Button>
                      
                      {product.promoCopy && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingProduct(product._id);
                              setEditedCopy(product.promoCopy || "");
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyPromoCopy(product.promoCopy!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewProduct(product)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Preview: {product.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                  <h3 className="font-medium mb-2">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {product.promoCopy}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                                    <Button size="sm">Buy Now</Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Promo Copy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={editedCopy}
                onChange={(e) => setEditedCopy(e.target.value)}
                rows={4}
                placeholder="Enter promotional copy..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, Download, FileText, AlertCircle, CheckCircle, Plus, X, Database, PenTool, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminPanelProps {
  onUpdate: (file: File) => void;
  isPending: boolean;
}

interface ProductFormData {
  id?: string;
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  imageUrl: string;
}

export default function AdminPanel({ onUpdate, isPending }: AdminPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upload");
  const [manualProducts, setManualProducts] = useState<ProductFormData[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const initialProductForm: ProductFormData = {
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrl: ''
  };

  const [currentProduct, setCurrentProduct] = useState<ProductFormData>(initialProductForm);

  const toast = (options: any) => {
    console.log('Toast:', options);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/json") {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        toast({
          title: "File Selected",
          description: `${selectedFile.name} is ready for upload.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid JSON file.",
        });
        event.target.value = "";
        setFile(null);
        setFileName("");
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/json") {
        setFile(droppedFile);
        setFileName(droppedFile.name);
      }
    }
  };

  const handleUpdateClick = () => {
    if (file) {
      onUpdate(file);
    } else {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a JSON file to update the catalog.",
      });
    }
  };

  const downloadSampleJSON = () => {
    const sampleData = [
      {
        id: "sample_001",
        name: "Premium Wireless Headphones",
        price: 199.99,
        description: "High-quality wireless headphones with noise cancellation",
        category: "Electronics",
        stock: 50,
        imageUrl: "https://example.com/headphones.jpg"
      }
    ];
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-product-catalog.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Sample Downloaded",
      description: "Sample product catalog JSON file has been downloaded.",
    });
  };

  const handleManualInputChange = (field: keyof ProductFormData, value: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addManualProduct = () => {
    if (!currentProduct.name || !currentProduct.price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Price).",
      });
      return;
    }

    const productWithId = {
      ...currentProduct,
      id: currentProduct.id || `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setManualProducts(prev => [...prev, productWithId]);
    setCurrentProduct(initialProductForm);
    toast({
      title: "Product Added",
      description: "Product added to manual list.",
    });
  };

  const removeManualProduct = (index: number) => {
    setManualProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleManualUpload = () => {
    if (manualProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "No Products",
        description: "Please add at least one product to upload.",
      });
      return;
    }

    const productsData = manualProducts.map(product => ({
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock) || 0
    }));

    const jsonString = JSON.stringify(productsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'manual-products.json', { type: 'application/json' });

    onUpdate(file);
    setManualProducts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Catalog Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload products via JSON file or add them manually
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600">
            <TabsTrigger
              value="upload"
              className="flex items-center gap-3 px-4 py-1 rounded-md transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold"
            >
              <UploadCloud className="h-4 w-4" />
              File Upload
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="flex items-center gap-2 px-4 py-1 rounded-md transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold"
            >
              <PenTool className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Card */}
            <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Upload Product Catalog</CardTitle>
                <CardDescription className="text-lg">
                  Upload a JSON file to update your catalog. AI will automatically generate promotional copy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag & Drop File Upload Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="catalog-file" className="text-sm font-medium">
                      Product Catalog JSON File
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <UploadCloud className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                            Drop your JSON file here, or click to browse
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Supports JSON files only
                          </p>
                        </div>
                        <Input
                          id="catalog-file"
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {fileName && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">{fileName}</span>
                            <span className="text-green-500">ready for upload</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadSampleJSON}
                        className="ml-4 whitespace-nowrap"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateClick}
                    disabled={isPending || !file}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Catalog...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Update Catalog with AI Promo Generation
                      </>
                    )}
                  </Button>
                </div>

                {/* Information Section */}
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>How it works:</strong> Upload a JSON file with product data. The system will:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Add new products to your catalog</li>
                      <li>Update existing products with new information</li>
                      <li>Generate AI-powered promotional copy for new/updated products</li>
                      <li>Track changes and maintain product history</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* JSON Structure Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  JSON Structure Guide
                </CardTitle>
                <CardDescription>
                  Your JSON file should contain an array of product objects with the following structure:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                  <pre>{`[
  {
    "id": "unique_product_id",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description...",
    "category": "Category Name",
    "stock": 100,
    "imageUrl": "https://example.com/image.jpg"
  }
]`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            {/* Manual Entry Card */}
            <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <PenTool className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Manual Product Entry</CardTitle>
                <CardDescription className="text-lg">
                  Add products one by one with a user-friendly form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-id">Product ID (Optional)</Label>
                    <Input
                      id="product-id"
                      placeholder="Auto-generated if left empty"
                      value={currentProduct.id || ""}
                      onChange={(e) => handleManualInputChange('id', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      value={currentProduct.name}
                      onChange={(e) => handleManualInputChange('name', e.target.value)}
                      placeholder="e.g., Wireless Headphones"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={currentProduct.price}
                      onChange={(e) => handleManualInputChange('price', e.target.value)}
                      placeholder="e.g., 99.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select value={currentProduct.category} onValueChange={(value) => handleManualInputChange('category', value)}>
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
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={currentProduct.stock}
                      onChange={(e) => handleManualInputChange('stock', e.target.value)}
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-image">Image URL</Label>
                    <Input
                      id="product-image"
                      value={currentProduct.imageUrl}
                      onChange={(e) => handleManualInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={currentProduct.description}
                      onChange={(e) => handleManualInputChange('description', e.target.value)}
                      placeholder="Enter product description..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={addManualProduct}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product to List
                </Button>
              </CardContent>
            </Card>

            {/* Manual Products List */}
            {manualProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Products to Upload ({manualProducts.length})</span>
                    <Button
                      onClick={handleManualUpload}
                      disabled={isPending}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="mr-2 h-4 w-4" />
                      )}
                      Upload All Products
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {manualProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{product.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span className="mr-3">ID: {product.id}</span>
                            <span className="mr-3">Price: ${product.price}</span>
                            <span className="mr-3">Category: {product.category || 'N/A'}</span>
                            <span>Stock: {product.stock || 'N/A'}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeManualProduct(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
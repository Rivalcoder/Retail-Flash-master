"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, Download, FileText, AlertCircle, CheckCircle, Plus, X, Database, PenTool, Sparkles, Upload, Link } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

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
  
  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [showJsonGuide, setShowJsonGuide] = useState(false);

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

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];
      
      if (!imageFile.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid image file.",
        });
        return;
      }

      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Create object URL for preview
            const imageUrl = URL.createObjectURL(imageFile);
            setCurrentProduct(prev => ({
              ...prev,
              imageUrl: imageUrl
            }));
            
            toast({
              title: "Image Uploaded",
              description: "Image has been uploaded successfully.",
            });
            
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const handleUrlSubmit = (url: string) => {
    if (url.trim()) {
      if (isValidUrl(url)) {
        setCurrentProduct(prev => ({
          ...prev,
          imageUrl: url.trim()
        }));
        setShowUrlInput(false);
        toast({
          title: "Image URL Added",
          description: "Image URL has been added successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Please enter a valid image URL.",
        });
      }
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const removeImage = () => {
    if (currentProduct.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentProduct.imageUrl);
    }
    setCurrentProduct(prev => ({
      ...prev,
      imageUrl: ''
    }));
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
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_002",
        name: "Smart LED Desk Lamp",
        price: 49.99,
        description: "Adjustable LED desk lamp with smart touch controls and USB charging port",
        category: "Home & Office",
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_003",
        name: "Men's Classic Leather Wallet",
        price: 29.95,
        description: "Genuine leather wallet with RFID blocking technology",
        category: "Fashion",
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_004",
        name: "Stainless Steel Insulated Water Bottle",
        price: 24.99,
        description: "Keeps drinks cold for 24 hours and hot for 12 hours, 500ml capacity",
        category: "Outdoors",
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_005",
        name: "Bluetooth Portable Speaker",
        price: 59.99,
        description: "Compact wireless speaker with deep bass and 12-hour playtime",
        category: "Electronics",
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_006",
        name: "Children's Building Blocks Set",
        price: 34.99,
        description: "Creative 150-piece building blocks set for kids aged 3+",
        category: "Toys",
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_007",
        name: "Ergonomic Office Chair",
        price: 189.99,
        description: "Adjustable office chair with lumbar support and breathable mesh back.",
        category: "Home & Office",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_008",
        name: "Stainless Steel Cookware Set",
        price: 129.99,
        description: "10-piece premium stainless steel cookware set for all cooktops.",
        category: "Kitchen",
        stock: 55,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_009",
        name: "Yoga Mat with Carrying Strap",
        price: 39.99,
        description: "Non-slip yoga mat with extra cushioning and carrying strap included.",
        category: "Fitness",
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "sample_010",
        name: "Wireless Gaming Mouse",
        price: 69.99,
        description: "High-precision wireless gaming mouse with customizable buttons.",
        category: "Electronics",
        stock: 90,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
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
    
    // Clean up any blob URLs before resetting
    if (currentProduct.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentProduct.imageUrl);
    }
    
    setCurrentProduct(initialProductForm);
    toast({
      title: "Product Added",
      description: "Product added to manual list.",
    });
  };

  const removeManualProduct = (index: number) => {
    const productToRemove = manualProducts[index];
    if (productToRemove.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(productToRemove.imageUrl);
    }
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
    
    // Clean up blob URLs
    manualProducts.forEach(product => {
      if (product.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(product.imageUrl);
      }
    });
    
    setManualProducts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        {/* Header with animation */}
        <div className="text-center space-y-4 animate-slideIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Catalog Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload products via JSON file or add them manually with our intuitive interface
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fadeIn">
          {/* Redesigned Navbar Start */}
          <div className="relative flex justify-center my-8">
              <div className="relative flex w-fit bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg px-1 py-1 min-w-[340px] overflow-hidden">
              {/* Animated indicator */}
              <span
                className={`absolute top-1 left-1 h-[44px] w-[calc(50%-8px)] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 shadow-md transition-all duration-300 ease-in-out z-0 ${activeTab === 'manual' ? 'translate-x-full' : 'translate-x-0'}`}
                style={{ transitionProperty: 'transform, background, box-shadow' }}
              />
              <button
                className={`relative z-10 flex items-center gap-2 px-8 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none ${activeTab === 'upload'
                  ? 'text-white drop-shadow-lg'
                  : 'text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white'} animate-fadeIn`}
                onClick={() => setActiveTab('upload')}
                type="button"
              >
                <UploadCloud className={`h-5 w-5 ${activeTab === 'upload' ? 'text-white' : 'text-blue-500 dark:text-blue-300'}`} />
                <span>File Upload</span>
              </button>
              <button
                className={`relative z-10 flex items-center gap-2 px-8 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none ${activeTab === 'manual'
                  ? 'text-white drop-shadow-lg'
                  : 'text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white'} animate-fadeIn`}
                onClick={() => setActiveTab('manual')}
                type="button"
              >
                <PenTool className={`h-5 w-5 ${activeTab === 'manual' ? 'text-white' : 'text-green-500 dark:text-green-300'}`} />
                <span>Manual Entry</span>
              </button>
            </div>
          </div>
          {/* Redesigned Navbar End */}

          <TabsContent value="upload" className="space-y-6 p-1">
            {/* File Upload Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all hover:shadow-2xl animate-cardIn">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                  <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  Upload Product Catalog
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Upload a JSON file to update your catalog. AI will automatically generate promotional copy and update your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag & Drop File Upload Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="catalog-file" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Catalog JSON File
                    </Label>
                    <div
                      className={`relative rounded-2xl p-8 text-center transition-all duration-300 ${dragActive
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-500 shadow-inner'
                          : 'bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 shadow-sm'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-4">
                        <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800/30 dark:to-purple-800/30 flex items-center justify-center transition-transform hover:scale-110">
                          <UploadCloud className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            Drop your JSON file here
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            or <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer">browse files</span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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

                    <div className="flex items-center justify-between gap-4 mt-4">
                      <div className="flex-1 min-w-0">
                        {fileName && (
                          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800/50 animate-pulse">
                            <div className="bg-green-500 rounded-full p-1">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-green-800 dark:text-green-200 truncate">{fileName}</p>
                              <p className="text-green-600 dark:text-green-300 text-xs">Ready for upload</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadSampleJSON}
                        className="whitespace-nowrap bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <Download className="mr-2 h-4 w-4 text-blue-600 group-hover:text-blue-700 dark:text-blue-400" />
                        <span className="text-blue-600 group-hover:text-blue-700 dark:text-blue-400 font-medium">Download Sample</span>
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateClick}
                    disabled={isPending || !file}
                    className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300 group"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin text-white" />
                        <span className="text-white">Processing Catalog...</span>
                      </>
                    ) : (
                      <>
                        <div className="mr-3 bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white">Update Catalog with AI</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Information Section */}
                <Alert className="rounded-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-sm">
                  <div className="flex gap-3">
                    <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center h-10 w-10">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong className="text-lg">How it works:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Add new products to your catalog</li>
                        <li>Update existing products with new information</li>
                        <li>Generate AI-powered promotional copy</li>
                        <li>Track changes and maintain product history</li>
                      </ul>
                    </AlertDescription>
                  </div>
                </Alert>

                {/* JSON Structure Guide as Hover Card */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium transition-all"
                    onClick={() => setShowJsonGuide(true)}
                    tabIndex={0}
                    aria-label="Show JSON Guide"
                  >
                    <Database className="h-4 w-4" />
                    Show JSON Guide
                  </button>
                </div>
                {/* Modal-style JSON Guide overlay */}
                {showJsonGuide && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-2xl border border-gray-700 p-6 text-sm font-mono text-gray-200 animate-fadeIn">
                      <button
                        type="button"
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
                        onClick={() => setShowJsonGuide(false)}
                        aria-label="Close JSON Guide"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="flex items-center gap-2 mb-4">
                        <Database className="h-5 w-5 text-blue-400" />
                        <span className="text-base font-semibold text-gray-100">JSON Structure Guide</span>
                      </div>
                      <div className="mb-2 text-xs text-gray-300 font-semibold">Your JSON file should contain an array of product objects with the following structure:</div>
                      <pre className="whitespace-pre-wrap bg-gray-800/80 rounded-lg p-4 border border-gray-700 text-gray-200 text-xs overflow-x-auto">{`[
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6 p-1">
            {/* Manual Entry Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all hover:shadow-2xl animate-cardIn">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                  <PenTool className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  Manual Product Entry
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Add products one by one with our user-friendly form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-id" className="text-gray-700 dark:text-gray-300">Product ID (Optional)</Label>
                    <Input
                      id="product-id"
                      placeholder="Auto-generated if left empty"
                      value={currentProduct.id || ""}
                      onChange={(e) => handleManualInputChange('id', e.target.value)}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-gray-700 dark:text-gray-300">Product Name *</Label>
                    <Input
                      id="product-name"
                      value={currentProduct.name}
                      onChange={(e) => handleManualInputChange('name', e.target.value)}
                      placeholder="e.g., Wireless Headphones"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price" className="text-gray-700 dark:text-gray-300">Price *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={currentProduct.price}
                      onChange={(e) => handleManualInputChange('price', e.target.value)}
                      placeholder="e.g., 99.99"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category" className="text-gray-700 dark:text-gray-300">Category</Label>
                    <Select value={currentProduct.category} onValueChange={(value) => handleManualInputChange('category', value)}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-lg rounded-xl">
                        <SelectItem value="Electronics" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Electronics</SelectItem>
                        <SelectItem value="Clothing" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Clothing</SelectItem>
                        <SelectItem value="Fitness" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Fitness</SelectItem>
                        <SelectItem value="Home & Kitchen" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Home & Kitchen</SelectItem>
                        <SelectItem value="Books" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Books</SelectItem>
                        <SelectItem value="Sports" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Sports</SelectItem>
                        <SelectItem value="Beauty" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Beauty</SelectItem>
                        <SelectItem value="Toys" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Toys</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock" className="text-gray-700 dark:text-gray-300">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={currentProduct.stock}
                      onChange={(e) => handleManualInputChange('stock', e.target.value)}
                      placeholder="e.g., 100"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Product Image</Label>
                    
                    {/* Image Preview */}
                    {currentProduct.imageUrl && (
                      <div className="relative group">
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                          <img
                            src={currentProduct.imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 transition-transform group-hover:scale-105 duration-500"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="space-y-2 mt-4">
                        <Progress value={uploadProgress} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-green-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}

                    {/* Upload Options */}
                    {!currentProduct.imageUrl && (
                      <div className="space-y-4 mt-2">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">Upload Image</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            disabled={isUploading}
                          >
                            <Link className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">Paste URL</span>
                          </Button>
                        </div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                        />

                        {showUrlInput && (
                          <div className="space-y-2 animate-fadeIn">
                            <Label htmlFor="image-url" className="text-gray-700 dark:text-gray-300">Image URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="image-url"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUrlSubmit(e.currentTarget.value);
                                  }
                                }}
                                className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById("image-url") as HTMLInputElement;
                                  handleUrlSubmit(input.value);
                                }}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="product-description" className="text-gray-700 dark:text-gray-300">Description</Label>
                    <Textarea
                      id="product-description"
                      value={currentProduct.description}
                      onChange={(e) => handleManualInputChange('description', e.target.value)}
                      placeholder="Enter product description..."
                      rows={3}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                <Button
                  onClick={addManualProduct}
                  className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all duration-300"
                >
                  <Plus className="mr-3 h-5 w-5 text-white" />
                  <span className="text-white">Add Product to List</span>
                </Button>
              </CardContent>
            </Card>

            {/* Manual Products List */}
            {manualProducts.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all hover:shadow-2xl animate-cardIn">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xl text-gray-800 dark:text-white">Products to Upload ({manualProducts.length})</span>
                    <Button
                      onClick={handleManualUpload}
                      disabled={isPending}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md transition-all"
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
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {manualProducts.map((product, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md animate-fadeIn"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {product.imageUrl ? (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-gray-800 dark:text-white truncate">{product.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap gap-2">
                              <span>ID: {product.id?.substring(0, 8)}...</span>
                              <span>Price: ${product.price}</span>
                              <span>Category: {product.category || 'N/A'}</span>
                              <span>Stock: {product.stock || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeManualProduct(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
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
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
        .animate-cardIn {
          animation: cardIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
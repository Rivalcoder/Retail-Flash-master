"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, Sparkles, Search, HelpCircle, TrendingUp, Plus, Mic, MicOff, X, CheckCircle, AlertCircle } from "lucide-react";

// Import the real AI flow function
import { answerQuestion } from '@/ai/flows/customer-q-and-a-bot';

// Product type matching the database schema
interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description?: string;
  category: string;
  stock: number;
  imageUrl: string;
  promoCopy?: string;
  isNew?: boolean;
  isActive: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  productId?: string;
}

export default function QAndABot() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);
        
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          throw new Error('No products available');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const toast = (message: { title: string; description: string; variant?: "destructive" }) => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useLayoutEffect(() => {
    if (scrollViewportRef.current) {
      setTimeout(() => {
        scrollViewportRef.current?.scrollTo({
          top: scrollViewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages, isPending]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) {
      setSpeechSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Question",
        description: "Please type a question to ask the AI assistant.",
      });
      return;
    }

    if (products.length === 0) {
      toast({
        variant: "destructive",
        title: "No Products Available",
        description: "Please add some products to the inventory first.",
      });
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date(),
      productId: selectedProductId === "general" ? undefined : selectedProductId
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsPending(true);

    try {
      const response = await answerQuestion({
        productId: selectedProductId,
        question: input,
        products: products.map(p => ({
          _id: p._id,
          name: p.name,
          description: p.description || "",
          price: p.price,
          category: p.category,
          stock: p.stock,
          image: p.imageUrl,
          imageUrl: p.imageUrl,
          isNew: p.isNew,
          features: p.tags || [],
          specifications: p.specifications || {}
        })),
        history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
      });

      const botMessage: Message = {
        sender: "bot",
        text: response.answer,
        timestamp: new Date(),
        productId: selectedProductId === "general" ? undefined : selectedProductId
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get answer from bot:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
  };

  const handleMicClick = () => {
    if (!speechSupported) {
      toast({
        variant: "destructive",
        title: "Voice Not Supported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const selectedProduct = selectedProductId === "general" ? null : products.find(p => p._id === selectedProductId);

  const suggestedQuestions = [
    "What is the current stock level?",
    "What is the product category?",
    "Is this product new or used?",
    "What is the product description?",
    "What is the product ID?",
    "What is the product price?",
    "Does this product have an image?",
    "What are the product features?",
    "What are the product specifications?"
  ];

  const popularProducts = products.slice(0, 4);

  // Show loading state
  if (isLoadingProducts) {
    return (
      <div className="max-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto p-6 h-screen max-h-[90vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Loading Products...
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching inventory data for the AI assistant
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (productsError) {
    return (
      <div className="max-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto p-6 h-screen max-h-[90vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Unable to Load Products
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {productsError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="max-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto p-6 h-screen max-h-[90vh] flex items-center justify-center">
          <div className="text-center">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              No Products Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Please add some products to the inventory to use the AI assistant
            </p>
            <button
              onClick={() => window.location.href = '/admin/dashboard/inventory'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" max-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 h-screen max-h-[90vh]">
        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              <span className="text-sm">Please type a question!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8 h-full">
          {/* Main Chat Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col min-h-0 relative"
          >
            {/* New Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 z-10 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 p-3"
              onClick={() => setMessages([])}
              title="New chat"
            >
              <Plus className="h-5 w-5" />
            </motion.button>

            {/* Chat Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Header */}
              <div className="flex-shrink-0 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI Shopping Assistant
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Ask questions about products and get instant AI-powered answers
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <div 
                  ref={scrollViewportRef}
                  className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                >
                  <div className="space-y-6">
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                        >
                          <Bot className="h-12 w-12 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                          Welcome to AI Shopping Assistant
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg">
                          Select a product and ask any questions. I'll help you make informed purchasing decisions!
                        </p>
                      </motion.div>
                    )}

                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -30, scale: 0.8 }}
                          transition={{ 
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }}
                          className={`flex gap-4 ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.sender === "bot" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                            >
                              <Bot className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm prose prose-sm max-w-none dark:prose-invert">
                              {message.sender === "bot" ? (
                                <div dangerouslySetInnerHTML={{ 
                                  __html: (() => {
                                    let text = message.text;
                                    
                                    // Handle headers
                                    text = text.replace(/### (.*)/g, '<h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">$1</h3>');
                                    text = text.replace(/## (.*)/g, '<h2 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">$1</h2>');
                                    
                                    // Handle bold and italic
                                    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
                                    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
                                    
                                    // Handle code
                                    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">$1</code>');
                                    
                                    // Handle blockquotes
                                    text = text.replace(/> (.*)/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>');
                                    
                                    // Handle tables - find table blocks and convert them
                                    text = text.replace(/(\|.*\|[\s\S]*?)(?=\n\n|\n[^|]|$)/g, (match) => {
                                      const lines = match.trim().split('\n').filter(line => line.trim());
                                      if (lines.length < 2) return match;
                                      
                                      let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">';
                                      
                                      lines.forEach((line, index) => {
                                        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                                        if (cells.length === 0) return;
                                        
                                        if (index === 0) {
                                          // Header row
                                          tableHtml += '<thead><tr>';
                                          cells.forEach(cell => {
                                            tableHtml += `<th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-left">${cell}</th>`;
                                          });
                                          tableHtml += '</tr></thead><tbody>';
                                        } else if (line.includes('---')) {
                                          // Skip separator row
                                          return;
                                        } else {
                                          // Data row
                                          tableHtml += '<tr>';
                                          cells.forEach(cell => {
                                            tableHtml += `<td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">${cell}</td>`;
                                          });
                                          tableHtml += '</tr>';
                                        }
                                      });
                                      
                                      tableHtml += '</tbody></table></div>';
                                      return tableHtml;
                                    });
                                    
                                    // Handle line breaks
                                    text = text.replace(/\n/g, '<br>');
                                    
                                    return text;
                                  })()
                                }} />
                              ) : (
                                message.text
                              )}
                            </div>
                            <div className={`text-xs mt-2 ${
                              message.sender === "user" 
                                ? "text-blue-100" 
                                : "text-slate-500 dark:text-slate-400"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </motion.div>

                          {message.sender === "user" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center shadow-lg"
                            >
                              <span className="text-white font-medium text-sm">U</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isPending && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 justify-start"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 shadow-lg">
                          <div className="flex space-x-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 p-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex gap-3">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="flex-1 relative"
                  >
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                      placeholder="Type your question or use the mic..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isPending) handleSend();
                      }}
                      disabled={isPending}
                    />
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMicClick}
                    className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isListening 
                        ? "bg-green-100 border-green-300 animate-pulse" 
                        : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300"
                    }`}
                    title={isListening ? "Listening..." : "Speak your question"}
                    disabled={isPending}
                  >
                    {isListening ? (
                      <Mic className="h-5 w-5 text-green-600" />
                    ) : (
                      <MicOff className="h-5 w-5 text-slate-400" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isPending || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-80 space-y-6 overflow-y-auto"
          >
            {/* Product Selection */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">Select Product</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Choose a product to ask about</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    aria-label="Select a product to ask questions about"
                  >
                    <option value="general">General Questions</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg"
                      >
                        <img
                          src={selectedProduct.imageUrl}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 dark:text-white truncate">
                          {selectedProduct.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">₹{selectedProduct.price.toLocaleString()}</span>
                          <span>•</span>
                          <span>{selectedProduct.stock} in stock</span>
                          {selectedProduct.isNew && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-1 bg-green-500 text-white text-xs rounded-full"
                            >
                              New
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">Suggested Questions</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click to ask common questions</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 text-sm border border-slate-200 dark:border-slate-600"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Popular Products */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">Popular Products</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Most asked about products</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {popularProducts.map((product, index) => (
                  <motion.button
                    key={product._id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProductId(product._id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left border ${
                      selectedProductId === product._id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                        : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white dark:border-slate-600 shadow-md"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-slate-800 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>
                    {product.isNew && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded-full"
                      >
                        New
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
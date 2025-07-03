"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { Product } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, Search, HelpCircle, Star, TrendingUp, RefreshCcw, RotateCcw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { answerQuestion } from "@/ai/flows/customer-q-and-a-bot";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface QAndABotProps {
  products: Product[];
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  productId?: string;
}

export default function QAndABot({ products }: QAndABotProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useLayoutEffect(() => {
    if (scrollViewportRef.current) {
      setTimeout(() => {
        scrollViewportRef.current?.scrollTo({
          top: scrollViewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  }, [messages, isPending]);
  
  const handleSend = async () => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Question",
        description: "Please type a question to ask the AI assistant.",
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
        productId: selectedProductId === "general" ? "general" : selectedProductId,
        question: input,
        products: products,
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
        productId: selectedProductId === "general" ? undefined : selectedProductId
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get a response from the Q&A bot.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const selectedProduct = selectedProductId === "general" ? null : products.find(p => p._id === selectedProductId);

  const suggestedQuestions = [
    "What are the key features of this product?",
    "How does this compare to similar products?",
    "What are the warranty terms?",
    "Is this suitable for beginners?",
    "What accessories are included?",
    "How long does shipping take?",
    "What's the return policy?",
    "Are there any discounts available?"
  ];

  const popularProducts = products.slice(0, 4);

  return (
    <div className="flex gap-6 h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* New Chat floating button */}
        <Button
          variant="ghost"
          className="absolute top-3 right-3 z-10 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow hover:from-green-600 hover:to-emerald-600 transition p-2 w-9 h-9"
          onClick={() => setMessages([])}
          title="New chat"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-600" />
              AI Shopping Assistant
              <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
            </CardTitle>
            <CardDescription>
              Ask questions about products and get instant AI-powered answers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" viewportRef={scrollViewportRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to AI Shopping Assistant
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Select a product and ask any questions. I'll help you make informed purchasing decisions!
                    </p>
                  </motion.div>
                )}
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 border"
                        )}
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
                        <div className={cn(
                          "text-xs mt-2",
                          message.sender === "user" ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-500 text-white text-xs">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                  {isPending && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                    >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                        AI
                      </AvatarFallback>
                      </Avatar>
                    <div className="bg-slate-100 dark:bg-slate-800 border rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      </div>
                    </motion.div>
                  )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question about the product..."
                  className="flex-1"
                  disabled={isPending}
              />
              <Button 
                onClick={handleSend} 
                  disabled={!input.trim() || isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                <Send className="h-4 w-4" />
                  )}
              </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Left Sidebar - Product Selection & Suggestions */}
      <div className="w-80 space-y-6 overflow-y-auto">
          {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Select Product
            </CardTitle>
            <CardDescription>
              Choose a product to ask questions about
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedProductId} value={selectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Questions</SelectItem>
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProductId(product._id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedProductId === product._id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={product.image || product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{product.name}</div>
                        <div className="text-sm text-muted-foreground">₹{Number(product.price).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </SelectContent>
            </Select>

            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                  <img 
                      src={selectedProduct.image || selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>₹{Number(selectedProduct.price).toLocaleString()}</span>
                    <span>•</span>
                      <span>{selectedProduct.stock} in stock</span>
                    {selectedProduct.isNew && (
                      <>
                        <span>•</span>
                        <Badge className="bg-green-500 text-white text-xs">New</Badge>
                      </>
                    )}
                  </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Suggested Questions
            </CardTitle>
            <CardDescription>
              Click to ask common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Products
            </CardTitle>
            <CardDescription>
              Most asked about products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => setSelectedProductId(product._id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    selectedProductId === product._id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">₹{Number(product.price).toLocaleString()}</div>
              </div>
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">New</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}

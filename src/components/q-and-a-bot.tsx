"use client";

import { useState, useRef, useEffect } from "react";
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
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, X } from "lucide-react";
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
}

export default function QAndABot({ products }: QAndABotProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || !selectedProductId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a product and type a question.",
      });
      return;
    }

    const userMessage: Message = { 
      sender: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsPending(true);

    try {
      const response = await answerQuestion({
        productId: selectedProductId,
        question: input,
      });
      const botMessage: Message = { 
        sender: "bot", 
        text: response.answer,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get answer from bot:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date()
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

  const selectedProduct = products.find(p => p.id === selectedProductId);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg p-4 hover:scale-105 transition-transform focus:outline-none"
        aria-label="Open chat bot"
      >
        <Bot className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full focus:outline-none z-10"
          aria-label="Close chat bot"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 flex flex-col p-5 pt-10 gap-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center flex flex-col items-center gap-2"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Bot className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">AI Shopping Assistant</h2>
              <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm max-w-[90%] mx-auto">Ask questions about any product and get instant AI-powered answers</p>
          </motion.div>

          {/* Product Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 items-center"
          >
            <Select onValueChange={setSelectedProductId} value={selectedProductId}>
              <SelectTrigger className="w-full sm:w-[300px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                <SelectValue placeholder="Select a product to ask about..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[120px]">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate">₹{Number(product.price)}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 w-full max-w-[320px] mx-auto"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white dark:border-gray-700 shadow-md flex-shrink-0">
                  <img 
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{selectedProduct.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 max-w-full">
                    <span className="truncate">₹{Number(selectedProduct.price).toLocaleString()}</span>
                    <span>•</span>
                    <span className="truncate">{selectedProduct.stock} in stock</span>
                    {selectedProduct.isNew && (
                      <>
                        <span>•</span>
                        <Badge className="bg-green-500 text-white text-xs">New</Badge>
                      </>
                    )}
                  </div>
                  {selectedProduct.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 max-w-full">{selectedProduct.description}</div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-center">
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Chat with AI Assistant</h3>
              </div>
            </div>
            <ScrollArea className="h-[340px] p-3" ref={scrollAreaRef}>
              <div className="space-y-4 flex flex-col justify-end">
                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-muted-foreground h-full flex flex-col items-center justify-center space-y-4"
                    >
                      <Bot className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm">Select a product and ask a question to start chatting!</p>
                      </div>
                    </motion.div>
                  )}
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex items-end gap-2 w-full",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                          <Bot className="h-4 w-4 text-white" />
                        </Avatar>
                      )}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "max-w-[75%] rounded-2xl p-3 text-sm shadow-sm break-words",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white text-right"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-left"
                        )}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
                        <p className={cn(
                          "text-xs mt-2 opacity-70",
                          message.sender === "user" ? "text-purple-100" : "text-gray-500"
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-gray-500 to-gray-600">
                          <User className="h-4 w-4 text-white" />
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                  {isPending && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2 w-full justify-start"
                    >
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                        <Bot className="h-4 w-4 text-white" />
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isPending && handleSend()}
                placeholder="Ask a question about the selected product..."
                disabled={isPending || !selectedProductId}
                className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 rounded-full px-4 py-2"
              />
              <Button 
                onClick={handleSend} 
                disabled={isPending || !selectedProductId}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 rounded-full px-4 py-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

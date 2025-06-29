"use client";

import { useState } from "react";
import QAndABot from "@/components/q-and-a-bot";
import { initialProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { Bot } from "lucide-react";

export default function AdminChatbotPage() {
  const [products] = useState<Product[]>(initialProducts);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="w-full max-w-md mx-auto p-4">
        <QAndABot products={products} />
      </div>
      <Link
        href="/admin/dashboard"
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg p-4 hover:scale-105 transition-transform focus:outline-none"
        aria-label="Back to dashboard"
      >
        <Bot className="h-7 w-7 rotate-180" />
      </Link>
    </div>
  );
} 
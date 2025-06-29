"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Bot, Zap, Shield, BarChart, ShoppingCart, Cpu } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Live Inventory Dashboard",
    description: "Visualize your entire product catalog in real-time. See stock levels, prices, and new additions at a glance.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "AI-Powered Promo Copy",
    description: "Automatically generate compelling marketing copy for new or updated products, highlighting sales and key features.",
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "Intelligent Q&A Bot",
    description: "Provide instant, accurate answers to customer questions with a chatbot that has real-time access to your catalog.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Admin Controls",
    description: "Easily manage your product catalog by uploading a simple JSON file. All changes are reflected instantly.",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Powered by Genkit",
    description: "Leverages the latest in generative AI to provide cutting-edge features for your e-commerce business.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Real-time Analytics",
    description: "Gain insights into your store's performance with AI-driven analytics and reporting (Coming Soon).",
  },
]

export default function LandingPage() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold">RetailFlow AI</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <Button variant="ghost" asChild>
                <Link href="/login">Customer Login</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate">
           <div
            className={cn(
              "absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]",
            )}
            aria-hidden="true"
            >
                <div
                className={cn(
                    "relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]",
                    "dark:opacity-10"
                )}
                />
            </div>

            <motion.div
                initial="hidden"
                animate="show"
                viewport={{ once: true }}
                variants={{
                hidden: {},
                show: {
                    transition: {
                    staggerChildren: 0.15,
                    },
                },
                }}
                className="container relative flex flex-col items-center justify-center space-y-6 py-24 text-center sm:py-32"
            >
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
                    <span>Now powered by Gemini 2.0 Flash</span>
                </motion.div>
                <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
                    The AI Co-Pilot for Modern Retail
                </motion.h1>
                <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-2xl text-lg text-muted-foreground">
                    Streamline your e-commerce operations with real-time AI. From inventory management to customer service, RetailFlow has you covered.
                </motion.p>
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                    <Button asChild size="lg">
                        <Link href="/admin/login">Admin Login &rarr;</Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>

        <section className="bg-muted/40 py-16 sm:py-24">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need. Nothing you don't.</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        RetailFlow AI provides a suite of tools to help you manage and grow your business with the power of AI.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">{feature.icon}</div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t py-6 md:px-8 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by <span className="font-medium">Firebase</span>. The source code is available on GitHub.
            </p>
          </div>
      </footer>
    </div>
  )
}

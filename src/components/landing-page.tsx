"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Bot, Store, Shield, BarChart, ShoppingCart, Cpu } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { HoverEffect } from "@/components/ui/card-hover-effect"

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Live Inventory Dashboard",
    description:
      "Visualize your entire product catalog in real-time. See stock levels, prices, and new additions at a glance.",
  },
  {
    icon: <Store className="h-8 w-8" />,
    title: "AI-Powered Promo Copy",
    description:
      "Automatically generate compelling marketing copy for new or updated products, highlighting sales and key features.",
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "Intelligent Q&A Bot",
    description:
      "Provide instant, accurate answers to customer questions with a chatbot that has real-time access to your catalog.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Admin Controls",
    description:
      "Easily manage your product catalog by uploading a simple JSON file. All changes are reflected instantly.",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Powered by Gemini AI",
    description:
      "Leverages the latest in generative AI to provide cutting-edge features for your e-commerce business.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Real-time Analytics",
    description:
      "Gain insights into your store's performance with AI-driven analytics and reporting (Coming Soon).",
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
            <Store className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold">Retail Flash</span>
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
          <BackgroundBeamsWithCollision className="bg-muted/40 py-16 sm:py-24">
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
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
                <motion.div
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="rounded-full border px-4 py-1.5 text-sm text-muted-foreground bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-md"
                >
                  <span>Now powered by Pathway</span>
                </motion.div>
                <motion.h1
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl drop-shadow-lg"
                >
                  The AI Co-Pilot for Modern Retail
                </motion.h1>
                <motion.p
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="max-w-2xl text-lg text-muted-foreground"
                >
                  Streamline your e-commerce operations with real-time AI. From inventory management to customer service, Retail Flash has you covered.
                </motion.p>
                <motion.div
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    <Link href="/admin/login">Admin Login &rarr;</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="backdrop-blur-md border-primary/30"
                  >
                    <Link href="#features" scroll>
                      See Features
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </BackgroundBeamsWithCollision>
        </div>

        <div className="flex items-center justify-center bg-muted/40">
          <span className="h-px w-1/4 bg-gray-500" />
          <span className="mx-4 text-gray-700 font-semibold tracking-wide">Features</span>
          <span className="h-px w-1/4 bg-gray-500" />
        </div>

        <section id="features" className="bg-muted/40 py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need. Nothing you don't.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Retail Flash provides a suite of tools to help you manage and grow your business with the power of AI.
              </p>
            </div>

            <div className="mt-12">
              <div className="max-w-6xl mx-auto px-4">
                <HoverEffect items={features} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:px-8 md:py-0 bg-background/80 backdrop-blur">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Retail Flash. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

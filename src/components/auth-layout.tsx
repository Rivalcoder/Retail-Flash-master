'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import Image from "next/image";
import logo from "../../public/logo.png";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[10%] rounded-full bg-primary/20 opacity-50 blur-3xl" />
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] translate-x-[20%] translate-y-[20%] rounded-full bg-primary/10 opacity-50 blur-3xl" />
        </div>
      </div>

      <header className="fixed top-0 z-50 w-full">
        <motion.div
          className="container flex h-16 items-center justify-between"
          initial="hidden"
          animate="show"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <span className="font-bold text-2xl">Retail Flash</span>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Admin Login
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gradient-to-br from-blue-700 to-purple-800 shadow-lg">
                <Image
                  src={logo}
                  alt="logo"
                  width={70}
                  height={70}
                  className="h-13 w-13 object-contain"
                />
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </motion.div>
      </header>

      <main className="flex w-full flex-1 items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}

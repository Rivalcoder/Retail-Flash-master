import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Zap, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Retail Flow AI
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Customer Portal</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50">
              <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Welcome Back</span>
            </div>
            
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
            
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              asChild
            >
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Link>
            </Button>
            
            <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-800 shadow-lg">
              <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person user" />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                CU
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col gap-6 p-6">
        {children}
      </main>
    </div>
  );
}

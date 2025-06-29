import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Zap, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 z-10 backdrop-blur-sm">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Zap className="h-6 w-6 text-primary" />
            <span className="">Retail Flow AI</span>
          </Link>
          <Link href="/dashboard" className="text-foreground font-bold transition-colors hover:text-foreground/80">
            Dashboard
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className='ml-auto' />
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
                <LogOut />
                <span className="sr-only">Logout</span>
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person user" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}

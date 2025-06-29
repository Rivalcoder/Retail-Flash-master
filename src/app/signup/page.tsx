'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthLayout from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'customer' }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Your account has been created. Please log in.',
        });
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: data.message || 'There was a problem with your request.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <AuthLayout>
      <motion.div
        className="w-full max-w-sm"
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
      >
        <Card className="bg-card/60 backdrop-blur-lg border-border/50">
          <CardHeader>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Create an Account
              </CardTitle>
            </motion.div>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <CardDescription>
                Enter your details to get started with RetailFlow AI.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </motion.div>
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>
            </form>
            <motion.div
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="mt-4 text-center text-sm"
            >
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}

'use client';

import Link from 'next/link';
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
import { motion } from 'framer-motion';

export default function CustomerLoginPage() {
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
                Welcome Back!
              </CardTitle>
            </motion.div>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
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
                />
              </motion.div>
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button type="submit" className="w-full" asChild>
                  <Link href="/dashboard">Login</Link>
                </Button>
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </motion.div>
            </form>
            <motion.div
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="mt-4 text-center text-sm"
            >
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}

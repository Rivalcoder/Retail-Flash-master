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

export default function AdminLoginPage() {
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
                Admin Portal
              </CardTitle>
            </motion.div>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <CardDescription>
                Enter your admin credentials to access the dashboard.
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
                  placeholder="admin@example.com"
                  required
                />
              </motion.div>
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button type="submit" className="w-full" asChild>
                  <Link href="/admin/dashboard">Login</Link>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}

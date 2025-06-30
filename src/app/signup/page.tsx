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
import { Loader2, Eye, EyeOff, Mail, Lock, User, Github, Chrome, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName,
          role: 'customer' 
        }),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
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
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105">
          <CardHeader className="text-center pb-6">
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                Create an Account
              </CardTitle>
            </motion.div>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <CardDescription className="text-gray-300">
                Enter your details to get started with Retail Flash.
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white hover:text-white transition-all duration-300 hover:scale-105"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
              </motion.div>
            </div>

            {/* Divider */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-300">or</span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
              
              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="grid gap-2"
              >
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="mt-6 text-center text-sm"
            >
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                >
                  Login
                </Link>
              </p>
            </motion.div>

            {/* Terms and Privacy */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                By creating an account, you agree to our{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
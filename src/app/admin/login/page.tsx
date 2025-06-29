'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff, Lock, Mail, Shield, Chrome } from 'lucide-react';

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and redirect to admin dashboard
    setTimeout(() => {
      setIsLoading(false);
      console.log('Admin login attempt:', formData);
      router.push('/admin/dashboard');
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Admin login with ${provider}`);
  };

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  const CARD_HOVER_VARIANTS = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <AuthLayout>
      {/* Enhanced background with floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
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
        <motion.div
          variants={CARD_HOVER_VARIANTS}
          whileHover="hover"
        >
          <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-card/90 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            
            <CardHeader className="relative z-10 text-center pb-2">
              <motion.div 
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="flex justify-center mb-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Admin Portal
                </CardTitle>
              </motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                <CardDescription className="text-muted-foreground/80">
                  Enter your admin credentials to access the dashboard.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">

              {/* Divider */}
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-4 text-muted-foreground/60 backdrop-blur-sm rounded-full border border-border/30">
                    or continue with email
                  </span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-purple-500 hover:bg-background/80 transition-all duration-300"
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-purple-500 hover:bg-background/80 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-purple-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Remember me and forgot password */}
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-border/50 rounded focus:ring-purple-500 focus:ring-2 bg-background/50"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-purple-600 hover:text-purple-500 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Signing in...
                      </div>
                    ) : (
                      'Access Dashboard'
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Additional admin info */}
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center">
                <p className="text-xs text-muted-foreground/60">
                  Need admin access?{' '}
                  <Link
                    href="/contact"
                    className="text-purple-600 hover:text-purple-500 transition-colors hover:underline"
                  >
                    Contact support
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="text-center mt-6"
        >
          <p className="text-xs text-muted-foreground/60">
            © 2025 Admin Portal. Secured and protected.
          </p>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
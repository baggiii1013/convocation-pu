'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, GraduationCap, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Show success message if redirected from registration
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      toast.success(message);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Info (Hidden on mobile) */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <div className="mb-12">
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">PU Convocation</h2>
                <p className="text-primary-200">Excellence in Education</p>
              </div>
            </motion.div>
          </div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to Your
              <br />
              <span className="bg-gradient-to-r from-accent-pink to-accent-blue bg-clip-text text-transparent">
                Convocation Portal
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-12 leading-relaxed max-w-lg">
              Manage your convocation journey with ease. Access your seat assignments, 
              download certificates, and stay updated with all event details.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: CheckCircle2, text: "Secure and encrypted platform" },
              { icon: Shield, text: "Role-based access control" },
              { icon: Sparkles, text: "Real-time event updates" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-primary-100 text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="max-w-md w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <motion.div 
                className="inline-flex items-center gap-3 mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-white">PU Convocation</h2>
              </motion.div>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Sign in to your account</CardTitle>
                  <CardDescription className="text-primary-100">
                    Enter your credentials to access the convocation platform
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-5">
                    {error && (
                      <motion.div 
                        className="rounded-xl bg-red-500/20 backdrop-blur-sm p-4 border border-red-400/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-sm text-red-100 font-medium flex items-center gap-2">
                          <span className="text-red-300">⚠</span>
                          {error}
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 pointer-events-none z-10" />
                        <Input
                          type="email"
                          placeholder="Email address"
                          className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:border-white/40 focus:ring-white/20"
                          autoComplete="email"
                          required
                          {...register('email')}
                          error={errors.email?.message}
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 pointer-events-none z-10" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:border-white/40 focus:ring-white/20"
                          autoComplete="current-password"
                          required
                          {...register('password')}
                          error={errors.password?.message}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-white/20 transition-all"
                        />
                        <span className="text-sm text-primary-100 group-hover:text-white transition-colors">
                          Remember me
                        </span>
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-accent-blue hover:text-accent-pink transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isLoading}
                      disabled={isLoading}
                      className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>

                    <p className="text-center text-sm text-primary-200">
                      Don't have an account?{' '}
                      <span className="text-white font-medium">Contact your administrator</span>
                    </p>
                  </CardFooter>
                </form>
              </Card>

              {/* Footer Links */}
              <div className="mt-6 text-center text-xs text-primary-200">
                <p>
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-white hover:text-accent-blue underline transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-white hover:text-accent-blue underline transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <GraduationCap className="w-8 h-8 text-primary-600" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            </motion.div>
            <p className="text-white text-lg font-medium">Loading convocation portal...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

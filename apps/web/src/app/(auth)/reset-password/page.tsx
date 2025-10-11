'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff, GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    return Math.min(strength, 100);
  };

  // Watch password field for real-time strength updates
  watch((formData) => {
    const password = formData.password;
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    }
  });

  const onSubmit = async (_data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?message=Password reset successfully. Please sign in.');
      }, 2000);
    } catch (_error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 relative overflow-hidden flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Invalid Reset Link</h2>
          <p className="text-primary-100 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password">
            <Button variant="primary" className="bg-white text-primary-700 hover:bg-primary-50">
              Request a new link
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-white">PU Convocation</h2>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!isSuccess ? (
              <Card variant="glass" className="border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent-blue/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <ShieldCheck className="w-8 h-8 text-accent-blue" />
                  </div>
                  <CardTitle className="text-2xl text-white text-center">Set new password</CardTitle>
                  <CardDescription className="text-primary-100 text-center">
                    Choose a strong password to secure your account
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-5">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 pointer-events-none z-10" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New password"
                          className="pl-11 pr-11 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:border-white/40 focus:ring-white/20"
                          autoComplete="new-password"
                          required
                          {...register('password')}
                          error={errors.password?.message}
                          onChange={(e) => {
                            register('password').onChange(e);
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-white transition-colors z-10"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {password && password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-primary-200">Password strength</span>
                            <span className={`font-medium ${
                              passwordStrength < 40 ? 'text-red-400' :
                              passwordStrength < 70 ? 'text-orange-400' :
                              'text-green-400'
                            }`}>
                              {getStrengthText()}
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${getStrengthColor()} transition-all duration-300`}
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 pointer-events-none z-10" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="pl-11 pr-11 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:border-white/40 focus:ring-white/20"
                        autoComplete="new-password"
                        required
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-white transition-colors z-10"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs text-primary-200 mb-2 font-medium">Password must contain:</p>
                      <ul className="space-y-1 text-xs text-primary-100">
                        <li className="flex items-center gap-2">
                          <span className={password?.length >= 8 ? 'text-green-400' : 'text-primary-300'}>
                            {password?.length >= 8 ? '✓' : '○'}
                          </span>
                          At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={/[A-Z]/.test(password || '') ? 'text-green-400' : 'text-primary-300'}>
                            {/[A-Z]/.test(password || '') ? '✓' : '○'}
                          </span>
                          One uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={/[a-z]/.test(password || '') ? 'text-green-400' : 'text-primary-300'}>
                            {/[a-z]/.test(password || '') ? '✓' : '○'}
                          </span>
                          One lowercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={/[0-9]/.test(password || '') ? 'text-green-400' : 'text-primary-300'}>
                            {/[0-9]/.test(password || '') ? '✓' : '○'}
                          </span>
                          One number
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={/[^A-Za-z0-9]/.test(password || '') ? 'text-green-400' : 'text-primary-300'}>
                            {/[^A-Za-z0-9]/.test(password || '') ? '✓' : '○'}
                          </span>
                          One special character
                        </li>
                      </ul>
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
                      {isLoading ? 'Resetting password...' : 'Reset password'}
                    </Button>

                    <p className="text-center text-sm text-primary-200">
                      Remember your password?{' '}
                      <Link href="/login" className="text-white font-medium hover:text-accent-blue transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              // Success State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card variant="glass" className="border-white/20 shadow-2xl">
                  <CardContent className="pt-8 pb-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2 
                      }}
                      className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-3">Password reset successful!</h3>
                    <p className="text-primary-100 mb-6">
                      Your password has been reset successfully.
                      <br />
                      Redirecting you to login...
                    </p>

                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

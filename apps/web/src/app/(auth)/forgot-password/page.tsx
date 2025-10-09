'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, GraduationCap, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Back to Login Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 text-white hover:text-accent-blue transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to login</span>
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
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
            transition={{ delay: 0.4 }}
          >
            {!isSuccess ? (
              <Card variant="glass" className="border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent-blue/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Mail className="w-8 h-8 text-accent-blue" />
                  </div>
                  <CardTitle className="text-2xl text-white text-center">Forgot your password?</CardTitle>
                  <CardDescription className="text-primary-100 text-center">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-5">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 pointer-events-none z-10" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:border-white/40 focus:ring-white/20"
                        autoComplete="email"
                        required
                        {...register('email')}
                        error={errors.email?.message}
                      />
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
                      {isLoading ? (
                        'Sending...'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Send reset link
                        </span>
                      )}
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

                    <h3 className="text-2xl font-bold text-white mb-3">Check your email</h3>
                    <p className="text-primary-100 mb-6 leading-relaxed">
                      We've sent a password reset link to
                      <br />
                      <span className="font-semibold text-white">{submittedEmail}</span>
                    </p>

                    <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                      <p className="text-sm text-primary-100">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                          onClick={() => setIsSuccess(false)}
                          className="text-accent-blue hover:text-accent-pink font-medium transition-colors"
                        >
                          try again
                        </button>
                      </p>
                    </div>

                    <Link href="/login" className="block">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl"
                      >
                        Return to login
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-primary-200">
              Need help?{' '}
              <Link href="/contact" className="text-white hover:text-accent-blue underline transition-colors">
                Contact support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

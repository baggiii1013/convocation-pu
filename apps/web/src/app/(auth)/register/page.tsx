'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  studentId: z.string().optional(),
  department: z.string().optional(),
  program: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Extract confirmPassword and prepare data for API
      const { confirmPassword, ...registerData } = data;
      
      await api.post('/api/v1/auth/register', {
        ...registerData,
        role: 'STUDENT' // Default role for registration
      });
      
      toast.success('Account created successfully! Please sign in to continue.');
      setSuccess(true);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/login?message=Registration successful. Please sign in.');
      }, 2000);
    } catch (err: unknown) {
      let errorMessage = 'Registration failed';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || 'Registration failed';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Card className="bg-card/50 backdrop-blur border-border shadow-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-gold-subtle rounded-full blur-xl opacity-30"></div>
              
              <CardContent className="pt-8 relative z-10">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 shadow-glow mb-4">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Welcome to PU Convocation platform. You will be redirected to sign in.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-gold font-medium">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold"></div>
                    <span>Redirecting...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-background/50 border rounded-full -z-20" />
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative shadow-glow">
                <span className="text-white font-bold text-2xl">PU</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full shadow-gold"></div>
              </div>
            </div>
            
            <div className="inline-block px-4 py-2 mb-4 bg-gradient-gold-subtle text-gold-dark font-semibold rounded-full border border-gold/20 shadow-sm">
              Join Convocation
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join the PU Convocation platform and celebrate your achievements
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-gold/20 transition-all duration-300 relative overflow-hidden shadow-gold">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-gold-subtle rounded-full blur-xl opacity-30"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground text-xl">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your details to join the convocation platform
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 relative z-10">
                {error && (
                  <div className="rounded-lg bg-red-50/80 backdrop-blur p-4 border border-red-200/50 dark:bg-red-900/30 dark:border-red-800/50">
                    <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                      {error}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    type="text"
                    autoComplete="given-name"
                    required
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                  />

                  <Input
                    label="Last Name"
                    type="text"
                    autoComplete="family-name"
                    required
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                  />
                </div>

                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  {...register('email')}
                  error={errors.email?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Student ID (Optional)"
                    type="text"
                    {...register('studentId')}
                    error={errors.studentId?.message}
                    className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                  />

                  <Input
                    label="Department (Optional)"
                    type="text"
                    {...register('department')}
                    error={errors.department?.message}
                    className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                  />
                </div>

                <Input
                  label="Program (Optional)"
                  type="text"
                  placeholder="e.g., B.Tech, M.Tech, MBA"
                  {...register('program')}
                  error={errors.program?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  required
                  {...register('password')}
                  error={errors.password?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  required
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-gold focus:ring-gold border-border rounded transition-colors duration-300 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground font-medium leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-gold hover:text-gold-dark underline transition-colors duration-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-gold hover:text-gold-dark underline transition-colors duration-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 relative z-10">
                <Button
                  type="submit"
                  className="w-full bg-gradient-gold text-black border-0 shadow-gold hover:shadow-gold-intense hover:scale-105 transition-all duration-300 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Join Convocation Platform'
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-gold hover:text-gold-dark transition-colors duration-300"
                    >
                      Sign in here
                    </Link>
                  </span>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

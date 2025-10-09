'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
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
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-primary-500/5 border border-primary-500/10 rounded-full -z-20" />
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center relative shadow-glow-lg">
                <span className="text-white font-bold text-2xl">PU</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-pink rounded-full shadow-lg shadow-accent-pink/50"></div>
              </div>
            </div>
            
            <div className="inline-block px-4 py-2 mb-4 bg-primary-500/10 text-primary-400 font-semibold rounded-full border border-primary-500/30 shadow-sm backdrop-blur">
              Convocation Portal
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-gray-400">
              Sign in to your PU Convocation account
            </p>
          </div>

          {/* Form Card */}
          <Card variant="gradient" className="backdrop-blur border-primary-500/30 transition-all duration-300 relative overflow-hidden shadow-glow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-2xl">Sign in</CardTitle>
              <CardDescription className="text-gray-300">
                Enter your credentials to access the convocation platform
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 relative z-10">
                {error && (
                  <div className="rounded-lg bg-red-500/10 backdrop-blur p-4 border border-red-500/30">
                    <div className="text-sm text-red-400 font-medium">
                      {error}
                    </div>
                  </div>
                )}

                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  {...register('email')}
                  error={errors.email?.message}
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register('password')}
                  error={errors.password?.message}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-border rounded bg-dark-surface transition-colors duration-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white font-medium">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-primary-400 hover:text-primary-300 transition-colors duration-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 relative z-10">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in to Convocation Portal'}
                </Button>

                {/* Removed registration link - accounts are created by admins only */}
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary-400 hover:text-primary-300 underline transition-colors duration-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline transition-colors duration-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
        </div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center relative shadow-glow-lg mx-auto mb-4">
              <span className="text-white font-bold text-2xl">PU</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-pink rounded-full shadow-lg shadow-accent-pink/50"></div>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Loading convocation portal...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

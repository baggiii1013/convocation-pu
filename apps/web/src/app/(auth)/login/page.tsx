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
              Convocation Portal
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your PU Convocation account
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-gold/20 transition-all duration-300 relative overflow-hidden shadow-gold">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-gold-subtle rounded-full blur-xl opacity-30"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground text-xl">Sign in</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access the convocation platform
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

                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  {...register('email')}
                  error={errors.email?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register('password')}
                  error={errors.password?.message}
                  className="bg-background/50 backdrop-blur border-border focus:border-gold/50 transition-all duration-300"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-gold focus:ring-gold border-border rounded transition-colors duration-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground font-medium">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-gold hover:text-gold-dark transition-colors duration-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in to Convocation Portal'
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="font-semibold text-gold hover:text-gold-dark transition-colors duration-300"
                    >
                      Create account
                    </Link>
                  </span>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-gold hover:text-gold-dark underline transition-colors duration-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-gold hover:text-gold-dark underline transition-colors duration-300">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative shadow-glow mx-auto mb-4">
              <span className="text-white font-bold text-2xl">PU</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full shadow-gold"></div>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading convocation portal...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

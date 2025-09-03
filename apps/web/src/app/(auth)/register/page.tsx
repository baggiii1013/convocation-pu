'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
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
      
      const { confirmPassword, ...registerData } = data;
      
      await api.post('/auth/register', registerData);
      
      setSuccess(true);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/login?message=Registration successful. Please sign in.');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
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
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-50">
                  Registration Successful!
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your account has been created successfully. You will be redirected to the login page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-slate-900 dark:bg-slate-50" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-50">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Join PU Convocation platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Create your account to access convocation services
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
                  <div className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </div>
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                required
                {...register('displayName')}
                error={errors.displayName?.message}
              />

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Student ID (Optional)"
                  type="text"
                  {...register('studentId')}
                  error={errors.studentId?.message}
                />

                <Input
                  label="Department (Optional)"
                  type="text"
                  {...register('department')}
                  error={errors.department?.message}
                />
              </div>

              <Input
                label="Program (Optional)"
                type="text"
                placeholder="e.g., B.Tech, M.Tech, MBA"
                {...register('program')}
                error={errors.program?.message}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                {...register('password')}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                required
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-slate-900 dark:text-slate-50">
                  I agree to the{' '}
                  <Link href="/terms" className="text-slate-600 hover:text-slate-500 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-slate-600 hover:text-slate-500 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <div className="text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

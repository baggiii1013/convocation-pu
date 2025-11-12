'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const createAccountSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'STAFF', 'ADMIN']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

/**
 * Client Component: Create Account Form
 * 
 * Handles all interactivity for creating new user accounts:
 * - Form validation with Zod
 * - Role selection with descriptions
 * - Password confirmation
 * - API submission
 * - Success/error toast notifications
 * 
 * @component
 */
export function CreateAccountClient() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      role: 'STUDENT'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      setIsLoading(true);
      
      const { confirmPassword: _confirmPassword, ...accountData } = data;
      
      await api.post('/api/v1/auth/admin/create-account', accountData);
      
      toast.success(`Account created successfully for ${accountData.email}!`);
      reset(); // Reset form after successful creation
      
    } catch (err: unknown) {
      console.error('Account creation error:', err);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create account';
      
      const error = err as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show specific error based on status code
      if (error.response?.status === 400) {
        toast.error(`Validation Error: ${errorMessage}`);
      } else if (error.response?.status === 403) {
        toast.error('Access Denied: You do not have permission to create accounts');
      } else if (error.response?.status === 409 || errorMessage.includes('already')) {
        toast.error(`Email Already Exists: ${errorMessage}`);
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-gold to-gold-dark rounded-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Create New Account
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Create a new user account with specified role and permissions
          </p>
        </div>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Enter the details for the new account. All fields are required.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Account Role
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                    errors.role ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent`}
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                )}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {selectedRole === 'STUDENT' && '• Can view their own convocation details and profile'}
                  {selectedRole === 'STAFF' && '• Can assist with convocation management and access reports'}
                  {selectedRole === 'ADMIN' && '• Full system access including user management, data upload, and system configuration'}
                </p>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Account Creation Policy</p>
                <ul className="space-y-1 text-xs">
                  <li>• Users will receive their credentials and can change their password after first login</li>
                  <li>• Student accounts should be linked to attendee records via enrollment ID</li>
                  <li>• Admin accounts have elevated permissions - create with caution</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

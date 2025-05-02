import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, AlertCircle, Building } from 'lucide-react';
import { useAuth, Branch } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  branch: z.enum(['Fedha', 'Utawala', 'Machakos', 'Tassia', 'Kitengela'], {
    errorMap: () => ({ message: 'Please select a branch' }),
  }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@bristolhospital.com',
      password: 'admin12345',
      branch: 'Fedha'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      const success = await login(data.email, data.password, data.branch as Branch);

      if (!success) {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen login-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl relative z-10 border-l-4 border-[#F5B800]">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/bristol-logo.png"
              alt="Bristol Hospital Logo"
              className="h-32 w-auto"
            />
          </div>

          <h2 className="mt-2 text-xl font-bold text-[#0000F6]">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the hospital management system
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-[#0000F6] to-[#F5B800] rounded-full"></div>
          </div>
        </div>

        {loginError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{loginError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#F5B800]" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F5B800] focus:border-[#F5B800] sm:text-sm`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#F5B800]" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F5B800] focus:border-[#F5B800] sm:text-sm`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="branch" className="sr-only">
                Branch
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-[#F5B800]" />
                </div>
                <select
                  {...register('branch')}
                  id="branch"
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    errors.branch ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 focus:outline-none focus:ring-[#F5B800] focus:border-[#F5B800] sm:text-sm`}
                >
                  <option value="">Select Branch</option>
                  <option value="Fedha">Fedha Branch</option>
                  <option value="Utawala">Utawala Branch</option>
                  <option value="Machakos">Machakos Branch</option>
                  <option value="Tassia">Tassia Branch</option>
                  <option value="Kitengela">Kitengela Branch</option>
                </select>
              </div>
              {errors.branch && (
                <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#F5B800] focus:ring-[#F5B800] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#0000F6] hover:text-[#0000D6]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#0000F6] to-[#0000D6] hover:from-[#0000D6] hover:to-[#0000F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-[#0000F6] hover:text-[#0000D6]">
              Contact administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
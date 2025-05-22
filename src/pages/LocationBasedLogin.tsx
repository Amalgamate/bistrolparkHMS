import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, User, AlertCircle, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth, LoginResult } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Define the login form schema
const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your email or job ID'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Define the branch selection form schema
const branchSelectionSchema = z.object({
  branchId: z.string().min(1, 'Please select a branch'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type BranchSelectionFormData = z.infer<typeof branchSelectionSchema>;

const LocationBasedLogin: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [requiresBranchSelection, setRequiresBranchSelection] = useState(false);
  const [allowedBranches, setAllowedBranches] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const { login, selectBranch, isLoading } = useAuth();
  const { branches, getCurrentLocation } = useSettings();

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    getValues: getLoginValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  // Branch selection form
  const {
    register: registerBranchSelection,
    handleSubmit: handleBranchSelectionSubmit,
    formState: { errors: branchSelectionErrors },
  } = useForm<BranchSelectionFormData>({
    resolver: zodResolver(branchSelectionSchema),
    defaultValues: {
      branchId: '',
    },
  });

  // Check for geolocation support on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('idle');
    } else {
      setLocationStatus('error');
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      setLocationStatus('detecting');

      // Store the login attempt in session storage for later use
      sessionStorage.setItem(
        'lastLoginAttempt',
        JSON.stringify({
          identifier: data.identifier,
          rememberMe: data.rememberMe,
        })
      );

      // Attempt to login
      const result = await login(data.identifier, data.password);

      if (result.success) {
        // Login successful
        setLocationStatus('detected');
      } else if (result.requiresBranchSelection && result.allowedBranches) {
        // User needs to select a branch
        setRequiresBranchSelection(true);
        setAllowedBranches(result.allowedBranches);
        setLocationStatus('detected');
      } else {
        // Login failed
        setLoginError(result.message || 'Invalid credentials');
        setLocationStatus('idle');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
      setLocationStatus('error');
    }
  };

  // Handle branch selection form submission
  const onBranchSelectionSubmit = async (data: BranchSelectionFormData) => {
    try {
      setLoginError(null);
      const result = await selectBranch(data.branchId);

      if (!result.success) {
        setLoginError(result.message || 'Failed to select branch');
      }
    } catch (error) {
      console.error('Branch selection error:', error);
      setLoginError('An error occurred during branch selection');
    }
  };

  // Handle back button click
  const handleBackToLogin = () => {
    setRequiresBranchSelection(false);
    setAllowedBranches([]);
    setLoginError(null);
  };

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  // Detect current location
  const detectLocation = async () => {
    setLocationStatus('detecting');
    try {
      const position = await getCurrentLocation();
      if (position) {
        setLocationStatus('detected');
        // You could use this position to auto-select a branch
      } else {
        setLocationStatus('error');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setLocationStatus('error');
    }
  };

  return (
    <div className="min-h-screen login-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl relative z-10 border-l-4 border-[#2B3990]">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/bristol-logo.png"
              alt="Bristol Park Hospital Logo"
              className="h-32 w-auto"
            />
          </div>

          <h2 className="mt-2 text-xl font-bold text-[#2B3990]">
            {requiresBranchSelection ? 'Select Branch' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {requiresBranchSelection
              ? 'Please select the branch you want to access'
              : 'Sign in to access the hospital management system'}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-[#2B3990] to-[#A61F1F] rounded-full"></div>
          </div>
        </div>

        {loginError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          </div>
        )}

        {!requiresBranchSelection ? (
          // Login Form
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="identifier" className="sr-only">
                  Email or Job ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#2B3990]" />
                  </div>
                  <input
                    {...registerLogin('identifier')}
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                      loginErrors.identifier ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2B3990] focus:border-[#2B3990] sm:text-sm`}
                    placeholder="Email or Job ID"
                  />
                </div>
                {loginErrors.identifier && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.identifier.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#2B3990]" />
                  </div>
                  <input
                    {...registerLogin('password')}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border ${
                      loginErrors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2B3990] focus:border-[#2B3990] sm:text-sm`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#2B3990] focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...registerLogin('rememberMe')}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#2B3990] hover:text-blue-800">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#2B3990] to-[#1E2A6B] hover:from-[#1E2A6B] hover:to-[#2B3990] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A61F1F] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Location status indicator */}
            <div className="flex items-center justify-center text-sm">
              {locationStatus === 'idle' && (
                <button
                  type="button"
                  onClick={detectLocation}
                  className="flex items-center text-gray-600 hover:text-[#2B3990]"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Detect my location
                </button>
              )}
              {locationStatus === 'detecting' && (
                <div className="flex items-center text-gray-600">
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                  Detecting location...
                </div>
              )}
              {locationStatus === 'detected' && (
                <div className="flex items-center text-green-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  Location detected
                </div>
              )}
              {locationStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Location detection failed
                </div>
              )}
            </div>
          </form>
        ) : (
          // Branch Selection Form
          <form className="mt-8 space-y-6" onSubmit={handleBranchSelectionSubmit(onBranchSelectionSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Branch
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#2B3990]" />
                  </div>
                  <select
                    {...registerBranchSelection('branchId')}
                    id="branchId"
                    className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                      branchSelectionErrors.branchId ? 'border-red-300' : 'border-gray-300'
                    } text-gray-900 focus:outline-none focus:ring-[#2B3990] focus:border-[#2B3990] sm:text-sm`}
                  >
                    <option value="">Select a branch</option>
                    {allowedBranches.map((branchId) => (
                      <option key={branchId} value={branchId}>
                        {getBranchName(branchId)}
                      </option>
                    ))}
                  </select>
                </div>
                {branchSelectionErrors.branchId && (
                  <p className="mt-1 text-sm text-red-600">{branchSelectionErrors.branchId.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#2B3990] to-[#1E2A6B] hover:from-[#1E2A6B] hover:to-[#2B3990] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A61F1F] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Selecting...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="mailto:system@bristolparkhospital.com?subject=Account%20Request&body=Hello%20Administrator,%0A%0AI%20would%20like%20to%20request%20an%20account%20for%20the%20Bristol%20Park%20Hospital%20Management%20System.%0A%0AName:%20%0APosition:%20%0ADepartment:%20%0AEmail:%20%0APhone:%20%0A%0AThank%20you."
              className="font-medium text-[#2B3990] hover:text-blue-800"
            >
              Contact administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationBasedLogin;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import { useToast } from '../context/ToastContext';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full Name must be at least 2 characters')
      .max(100, 'Max 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      await registerWithEmail(data.fullName, data.email, data.password, 'EGP');
      showToast('Account created successfully! Welcome to StudentWallet.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in your Firebase Console yet. Please enable it under Firebase Console -> Authentication -> Sign-in method.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'The password is too weak. Please use at least 8 characters with letters and numbers.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      showToast(msg, 'error');
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google sign-in failed');
        showToast(err.message || 'Google sign-in failed', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#102A2A] flex items-center justify-center text-[#C6A76A] shadow-md shadow-[#102A2A]/20 border border-[#C6A76A]/30">
            <Wallet className="w-6 h-6 text-[#C6A76A]" />
          </div>
          <span className="text-2xl font-black text-[#202B29] tracking-tight">
            Student<span className="text-[#23866B]">Wallet</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B29] tracking-tight">
          Create Your Student Account
        </h2>
        <p className="text-sm text-[#78877F]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#23866B] hover:text-[#1C6C56]">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#EAE8E1] space-y-6">
          {/* Global error banner */}
          {authError && (
            <div className="p-3.5 bg-[#FDF1F0] border border-[#E47770]/30 rounded-xl text-xs text-[#E47770] font-medium">
              {authError}
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 border border-[#EAE8E1] rounded-xl shadow-2xs bg-white text-sm font-semibold text-[#202B29] hover:bg-[#F5F3ED] transition-colors disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#23866B]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Sign up with Google
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#EAE8E1]" />
            <span className="shrink mx-4 text-xs font-semibold text-[#78877F] uppercase">
              Or with email
            </span>
            <div className="flex-grow border-t border-[#EAE8E1]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
                Full Name <span className="text-[#E47770]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Abdullah Haroon"
                {...register('fullName')}
                className={`w-full px-3.5 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                  errors.fullName ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
                Email Address <span className="text-[#E47770]">*</span>
              </label>
              <input
                type="email"
                placeholder="student@university.edu"
                {...register('email')}
                className={`w-full px-3.5 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                  errors.email ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
                Password (min 8 characters) <span className="text-[#E47770]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                    errors.password ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78877F] hover:text-[#202B29]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
                Confirm Password <span className="text-[#E47770]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                    errors.confirmPassword ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78877F] hover:text-[#202B29]"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#23866B] hover:bg-[#1C6C56] text-white text-sm font-bold rounded-xl shadow-md shadow-[#23866B]/20 hover:shadow-[#23866B]/30 transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Student Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

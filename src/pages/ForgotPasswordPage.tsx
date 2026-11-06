import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { sendResetPassword } from '../services/authService';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const prefillEmail = (location.state as any)?.email || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: prefillEmail,
    },
  });

  React.useEffect(() => {
    if (prefillEmail) {
      setValue('email', prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const onSubmit = async (data: ForgotFormData) => {
    setErrorMessage(null);
    try {
      await sendResetPassword(data.email);
      setIsSent(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to send password reset email. Please ensure your email is correct.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#102A2A] flex items-center justify-center text-[#C6A76A] shadow-md shadow-[#102A2A]/20 border border-[#C6A76A]/30">
            <Wallet className="w-6 h-6 text-[#C6A76A]" />
          </div>
          <span className="text-2xl font-black text-[#202B29] tracking-tight">
            Student<span className="text-[#23866B]">Wallet</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B29] tracking-tight">
          Reset Your Password
        </h2>
        <p className="text-sm text-[#78877F]">
          Enter your registered student email and we'll send a password recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#EAE8E1] space-y-6">
          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-[#35A875]/10 text-[#35A875] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#202B29]">Recovery Email Dispatched</h3>
              <p className="text-xs text-[#78877F] leading-relaxed max-w-xs mx-auto">
                If an account exists with that email, check your inbox and spam folder for instructions to reset your password.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  state={{ email: prefillEmail }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#23866B] hover:text-[#1C6C56]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 bg-[#FDF1F0] border border-[#E47770]/30 rounded-xl text-xs text-[#E47770] font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#78877F]" />
                    University Email Address
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#23866B] hover:bg-[#1C6C56] text-white text-sm font-bold rounded-xl shadow-md shadow-[#23866B]/20 hover:shadow-[#23866B]/30 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
                </button>
              </form>

              <div className="pt-3 border-t border-[#EAE8E1] text-center">
                <Link
                  to="/login"
                  state={{ email: prefillEmail }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78877F] hover:text-[#23866B] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

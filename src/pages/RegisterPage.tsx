import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { loginWithGoogle } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect directly
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
      showToast('Welcome to StudentWallet!', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google sign-in was interrupted. Please try again.');
        showToast(err.message || 'Google sign-in was interrupted', 'error');
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
          Create Student Account
        </h2>
        <p className="text-sm text-[#78877F]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#23866B] hover:text-[#1C6C56]">
            Sign in with Google
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#EAE8E1] space-y-6">
          {/* Error Banner */}
          {authError && (
            <div className="p-3.5 bg-[#FDF1F0] border border-[#E47770]/30 rounded-xl text-xs text-[#E47770] font-medium leading-relaxed">
              {authError}
            </div>
          )}

          <div className="space-y-1.5 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#23866B]/10 text-[#23866B] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#23866B]" />
              One-Click Registration
            </span>
            <p className="text-xs text-[#78877F] pt-1">
              Join StudentWallet with your student Google or Gmail account in seconds.
            </p>
          </div>

          {/* Primary Big Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full inline-flex justify-center items-center gap-3.5 py-3.5 px-5 border-2 border-[#23866B] rounded-xl shadow-md shadow-[#23866B]/20 bg-[#23866B] hover:bg-[#1C6C56] text-white text-base font-bold transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
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
              </div>
            )}
            Sign Up with Google / Gmail
          </button>

          {/* Benefits summary */}
          <div className="pt-4 border-t border-[#EAE8E1] space-y-2 text-xs text-[#78877F]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#35A875] shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#35A875] shrink-0" />
              <span>Instant setup with EGP default currency</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#35A875] shrink-0" />
              <span>Free student budgeting tools & analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

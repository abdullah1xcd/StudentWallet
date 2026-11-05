import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Coins,
  Lock,
  Loader2,
  LogOut,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateUserProfile, changeUserPassword, logoutUser } from '../services/authService';
import { CurrencyCode } from '../types';
import { formatCurrency } from '../utils/currency';
import { useNavigate } from 'react-router-dom';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  currency: z.enum(['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { currentUser, profile, currency, refreshProfile, updateCurrency } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
      currency: (profile?.currency as CurrencyCode) || 'EGP',
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!currentUser) return;
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(currentUser.uid, {
        fullName: data.fullName,
        currency: data.currency,
      });
      await updateCurrency(data.currency);
      await refreshProfile();
      showToast('Profile and preferences updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await changeUserPassword(data.newPassword);
      showToast('Password changed successfully!', 'success');
      resetPassword();
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showToast(
          'For security, please log out and log in again before changing your password.',
          'warning'
        );
      } else {
        showToast(err.message || 'Failed to change password', 'error');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B29]">
          Profile & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-[#78877F] mt-0.5">
          Manage your personal university credentials and display preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#102A2A] text-[#C6A76A] border border-[#C6A76A]/40 flex items-center justify-center text-3xl font-black shadow-md shadow-[#102A2A]/20">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#202B29]">{profile?.fullName || 'Student'}</h3>
            <p className="text-xs text-[#78877F] flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {profile?.email}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF6F0] text-[#35A875] border border-[#35A875]/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Firebase Verified
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F3ED] text-[#202B29] border border-[#EAE8E1]">
                Currency: {currency}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#E47770] hover:text-[#d35a52] bg-[#FDF1F0] hover:bg-[#FBE4E3] rounded-xl transition-colors self-center sm:self-start"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Profile and Currency Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-5">
        <div className="border-b border-[#EAE8E1] pb-3">
          <h3 className="text-base font-bold text-[#202B29]">Personal Information</h3>
          <p className="text-xs text-[#78877F]">Update your student display name and currency format.</p>
        </div>

        <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#78877F]" />
                Full Name
              </label>
              <input
                type="text"
                defaultValue={profile?.fullName}
                {...registerProfile('fullName')}
                className={`w-full px-3.5 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                  profileErrors.fullName ? 'border-[#E47770]' : 'border-[#EAE8E1]'
                }`}
              />
              {profileErrors.fullName && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">
                  {profileErrors.fullName.message}
                </p>
              )}
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#78877F]" />
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-3.5 py-2.5 bg-[#F5F3ED]/40 border border-[#EAE8E1] rounded-xl text-sm text-[#78877F] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#78877F] mt-1">Managed via Firebase Authentication</p>
            </div>
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#78877F]" />
              Display Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { code: 'EGP', label: 'EGP (Egyptian Pound)' },
                { code: 'USD', label: 'USD ($)' },
                { code: 'EUR', label: 'EUR (€)' },
                { code: 'GBP', label: 'GBP (£)' },
                { code: 'SAR', label: 'SAR' },
                { code: 'AED', label: 'AED' },
              ].map(c => (
                <label
                  key={c.code}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#EAE8E1] bg-[#F5F3ED]/60 hover:bg-[#F5F3ED] cursor-pointer text-center text-xs font-bold text-[#202B29] has-checked:border-[#23866B] has-checked:bg-[#23866B]/10 has-checked:text-[#23866B]"
                >
                  <input
                    type="radio"
                    value={c.code}
                    {...registerProfile('currency')}
                    className="sr-only"
                  />
                  <span>{c.code}</span>
                  <span className="text-[10px] text-[#78877F] font-normal mt-0.5">
                    {formatCurrency(1500, c.code as CurrencyCode)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-5">
        <div className="border-b border-[#EAE8E1] pb-3">
          <h3 className="text-base font-bold text-[#202B29]">Security & Password</h3>
          <p className="text-xs text-[#78877F]">Keep your StudentWallet account safe and secure.</p>
        </div>

        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#78877F]" />
                New Password
              </label>
              <input
                type="password"
                placeholder="Min 8 characters"
                {...registerPassword('newPassword')}
                className={`w-full px-3.5 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                  passwordErrors.newPassword ? 'border-[#E47770]' : 'border-[#EAE8E1]'
                }`}
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                {...registerPassword('confirmPassword')}
                className={`w-full px-3.5 py-2.5 bg-[#F5F3ED]/70 border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                  passwordErrors.confirmPassword ? 'border-[#E47770]' : 'border-[#EAE8E1]'
                }`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-[#E47770] mt-1 font-medium">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#102A2A] hover:bg-[#183d3d] rounded-xl shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

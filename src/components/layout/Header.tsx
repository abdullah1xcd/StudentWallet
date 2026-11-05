import React, { useState } from 'react';
import { Menu, Bell, AlertTriangle, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
  budgetWarningMessage?: string | null;
}

export function Header({ title, onOpenMobileMenu, budgetWarningMessage }: HeaderProps) {
  const { profile } = useAuth();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EAE8E1] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#78877F] hover:text-[#202B29] rounded-xl hover:bg-[#F5F3ED]"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B29]">
            {title}
          </h1>
          <p className="text-xs font-medium text-[#78877F] hidden sm:block">
            {todayStr}
          </p>
        </div>
      </div>

      {/* Right: Notifications & User profile pill */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2.5 text-[#78877F] hover:text-[#202B29] hover:bg-[#F5F3ED] rounded-xl relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {budgetWarningMessage && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E8AC4A] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification dropdown */}
          {showNotificationPopup && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EAE8E1] p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE8E1]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#78877F]">
                  Notifications
                </span>
                <span className="text-[11px] text-[#23866B] font-semibold">
                  {budgetWarningMessage ? '1 Unread' : '0 Unread'}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {budgetWarningMessage ? (
                  <div className="p-3 bg-[#FDF6E9] border border-[#E8AC4A]/40 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#E8AC4A] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#202B29]">Budget Alert</p>
                      <p className="text-xs text-[#78877F] mt-0.5 leading-relaxed">
                        {budgetWarningMessage}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-[#78877F]">
                    No new alerts. Your spending is looking great!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown link */}
        <Link
          to="/settings"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F5F3ED] transition-colors border border-[#EAE8E1]"
        >
          <div className="w-8 h-8 rounded-full bg-[#23866B] text-[#C6A76A] flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-[#C6A76A]/30">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#202B29] truncate max-w-[120px]">
              {profile?.fullName || 'Student'}
            </span>
            <span className="block text-[10px] text-[#C6A76A] font-bold">
              {profile?.currency || 'EGP'}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#78877F] hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}

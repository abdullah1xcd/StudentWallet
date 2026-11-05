import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  PieChart,
  BarChart3,
  Tags,
  Settings,
  LogOut,
  X,
  Crown,
} from 'lucide-react';
import { logoutUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/categories', label: 'Categories', icon: Tags },
    { to: '/settings', label: 'Profile & Settings', icon: Settings },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#102A2A] text-[#78877F]">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-[#1A3D3D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#23866B] flex items-center justify-center text-[#C6A76A] shadow-md shadow-[#23866B]/30 ring-1 ring-[#C6A76A]/30">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white tracking-tight">
                  Student<span className="text-[#C6A76A]">Wallet</span>
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[#C6A76A]/15 text-[#C6A76A] border border-[#C6A76A]/30">
                  <Crown className="w-2.5 h-2.5" />
                  Premium
                </span>
              </div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#78877F]">
                Fintech Edition
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#78877F] hover:text-white rounded-lg hover:bg-[#1A3D3D]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#23866B] text-white shadow-md shadow-[#23866B]/25 ring-1 ring-[#C6A76A]/20'
                      : 'text-[#78877F] hover:text-white hover:bg-[#183939]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-[#1A3D3D] space-y-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-[#23866B]/20 border border-[#C6A76A]/40 flex items-center justify-center text-[#C6A76A] font-bold text-sm shrink-0">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {profile?.fullName || 'Student'}
            </p>
            <p className="text-[11px] text-[#78877F] truncate font-mono">{profile?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-[#78877F] hover:text-[#E47770] hover:bg-[#E47770]/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 border-r border-[#1A3D3D] z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-xs h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

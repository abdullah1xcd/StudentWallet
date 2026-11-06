import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  BarChart3,
  Tags,
  Settings,
} from 'lucide-react';

export function BottomNavigation() {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/transactions', label: 'Activity', icon: Receipt },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/categories', label: 'Categories', icon: Tags },
    { to: '/settings', label: 'Profile', icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#102A2A]/95 backdrop-blur-md border-t border-[#1A3D3D] px-2 py-1.5 shadow-lg safe-area-pb"
    >
      <div className="grid grid-cols-6 gap-1 max-w-md mx-auto items-center">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#C6A76A] font-bold'
                    : 'text-[#78877F] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-all ${
                      isActive ? 'bg-[#23866B] text-white shadow-xs' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

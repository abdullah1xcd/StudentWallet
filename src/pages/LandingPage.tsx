import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  BellRing,
  BarChart3,
  Receipt,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              Built Specifically for University Students
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Take Control of Your <br />
              <span className="text-blue-600">Student Finances.</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Track your income, manage expenses, and build smarter financial habits with StudentWallet.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={async () => {
                  if (currentUser) {
                    navigate('/dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-98"
              >
                Go to Student Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                Explore Features
              </a>
            </div>

            {/* Student Trust Proof */}
            <div className="pt-6 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Firebase Cloud Security
              </span>
              <span className="flex items-center gap-1.5 hidden sm:flex">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                EGP Currency Default
              </span>
            </div>
          </div>

          {/* Product Dashboard Visual Preview */}
          <div className="mt-12 lg:mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl ring-1 ring-slate-900/5">
              {/* Fake browser topbar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                  app.studentwallet.edu/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Preview Content Grid */}
              <div className="space-y-4">
                {/* 4 Preview Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Balance</span>
                    <p className="text-lg font-black text-emerald-600 mt-1">EGP 4,850.00</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Income</span>
                    <p className="text-lg font-black text-slate-900 mt-1">EGP 6,000.00</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Expenses</span>
                    <p className="text-lg font-black text-rose-600 mt-1">EGP 2,400.00</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="text-[10px] uppercase font-bold text-blue-600">Remaining Budget</span>
                    <p className="text-lg font-black text-blue-700 mt-1">EGP 600.00</p>
                  </div>
                </div>

                {/* Simulated Chart & Budget preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Income vs Expenses Overview</span>
                      <span className="text-emerald-600">+18% vs Last Month</span>
                    </div>
                    <div className="h-32 flex items-end justify-between gap-3 px-4 pt-4">
                      {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, idx) => {
                        const h1 = [40, 55, 70, 60, 85, 95][idx];
                        const h2 = [30, 45, 50, 40, 65, 50][idx];
                        return (
                          <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full flex items-end justify-center gap-1 h-24">
                              <div
                                className="w-3 bg-emerald-500 rounded-t-sm"
                                style={{ height: `${h1}%` }}
                              />
                              <div
                                className="w-3 bg-rose-500 rounded-t-sm"
                                style={{ height: `${h2}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">{m}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Monthly Budget Status</span>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">80% used</span>
                        <span className="text-slate-400">Limit: 3,000 EGP</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-4/5" />
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium">
                        ⚠️ You have used 80% of your budget. Be careful with your spending.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
              Powerful Student Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Master Your Money
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Designed from the ground up to solve the real financial challenges university students face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">1. Expense Tracking</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log cafeteria lunches, textbooks, transportation, and campus supplies in seconds with real-time balance updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">2. Income Management</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track family allowances, student scholarships, tutoring gigs, and part-time jobs all in one centralized place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">3. Monthly Budgets</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Define realistic monthly spending thresholds (e.g. 3,000 EGP) and keep your university lifestyle under control.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">4. Financial Reports</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate in-depth monthly summaries, net savings analyses, and one-click CSV spreadsheet exports for your records.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">5. Spending Analytics</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Beautiful Recharts donut and bar visualizations show where your cash flows across food, housing, and entertainment.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BellRing className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">6. Budget Alerts</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get proactive visual warnings when you reach 80% and instant alerts if you ever exceed 100% of your allowance limit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How StudentWallet Works
            </h3>
            <p className="text-base text-slate-600">
              Start mastering your semester budget in less than two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Create your account</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign up with your university email or Google account to create your personal encrypted financial vault.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">Record income & expenses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quickly add your daily cafeteria meals, campus transport, textbooks, and monthly allowances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Set your monthly budget</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define your target budget (e.g. 3,000 EGP) to keep your expenditures in check before midterms and finals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900">Understand your spending</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review interactive charts and smart breakdown analytics to build lifelong positive financial habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for Campus Financial Independence
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Student life can be demanding. Between lectures, textbooks, and social events, money shouldn't be another stress factor. StudentWallet was engineered to give university students complete clarity, security, and peace of mind over their finances.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Student<span className="text-blue-400">Wallet</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Take Control of Your Money. The modern personal finance and budget manager built for university students.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Features</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Expense Tracking</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Monthly Budgets</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Spending Analytics</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Budget Warnings</a></li>
              </ul>
            </div>

            {/* Contact Placeholder */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Campus Support</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Got feedback or university project questions? Reach out through your campus student representative.
              </p>
              <p className="text-xs text-slate-500 font-mono">support@studentwallet.edu.eg</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} StudentWallet. All rights reserved.</p>
            <p>Designed for University Software Engineering Agile Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-jira-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-jira-blue text-white shadow-md mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V2h-10.58zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V7.8H5.79zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V13.6H.05z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-jira-dark tracking-tight">
            Log in to JiraFlow
          </h1>
          <p className="text-xs text-jira-gray mt-1">
            Enterprise Full Stack Task & Sprint Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-jira-modal border border-jira-border p-8">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-jira-blue hover:bg-jira-blue-hover text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-jira-subtle mb-2.5 text-center">
              Quick One-Click Demo Logins
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('alex@example.com')}
                className="p-2 rounded border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-left text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-jira-blue">Alex Morgan</span>
                  <span className="text-[11px] text-jira-gray block">alex@example.com (Admin)</span>
                </div>
                <span className="text-[10px] bg-blue-200/80 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('sarah@example.com')}
                className="p-2 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-jira-dark">Sarah Chen</span>
                  <span className="text-[11px] text-jira-gray block">sarah@example.com (Engineer)</span>
                </div>
                <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.5 rounded">
                  Member
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('michael@example.com')}
                className="p-2 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-jira-dark">Michael Scott</span>
                  <span className="text-[11px] text-jira-gray block">michael@example.com (PM)</span>
                </div>
                <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.5 rounded">
                  Member
                </span>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-jira-gray">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-jira-blue font-bold hover:underline"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

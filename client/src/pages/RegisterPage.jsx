import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle, ArrowRight, Briefcase } from 'lucide-react';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        confirmPassword,
        role,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
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
            Create JiraFlow Account
          </h1>
          <p className="text-xs text-jira-gray mt-1">
            Join your engineering workspace to collaborate on tasks
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jessica@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Role / Workspace Position */}
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Workspace Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark bg-white focus:outline-none focus:ring-2 focus:ring-jira-blue cursor-pointer font-medium"
                >
                  <option value="member">Team Member (Engineer / Designer / QA)</option>
                  <option value="admin">Administrator / Lead</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-jira-blue hover:bg-jira-blue-hover text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-jira-gray">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-jira-blue font-bold hover:underline"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

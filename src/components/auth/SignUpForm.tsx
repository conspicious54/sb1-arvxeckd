import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create new account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email,
            referral_code: referralCode || null
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already exists')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          throw signUpError;
        }
        return;
      }

      if (authData.user) {
        // Process referral if code exists
        if (referralCode) {
          const { error: referralError } = await supabase
            .from('profiles')
            .update({ referred_by: referralCode })
            .eq('id', authData.user.id);

          if (referralError) {
            console.error('Error processing referral:', referralError);
          }
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Failed to create user account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred during signup. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            placeholder="you@example.com"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Must be at least 6 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? 'Creating account...' : 'Create account'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-green-600 hover:text-green-500 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
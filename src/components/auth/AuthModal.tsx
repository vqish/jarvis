import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { getFirebaseDiagnostics } from '../../lib/firebase';
import { 
  Lock, 
  Mail, 
  User, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    login, 
    register, 
    authError, 
    isFirebaseReady 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!isAuthModalOpen) return null;

  const diagnostics = getFirebaseDiagnostics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);

    if (!isFirebaseReady) {
      setLocalErr('Firebase configuration is incomplete. Check .env.local and restart the Vite server.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
    } catch (err: any) {
      const msg = err.message || err.code || 'Authentication failed.';
      setLocalErr(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorExplanation = (errMsg: string) => {
    if (errMsg.includes('auth/configuration-not-found')) {
      return (
        <div className="mt-2 text-[11px] text-amber-300 font-mono space-y-1 bg-amber-950/60 p-2.5 rounded-lg border border-amber-500/40">
          <div className="font-bold text-amber-200">🛠️ Firebase Console Action Required:</div>
          <div>1. Open Firebase Console → Authentication</div>
          <div>2. Click "Get Started" (if not already activated)</div>
          <div>3. Under "Sign-in method", click "Email/Password" and toggle it to <strong>ENABLED</strong></div>
          <div>4. Ensure the Web App credentials in .env.local match this project</div>
        </div>
      );
    }
    if (errMsg.includes('auth/email-already-in-use')) {
      return <div className="mt-1 text-[11px] text-slate-300">This email is already registered. Switch to the Log In tab.</div>;
    }
    if (errMsg.includes('auth/invalid-credential') || errMsg.includes('auth/wrong-password') || errMsg.includes('auth/user-not-found')) {
      return <div className="mt-1 text-[11px] text-slate-300">Invalid email or password. Please verify your credentials or register a new account.</div>;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl border border-teal-500/40 shadow-2xl p-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                {mode === 'login' ? 'Sign In to JARVIS' : 'Create JARVIS Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Firebase Authentication & Cloud Storage
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firebase Config Status Pill */}
        <div className="mb-4 space-y-2">
          {isFirebaseReady ? (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Firebase Environment (.env.local) Detected</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-[10px] text-teal-400 underline hover:text-teal-300"
              >
                {showDiagnostics ? 'Hide' : 'Diagnostics'}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Firebase Not Configured Yet</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Add your Firebase Web App credentials into <code>.env.local</code> to enable cloud accounts.
              </p>
            </div>
          )}

          {/* Safe Diagnostics Panel (shows only PRESENT/MISSING, zero secrets) */}
          {showDiagnostics && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1 animate-fadeIn">
              <div className="flex items-center gap-1 text-teal-400 font-bold mb-1 border-b border-slate-800 pb-1">
                <Terminal className="w-3 h-3" />
                <span>ENVIRONMENT VARIABLES AUDIT:</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div>API Key: <strong className={diagnostics.apiKey === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.apiKey}</strong></div>
                <div>Auth Domain: <strong className={diagnostics.authDomain === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.authDomain}</strong></div>
                <div>Project ID: <strong className={diagnostics.projectId === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.projectId}</strong></div>
                <div>Storage Bucket: <strong className={diagnostics.storageBucket === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.storageBucket}</strong></div>
                <div>Sender ID: <strong className={diagnostics.messagingSenderId === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.messagingSenderId}</strong></div>
                <div>App ID: <strong className={diagnostics.appId === 'PRESENT' ? 'text-emerald-400' : 'text-red-400'}>{diagnostics.appId}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLocalErr(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              mode === 'login'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setLocalErr(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              mode === 'register'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert with Detailed Guidance */}
        {(localErr || authError) && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono mb-4 space-y-1">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="font-semibold break-all">{localErr || authError}</span>
            </div>
            {getErrorExplanation(localErr || authError || '')}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 mt-2"
          >
            <span>{mode === 'login' ? 'Authenticate' : 'Create Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Guest fallback option */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continue in Local / Offline Mode →
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Rocket, Mail, Lock, User, Star, AlertCircle, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!trimmedEmail) {
      setError('Protocol / Email is required');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Invalid orbital protocol (email format)');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await updateProfile(user, { displayName: name });
        
        // Create user doc in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: name,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if user doc exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-fuchsia/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyber-cyan/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-cyber-cyan to-cyber-fuchsia rounded-2xl mb-8 shadow-xl">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-3 uppercase text-white">
            {isLogin ? 'Mission Check-in' : 'New Recruit'}
          </h1>
          <p className="text-slate-400 text-sm font-light">
            {isLogin ? 'Re-establish terminal connection' : 'Begin your interstellar journey'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-medium text-white placeholder:text-slate-600"
                    placeholder="Commander Shepard"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Protocol / Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-medium text-white placeholder:text-slate-600"
                placeholder="pilot@orbitx.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Encryption / Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-medium text-white placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-400/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-100 text-xs font-light"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyber-cyan text-slate-950 rounded-2xl font-bold text-lg hover:bg-cyber-cyan/80 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 group uppercase tracking-tight"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'INITIATE UPLINK' : 'CREATE ACCOUNT'}
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
            <span className="bg-[#020617]/80 backdrop-blur-md px-4 text-slate-500 font-bold">Alternative Access</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 glass-bright text-white rounded-2xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-3 border border-white/10 group active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" referrerPolicy="no-referrer" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
          <span className="text-sm">Connect with Google</span>
        </button>

        <p className="text-center mt-10 text-slate-400 text-sm font-light relative z-10">
          {isLogin ? "New to the system?" : "Already a member?"} {' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyber-fuchsia font-bold hover:text-cyber-fuchsia/80 transition-colors underline decoration-cyber-fuchsia/30 underline-offset-4"
          >
            {isLogin ? 'Apply for Training' : 'Check Identity'}
          </button>
        </p>
      </motion.div>
    </div>

  );
}

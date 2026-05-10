import { Link, useLocation } from 'react-router-dom';
import { User, Rocket, Compass, Ticket, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: <Compass className="w-4 h-4" /> },
    { name: 'My Bookings', path: '/bookings', icon: <Ticket className="w-4 h-4" />, private: true },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 md:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyber-cyan to-cyber-fuchsia rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tighter uppercase text-white">
            ORBIT <span className="text-cyber-cyan">X</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            (!link.private || user) && (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 text-xs font-medium transition-colors hover:text-cyber-cyan uppercase tracking-wider",
                  isActive(link.path) ? "text-cyber-cyan" : "text-slate-400"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            )
          ))}

          {user ? (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-cyber-cyan p-0.5">
                  <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-cyber-cyan overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-300 max-w-[80px] truncate">
                  {user.displayName || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1.5 bg-cyber-cyan text-slate-950 rounded-lg font-bold text-xs hover:bg-cyber-cyan/80 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.4)] uppercase tracking-tight"
            >
              Uplink
            </Link>
          )}
        </div>


        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 mt-3 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              {navLinks.map((link) => (
                (!link.private || user) && (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(link.path) ? "bg-cyber-purple/20 text-cyber-purple" : "text-gray-400 hover:bg-white/5"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-4 bg-cyber-purple rounded-lg text-white font-display font-bold"
                >
                  <LogIn className="w-4 h-4" />
                  CONTROL LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

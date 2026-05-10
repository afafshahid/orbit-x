import { Rocket, Shield, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 pt-12 pb-8 px-4 md:px-8 relative overflow-hidden mt-12">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-cyber-indigo/5 rounded-t-[100%] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
              <div className="p-1.5 bg-gradient-to-tr from-cyber-cyan to-cyber-fuchsia rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tighter uppercase text-white">
                ORBIT <span className="text-cyber-cyan">X</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light italic max-w-sm">
              Pioneering the democratization of the solar system. Secure your seat in the future.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center hover:bg-cyber-cyan/20 transition-all cursor-pointer group hover:scale-110">
                <Globe className="w-4 h-4 text-slate-500 group-hover:text-cyber-cyan transition-colors" />
              </div>
              <div className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center hover:bg-cyber-fuchsia/20 transition-all cursor-pointer group hover:scale-110">
                <Shield className="w-4 h-4 text-slate-500 group-hover:text-cyber-fuchsia transition-colors" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold text-white mb-6 uppercase tracking-[0.3em] flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              Destinations
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs font-light">
              <li><Link to="/explore?category=Moon" className="hover:text-cyber-cyan transition-colors">Moon Colonies</Link></li>
              <li><Link to="/explore?category=Mars" className="hover:text-cyber-cyan transition-colors">Mars Outposts</Link></li>
              <li><Link to="/explore?category=Venus" className="hover:text-cyber-cyan transition-colors">Venus Atmosphere</Link></li>
              <li><Link to="/explore?category=ISS" className="hover:text-cyber-cyan transition-colors">Orbital Stations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold text-white mb-6 uppercase tracking-[0.3em] flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-cyber-fuchsia shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
              Mission
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs font-light">
              <li><Link to="/about" className="hover:text-cyber-fuchsia transition-colors">About Mission</Link></li>
              <li><Link to="/fleet" className="hover:text-cyber-fuchsia transition-colors">Fleet Details</Link></li>
              <li><Link to="/terms" className="hover:text-cyber-fuchsia transition-colors">Safety Protocol</Link></li>
              <li><Link to="/explore" className="hover:text-cyber-fuchsia transition-colors">Flight Schedule</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold text-white mb-6 uppercase tracking-[0.3em] flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-cyber-indigo shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              Legal
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs font-light">
              <li><Link to="/terms" className="hover:text-cyber-indigo transition-colors">Privacy Matrix</Link></li>
              <li><Link to="/terms" className="hover:text-cyber-indigo transition-colors">Terms of Flight</Link></li>
              <li><Link to="/terms" className="hover:text-cyber-indigo transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[9px] font-bold tracking-[0.2em] uppercase">
            © 2026 ORBIT X INTERSTELLAR. SECURE CHANNEL #5534.
          </p>
          <div className="flex gap-8 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
              Mainnet Online
            </span>
            <span>Uptime 99.998%</span>
          </div>
        </div>
      </div>
    </footer>

  );
}

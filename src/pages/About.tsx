import { Rocket, Shield, Users, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter uppercase text-white">
          OUR <span className="text-cyber-cyan">MISSION</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light text-base italic leading-relaxed">
          "To make multi-planetary life not just possible, but accessible, safe, and breathtaking."
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyber-cyan/10 transition-colors" />
          <Rocket className="w-8 h-8 text-cyber-cyan mb-6" />
          <h2 className="text-xl font-display font-bold text-white mb-4 uppercase tracking-tight">Democratizing Space</h2>
          <p className="text-slate-400 font-light leading-relaxed text-sm">
            Orbit X was founded on a simple principle: Earth is our cradle, but the solar system is our home. We are reducing the cost of orbital insertion by 90% through re-usable neural-linked transport systems.
          </p>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-fuchsia/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyber-fuchsia/10 transition-colors" />
          <Shield className="w-8 h-8 text-cyber-fuchsia mb-6" />
          <h2 className="text-xl font-display font-bold text-white mb-4 uppercase tracking-tight">Uncompromising Safety</h2>
          <p className="text-slate-400 font-light leading-relaxed text-sm">
            Every mission is monitored by Earth-Side command and local orbital relays. Our fleet maintains a 99.999% success rate across pressurized and un-pressurized cargo and passenger manifests.
          </p>
        </div>
      </div>

      <div className="glass p-10 md:p-14 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/5 to-cyber-fuchsia/5 pointer-events-none" />
        <Globe className="w-12 h-12 text-white/20 mx-auto mb-8" />
        <h2 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-tighter">12 Colonies. 1 Network.</h2>
        <p className="text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-10 text-sm">
          From the moon-dust of Tycho Crater to the cloud-camps of Venus, we are building the infrastructure that connects humanity across the stars.
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold text-white tracking-widest">4.2K</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Residents</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold text-white tracking-widest">58</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Ships</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold text-white tracking-widest">12</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Outposts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

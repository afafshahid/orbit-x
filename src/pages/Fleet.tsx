import { Cpu, Shield, Zap, Wind } from 'lucide-react';
import { motion } from 'motion/react';

export default function Fleet() {
  const ships = [
    {
      name: "Stellar Nomad X-1",
      class: "Long Distance Explorer",
      specs: "A fusion-driven flagship designed for deep space transits. Optimized for comfort and radiation shielding.",
      stats: { speed: "Mach 25", range: "800M km", capacity: "12 Pax" },
      color: "text-cyber-cyan",
      bg: "bg-cyber-cyan/5"
    },
    {
      name: "Orbital Courier v4",
      class: "Lunar/ISS Shuttle",
      specs: "Small, fast, and agile. Perfect for short bursts to the Moon or low earth orbit stations.",
      stats: { speed: "Mach 35", range: "400K km", capacity: "24 Pax" },
      color: "text-cyber-fuchsia",
      bg: "bg-cyber-fuchsia/5"
    },
    {
      name: "Goliath Heavy Porter",
      class: "Cargo & Residency",
      specs: "A massive rotating habitat ship. Used for Venus and Mars transits where gravity is essential.",
      stats: { speed: "Mach 18", range: "1.2B km", capacity: "200 Pax" },
      color: "text-cyber-indigo",
      bg: "bg-cyber-indigo/5"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-cyber-cyan text-[9px] font-bold uppercase tracking-[0.4em] mb-3">The Transport Matrix</p>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter uppercase text-white">
          THE <span className="text-cyber-fuchsia">FLEET</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light text-base italic leading-relaxed">
          Propelling humanity through state-of-the-art fusion and ion propulsion systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ships.map((ship, idx) => (
          <motion.div
            key={ship.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass rounded-[2rem] p-8 border border-white/10 hover:border-white/30 transition-all flex flex-col relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${ship.bg} rounded-full blur-3xl pointer-events-none group-hover:opacity-60 transition-opacity`} />
            
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-xl glass border border-white/10 ${ship.color}`}>
                {idx === 0 ? <Zap className="w-5 h-5" /> : idx === 1 ? <Wind className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{ship.class}</span>
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tighter">{ship.name}</h3>
            <p className="text-slate-400 font-light text-xs mb-8 leading-relaxed italic">
              "{ship.specs}"
            </p>

            <div className="mt-auto space-y-3">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Velocity</span>
                <span className="text-white font-mono font-bold text-xs">{ship.stats.speed}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Range</span>
                <span className="text-white font-mono font-bold text-xs">{ship.stats.range}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Capacity</span>
                <span className="text-white font-mono font-bold text-xs">{ship.stats.capacity}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 glass p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center gap-8">
        <div className="p-8 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/20">
          <Cpu className="w-10 h-10 text-cyber-cyan animate-pulse" />
        </div>
        <div>
          <h4 className="text-xl font-display font-bold text-white mb-3 uppercase tracking-tight italic">Neural Link Navigation</h4>
          <p className="text-slate-400 font-light leading-relaxed max-w-3xl text-sm">
            Our entire fleet is managed by localized AI cores that interface directly with our pilots' neural implants. This reduces reaction times to milliseconds, ensuring safety even in the densest asteroid belts.
          </p>
        </div>
      </div>
    </div>
  );
}

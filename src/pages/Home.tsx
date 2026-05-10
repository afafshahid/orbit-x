import { motion } from 'motion/react';
import { Rocket, Shield, Zap, ArrowRight, Gauge, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Home() {
  const features = [
    {
      title: 'Neural Payment',
      desc: 'Instant biological verification & secure orbital transactions.',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-cyber-fuchsia'
    },
    {
      title: 'Shield Tech',
      desc: 'Military-grade radiation protection for every passenger.',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-cyber-indigo'
    },
    {
      title: 'Hypersonic Fleet',
      desc: '0 to Mach 25 in under 3 minutes with our latest fusion drives.',
      icon: <Gauge className="w-6 h-6" />,
      color: 'text-cyber-cyan'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-12 px-4 text-center lg:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/20 text-cyber-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Star className="w-3 h-3 fill-cyber-cyan" />
              The Next Golden Age
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold leading-[0.9] mb-8 tracking-tighter uppercase"
            >
              LEAVE THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-indigo to-cyber-fuchsia animate-gradient">
                GRAVITY BEHIND
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Experience the pinnacle of interstellar travel. Weekend getaways to deep-space expeditions. Your journey begins with <span className="text-white font-medium">Orbit X</span>.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/explore"
                className="px-8 py-3.5 bg-cyber-cyan text-slate-950 rounded-xl font-bold text-base hover:bg-cyber-cyan/80 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 group uppercase tracking-tight"
              >
                EXPLORE TRIPS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth"
                className="px-8 py-3.5 glass text-white rounded-xl font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center border border-white/20 uppercase tracking-tight"
              >
                JOIN MISSION
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden glass p-2 border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
                alt="Earth from Space"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800';
                }}
                className="rounded-[1.5rem] w-full h-full object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-5 glass-bright rounded-xl border border-white/30 backdrop-blur-3xl shadow-2xl">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-cyber-cyan text-[8px] font-bold mb-0.5 uppercase tracking-[0.3em]">Next Departure</p>
                      <h3 className="text-lg font-display font-medium text-white">Earth Orbital Station</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[8px] font-bold mb-0.5 uppercase tracking-[0.3em]">Status</p>
                      <p className="text-cyber-cyan text-xs font-bold flex items-center gap-1.5 justify-end">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        READY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-cyber-indigo/20 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { label: 'Journeys', val: '12K+' },
            { label: 'Outposts', val: '42' },
            { label: 'Fleet', val: '156' },
            { label: 'Safety', val: '99.9%' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center group">
              <p className="text-3xl md:text-4xl font-display font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors">{stat.val}</p>
              <p className="text-slate-500 text-[9px] uppercase tracking-[0.3em] font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">WHY ORBIT X?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="p-8 glass rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={cn("mb-6 p-4 rounded-xl inline-block glass border border-white/20", f.color)}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-display font-medium mb-3 text-white">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light text-base">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden border border-white/20">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyber-fuchsia/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyber-cyan/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyber-cyan to-cyber-fuchsia rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tighter uppercase">READY FOR LIFTOFF?</h2>
            <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Join thousands of orbital explorers who have already secured their place in the history books.
            </p>
            <Link
              to="/explore"
              className="px-12 py-4 bg-cyber-fuchsia text-white rounded-xl font-bold text-lg hover:bg-cyber-fuchsia/80 transition-all shadow-[0_0_30px_rgba(232,121,249,0.4)] uppercase tracking-tighter"
            >
              BOOK YOUR SEAT
            </Link>
          </div>
        </div>
      </section>
    </div>

  );
}

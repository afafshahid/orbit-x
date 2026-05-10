import { FileText, AlertTriangle, ShieldCheck, Scale, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Terms() {
  const sections = [
    {
      title: "1. Flight Eligibility",
      icon: <Users className="w-5 h-5" />,
      content: "All passengers must pass a Grade B Neural Compatibility test and show no signs of acute radiation sickness prior to manifest confirmation."
    },
    {
      title: "2. Liability & Waiver",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: "Orbit X holds no liability for quantum field decoherence, temporal drift, or minor regolith inhalation. Passengers assume all risks associated with 0G environments."
    },
    {
      title: "3. Refund Policy",
      icon: <Scale className="w-5 h-5" />,
      content: "Abort protocols initiated 7 days prior to departure receive 80% credit. Cancellations within 24 hours are non-refundable."
    },
    {
      title: "4. Cargo Restrictions",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Biological matter must be declared. Dark matter components and undocumented alien relics are strictly prohibited on all residential flights."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/20 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
          <FileText className="w-3 h-3" />
          Legal Manifest v5.2
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 tracking-tighter uppercase text-white">
          TERMS OF <span className="text-cyber-cyan">FLIGHT</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-light text-xs italic">
          Last Updated: Lunar Cycle 44-X. All flights are governed by ITA protocols.
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 md:p-8 rounded-[2rem] border border-white/10 hover:bg-white/5 transition-colors group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="p-3 rounded-xl glass border border-white/10 text-cyber-cyan h-fit w-fit group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-2 uppercase tracking-tight">{section.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed text-sm">
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 border-t border-white/5 text-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
          BY PROCEEDING WITH PAYMENT, YOU AGREE TO NEURAL ENCODING OF THESE TERMS. 
          <br />SAFE TRAVELS, CITIZEN.
        </p>
      </div>
    </div>
  );
}

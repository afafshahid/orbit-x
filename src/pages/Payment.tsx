import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CreditCard, Lock, ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatPrice } from '../lib/utils';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trip, seat, seatClass, totalPrice } = location.state || {};
  
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/26');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('NEURAL EXPLORER');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!trip || !seat) {
    return (
      <div className="max-w-7xl mx-auto p-4 py-20 text-center">
        <h2 className="text-3xl font-display font-black mb-4 uppercase">SESSION EXPIRED</h2>
        <button onClick={() => navigate('/explore')} className="bg-cyber-purple px-8 py-3 rounded-xl font-bold">RESTART BOOKING</button>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      const resultId = await runTransaction(db, async (transaction) => {
        const tripRef = doc(db, 'trips', trip.id);
        const tripDoc = await transaction.get(tripRef);

        if (!tripDoc.exists()) throw new Error('Trip not found');
        const availableSeats = tripDoc.data().availableSeats;

        if (availableSeats <= 0) throw new Error('No seats available');

        // Update trip
        transaction.update(tripRef, { availableSeats: availableSeats - 1 });

        // Create booking
        const bookingRef = doc(collection(db, 'bookings'));
        const bookingData = {
          userId: auth.currentUser?.uid,
          tripId: trip.id,
          seatNumber: seat,
          class: seatClass,
          status: 'confirmed',
          totalPaid: totalPrice,
          createdAt: serverTimestamp(),
          qrCode: `ORBITX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        };
        transaction.set(bookingRef, bookingData);
        return bookingRef.id;
      });

      setBookingId(resultId);
      setCompleted(true);
      setTimeout(() => navigate(`/ticket/${resultId}`), 3000);
    } catch (error) {
      console.error(error);
      alert('Transaction failed. Neural link unstable.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key="payment-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-5">
              <button onClick={() => navigate(-1)} className="p-3 glass rounded-xl hover:bg-white/10 border border-white/10 transition-all hover:scale-110 active:scale-95">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-4xl font-display font-bold tracking-tight uppercase text-white leading-none">Terminal Payment</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7 space-y-8">
                <form onSubmit={handlePayment} className="glass p-10 rounded-[2.5rem] border border-white/20 space-y-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-8 text-cyber-cyan">
                    <div className="p-2.5 bg-cyber-cyan/10 rounded-xl">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="font-display font-medium text-xs uppercase tracking-[0.3em] font-bold">Neural Card Verification</span>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Digital Card Number</label>
                      <input
                        required
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono text-white tracking-widest placeholder:text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Expiry</label>
                        <input
                          required
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono text-white placeholder:text-slate-700"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">CVC</label>
                        <input
                          required
                          type="text"
                          placeholder="•••"
                          maxLength={3}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono text-white placeholder:text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Cardholder Identity</label>
                      <input
                        required
                        type="text"
                        placeholder="NAME ON CARD"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full glass-bright bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all uppercase text-white placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-5 bg-cyber-cyan text-slate-950 rounded-2xl font-bold text-xl hover:bg-cyber-cyan/80 transition-all shadow-[0_15px_30px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-tight active:scale-95"
                    >
                      {processing ? (
                        <>
                          <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          VERIFYING SIGNAL...
                        </>
                      ) : (
                        <>AUTHORIZE <span className="font-mono tracking-widest">{formatPrice(totalPrice)}</span></>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] pt-4">
                    <Lock className="w-3.5 h-3.5" />
                    Quantum Encrypted Transmission
                  </div>
                </form>
              </div>

              <div className="md:col-span-5 space-y-8">
                <div className="glass p-10 rounded-[2rem] border border-white/20 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-fuchsia opacity-50" />
                  <h3 className="font-display font-medium text-xs mb-8 uppercase text-slate-500 tracking-[0.3em] font-bold">Order Manifest</h3>
                  <div className="space-y-6 mb-10">
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1.5">Destination</p>
                      <p className="font-bold text-white uppercase text-base leading-tight">{trip.name}</p>
                    </div>
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1.5">Seat & Class</p>
                      <p className="font-bold text-cyber-cyan text-sm tracking-widest uppercase">{seat} — {seatClass}</p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Total</span>
                      <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 glass-bright border border-white/20 rounded-[2rem] relative overflow-hidden shadow-xl">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyber-indigo/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex gap-4 relative z-10">
                    <div className="p-3 bg-cyber-indigo/10 rounded-xl border border-white/10 shrink-0">
                      <ShieldCheck className="w-7 h-7 text-cyber-indigo" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase mb-2 tracking-widest">Orbit X Safe</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-widest">
                        Your credits are insured against anomalies and docking failures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="payment-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center px-4"
          >
            <div className="w-24 h-24 bg-green-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tight text-white">UPLINK ESTABLISHED</h1>
            <p className="text-slate-400 mb-12 max-w-md mx-auto font-light text-lg italic">
              "Credits authorized. Your seat has been reserved on the {trip.name} mission. Redirecting to your digital boarding pass..."
            </p>
            <div className="flex justify-center gap-3">
              <div className="w-2.5 h-2.5 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div className="w-2.5 h-2.5 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div className="w-2.5 h-2.5 bg-cyber-cyan rounded-full animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

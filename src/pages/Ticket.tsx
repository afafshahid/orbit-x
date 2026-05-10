import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Booking, Trip } from '../types';
import { Rocket, Download, Share2, MapPin, Calendar, Clock, User, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPrice, cn } from '../lib/utils';

export default function Ticket() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!bookingId) return;
      const bDoc = await getDoc(doc(db, 'bookings', bookingId));
      if (bDoc.exists()) {
        const bData = { id: bDoc.id, ...bDoc.data() } as Booking;
        setBooking(bData);
        
        const tDoc = await getDoc(doc(db, 'trips', bData.tripId));
        if (tDoc.exists()) {
          setTrip({ id: tDoc.id, ...tDoc.data() } as Trip);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [bookingId]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
      <span className="text-cyber-cyan font-display font-medium tracking-[0.3em] text-sm animate-pulse">GENERATING BOARDING PASS...</span>
    </div>
  );

  if (!booking || !trip) return (
    <div className="text-center py-32 px-4 glass max-w-lg mx-auto rounded-[3rem] border border-white/10 mt-20">
      <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
        <Rocket className="w-10 h-10 text-red-400 rotate-180" />
      </div>
      <h2 className="text-3xl font-display font-medium mb-6 uppercase tracking-tight text-white">BOARDING PASS VOID</h2>
      <p className="text-slate-500 mb-10 font-light">The mission clearance data has been corrupted or decommissioned.</p>
      <Link to="/bookings" className="px-10 py-4 bg-cyber-fuchsia text-white rounded-2xl font-bold uppercase tracking-tight shadow-lg">MY BOOKINGS</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/20 text-cyber-cyan text-[9px] font-bold uppercase tracking-[0.2em] mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Rocket className="w-2.5 h-2.5 fill-cyber-cyan" />
            Clearance Verified
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tighter uppercase mb-2 text-white leading-none">MISSION CLEARANCE</h1>
          <p className="text-slate-400 font-light italic text-sm">Present this pass at the docking bay during boarding.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 glass-bright border border-white/20 rounded-xl text-[9px] font-bold hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-white shadow-lg group">
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" /> Save Pass
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 glass-bright border border-white/20 rounded-xl text-[9px] font-bold hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-white shadow-lg group">
            <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Transmit
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        {/* Ticket Box */}
        <div className="glass rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/5 via-transparent to-cyber-fuchsia/5 pointer-events-none" />
          
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-cyan via-cyber-indigo to-cyber-fuchsia" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-gradient-to-tr from-cyber-cyan to-cyber-fuchsia rounded-xl shadow-2xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-cyber-cyan tracking-[0.4em] uppercase mb-0.5">Orbit X Boarding Pass</p>
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white leading-none">{trip.name}</h2>
              </div>
            </div>
            <div className="text-center md:text-right relative z-10">
              <div className="px-4 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-cyber-cyan text-[9px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                VERIFIED & ACTIVE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Passenger & Flight Info */}
            <div className="p-6 md:p-10 md:col-span-2 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Passenger</label>
                  <p className="text-xl font-display font-medium uppercase tracking-tight text-white">
                    {auth.currentUser?.displayName || 'Explorer'}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Class</label>
                  <p className="text-xl font-display font-bold text-cyber-fuchsia uppercase tracking-tight">{booking.class}</p>
                </div>
              </div>

              <div className="h-px bg-white/10 relative">
                <div className="absolute -left-8 -top-1 w-2 h-2 rounded-full bg-slate-950 border border-white/20" />
                <div className="absolute -right-8 -top-1 w-2 h-2 rounded-full bg-slate-950 border border-white/20" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Launch</label>
                  <p className="font-bold flex items-center gap-2 text-white text-xs">
                    <Calendar className="w-3.5 h-3.5 text-cyber-indigo" />
                    {new Date(trip.departureDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Gate</label>
                  <p className="font-bold text-white text-xs">ORB-04</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Seat</label>
                  <p className="font-display font-bold text-2xl text-cyber-cyan tracking-tighter">{booking.seatNumber}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">Boarding</label>
                  <p className="font-bold flex items-center gap-2 text-white text-xs">
                    <Clock className="w-3.5 h-3.5 text-cyber-indigo" />
                    T-120m
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="p-6 glass-bright border border-white/10 rounded-[1.5rem] flex items-center gap-6 shadow-inner">
                  <div className="p-3 bg-cyber-fuchsia/10 rounded-xl border border-white/10 text-cyber-fuchsia shadow-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">Destination Coordinates</h4>
                    <p className="text-base font-bold text-white tracking-widest uppercase">{trip.destination} <span className="text-cyber-fuchsia opacity-50 ml-2">SECTOR-42</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-10 bg-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyber-cyan/5 pointer-events-none" />
              <div className="p-6 bg-white rounded-[2rem] mb-10 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                <QRCodeSVG value={booking.qrCode || booking.id} size={150} bgColor="#ffffff" fgColor="#020617" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Pass Identifier</p>
                <p className="text-lg font-bold font-mono text-cyber-fuchsia tracking-widest uppercase">{booking.qrCode || booking.id.substring(0, 10).toUpperCase()}</p>
              </div>
              <div className="mt-12 pt-12 border-t border-white/10 w-full relative z-10">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] italic leading-relaxed">
                  "Toward the stars, <br/> together as one."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyber-fuchsia/10 rounded-full blur-[80px] -z-10" />
        
        {/* Perforated lines simulation */}
        <div className="hidden md:block absolute top-[15%] bottom-[15%] right-[33.333%] w-px border-l-2 border-dashed border-white/10 z-20 pointer-events-none" />
      </motion.div>

      <div className="mt-16 text-center relative z-10">
        <Link 
          to="/bookings" 
          className="group inline-flex items-center gap-3 text-slate-400 font-display font-medium text-sm border-b border-white/10 pb-2 hover:border-cyber-cyan hover:text-white transition-all uppercase tracking-[0.3em]"
        >
          View All Mission Briefs
          <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </div>

  );
}

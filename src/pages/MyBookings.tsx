import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Booking, Trip, OperationType } from '../types';
import { Rocket, Calendar, MapPin, Archive, AlertTriangle, ExternalLink, Ticket, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { handleFirestoreError } from '../lib/firebaseUtils';
import { formatPrice, cn } from '../lib/utils';

interface BookingWithTrip extends Booking {
  trip?: Trip;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    if (errorStatus) {
      const timer = setTimeout(() => setErrorStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorStatus]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const path = 'bookings';
    const q = query(collection(db, path), where('userId', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookingWithTrip[];

        // Fetch trip details for each booking
        const enhancedBookings = await Promise.all(
          bookingsData.map(async (b) => {
            const tripDoc = await getDoc(doc(db, 'trips', b.tripId));
            return {
              ...b,
              trip: tripDoc.exists() ? { id: tripDoc.id, ...tripDoc.data() } as Trip : undefined
            };
          })
        );

        setBookings(enhancedBookings.sort((a, b) => {
          const timeA = a.createdAt && (a.createdAt as any).toDate ? (a.createdAt as any).toDate().getTime() : new Date(a.createdAt).getTime();
          const timeB = b.createdAt && (b.createdAt as any).toDate ? (b.createdAt as any).toDate().getTime() : new Date(b.createdAt).getTime();
          return timeB - timeA;
        }));
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCancel = async (booking: BookingWithTrip) => {
    setCancellingId(booking.id);
    setErrorStatus(null);
    try {
      await runTransaction(db, async (transaction) => {
        const bookingRef = doc(db, 'bookings', booking.id);
        const tripRef = doc(db, 'trips', booking.tripId);
        
        const tripDoc = await transaction.get(tripRef);
        if (!tripDoc.exists()) throw new Error('Mission data corrupted.');
        
        const rawData = tripDoc.data();
        const currentSeats = typeof rawData?.availableSeats === 'number' ? rawData.availableSeats : 0;
        
        transaction.update(bookingRef, { status: 'cancelled' });
        transaction.update(tripRef, { availableSeats: Number(currentSeats) + 1 });
      });
    } catch (err) {
      console.error(err);
      setErrorStatus('Abort protocol failed. Interstellar link unstable.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Remove this archive from your records?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
      <span className="text-cyber-cyan font-display font-medium tracking-[0.3em] text-sm animate-pulse uppercase">Accessing Secure Archives...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {errorStatus && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 glass bg-red-500/20 border border-red-500/50 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white text-sm font-medium"
        >
          <AlertTriangle className="w-5 h-5 text-red-500" />
          {errorStatus}
        </motion.div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-4 text-white leading-none">YOUR <span className="text-cyber-cyan">MANIFEST</span></h1>
          <p className="text-slate-400 font-light italic text-sm md:text-base">A history of your interstellar travels.</p>
        </div>
        <div className="flex items-center gap-4 p-4 glass rounded-[1.5rem] border border-white/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent pointer-events-none" />
          <div className="text-right relative z-10">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Total Vested</p>
                      <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-widest">
                        {formatPrice(bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPaid || 0), 0))}
                      </p>
          </div>
          <div className="p-3 bg-cyber-cyan/10 rounded-xl border border-white/10">
            <Archive className="w-6 h-6 text-cyber-cyan" />
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Rocket className="w-8 h-8 text-slate-700 -rotate-45" />
          </div>
          <h2 className="text-3xl font-display font-medium mb-4 uppercase tracking-tight text-white">ARCHIVE EMPTY</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-light leading-relaxed text-sm">You have no active missions recorded.</p>
          <Link to="/explore" className="px-10 py-4 bg-cyber-cyan text-slate-950 rounded-xl font-bold uppercase tracking-tight shadow-[0_15px_30px_rgba(34,211,238,0.2)] hover:bg-cyber-cyan/80 transition-all active:scale-95 text-xs">START MISSION</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={cn(
                  "p-6 glass-bright rounded-[2rem] border transition-all flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden group",
                  booking.status === 'cancelled' 
                    ? "opacity-60 border-red-500/20 grayscale shadow-inner" 
                    : "border-white/20 hover:border-cyber-cyan/30 shadow-2xl"
                )}
              >
                {/* Trip Preview */}
                <div className="relative w-full lg:w-48 h-36 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/10 bg-slate-900">
                  {booking.trip ? (
                    <img 
                      src={booking.trip.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'} 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={booking.trip.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Rocket className="w-8 h-8 text-slate-800 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 glass-bright border border-white/20 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                    {booking.trip?.category || 'UNKNOWN'}
                  </div>
                </div>

                {/* Booking Content */}
                <div className="flex-grow space-y-4 w-full lg:w-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-display font-medium uppercase tracking-tight text-white mb-1 leading-tight group-hover:text-cyber-cyan transition-colors">
                        {booking.trip?.name || 'Unknown Mission'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyber-cyan" />
                          {booking.trip?.destination || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyber-indigo" />
                          {booking.trip ? new Date(booking.trip.departureDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] border mb-2 shadow-sm backdrop-blur-md",
                        booking.status === 'confirmed' 
                          ? "bg-green-400/10 border-green-400/30 text-green-400" 
                          : "bg-red-400/10 border-red-400/30 text-red-400"
                      )}>
                        {booking.status}
                      </div>
                      <p className="text-lg font-mono font-bold text-white tracking-widest">{formatPrice(booking.totalPaid)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Gate</p>
                      <p className="font-display font-bold text-lg text-cyber-cyan tracking-tight">{booking.seatNumber}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Tier</p>
                      <p className="font-bold text-white text-[10px] uppercase tracking-widest">{booking.class}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Auth</p>
                      <p className="font-bold text-white text-[10px] uppercase tracking-widest">
                        {booking.createdAt ? (
                          (booking.createdAt as any).toDate 
                            ? new Date((booking.createdAt as any).toDate()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
                            : new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
                        ) : 'Recently Registered'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Manifest</p>
                      <p className="font-mono text-[9px] text-slate-400 tracking-wider uppercase">{booking.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  {booking.status === 'confirmed' ? (
                    <>
                      <Link
                        to={`/ticket/${booking.id}`}
                        className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-cyber-indigo text-white rounded-xl font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-tight"
                      >
                        <Ticket className="w-4 h-4" /> PASS
                      </Link>
                      <button
                        onClick={() => handleCancel(booking)}
                        disabled={!!cancellingId}
                        className={cn(
                          "p-3 glass rounded-xl text-red-400 border border-white/10 transition-all flex items-center gap-2 hover:bg-red-400 hover:text-white hover:scale-105 active:scale-95",
                          cancellingId === booking.id ? "animate-pulse opacity-50" : ""
                        )}
                      >
                        {cancellingId === booking.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl text-slate-500 border border-white/10 hover:text-red-400 hover:border-red-400/30 transition-all uppercase text-[9px] font-bold tracking-widest active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" /> Purge
                    </button>
                  )}
                  <Link
                    to={`/reviews/${booking.tripId}`}
                    className="p-3 glass rounded-xl text-slate-500 border border-white/10 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all flex items-center justify-center hover:scale-110 active:scale-95"
                    title="Mission Feedback"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

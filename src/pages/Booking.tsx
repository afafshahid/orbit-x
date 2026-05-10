import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firebaseUtils';
import { Trip, OperationType } from '../types';
import { Rocket, ShieldCheck, CreditCard, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatPrice } from '../lib/utils';

type SeatClass = 'Economy' | 'Business' | 'First Class';

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<SeatClass>('Economy');
  const [simulatedBookedSeats, setSimulatedBookedSeats] = useState<Set<string>>(new Set());
  const [realTimeBookedSeats, setRealTimeBookedSeats] = useState<Set<string>>(new Set());
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const seatClasses = {
    'First Class': { priceMult: 3, rows: 2, cols: 4, label: 'Hyper-Suite' },
    'Business': { priceMult: 1.8, rows: 4, cols: 6, label: 'Star-Executive' },
    'Economy': { priceMult: 1, rows: 8, cols: 6, label: 'Orbital-Standard' }
  };

  useEffect(() => {
    async function fetchTrip() {
      if (!tripId) return;
      const tripDoc = await getDoc(doc(db, 'trips', tripId));
      if (tripDoc.exists()) {
        setTrip({ id: tripDoc.id, ...tripDoc.data() } as Trip);
      }
      setLoading(false);
    }
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    // Stable "booked" generation based on seeds or tripId
    if (tripId && selectedClass) {
      const { rows, cols } = seatClasses[selectedClass];
      const classPrefix = selectedClass[0];
      const booked = new Set<string>();
      
      // Use a consistent pseudo-random seed based on tripId and class
      const seed = tripId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const id = `${classPrefix}${r}${String.fromCharCode(64 + c)}`;
          // Deterministic "random" based on ID and trip seed
          const idVal = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          if ((seed + idVal) % 7 === 0) {
            booked.add(id);
          }
        }
      }
      setSimulatedBookedSeats(booked);
    }
  }, [tripId, selectedClass]);

  useEffect(() => {
    if (!tripId) return;

    const bQuery = query(
      collection(db, 'bookings'),
      where('tripId', '==', tripId),
      where('status', '==', 'confirmed')
    );

    const unsubscribe = onSnapshot(bQuery, (snapshot) => {
      const seats = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.seatNumber) {
          seats.add(data.seatNumber);
        }
      });
      setRealTimeBookedSeats(seats);

      // If our selected seat just got booked by someone else
      if (selectedSeat && seats.has(selectedSeat)) {
        setAvailabilityError(`Coordinate ${selectedSeat} was just claimed by another explorer. Please re-assign.`);
        setSelectedSeat(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `bookings (tripId: ${tripId})`);
    });

    return () => unsubscribe();
  }, [tripId, selectedSeat]);

  const renderSeatMap = () => {
    const { rows, cols } = seatClasses[selectedClass];
    const seats = [];
    const classPrefix = selectedClass[0];

    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        const id = `${classPrefix}${r}${String.fromCharCode(64 + c)}`;
        const isBooked = simulatedBookedSeats.has(id) || realTimeBookedSeats.has(id);
        
        rowSeats.push(
          <button
            key={id}
            disabled={isBooked}
            onClick={() => setSelectedSeat(id)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all border",
              isBooked ? "bg-red-500/10 border-red-500/20 text-red-900 cursor-not-allowed opacity-30 shadow-inner" :
              selectedSeat === id ? "bg-cyber-cyan border-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-110 z-10 font-black" :
              "glass-bright bg-white/5 border-white/10 text-slate-400 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 hover:text-cyber-cyan"
            )}
          >
            {id}
          </button>
        );
      }
      seats.push(
        <div key={r} className="flex gap-2.5 justify-center">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  const totalPrice = trip ? trip.price * seatClasses[selectedClass].priceMult : 0;

  const handleProceed = () => {
    if (!selectedSeat || !trip) return;

    // Final sanity check
    if (realTimeBookedSeats.has(selectedSeat)) {
      setAvailabilityError(`Assignment Conflict: ${selectedSeat} is no longer available.`);
      setSelectedSeat(null);
      return;
    }

    navigate('/payment', { 
      state: { 
        trip, 
        seat: selectedSeat, 
        seatClass: selectedClass,
        totalPrice 
      } 
    });
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
      <span className="text-cyber-cyan font-display font-medium tracking-[0.3em] text-sm animate-pulse">CONFIGURING SEAT MAP...</span>
    </div>
  );

  if (!trip) return (
    <div className="max-w-7xl mx-auto p-4 py-32 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-4xl font-display font-medium mb-6 uppercase tracking-tight text-white">MISSION UNAVAILABLE</h2>
      <p className="text-slate-500 mb-10 font-light text-lg">The requested trip coordinates could not be located in our orbital database.</p>
      <Link to="/explore" className="px-10 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-tight">RETURN TO SECTOR MAP</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Left Column: Trip Details & Class Selection */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2rem] p-8 border border-white/20 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <img 
              src={trip.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'} 
              referrerPolicy="no-referrer" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800';
              }}
              className="w-full h-56 object-cover rounded-2xl mb-8 shadow-2xl border border-white/10" 
              alt={trip.name} 
            />
            <h1 className="text-3xl font-display font-bold mb-3 uppercase tracking-tight text-white leading-tight">{trip.name}</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-light italic">"{trip.description}"</p>
            
            <div className="grid grid-cols-2 gap-4 p-5 glass-bright rounded-2xl border border-white/10 shadow-inner">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Destination</p>
                <p className="font-bold text-cyber-cyan">{trip.destination}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Duration</p>
                <p className="font-bold text-cyber-indigo">{trip.duration}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h3 className="font-display font-bold text-[10px] tracking-[0.3em] text-slate-500 uppercase px-1">Transmission Class</h3>
            <div className="grid grid-cols-1 gap-4">
              {(Object.keys(seatClasses) as SeatClass[]).map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSeat(null);
                  }}
                  className={cn(
                    "p-6 rounded-[1.5rem] border transition-all text-left flex justify-between items-center group relative overflow-hidden",
                    selectedClass === cls 
                      ? "glass-bright border-cyber-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                      : "glass border-white/10 hover:border-white/20"
                  )}
                >
                  {selectedClass === cls && (
                    <div className="absolute -left-10 bottom-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-2xl pointer-events-none" />
                  )}
                  <div className="relative z-10">
                    <p className="font-display font-medium text-sm font-bold uppercase text-white tracking-widest">{seatClasses[cls].label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">x{seatClasses[cls].priceMult} Quality Index</p>
                  </div>
                  <div className={cn("text-base sm:text-lg font-mono font-bold tracking-tight relative z-10 transition-colors", selectedClass === cls ? "text-cyber-cyan" : "text-slate-400 group-hover:text-white")}>
                    {formatPrice(trip.price * seatClasses[cls].priceMult)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Seat Map */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-10 border border-white/20 relative shadow-2xl min-h-[40rem] flex flex-col"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-b from-cyber-cyan/20 to-transparent blur-xl pointer-events-none" />
            
            <div className="text-center mb-16 relative">
              <div className="w-full h-8 bg-gradient-to-b from-cyber-cyan/10 to-transparent border-t border-cyber-cyan/20 rounded-t-[2.5rem] mb-6" />
              
              {availabilityError && (
                <div className="mx-10 mb-8 p-4 glass-bright border border-red-500/30 rounded-2xl bg-red-400/10 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest text-left leading-relaxed">
                    {availabilityError}
                  </p>
                  <button 
                    onClick={() => setAvailabilityError(null)}
                    className="text-red-400 hover:text-white transition-colors ml-auto text-xs"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-cyber-cyan/30" />
                <p className="text-[10px] font-bold tracking-[0.4em] text-cyber-cyan uppercase">Cruiser Front</p>
                <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-cyber-cyan/30" />
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {renderSeatMap()}
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 py-6 glass-bright rounded-2xl border border-white/10 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-white/5 border border-white/10" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-cyber-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                <span className="text-[9px] font-bold text-cyber-cyan uppercase tracking-widest">Selected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-red-400/20 border border-red-500/30" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Booked</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2.5rem] p-10 border border-white/20 sticky top-24 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyber-fuchsia/5 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-3xl font-display font-medium mb-12 uppercase tracking-tight text-white leading-none">Vesting Summary</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pass Segment</span>
                <span className="font-medium text-white text-sm">{trip.name}</span>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Transmission</span>
                <span className="font-bold text-cyber-indigo text-xs uppercase tracking-[0.2em]">{selectedClass}</span>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Assignment</span>
                <span className={cn("font-display font-bold text-2xl tracking-tighter", selectedSeat ? "text-cyber-cyan animate-pulse" : "text-red-500/30")}>
                  {selectedSeat || 'UNASSIGNED'}
                </span>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Total Energy</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-right text-[10px] font-bold text-slate-600 uppercase tracking-widest">Includes Orbital Tax & Fees</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 glass-bright border border-white/10 rounded-2xl shadow-xl">
                <div className="p-2 bg-cyber-cyan/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-widest">
                  Secure Quantum-Encrypted transactions only. No refunds after departure clearance.
                </p>
              </div>

              <button
                disabled={!selectedSeat}
                onClick={handleProceed}
                className="w-full py-5 bg-cyber-cyan text-slate-950 rounded-[1.5rem] font-bold text-lg hover:bg-cyber-cyan/80 transition-all shadow-[0_15px_30px_rgba(34,211,238,0.2)] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 group uppercase tracking-tight active:scale-95"
              >
                PAYMENT UPLINK
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

  );
}

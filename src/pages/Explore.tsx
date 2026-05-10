import { useState, useEffect } from 'react';
import { useTrips } from '../hooks/useTrips';
import { TripCategory } from '../types';
import { Search, Filter, MapPin, Calendar, Clock, DollarSign, Rocket, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice, cn } from '../lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CATEGORIES: TripCategory[] = ['Moon', 'Mars', 'ISS', 'Venus', 'Jupiter', 'Saturn', 'Europa', 'Proxima Centauri'];

export default function Explore() {
  const { trips, loading, error } = useTrips();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TripCategory | 'All'>((searchParams.get('category') as any) || 'All');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat as any)) {
      setSelectedCategory(cat as any);
    }
  }, [searchParams]);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(search.toLowerCase()) || 
                         trip.destination.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || trip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const seedData = async () => {
    setSeeding(true);
    // Optional: Clear existing trips if the user wants a clean slate
    // But for safety, we'll just add new ones or let the user handle it
    // Actually, I'll add a specialized "Clean & Seed" function as well
    const sampleTrips = [
      {
        name: 'Lunar Gateway Residency',
        destination: 'Moon Orbit',
        description: 'Experience gravity-neutral living with the most spectacular view of Earth ever seen. Includes spacewalk training and regolith research labs.',
        price: 25000,
        departureDate: '2026-08-15',
        duration: '14 Days',
        totalSeats: 12,
        availableSeats: 8,
        image: 'https://images.unsplash.com/photo-1541001477121-7f91ea73142f?q=80&w=800',
        category: 'Moon'
      },
      {
        name: 'Olympus Mons Expedition',
        destination: 'Mars',
        description: 'Scale the largest volcano in the solar system. A 3-month journey into the heart of the Red Planet. Survival gear and pressurized domes included.',
        price: 150000,
        departureDate: '2027-02-10',
        duration: '9 Months',
        totalSeats: 6,
        availableSeats: 2,
        image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800',
        category: 'Mars'
      },
      {
        name: 'Europa Ocean Explorer',
        destination: 'Europa (Jupiter)',
        description: 'Dive beneath the icy crust of Europa. Explore the sub-surface oceans in our state-of-the-art bio-luminescent submersibles.',
        price: 850000,
        departureDate: '2028-11-20',
        duration: '2 Years',
        totalSeats: 4,
        availableSeats: 4,
        image: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?q=80&w=800',
        category: 'Europa'
      },
      {
        name: 'ISS Luxury Weekend',
        destination: 'Low Earth Orbit',
        description: 'The classic orbital experience. Five-star dining in 0G and world-class observation decks.',
        price: 12000,
        departureDate: '2026-06-05',
        duration: '3 Days',
        totalSeats: 20,
        availableSeats: 15,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        category: 'ISS'
      },
      {
        name: 'Saturn Ring Glide',
        destination: 'Saturn Orbit',
        description: 'A breathtaking cruise through the rings of Saturn. Witness the light diffraction through ice crystals up close.',
        price: 450000,
        departureDate: '2029-04-12',
        duration: '1.5 Years',
        totalSeats: 8,
        availableSeats: 6,
        image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=800',
        category: 'Saturn'
      }
    ];

    try {
      const tripsCol = collection(db, 'trips');
      const existingTripsSnap = await getDocs(tripsCol);
      const existingTrips = existingTripsSnap.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

      for (const trip of sampleTrips) {
        const existing = existingTrips.find(t => t.name === trip.name);
        if (existing) {
          await setDoc(doc(db, 'trips', existing.id), trip);
        } else {
          await addDoc(tripsCol, trip);
        }
      }
      alert('Orbital database synced with latest visual protocols.');
    } catch (err) {
      console.error(err);
      alert('Sync failed. Check console for uplink errors.');
    } finally {
      setSeeding(false);
    }
  };

  const cleanAndSeed = async () => {
    if (!confirm('This will not delete bookings, but it might create duplicate trips if they exist. Continue?')) return;
    await seedData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/20 text-cyber-cyan text-[9px] font-bold uppercase tracking-[0.2em] mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Star className="w-2.5 h-2.5 fill-cyber-cyan" />
            Discover the Cosmos
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter uppercase text-white">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-fuchsia">DESTINY</span>
          </h1>
          <p className="text-slate-400 max-w-xl font-light text-base italic">
            "Space is not a destination, it's a direction."
          </p>
          <button 
            onClick={cleanAndSeed}
            disabled={seeding}
            className="mt-4 text-[9px] uppercase tracking-widest font-bold text-slate-600 hover:text-cyber-cyan transition-colors flex items-center gap-2"
          >
            <Rocket className="w-2.5 h-2.5" />
            {seeding ? 'Processing...' : 'Refresh Orbital Database'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search sectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-bright bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyber-cyan transition-all text-sm font-medium text-white shadow-lg"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val as any);
                if (val === 'All') {
                  searchParams.delete('category');
                } else {
                  searchParams.set('category', val);
                }
                setSearchParams(searchParams);
              }}
              className="w-full sm:w-48 glass-bright bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyber-cyan transition-all text-sm font-medium text-white appearance-none cursor-pointer shadow-lg"
            >
              <option value="All" className="bg-slate-950">All Sectors</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 glass rounded-[2rem] animate-pulse border border-white/10" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 glass rounded-[2rem] border border-red-500/20 shadow-2xl bg-red-500/5">
          <Info className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-40" />
          <h2 className="text-2xl font-display font-medium mb-4 text-white uppercase tracking-tight">ORBITAL LINK ERROR</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto font-light text-sm">
            {error}. Check your configuration.
          </p>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-white/10 shadow-2xl">
          <Rocket className="w-16 h-16 text-cyber-fuchsia mx-auto mb-6 opacity-40 animate-pulse" />
          <h2 className="text-2xl font-display font-medium mb-4 text-white uppercase tracking-tight">MISSION DATA NOT FOUND</h2>
          <button
            onClick={seedData}
            disabled={seeding}
            className="px-8 py-3.5 glass-bright bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-xl font-bold hover:bg-cyber-cyan hover:text-slate-950 transition-all flex items-center gap-3 mx-auto uppercase tracking-tight shadow-[0_0_20px_rgba(34,211,238,0.2)] text-xs"
          >
            {seeding ? 'INITIATING...' : 'AUTO-SEED DESTINATIONS'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTrips.map((trip, idx) => (
              <motion.div
                layout
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group glass rounded-[2rem] overflow-hidden hover:border-white/30 transition-all flex flex-col border border-white/10 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'}
                    alt={trip.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute top-4 right-4 glass-bright bg-slate-950/40 border border-white/20 px-3 py-1 rounded-full text-[8px] font-bold tracking-[0.2em] text-cyber-fuchsia uppercase shadow-xl">
                    {trip.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-cyber-cyan mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-[0.3em] uppercase">{trip.destination}</span>
                      </div>
                      <h3 className="text-xl font-display font-medium leading-tight uppercase group-hover:text-cyber-cyan transition-colors text-white">
                        {trip.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-slate-400 text-xs mb-6 line-clamp-2 leading-relaxed font-light">
                    {trip.description}
                  </p>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-3 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                      {new Date(trip.departureDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      <Star className="w-3.5 h-3.5 text-cyber-fuchsia fill-cyber-fuchsia/20" />
                      4.9 Rating
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      <Info className="w-3.5 h-3.5 text-cyber-cyan" />
                      {trip.availableSeats} Remaining
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase mb-0.5">Pass Entry</p>
                      <p className="text-base font-mono font-bold text-white tracking-widest">
                        {formatPrice(trip.price)}
                      </p>
                    </div>
                    <Link
                      to={`/booking/${trip.id}`}
                      className="px-6 py-2.5 bg-cyber-cyan text-slate-950 rounded-xl font-bold text-xs tracking-tight hover:bg-cyber-cyan/80 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] uppercase active:scale-95"
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>

  );
}

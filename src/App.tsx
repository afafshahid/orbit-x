import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages (to be implemented)
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import Explore from './pages/Explore';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Ticket from './pages/Ticket';
import MyBookings from './pages/MyBookings';
import ReviewsPage from './pages/Reviews';
import About from './pages/About';
import Fleet from './pages/Fleet';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log("Testing orbital link to Firestore...");
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Orbital link established successfully.");
        setConnectionError(null);
      } catch (error) {
        console.error("Firestore Connection Error:", error);
        if (error instanceof Error) {
          if (error.message.includes('permission')) {
            setConnectionError("Orbital access denied. Security protocols active.");
          } else if (error.message.includes('Could not reach') || error.message.includes('offline')) {
            setConnectionError("Orbital link unstable. Retrying connection...");
          } else {
            setConnectionError("Interstellar error detected. Code: " + error.message.substring(0, 20));
          }
        }
      }
    }
    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-display">
        <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin mb-8" />
        <span className="text-cyber-cyan text-sm font-bold tracking-[0.4em] animate-pulse">INITIALIZING ORBITAL LINK...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen selection:bg-cyber-purple/30 selection:text-white">
        <Navbar user={user} />
        {connectionError && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 glass bg-red-500/20 border border-red-500/30 rounded-full text-white text-xs font-bold tracking-widest uppercase shadow-2xl animate-pulse">
            {connectionError}
          </div>
        )}
        <main className="flex-grow pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/booking/:tripId" element={user ? <Booking /> : <Navigate to="/auth" />} />
            <Route path="/payment" element={user ? <Payment /> : <Navigate to="/auth" />} />
            <Route path="/ticket/:bookingId" element={user ? <Ticket /> : <Navigate to="/auth" />} />
            <Route path="/bookings" element={user ? <MyBookings /> : <Navigate to="/auth" />} />
            <Route path="/reviews/:tripId" element={<ReviewsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

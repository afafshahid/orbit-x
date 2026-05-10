import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Review, Trip, OperationType } from '../types';
import { Star, MessageSquare, Send, ChevronLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError } from '../lib/firebaseUtils';
import { cn } from '../lib/utils';

export default function ReviewsPage() {
  const { tripId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    // Fetch trip
    getDoc(doc(db, 'trips', tripId)).then(docSnap => {
      if (docSnap.exists()) {
        setTrip({ id: docSnap.id, ...docSnap.data() } as Trip);
      }
    });

    const path = `trips/${tripId}/reviews`;
    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(reviewsData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !tripId || !newComment.trim()) return;

    setSubmitting(true);
    const path = `trips/${tripId}/reviews`;
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Explorer',
        tripId,
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
      <span className="text-cyber-cyan font-display font-medium tracking-[0.3em] text-sm animate-pulse uppercase">Decrypting Mission Reviews...</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 relative">
      <div className="flex items-center gap-6 mb-16 relative z-10">
        <Link to="/explore" className="p-3 glass rounded-xl hover:bg-white/10 border border-white/10 transition-all hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight uppercase text-white leading-none mb-3">MISSION CRITIQUE</h1>
          {trip && (
            <p className="text-slate-400 font-light italic">
              Post-flight evaluations for <span className="text-cyber-cyan font-bold uppercase tracking-widest">{trip.name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Review Form */}
        <div className="lg:col-span-1">
          {auth.currentUser ? (
            <form onSubmit={handleSubmit} className="glass p-8 rounded-[2.5rem] border border-white/20 space-y-8 sticky top-28 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="font-display font-medium text-[10px] uppercase tracking-[0.4em] text-cyber-cyan font-bold mb-4">Log Evaluation</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Quality Index</label>
                  <div className="flex gap-3 p-3 glass-bright rounded-2xl border border-white/10 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={cn(
                          "transition-all transform",
                          newRating >= star ? "text-cyber-fuchsia scale-125" : "text-slate-700 hover:text-cyber-fuchsia/50"
                        )}
                      >
                        <Star className={cn("w-6 h-6", newRating >= star && "fill-cyber-fuchsia")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Observations</label>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full glass-bright bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all min-h-[180px] resize-none text-white font-light leading-relaxed placeholder:text-slate-700"
                    placeholder="Describe your orbital experience in detail..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-cyber-cyan text-slate-950 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-cyber-cyan/80 transition-all shadow-[0_15px_30px_rgba(34,211,238,0.2)] flex items-center justify-center gap-3 active:scale-95"
              >
                {submitting ? 'Transmitting...' : (
                  <> <Send className="w-4 h-4 translate-y-[-1px]" /> Submit Log </>
                )}
              </button>
            </form>
          ) : (
            <div className="glass p-10 rounded-[2.5rem] border border-white/20 text-center space-y-8 sticky top-28 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.03] to-transparent pointer-events-none" />
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <MessageSquare className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm font-light italic leading-loose">"Encryption protocols active. Authentication required to log mission evaluations into the archive."</p>
              <Link to="/auth" className="block w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all hover:scale-105 active:scale-95">UPLINK IDENTITY</Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="py-40 text-center glass rounded-[3rem] border-dashed border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <MessageSquare className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-40 group-hover:scale-110 transition-transform duration-500" />
              <p className="text-slate-500 font-display font-medium text-xs uppercase tracking-[0.5em]">No Data Logged Yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="glass p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden hover:border-white/20 transition-all group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-indigo/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-cyber-cyan/10 to-cyber-indigo/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User className="w-6 h-6 text-cyber-cyan" />
                        </div>
                        <div>
                          <h4 className="font-display font-medium text-base text-white uppercase tracking-tight mb-1">{review.userName}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {review.createdAt ? new Date((review.createdAt as any).toDate()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent Entry'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 p-2 glass-bright border border-white/10 rounded-xl shadow-inner">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={cn("w-3 h-3", review.rating >= s ? "text-cyber-fuchsia fill-cyber-fuchsia" : "text-slate-800")} />
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyber-cyan/20 to-transparent rounded-full" />
                        <p className="text-slate-400 text-base leading-relaxed font-light italic pl-4">
                        "{review.comment}"
                        </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

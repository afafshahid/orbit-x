import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip, OperationType } from '../types';
import { handleFirestoreError } from '../lib/firebaseUtils';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = 'trips';
    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tripData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Trip[];
        setTrips(tripData);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { trips, loading, error };
}

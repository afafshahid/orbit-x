import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust settings
const firestoreSettings = {
  experimentalForceLongPolling: true,
};

export const db = initializeFirestore(app, firestoreSettings, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

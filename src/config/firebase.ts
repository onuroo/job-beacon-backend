import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDlhesOzbEmim7mHB1xMzXhCJ7CHWRsNkc",
  authDomain: "jobbeacon-8a8a8.firebaseapp.com",
  projectId: "jobbeacon-8a8a8",
  storageBucket: "jobbeacon-8a8a8.firebasestorage.app",
  messagingSenderId: "482579554236",
  appId: "1:482579554236:web:c329826d3078536a70d5b9",
  measurementId: "G-2XE0TRR3C4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
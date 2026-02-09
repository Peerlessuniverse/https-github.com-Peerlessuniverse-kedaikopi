
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfwAqANKCQmjaRiKbvE-93GAPctM5Tw78",
  authDomain: "kowawa-fee8c.firebaseapp.com",
  projectId: "kowawa-fee8c",
  storageBucket: "kowawa-fee8c.firebasestorage.app",
  messagingSenderId: "369035690704",
  appId: "1:369035690704:web:e7164c08c0177236fc94d5",
  measurementId: "G-C3N5T4PLWJ"
};

let db: Firestore | null = null;

try {
  const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  console.log("Firebase & Firestore initialized successfully.");
} catch (error) {
  console.error("Firebase/Firestore initialization error:", error);
}

export { db };

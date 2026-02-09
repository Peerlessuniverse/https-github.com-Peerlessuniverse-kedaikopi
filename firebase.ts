
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfwAqANKCQmjaRiKbvE-93GAPctM5Tw78",
  authDomain: "kowawa-fee8c.firebaseapp.com",
  projectId: "kowawa-fee8c",
  storageBucket: "kowawa-fee8c.firebasestorage.app",
  messagingSenderId: "369035690704",
  appId: "1:369035690704:web:e7164c08c0177236fc94d5",
  measurementId: "G-C3N5T4PLWJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

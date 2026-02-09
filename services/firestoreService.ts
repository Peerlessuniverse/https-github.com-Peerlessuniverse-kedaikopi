
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  doc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { MenuItem, Testimonial, ReservationDetails } from "../types";

const MENU_COL = "menu";
const TESTIMONIALS_COL = "testimonials";
const RESERVATIONS_COL = "reservations";

export const getMenuItems = async (): Promise<MenuItem[]> => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (e) {
    console.error("Error fetching menu:", e);
    return [];
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, TESTIMONIALS_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (e) {
    console.error("Error fetching testimonials:", e);
    return [];
  }
};

export const addReservation = async (reservationData: ReservationDetails): Promise<void> => {
  if (!db) throw new Error("Database not connected");
  try {
    await addDoc(collection(db, RESERVATIONS_COL), {
      ...reservationData,
      timestamp: Timestamp.now()
    });
  } catch (e) {
    console.error("Error adding reservation:", e);
    throw e;
  }
};

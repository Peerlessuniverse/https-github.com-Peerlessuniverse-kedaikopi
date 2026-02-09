
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
import { MenuItem, Order, Branch } from "../types";

const ORDERS_COL = "orders";
const MENU_COL = "menu";
const BRANCHES_COL = "branches";

const ensureDb = (): boolean => {
  if (!db) {
    console.error("Firestore database instance (db) is not available.");
    return false;
  }
  return true;
};

export const getMenu = async (): Promise<MenuItem[]> => {
  if (!ensureDb()) return [];
  try {
    const querySnapshot = await getDocs(collection(db!, MENU_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (e) {
    console.error("Error fetching menu:", e);
    return [];
  }
};

export const getBranches = async (): Promise<Branch[]> => {
  if (!ensureDb()) return [];
  try {
    const querySnapshot = await getDocs(collection(db!, BRANCHES_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (e) {
    console.error("Error fetching branches:", e);
    return [];
  }
};

export const createOrder = async (order: Omit<Order, 'id'>) => {
  if (!ensureDb()) throw new Error("Database not connected");
  return await addDoc(collection(db!, ORDERS_COL), {
    ...order,
    timestamp: Timestamp.now()
  });
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  if (!ensureDb()) return;
  const orderRef = doc(db!, ORDERS_COL, orderId);
  return await updateDoc(orderRef, { status });
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  if (!db) {
    console.error("Firestore DB is not initialized for subscription.");
    return () => {};
  }
  
  try {
    const q = query(collection(db, ORDERS_COL), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        const ts = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date();
        return {
          id: doc.id,
          ...data,
          timestamp: ts
        } as Order;
      });
      callback(orders);
    }, (err) => {
      console.error("Firestore Subscription Error:", err);
    });
  } catch (e) {
    console.error("Error setting up order subscription:", e);
    return () => {};
  }
};

export const seedDatabase = async (initialMenu: MenuItem[], initialBranches: Branch[]) => {
  if (!ensureDb()) return;
  try {
    const menuSnap = await getDocs(collection(db!, MENU_COL));
    if (menuSnap.empty) {
      for (const item of initialMenu) {
        await setDoc(doc(db!, MENU_COL, item.id), item);
      }
    }
    
    const branchSnap = await getDocs(collection(db!, BRANCHES_COL));
    if (branchSnap.empty) {
      for (const b of initialBranches) {
        await setDoc(doc(db!, BRANCHES_COL, b.id), b);
      }
    }
  } catch (e) {
    console.error("Seeding failed:", e);
  }
};

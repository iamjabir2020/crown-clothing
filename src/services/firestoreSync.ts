import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Product, OrderTelemetry, BespokeLead, OrderStatus } from '../types';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_LEADS } from '../data/mockData';
import { resolveImageUrl } from '../utils/imageResolver';
import { normalizeToINRPrice } from '../utils/currency';

// Ensure anonymous auth for security rules if needed
let currentUser: User | null = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export const ensureAuth = async () => {
  if (!currentUser && auth) {
    try {
      const cred = await signInAnonymously(auth);
      currentUser = cred.user;
    } catch (e) {
      console.warn('Anonymous auth note:', e);
    }
  }
};

/**
 * Real-time Products subscription with initial database seed
 */
export const subscribeProducts = (onUpdate: (products: Product[]) => void) => {
  const colRef = collection(db, 'products');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial products into Firestore
        try {
          const batch = writeBatch(db);
          PRODUCTS.forEach((product) => {
            const docRef = doc(db, 'products', product.id);
            batch.set(docRef, product);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding products:', err);
          onUpdate(PRODUCTS);
        }
      } else {
        const loaded: Product[] = [];
        snapshot.forEach((d) => {
          const raw = d.data() as Product;
          const price = normalizeToINRPrice(raw.price, raw.id);
          const originalPrice = raw.originalPrice ? normalizeToINRPrice(raw.originalPrice, raw.id) : undefined;
          
          // If Firestore still held old USD values, update in background to INR
          if (raw.price < 2000) {
            updateDoc(doc(db, 'products', d.id), { price, originalPrice }).catch(() => {});
          }

          loaded.push({
            ...raw,
            price,
            originalPrice,
            image: resolveImageUrl(raw.image, raw.id),
            secondaryImage: raw.secondaryImage
              ? resolveImageUrl(raw.secondaryImage, raw.id, true)
              : resolveImageUrl(raw.image, raw.id, true),
          });
        });
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('Firestore snapshot error, using local fallback:', err);
      onUpdate(PRODUCTS);
    }
  );

  return unsubscribe;
};

/**
 * Real-time Orders subscription with initial database seed
 */
export const subscribeOrders = (onUpdate: (orders: OrderTelemetry[]) => void) => {
  const colRef = collection(db, 'orders');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_ORDERS.forEach((order) => {
            const docRef = doc(db, 'orders', order.orderId);
            batch.set(docRef, order);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding orders:', err);
          onUpdate(INITIAL_ORDERS);
        }
      } else {
        const loaded: OrderTelemetry[] = [];
        snapshot.forEach((d) => {
          const raw = d.data() as OrderTelemetry;
          const isLegacyUSD = raw.total < 5000;
          const multiplier = isLegacyUSD ? 100 : 1;
          const subtotal = Math.round(raw.subtotal * multiplier);
          const total = Math.round(raw.total * multiplier);

          const normalizedItems = Array.isArray(raw.items)
            ? raw.items.map((item) => {
                const prodPrice = normalizeToINRPrice(item.product?.price, item.product?.id);
                return {
                  ...item,
                  product: {
                    ...item.product,
                    price: prodPrice,
                    image: resolveImageUrl(item.product?.image, item.product?.id),
                  },
                };
              })
            : raw.items;

          loaded.push({
            ...raw,
            subtotal,
            total,
            items: normalizedItems,
          });
        });
        // Sort newest first
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('Firestore orders error, using local fallback:', err);
      onUpdate(INITIAL_ORDERS);
    }
  );

  return unsubscribe;
};

/**
 * Real-time Leads subscription with initial database seed
 */
export const subscribeLeads = (onUpdate: (leads: BespokeLead[]) => void) => {
  const colRef = collection(db, 'leads');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_LEADS.forEach((lead) => {
            const docRef = doc(db, 'leads', lead.id);
            batch.set(docRef, lead);
          });
          await batch.commit();
        } catch (err) {
          console.error('Error seeding leads:', err);
          onUpdate(INITIAL_LEADS);
        }
      } else {
        const loaded: BespokeLead[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as BespokeLead);
        });
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('Firestore leads error, using local fallback:', err);
      onUpdate(INITIAL_LEADS);
    }
  );

  return unsubscribe;
};

// CRUD Operations
export const saveOrderToDb = async (order: OrderTelemetry) => {
  try {
    await setDoc(doc(db, 'orders', order.orderId), order);
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }
};

export const updateOrderStatusInDb = async (orderId: string, newStatus: OrderStatus) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: newStatus,
    });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
};

export const updateProductStockInDb = async (productId: string, newStock: number) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      stockCount: newStock,
      inStock: newStock > 0,
    });
  } catch (err) {
    console.error('Error updating product stock in Firestore:', err);
  }
};

export const updateProductPriceInDb = async (productId: string, newPrice: number) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      price: newPrice,
    });
  } catch (err) {
    console.error('Error updating product price in Firestore:', err);
  }
};

export const saveLeadToDb = async (lead: BespokeLead) => {
  try {
    await setDoc(doc(db, 'leads', lead.id), lead);
  } catch (err) {
    console.error('Error saving lead to Firestore:', err);
  }
};

export const updateLeadStatusInDb = async (leadId: string, newStatus: BespokeLead['status']) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    await updateDoc(docRef, {
      status: newStatus,
    });
  } catch (err) {
    console.error('Error updating lead status in Firestore:', err);
  }
};

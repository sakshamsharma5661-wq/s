import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Truck } from '../types';

export const TruckService = {
  createTruck: async (truck: Omit<Truck, 'id'>) => {
    const path = 'trucks';
    try {
      return await addDoc(collection(db, path), truck);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateTruckStatus: async (truckId: string, status: 'active' | 'maintenance' | 'inactive') => {
    const path = `trucks/${truckId}`;
    try {
      return await updateDoc(doc(db, 'trucks', truckId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  subscribeToOwnerTrucks: (ownerId: string, callback: (trucks: Truck[]) => void) => {
    const path = 'trucks';
    const q = query(
      collection(db, path),
      where('ownerId', '==', ownerId)
    );
    return onSnapshot(q, (snapshot) => {
      const trucks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Truck));
      callback(trucks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  getOwnerTrucks: async (ownerId: string) => {
    const path = 'trucks';
    const q = query(
      collection(db, path),
      where('ownerId', '==', ownerId)
    );
    try {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Truck));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};

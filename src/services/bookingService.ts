import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Booking, BookingStatus } from '../types';

export const BookingService = {
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const path = 'bookings';
    try {
      return await addDoc(collection(db, path), {
        ...booking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus, driverId?: string) => {
    const path = `bookings/${bookingId}`;
    try {
      const data: any = { 
        status, 
        updatedAt: serverTimestamp() 
      };
      if (driverId) data.driverId = driverId;
      return await updateDoc(doc(db, 'bookings', bookingId), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  subscribeToCustomerBookings: (customerId: string, callback: (bookings: Booking[]) => void) => {
    const path = 'bookings';
    const q = query(
      collection(db, path), 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      callback(bookings);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  subscribeToAvailableBookings: (callback: (bookings: Booking[]) => void) => {
    const path = 'bookings';
    const q = query(
      collection(db, path), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      callback(bookings);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  subscribeToDriverBookings: (driverId: string, callback: (bookings: Booking[]) => void) => {
    const path = 'bookings';
    const q = query(
      collection(db, path), 
      where('driverId', '==', driverId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      callback(bookings);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};

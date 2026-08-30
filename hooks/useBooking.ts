import { useState, useEffect } from 'react';
import { bookingStore, BookingDraft } from '@/store/bookingStore';

export const useBooking = () => {
  const [draft, setDraftState] = useState<BookingDraft>(bookingStore.get());

  useEffect(() => {
    const unsubscribe = bookingStore.subscribe(() => {
      setDraftState(bookingStore.get());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    draft,
    updateBooking: bookingStore.set,
    resetBooking: bookingStore.reset,
  };
};

export default useBooking;

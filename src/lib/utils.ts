import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any) {
  if (!date) return 'N/A';
  if (typeof date === 'string') return new Date(date).toLocaleDateString();
  if (date?.toDate && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString();
  }
  if (date?.seconds) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

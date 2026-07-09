import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + " Cr";
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(2) + " Lac";
  }
  return num.toLocaleString('en-IN');
}

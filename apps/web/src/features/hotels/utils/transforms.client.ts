"use client";

import {
  transformDatesRecursive as transformDatesBase,
  transformHotelsData as transformHotelsDataBase,
  WithDateConversions
} from "@/features/hotels/utils/transforms";

/**
 * Client-side utility for transforming date strings to Date objects
 * This wrapper ensures proper typing for client components
 */
export function transformDatesRecursive<T>(obj: T): WithDateConversions<T> {
  return transformDatesBase(obj);
}

/**
 * Client-side utility for transforming hotel data
 */
export function transformHotelsData<T>(hotels: T[]): WithDateConversions<T[]> {
  return transformHotelsDataBase(hotels);
}

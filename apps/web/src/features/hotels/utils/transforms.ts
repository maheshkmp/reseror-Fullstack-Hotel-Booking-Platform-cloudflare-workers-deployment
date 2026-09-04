/**
 * Utility functions to transform API data to match expected component types
 */

/**
 * Transforms API date strings to Date objects in hotel data
 * @param hotel Hotel data from API with string dates
 * @returns Hotel data with Date objects
 */
export function transformHotelDates<
  T extends { createdAt: string; updatedAt: string | null }
>(hotel: T): T & { createdAt: Date; updatedAt: Date | null } {
  return {
    ...hotel,
    createdAt: new Date(hotel.createdAt),
    updatedAt: hotel.updatedAt ? new Date(hotel.updatedAt) : null
  };
}

type DateFields = "createdAt" | "updatedAt" | "effectiveDate";

/**
 * Type that represents an object with string dates converted to Date objects
 * This preserves the structure of the original type but converts date fields to Date
 */
export type WithDateConversions<T> = T extends (infer U)[]
  ? WithDateConversions<U>[]
  : T extends object
    ? {
        [K in keyof T]: K extends DateFields
          ? T[K] extends string
            ? Date
            : T[K] extends string | null
              ? Date | null
              : T[K]
          : T[K] extends object
            ? WithDateConversions<T[K]>
            : T[K];
      }
    : T;

/**
 * Recursively transforms date strings to Date objects in an object or array
 */
function transformDatesRecursive<T>(data: T): WithDateConversions<T> {
  if (data === null || data === undefined) {
    return data as WithDateConversions<T>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(transformDatesRecursive) as WithDateConversions<T>;
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    const result = { ...data } as Record<string, any>;
    const dateFields: DateFields[] = [
      "createdAt",
      "updatedAt",
      "effectiveDate"
    ];

    for (const key in result) {
      if (dateFields.includes(key as DateFields)) {
        // Convert string date fields to Date objects
        if (typeof result[key] === "string") {
          result[key] = new Date(result[key]);
        }
      } else if (typeof result[key] === "object" && result[key] !== null) {
        // Recursively transform nested objects/arrays
        result[key] = transformDatesRecursive(result[key]);
      }
    }

    return result as WithDateConversions<T>;
  }

  return data as WithDateConversions<T>;
}

/**
 * Transforms date strings to Date objects in hotel data
 * This function specifically ensures all date fields are properly converted
 */
function transformHotelsData<T>(hotels: T[]): WithDateConversions<T[]> {
  if (!Array.isArray(hotels)) {
    return [] as WithDateConversions<T[]>;
  }

  return hotels.map((hotel) => {
    if (typeof hotel !== "object" || hotel === null) {
      return hotel as WithDateConversions<T>;
    }

    // Create a deep copy to avoid mutating the original
    const result = JSON.parse(JSON.stringify(hotel)) as Record<string, any>;

    // Convert top-level date fields
    if (typeof result.createdAt === "string") {
      result.createdAt = new Date(result.createdAt);
    }

    if (typeof result.updatedAt === "string") {
      result.updatedAt = new Date(result.updatedAt);
    }

    // Process hotelType if present
    if (result.hotelType && typeof result.hotelType === "object") {
      if (typeof result.hotelType.createdAt === "string") {
        result.hotelType.createdAt = new Date(result.hotelType.createdAt);
      }
      if (typeof result.hotelType.updatedAt === "string") {
        result.hotelType.updatedAt = new Date(result.hotelType.updatedAt);
      }
    }

    // Process propertyClass if present
    if (result.propertyClass && typeof result.propertyClass === "object") {
      if (typeof result.propertyClass.createdAt === "string") {
        result.propertyClass.createdAt = new Date(
          result.propertyClass.createdAt
        );
      }
      if (typeof result.propertyClass.updatedAt === "string") {
        result.propertyClass.updatedAt = new Date(
          result.propertyClass.updatedAt
        );
      }
    }

    // Process images array
    if (Array.isArray(result.images)) {
      result.images = result.images.map((img: any) => {
        if (typeof img === "object" && img !== null) {
          return {
            ...img,
            createdAt:
              typeof img.createdAt === "string"
                ? new Date(img.createdAt)
                : img.createdAt,
            updatedAt:
              typeof img.updatedAt === "string"
                ? new Date(img.updatedAt)
                : img.updatedAt
          };
        }
        return img;
      });
    }

    // Process other arrays: amenities, roomTypes, policies
    ["amenities", "roomTypes", "policies"].forEach((arrayKey) => {
      if (Array.isArray(result[arrayKey])) {
        result[arrayKey] = result[arrayKey].map((item: any) => {
          if (typeof item === "object" && item !== null) {
            const transformed = { ...item };
            if (typeof transformed.createdAt === "string") {
              transformed.createdAt = new Date(transformed.createdAt);
            }
            if (typeof transformed.updatedAt === "string") {
              transformed.updatedAt = new Date(transformed.updatedAt);
            }
            if (typeof transformed.effectiveDate === "string") {
              transformed.effectiveDate = new Date(transformed.effectiveDate);
            }
            return transformed;
          }
          return item;
        });
      }
    });

    return result as WithDateConversions<T>;
  }) as WithDateConversions<T[]>;
}

export { transformDatesRecursive, transformHotelsData };

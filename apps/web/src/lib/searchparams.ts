import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from "nuqs/server";

export enum Sort {
  asc = "asc",
  desc = "desc"
}

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsStringEnum<Sort>(Object.values(Sort)).withDefault(Sort.desc),
  q: parseAsString,
  tab: parseAsString.withDefault("all"),

  hotelType: parseAsString,
  nurseryType: parseAsString,
  propertyClass: parseAsString,
  status: parseAsString,
  hotelId: parseAsString,
  paymentStatus: parseAsString,
  paymentMethod: parseAsString,
  from: parseAsString,
  to: parseAsString,
  minAmount: parseAsString,
  maxAmount: parseAsString,
  starRating: parseAsString,
  isOverdue: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

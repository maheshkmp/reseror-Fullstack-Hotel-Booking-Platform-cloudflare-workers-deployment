"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { searchParams } from "@/lib/searchparams";

export function useRoomBookingsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );


  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const [hotelId, setHotelId] = useQueryState(
    "hotelId",
    searchParams.hotelId.withOptions({ shallow: false }).withDefault("")
  );

  const [status, setStatus] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [paymentStatus, setPaymentStatus] = useQueryState(
    "paymentStatus",
    searchParams.paymentStatus.withOptions({ shallow: false }).withDefault("")
  );

  const [paymentMethod, setPaymentMethod] = useQueryState(
    "paymentMethod",
    searchParams.paymentMethod.withOptions({ shallow: false }).withDefault("")
  );

  const [from, setFrom] = useQueryState(
    "from",
    searchParams.from.withOptions({ shallow: false }).withDefault("")
  );

  const [to, setTo] = useQueryState(
    "to",
    searchParams.to.withOptions({ shallow: false }).withDefault("")
  );

  const [minAmount, setMinAmount] = useQueryState(
    "minAmount",
    searchParams.minAmount.withOptions({ shallow: false }).withDefault("")
  );

  const [maxAmount, setMaxAmount] = useQueryState(
    "maxAmount",
    searchParams.maxAmount.withOptions({ shallow: false }).withDefault("")
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setPage(1);
    setLimit(10);
    setHotelId(null);
    setStatus(null);
    setPaymentStatus(null);
    setPaymentMethod(null);
    setFrom(null);
    setTo(null);
    setMinAmount(null);
    setMaxAmount(null);
  }, [
    setSearchQuery,
    setPage,
    setHotelId,
    setStatus,
    setPaymentStatus,
    setPaymentMethod,
    setFrom,
    setTo,
    setMinAmount,
    setMaxAmount,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      page > 1 ||
      limit !== 10 ||
      !!hotelId ||
      !!status ||
      !!paymentStatus ||
      !!paymentMethod ||
      !!from ||
      !!to ||
      !!minAmount ||
      !!maxAmount
    );
  }, [
    searchQuery,
    page,
    limit,
    hotelId,
    status,
    paymentStatus,
    paymentMethod,
    from,
    to,
    minAmount,
    maxAmount,
  ]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    // New Filters
    hotelId,
    setHotelId,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    paymentMethod,
    setPaymentMethod,
    from,
    setFrom,
    to,
    setTo,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,

    // Reset
    resetFilters,
    isAnyFilterActive,
  };
}

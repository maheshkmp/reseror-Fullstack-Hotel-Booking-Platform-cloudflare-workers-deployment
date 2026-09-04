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

  const [page, setPage] = useQueryState("page", searchParams.page.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", searchParams.limit.withDefault(10));

  const [status, setStatus] = useQueryState("status", searchParams.status);
  const [paymentStatus, setPaymentStatus] = useQueryState("paymentStatus", searchParams.paymentStatus);
  const [paymentMethod, setPaymentMethod] = useQueryState("paymentMethod", searchParams.paymentMethod);
  const [from, setFrom] = useQueryState("from", searchParams.from);
  const [to, setTo] = useQueryState("to", searchParams.to);
  const [minAmount, setMinAmount] = useQueryState("minAmount", searchParams.minAmount);
  const [maxAmount, setMaxAmount] = useQueryState("maxAmount", searchParams.maxAmount);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatus(null);
    setPaymentStatus(null);
    setPaymentMethod(null);
    setFrom(null);
    setTo(null);
    setMinAmount(null);
    setMaxAmount(null);
    setPage(1);
    setLimit(10);
  }, [setSearchQuery, setStatus, setPaymentStatus, setPaymentMethod, setFrom, setTo, setMinAmount, setMaxAmount, setPage, setLimit]);

  const isAnyFilterActive = useMemo(() => {
    return !!(
      searchQuery ||
      status ||
      paymentStatus ||
      paymentMethod ||
      from ||
      to ||
      minAmount ||
      maxAmount ||
      page > 1 ||
      limit !== 10
    );
  }, [searchQuery, status, paymentStatus, paymentMethod, from, to, minAmount, maxAmount, page, limit]);

  return {
    searchQuery, setSearchQuery,
    page, setPage,
    limit, setLimit,
    status, setStatus,
    paymentStatus, setPaymentStatus,
    paymentMethod, setPaymentMethod,
    from, setFrom,
    to, setTo,
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    resetFilters,
    isAnyFilterActive
  };
}

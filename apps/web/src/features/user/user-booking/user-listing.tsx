"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentType: "cash" | "online";
  bookingStatus: "confirmed" | "cancelled" | "completed" | "pending";
  specialRequests: string | null;
  createdAt: string;
  updatedAt: string | null;
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  hotel?: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
  };
  roomType?: {
    id: string;
    name: string;
    baseOccupancy: number;
    maxOccupancy: number;
  };
}

interface BookingsResponse {
  data: Booking[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function UserBookingListing() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [limit] = useState(10);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentPage) params.append("page", currentPage.toString());
      if (limit) params.append("limit", limit.toString());
      if (sortOrder) params.append("sort", sortOrder);
      if (searchQuery) params.append("search", searchQuery);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (paymentType) params.append("paymentType", paymentType);
      if (bookingStatus) params.append("bookingStatus", bookingStatus);

      const userId = session?.user?.id;
      if (!userId) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room-bookings/user/${userId}?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data: BookingsResponse = await response.json();
      setBookings(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  useEffect(() => {
    if (isSessionPending) return;

    if (!session) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    fetchBookings();
  }, [
    session,
    isSessionPending,
    currentPage,
    searchQuery,
    paymentStatus,
    paymentType,
    bookingStatus,
    sortOrder,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case "online":
        return "bg-blue-100 text-blue-800";
      case "cash":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Safe string slicing helper
  const safeSlice = (
    str: string | undefined | null,
    start: number,
    end?: number
  ) => {
    if (!str) return "N/A";
    return str.slice(start, end);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading bookings</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payment Types</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>

            <select
              value={bookingStatus}
              onChange={(e) => {
                setBookingStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Booking Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {(meta.currentPage - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.currentPage * meta.limit, meta.totalCount)} of{" "}
            {meta.totalCount} bookings
          </span>
          <button
            onClick={fetchBookings}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div
          className="h-full overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F7FAFC",
          }}
        >
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[15%]">
                  Booking ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[18%]">
                  Guest
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[15%]">
                  Hotel
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Room Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Dates
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[8%]">
                  Guests
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[10%]">
                  Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[8%]">
                  Payment
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[8%]">
                  Status
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[6%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <User className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No bookings found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <Calendar className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            #{safeSlice(booking.id, 0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {formatDate(booking.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900">
                        <div className="font-medium truncate">
                          {booking.guest
                            ? `${booking.guest.firstName} ${booking.guest.lastName}`
                            : `User ${safeSlice(booking.userId, 0, 8)}...`}
                        </div>
                        {booking.guest?.email && (
                          <div className="text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.guest.email}
                          </div>
                        )}
                        {booking.guest?.phone && (
                          <div className="text-gray-500 truncate flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.guest.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900">
                        <div className="font-medium truncate">
                          {booking.hotel
                            ? booking.hotel.name
                            : `Hotel ${safeSlice(booking.hotelId, 0, 8)}...`}
                        </div>
                        {booking.hotel && (
                          <div className="text-gray-500 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.hotel.city}, {booking.hotel.state}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900">
                        <div className="font-medium truncate">
                          {booking.roomType
                            ? booking.roomType.name
                            : `Room ${safeSlice(booking.roomTypeId, 0, 8)}...`}
                        </div>
                        {booking.roomType && (
                          <div className="text-gray-500 text-xs">
                            {booking.roomType.baseOccupancy}-
                            {booking.roomType.maxOccupancy} guests
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900">
                        <div className="font-medium">
                          {formatDate(booking.checkInDate)}
                        </div>
                        <div className="text-gray-500">
                          {formatDate(booking.checkOutDate)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {calculateNights(
                            booking.checkInDate,
                            booking.checkOutDate
                          )}{" "}
                          nights
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900">
                        {booking.numberOfGuests}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs font-semibold text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPaymentStatusBadge(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                        <div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPaymentTypeBadge(
                              booking.paymentType
                            )}`}
                          >
                            {booking.paymentType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getBookingStatusBadge(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/account/booking-details/${booking.id}`}
                        className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed Footer Section */}
      {meta.totalPages > 1 && (
        <div className="flex-shrink-0 mt-4">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <button
              onClick={() => handlePageChange(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { format } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default async function BookingDetailsPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room-bookings/${id}`,
    {
      headers: {
        cookie: cookieString,
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    // Render a friendly error / not found state
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-700 p-6 text-white">
              <h2 className="text-2xl font-semibold">Booking details</h2>
              <p className="mt-1 text-sm opacity-90">
                Unable to load booking <span className="font-mono">#{id}</span>
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="text-red-600 font-medium">
                Booking not found or an error occurred.
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/account/booking-details"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow"
                >
                  ← Back to bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const booking = await res.json();
  console.log("FETCHED BOOKING:", JSON.stringify(booking, null, 2));

  const checkIn = booking.checkInDate
    ? format(new Date(booking.checkInDate), "PPP")
    : "—";
  const checkOut = booking.checkOutDate
    ? format(new Date(booking.checkOutDate), "PPP")
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
          <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-sky-700 p-6 text-white">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-2xl font-semibold">
                  Booking #{booking.id}
                </h1>
                <p className="mt-1 text-sm opacity-90">
                  {booking.hotel?.name ?? booking.hotelName ?? "Unknown hotel"}
                </p>
                <p className="mt-2 text-sm opacity-80">
                  Guest:{" "}
                  <span className="font-medium">
                    {booking.guestName || booking.guest?.name || "—"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white`}
                >
                  {booking.status ?? "—"}
                </span>
                <Link
                  href="/account/booking-details"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Hotel image & basic */}
            <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-white rounded-lg flex items-center justify-center text-gray-400">
                Image
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {booking.hotel?.name ?? booking.hotelName ?? "—"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {booking.hotel?.city}, {booking.hotel?.country}
                </p>
              </div>
              <div className="mt-2">
                <a
                  href={`mailto:${booking.guestEmail || booking.hotel?.email || ""}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Middle: Reservation details */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Reservation
                  </h4>
                  <dl className="mt-3 text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Check-in</dt>
                      <dd className="font-medium">{checkIn}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Check-out</dt>
                      <dd className="font-medium">{checkOut}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Nights</dt>
                      <dd className="font-medium">
                        {booking.checkInDate && booking.checkOutDate
                          ? Math.max(
                              1,
                              Math.ceil(
                                (new Date(booking.checkOutDate).getTime() -
                                  new Date(booking.checkInDate).getTime()) /
                                  (1000 * 3600 * 24)
                              )
                            )
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Rooms</dt>
                      <dd className="font-medium">
                        {Array.isArray(booking.rooms)
                          ? booking.rooms.length
                          : (booking.numRooms ?? 1)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Payment & Status
                  </h4>
                  <dl className="mt-3 text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Total</dt>
                      <dd className="font-medium">
                        {booking.totalAmount
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(parseFloat(booking.totalAmount))
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Payment Type</dt>
                      <dd className="font-medium">
                        {booking.paymentType ?? "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Payment Status</dt>
                      <dd className="font-medium">
                        {booking.paymentStatus ?? "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Guest</h4>
                <div className="mt-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <div className="text-gray-500">Name</div>
                    <div className="font-medium">
                      {(booking.guestName || booking.guest?.name) ?? "—"}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium">
                      {(booking.guestEmail || booking.guest?.email) ?? "—"}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-gray-500">Phone</div>
                    <div className="font-medium">
                      {booking.guestPhone ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                    {booking.notes}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/account/booking-details"
                  className="px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-800"
                >
                  Back
                </Link>
                <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm">
                  Contact hotel
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6">
            <details className="bg-gray-50 p-4 rounded">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Raw booking data
              </summary>
              <pre className="mt-3 text-xs text-gray-700 overflow-auto max-h-64">
                {JSON.stringify(booking, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

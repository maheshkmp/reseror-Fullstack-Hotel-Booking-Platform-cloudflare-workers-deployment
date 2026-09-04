import { HotelDetailsComponent } from "@/features/hotels/components/hotel-details";
import { getClient } from "@/lib/rpc/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HotelDetailsPage({ params }: Props) {
  const { slug } = await params;

  const rpcClient = await getClient();

  const hotelRes = await rpcClient.api.hotels[":id"].$get({
    param: { id: slug },
  });

  if (!hotelRes.ok) {
    const errorData = await hotelRes.json();

    if (hotelRes.status === 404) {
      notFound();
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Hotel
          </h1>
          <p className="text-muted-foreground">{errorData.message}</p>
        </div>
      </div>
    );
  }

  const hotelData = await hotelRes.json();

  return <HotelDetailsComponent hotel={hotelData as any} />;
}

import { ManageHotelAmenities } from "@/features/hotels/components/dashboard-components/hotel-amenities";
import { ManageHotelImages } from "@/features/hotels/components/dashboard-components/hotel-images";
import { ManageHotelLanguages } from "@/features/hotels/components/dashboard-components/hotel-languages";
import { ManageHotelNearbyPOIs } from "@/features/hotels/components/dashboard-components/hotel-nearby-pois";
import { ManageHotelPolicies } from "@/features/hotels/components/dashboard-components/hotel-policies";
import { ManageHotelSafety } from "@/features/hotels/components/dashboard-components/hotel-safety";
import { ManageHotelSustainability } from "@/features/hotels/components/dashboard-components/hotel-sustainability";
import { ManageHotelTransport } from "@/features/hotels/components/dashboard-components/hotel-transport";
import { ManageHotelHouseRules } from "@/features/hotels/components/dashboard-components/hotel-house-rules";
import { ManageHotelPaymentMethods } from "@/features/hotels/components/dashboard-components/hotel-payment-methods";
import { ManageHotelFaqs } from "@/features/hotels/components/dashboard-components/hotel-faqs";
import { ManageHotelCommonAreas } from "@/features/hotels/components/dashboard-components/hotel-common-areas";
import { HotelUpdate } from "@/features/hotels/components/dashboard-components/hotel-update";

export default function ManageOwnedHotel() {
  return (
    <div className="space-y-3 pb-20">
      <HotelUpdate />
      <ManageHotelImages />

      <ManageHotelAmenities />
      <ManageHotelCommonAreas />
      <ManageHotelHouseRules />
      
      <ManageHotelLanguages />
      <ManageHotelSafety />

      <ManageHotelSustainability />
      <ManageHotelTransport />

      <ManageHotelPaymentMethods />
      <ManageHotelNearbyPOIs />
      <ManageHotelFaqs />
      <ManageHotelPolicies />
    </div>
  );
}

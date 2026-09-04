import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Reseror — We're Here to Help",
  description:
    "Reach out to Reseror for travel inquiries, booking support, brand collaborations, or general questions. Our team is available 24/7 at +94 712 568 568 or info@reseror.com.",
  openGraph: {
    title: "Contact Reseror — We're Here to Help",
    description:
      "Get in touch with Reseror. Toll-free: +94 712 568 568. Email: info@reseror.com. Based in Colombo, Sri Lanka.",
    url: "https://reseror.com/contact",
    siteName: "Reseror",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Reseror",
    description:
      "Reach our 24/7 support team for travel help, bookings, and partnerships.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

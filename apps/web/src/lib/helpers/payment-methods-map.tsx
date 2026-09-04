import React from "react";
import {
  CreditCard,
  History,
  Smartphone,
  Wallet,
} from "lucide-react";

// Inline SVG components for payment logos
export const VisaLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.422 15.845h2.181l1.364-8.484h-2.181l-1.364 8.484z" fill="#1434CB"/>
    <path d="M22.518 7.361h-2.06c-.636 0-1.114.182-1.393.856l-3.273 7.628h2.291l.455-1.261h2.793l.26 1.261h2.011l-1.084-8.484zm-3.235 5.564l.983-2.673c-.013.023.203-.549.327-.9l.17 1.258.49 2.315h-1.97z" fill="#1434CB"/>
    <path d="M10.124 10.978c.01-.893.791-1.012 1.542-1.042.827-.033 1.536.14 1.536.14l.271-1.68s-.681-.237-1.644-.237c-1.782 0-3.036.948-3.045 2.298-.01 1.002.894 1.562 1.577 1.895.702.341.938.56.936.865-.004.467-.56.671-1.076.671-1.42 0-2.203-.642-2.203-.642l-.286 1.776s.803.369 2.272.369c1.895 0 3.125-.935 3.138-2.383.01-1.168-.696-1.708-1.774-2.222-.897-.432-1.044-.567-1.04-.808z" fill="#1434CB"/>
    <path d="M4.17 15.845l1.047-6.505.109-.64.123-.194c.328-.521.905-1.127 1.954-1.127h3.333V7.379H7.31c-1.22 0-2.138.31-2.613 1.455L3.847 11.23l-.113.275-.402-2.035C3.155 8.435 2.652 7.361 1.348 7.361H0l.024.113c2.618.667 4.257 2.25 4.962 4.148l1.378-5.756.126.65L4.17 15.845z" fill="#1434CB"/>
  </svg>
);

export const MastercardLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8.5" cy="12" r="7" fill="#EB001B" fillOpacity="0.8"/>
    <circle cx="15.5" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/>
    <path d="M12 7.234a6.99 6.99 0 0 1 2.373 5.378s-.012.204-.029.388a6.99 6.99 0 0 1-2.344 5.234 6.99 6.99 0 0 1-2.373-5.378s.013-.204.029-.388A6.99 6.99 0 0 1 12 7.234z" fill="#FF5F00"/>
  </svg>
);

export const AmexLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="3" fill="#016FD0"/>
    <path d="M4.5 16.5L6.5 7.5H8.5L10.5 16.5H8.5L8 14H6.5L6 16.5H4.5ZM7 12.5H7.5L7.25 10L7 12.5Z" fill="white"/>
    <path d="M11.5 16.5L11 7.5H13L13.5 13.5L14 7.5H16L15.5 16.5H13.5L13 10.5L12.5 16.5H11.5Z" fill="white"/>
    <path d="M17.5 7.5H21.5V9H19.5V11H21V12.5H19.5V15H21.5V16.5H17.5V7.5Z" fill="white"/>
  </svg>
);

export const ApplePayLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.5 13.5C17.5 11.23 18.73 9.25 20.5 8.16C19.46 6.64 17.84 5.67 15.97 5.56C14.07 5.4 12.25 6.7 11.28 6.7C10.32 6.7 8.85 5.61 7.25 5.64C5.17 5.67 3.27 6.85 2.2 8.7C0.03 12.45 1.64 18 3.73 21C4.76 22.48 5.96 24.15 7.56 24.09C9.11 24.03 9.69 23.09 11.56 23.09C13.43 23.09 13.97 24.09 15.59 24.03C17.27 23.97 18.3 22.48 19.33 21C20.53 19.26 21.03 17.58 21.06 17.5C21.03 17.5 17.5 16.14 17.5 13.5Z" fill="black"/>
    <path d="M14.7 3.79C15.56 2.76 16.14 1.33 15.98 0C14.74 0.05 13.25 0.82 12.36 1.85C11.56 2.77 10.86 4.24 11.05 5.5C12.43 5.61 13.83 4.82 14.7 3.79Z" fill="black"/>
  </svg>
);

export const GooglePayLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.5 12V10H3.5V12H4.5Z" fill="#EA4335"/>
    <path d="M6 12V10H5V12H6Z" fill="#FBBC04"/>
    <path d="M7.5 12V10H6.5V12H7.5Z" fill="#34A853"/>
    <path d="M13.2 12C13.2 13.77 11.77 15.2 10 15.2C8.23 15.2 6.8 13.77 6.8 12C6.8 10.23 8.23 8.8 10 8.8C11.77 8.8 13.2 10.23 13.2 12Z" fill="#4285F4"/>
    <path d="M4.5 7.5V6.5H3.5V7.5H4.5Z" fill="#FBBC04"/>
    <path d="M12.5 7.2L10 9.7L7.5 7.2L8.2 6.5L10 8.3L11.8 6.5L12.5 7.2Z" fill="#34A853"/>
  </svg>
);

export const paymentMethodsList = [
  { id: "visa", label: "Visa", icon: VisaLogo },
  { id: "mastercard", label: "Mastercard", icon: MastercardLogo },
  { id: "american_express", label: "American Express", icon: AmexLogo },
  { id: "discover", label: "Discover", icon: CreditCard },
  { id: "maestro", label: "Maestro", icon: MastercardLogo },
  { id: "jcb", label: "JCB", icon: CreditCard },
  { id: "apple_pay", label: "Apple Pay", icon: ApplePayLogo },
  { id: "google_pay", label: "Google Pay", icon: GooglePayLogo },
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "bank_transfer", label: "Bank Transfer", icon: History },
];

export const getPaymentMethodLabel = (id: string) =>
  paymentMethodsList.find((m) => m.id === id)?.label || id;

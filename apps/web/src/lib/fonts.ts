import { Bricolage_Grotesque, DM_Sans, Playfair_Display } from "next/font/google";

export const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

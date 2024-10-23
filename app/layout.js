import {Rubik_Wet_Paint, Inter, Nosifer} from "next/font/google";
import "./globals.css";

const rubik = Rubik_Wet_Paint({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik",
});

const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nosifer",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Phobia Verse",
  description: "Discover and explore your fears!",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${nosifer.variable} ${inter.className} bg-black `}
      >
        {children}
      </body>
    </html>
  );
}

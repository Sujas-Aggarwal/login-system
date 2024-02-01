import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({ subsets: ["latin"],weight:['100','200','300','400','500','600','700','800','900'] });

export const metadata = {
  title: "OCS Tech Test",
  description: "A tech test for OCS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}

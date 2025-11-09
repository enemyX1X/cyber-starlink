import "./globals.css";
import Navbar from "../components/Navbar";
import BackgroundGrid from "../components/BackgroundGrid";

export const metadata = {
  title: "Cyber Starlink",
  description: "Next-Gen Intelligence Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans relative overflow-hidden">
        <BackgroundGrid />
        <div className="relative z-10">
          <Navbar />
          <main className="pt-20">{children}</main>
        </div>
      </body>
    </html>
  );
}

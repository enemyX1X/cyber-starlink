import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata = {
  title: "Cyber Starlink",
  description: "Next-Gen Intelligence Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans">
        <NavbarWrapper />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

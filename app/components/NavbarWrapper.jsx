"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar only on homepage
  if (pathname === "/") return null;

  return <Navbar />;
}

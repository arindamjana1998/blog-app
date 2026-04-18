"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const SidebarWrapper = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) return null;

  return (
    <>
      <Sidebar />
      <div className="w-64 flex-shrink-0" /> {/* Spacer for fixed sidebar */}
    </>
  );
};

export default SidebarWrapper;

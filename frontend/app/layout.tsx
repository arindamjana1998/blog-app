import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMS - Approval Workflow",
  description:
    "Advanced Content Management System with RBAC and 2-step approval",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex min-h-screen">
            <SidebarWrapper />
            <main className="flex-1 transition-all duration-300">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

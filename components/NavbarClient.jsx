"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { Home, Info, Phone, HelpCircle, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "About", path: "/about", icon: <Info className="w-5 h-5" /> },
  { name: "Contact", path: "/contact", icon: <Phone className="w-5 h-5" /> },
  { name: "FAQ's", path: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
  { name: "Documents", path: "/document-repository", icon: <HelpCircle className="w-5 h-5" /> },
];

export default function NavbarClient() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          setDbUser(data.data); // Ensure data.data
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [isSignedIn]);
  
  

  const renderDashboardLink = () => {
    if (!dbUser?.role) return null;

    const baseBtn =
      "px-4 py-2 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition";

    return (
      <div className="flex gap-2">
        {dbUser?.role === "SUPER_ADMIN" ? (
          <>
            <Link href="/dashboard" className={baseBtn}>
              Dashboard
            </Link>
            <Link href="/dashboard/admin" className={baseBtn}>
              Super Admin
            </Link>
          </>
        ) : dbUser?.role === "GUARD" ? (
          <Link href="/dashboard/guard" className={baseBtn}>
            Guard Dashboard
          </Link>
        ) : dbUser?.role === "SOCIETY_ADMIN" ? (
          <div className="flex gap-2">
            <Link href="/dashboard/society-admin" className={baseBtn}>
              Society Admin
            </Link>
            <Link href="/dashboard" className={baseBtn}>
              Dashboard
            </Link>
          </div>
        ) : (
          <Link href="/dashboard" className={baseBtn}>
            Dashboard
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex gap-4 items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
              pathname === item.path
                ? "bg-blue-700 text-white shadow-lg"
                : "text-blue-900 hover:bg-blue-200"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Desktop User Section */}
      <div className="hidden sm:flex items-center gap-4">
        {isSignedIn && renderDashboardLink()}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link
            href="/sign-up"
            className="ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-red-600 transition-all duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-900 hover:text-blue-700 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden bg-blue-50/80 backdrop-blur-md px-6 pb-4 rounded-b-xl shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300",
                  pathname === item.path
                    ? "bg-blue-700 text-white"
                    : "text-blue-900 hover:bg-blue-200"
                )}
              >
                {item.icon} {item.name}
              </Link>
            ))}

            {isSignedIn && <div className="mt-4">{renderDashboardLink()}</div>}

            {isSignedIn ? (
              <div className="mt-2 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="mt-2 block text-center w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-red-600 transition"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const NavLinks = [
  { href: "/Dashboard/Home", label: "Profile" },
  { href: "/NewsFeed", label: "Home" },
  { href: "/Dashboard/Admin", label: "Admin Dashboard" },
  { href: "/userSettings", label: "Settings" },
];

export default function NavComp({}) {
  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/Login",
    });
  };

  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  if (!session) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 left right-0 z-40 transition-transform duration-300 shadow-md ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Logo
              </Link>
            </div>
            <nav className="hidden md:flex md:items-center md:space-x-6">
              {NavLinks.map((link) => {
                if (
                  link.href === "/Dashboard/Admin" &&
                  session?.user?.isAdmin !== "admin"
                ) {
                  return null;
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                      pathname === link.href ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </nav>
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {NavLinks.map((link) => {
                if (
                  link.href === "/Dashboard/Admin" &&
                  session?.user?.isAdmin !== "admin"
                ) {
                  return null;
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      pathname === link.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

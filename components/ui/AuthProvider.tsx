"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = [
    "/Signup",
    "/Login",
    "/LandingPage",
    "/",
    "/ResetPassword",
  ].includes(pathname);

  useEffect(() => {
    if (status === "loading") return;

    if (!session && !isPublicRoute) {
      router.push("/Login");
    } else if (session && isPublicRoute) {
      router.push("/Dashboard/Home");
    }
  }, [session, status, router, pathname, isPublicRoute]);

  if (status === "loading") {
    return null;
  }

  return children;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

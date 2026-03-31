"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export function useIsAdmin() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/role");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.role === "admin");
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [isSignedIn, isLoaded]);

  return { isAdmin, isLoading };
}


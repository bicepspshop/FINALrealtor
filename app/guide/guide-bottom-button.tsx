"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GuideBottomButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/user-session");
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Ignore errors
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <Button 
        variant="luxury"
        className="bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-goldMuted dark:hover:bg-luxury-royalBlueMuted theme-transition shadow-md hover:shadow-lg mt-4" 
        disabled
      >
        <span className="opacity-70">Загрузка...</span>
      </Button>
    );
  }

  return (
    <Link href={isAuthenticated ? "/dashboard" : "/register"}>
      <Button 
        variant="luxury"
        className="bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-goldMuted dark:hover:bg-luxury-royalBlueMuted theme-transition shadow-md hover:shadow-lg mt-4"
      >
        {isAuthenticated ? "Перейти к работе" : "Начать бесплатно"}
      </Button>
    </Link>
  );
}

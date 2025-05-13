"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserInfo {
  name: string;
}

export function GuideUserNavButton() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user-session");
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setUser({ name: data.name });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <span className="inline-block w-32 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  if (user) {
    return (
      <Link href="/dashboard">
        <Button 
          variant="outline" 
          className="border border-white/40 text-white hover:bg-white/10 transition-colors duration-300"
          title="Личный кабинет"
        >
          Личный кабинет: {user.name}
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button 
          variant="outline" 
          className="border border-white/40 text-white hover:bg-white/10 transition-colors duration-300"
        >
          Войти
        </Button>
      </Link>
      <Link href="/register">
        <Button 
          variant="luxury"
          className="theme-transition"
        >
          Зарегистрироваться
        </Button>
      </Link>
    </>
  );
}

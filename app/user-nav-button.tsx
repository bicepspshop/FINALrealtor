"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, UserCircle, UserPlus } from "lucide-react";

interface UserInfo {
  name: string;
}

export function UserNavButton() {
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
      <span className="inline-block w-24 h-10 rounded bg-white/20 dark:bg-moonstone/20 animate-pulse border border-white/30 dark:border-moonstone/30" />
    );
  }

  if (user) {
    return (
      <Link href="/dashboard">
        <Button variant="outline" className="border-white dark:border-moonstone text-white dark:text-moonstone hover:bg-white dark:hover:bg-moonstone hover:text-luxury-black dark:hover:text-dark-graphite theme-transition font-medium px-6" title="Личный кабинет">
          <UserCircle className="sm:mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Личный кабинет:&nbsp;<span className="font-semibold">{user.name}</span></span>
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="outline" className="border-white dark:border-moonstone text-white dark:text-moonstone hover:bg-white dark:hover:bg-moonstone hover:text-luxury-black dark:hover:text-dark-graphite theme-transition flex items-center" title="Войти">
          <LogIn className="sm:mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Войти</span>
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="luxury" className="bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-goldMuted dark:hover:bg-luxury-royalBlueMuted theme-transition flex items-center" animation="scale" title="Регистрация">
          <UserPlus className="sm:mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Регистрация</span>
        </Button>
      </Link>
    </>
  );
} 
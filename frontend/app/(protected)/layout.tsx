'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import BottomNav from '../../components/layout/BottomNav.jsx';
import Header from '../../components/layout/Header.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import { api } from '../../lib/api.js';
import { getToken } from '../../lib/auth.js';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const apiClient = (path: string, init: RequestInit = {}) => {
  const target = new URL(path, apiBaseUrl).toString();

  return fetch(target, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    } as HeadersInit,
  });
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me');
        setUser(response.data?.user || null);
      } catch (error) {
        console.error('Erro a carregar utilizadora', error);
        router.replace('/login');
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen lg:flex gap-6">
      <Sidebar />
      <div className="flex-1 px-5 md:px-8 pb-24 space-y-6">
        <Header userName={user?.name} />
        <main className="space-y-6 rounded-[var(--radius-24)]">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

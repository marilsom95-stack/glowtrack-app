'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Header from '../../components/layout/Header.jsx';
import BottomNav from '../../components/layout/BottomNav.jsx';
import { getToken } from '../../lib/auth.js';
import { api } from '../../lib/api.js';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Erro a carregar utilizadora', error);
        router.replace('/login');
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="flex-1 px-5 md:px-10 pb-20">
        <Header userName={user?.name} />
        <main>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

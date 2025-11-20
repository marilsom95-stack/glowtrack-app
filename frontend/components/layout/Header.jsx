'use client';

import Link from 'next/link';
import Button from '../ui/Button';
import { clearToken } from '../../lib/auth.js';
import { useRouter } from 'next/navigation';

export default function Header({ userName = 'Glow Lover' }) {
  const router = useRouter();
  const logout = () => {
    clearToken();
    router.push('/login');
  };
  return (
    <header className="flex items-center justify-between py-6">
      <div>
        <p className="text-sm text-[#7A7687]">Olá,</p>
        <h1 className="text-2xl font-semibold">{userName}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link className="text-sm text-[#7A7687]" href="/profile">
          Perfil
        </Link>
        <Button variant="secondary" onClick={logout}>
          Terminar sessão
        </Button>
      </div>
    </header>
  );
}

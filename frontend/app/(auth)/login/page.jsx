'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api.js';
import { setToken } from '../../../lib/auth.js';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', form);
      setToken(response.data.token);
      router.push('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EEDF] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white shadow-glow p-8 space-y-4"
      >
        <h1 className="text-2xl font-semibold">Entrar no GlowTrack</h1>
        <Input label="Email" name="email" type="email" required value={form.email} onChange={handleChange} />
        <Input
          label="Palavra-passe"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="w-full" type="submit">
          Entrar
        </Button>
        <p className="text-sm text-center text-[#7A7687]">
          Ainda não tens conta? <Link href="/register">Cria agora</Link>
        </p>
      </form>
    </div>
  );
}

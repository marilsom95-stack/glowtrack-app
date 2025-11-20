'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { clearToken } from '../../../lib/auth.js';

const languageOptions = [
  { label: 'Português', value: 'pt' },
  { label: 'Inglês', value: 'en' },
];

const skinOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Oleosa', value: 'oleosa' },
  { label: 'Seca', value: 'seca' },
  { label: 'Mista', value: 'mista' },
  { label: 'Sensível', value: 'sensível' },
];

export default function ProfilePage() {
  const router = useRouter();
  const preferencesRef = useRef(null);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/auth');
      const payload = response?.data || response;
      const profile = payload?.user || payload;
      const languageValue = profile?.language || 'pt';
      setUser(profile ? { ...profile, language: languageValue } : null);
      setLanguage(languageValue);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);
    setStatus('');
    try {
      await api.put('/user/preferences', {
        skinType: user.skinType,
        goals: user.goals || [],
        language,
      });
      setStatus('Preferências atualizadas.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  const handleEditClick = () => {
    preferencesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const preferenceItems = useMemo(
    () => [
      { label: 'Idioma', value: languageOptions.find((opt) => opt.value === language)?.label || 'Português' },
      { label: 'Tipo de pele', value: user?.skinType || 'Não definido' },
      {
        label: 'Objetivos',
        value: user?.goals?.length ? user.goals.join(', ') : 'Sem objetivos definidos',
      },
      { label: 'Subscrição', value: user?.subscription || 'Gratuita' },
    ],
    [language, user]
  );

  if (loading) {
    return (
      <Card title="Perfil">
        <p className="text-[#7A7687]">A carregar perfil...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Perfil">
        <p className="text-[#E65F5C]">{error}</p>
        <Button className="mt-3" onClick={loadProfile}>
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-4">
      <Card
        title="Resumo da conta"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleEditClick}>
              Editar perfil
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Terminar sessão
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#7A7687]">Nome</p>
            <p className="text-lg font-semibold">{user.name || 'Glow Lover'}</p>
          </div>
          <div>
            <p className="text-sm text-[#7A7687]">Email</p>
            <p className="text-lg font-semibold break-words">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-[#7A7687]">Idioma preferido</p>
            <p className="text-lg font-semibold">{preferenceItems[0].value}</p>
          </div>
          <div>
            <p className="text-sm text-[#7A7687]">Subscrição</p>
            <p className="text-lg font-semibold">{preferenceItems[3].value}</p>
          </div>
        </div>
      </Card>

      <Card title="Preferências" muted>
        <ul className="space-y-3">
          {preferenceItems.map((item) => (
            <li key={item.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#7A7687]">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Atualizar preferências">
        <div ref={preferencesRef} className="grid gap-4 md:grid-cols-2">
          <Input label="Nome" value={user.name} readOnly />
          <Input label="Email" value={user.email} readOnly />
          <Select
            label="Tipo de pele"
            value={user.skinType}
            options={skinOptions}
            onChange={(event) => setUser({ ...user, skinType: event.target.value })}
          />
          <Input
            label="Objetivos"
            value={user.goals?.join(', ') || ''}
            onChange={(event) =>
              setUser({
                ...user,
                goals: event.target.value
                  .split(',')
                  .map((goal) => goal.trim())
                  .filter(Boolean),
              })
            }
          />
          <Select
            label="Idioma"
            value={language}
            options={languageOptions}
            onChange={(event) => setLanguage(event.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={handleUpdate} disabled={saving}>
          {saving ? 'A atualizar...' : 'Guardar alterações'}
        </Button>
        {status && <p className="text-sm text-[#7A7687] mt-2">{status}</p>}
      </Card>
    </div>
  );
}

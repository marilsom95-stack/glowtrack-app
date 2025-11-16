'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { api } from '../../../lib/api.js';

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
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const response = await api.get('/user/me');
      setUser(response.data.user);
    };
    loadProfile();
  }, []);

  if (!user) return <p>A carregar perfil...</p>;

  const handleUpdate = async () => {
    try {
      await api.put('/user/preferences', {
        skinType: user.skinType,
        goals: user.goals || [],
      });
      setStatus('Preferências atualizadas.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Os teus dados">
        <div className="grid gap-4 md:grid-cols-2">
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
        </div>
        <Button className="mt-4" onClick={handleUpdate}>
          Atualizar
        </Button>
        {status && <p className="text-sm text-[#7A7687] mt-2">{status}</p>}
      </Card>
      <Card title="Idioma do app">
        <Select
          label="Seleciona"
          value={language}
          options={languageOptions}
          onChange={(event) => setLanguage(event.target.value)}
        />
        <p className="text-sm text-[#7A7687] mt-2">
          Idioma preferido guardado localmente: {language.toUpperCase()}
        </p>
      </Card>
    </div>
  );
}

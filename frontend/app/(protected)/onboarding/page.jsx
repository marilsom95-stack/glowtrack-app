'use client';

import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { api } from '../../../lib/api';

const skinOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Oleosa', value: 'oleosa' },
  { label: 'Seca', value: 'seca' },
  { label: 'Mista', value: 'mista' },
  { label: 'Sensível', value: 'sensível' },
];

export default function OnboardingPage() {
  const [form, setForm] = useState({ gender: '', age: '', skinType: 'normal', goals: '' });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      goals: form.goals
        .split(',')
        .map((goal) => goal.trim())
        .filter(Boolean),
    };
    try {
      await api.post('/skin/onboarding', payload);
      setStatus('Perfil guardado com sucesso.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Card title="Primeiros passos Glow">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <Input label="Género" name="gender" value={form.gender} onChange={handleChange} placeholder="ex: feminino" />
        <Input label="Idade" name="age" type="number" value={form.age} onChange={handleChange} />
        <Select label="Tipo de pele" name="skinType" value={form.skinType} onChange={handleChange} options={skinOptions} />
        <Input
          label="Objetivos (separar por vírgulas)"
          name="goals"
          value={form.goals}
          onChange={handleChange}
          placeholder="hidratar, glow, acne"
        />
        <div className="md:col-span-2">
          <Button type="submit">Guardar informações</Button>
          {status && <p className="text-sm text-[#7A7687] mt-2">{status}</p>}
        </div>
      </form>
    </Card>
  );
}

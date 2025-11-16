'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { api } from '../../../lib/api.js';

export default function WellbeingPage() {
  const [form, setForm] = useState({ mood: '', note: '' });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/lifestyle/wellbeing', form);
      setMessage('Diário atualizado com sucesso.');
      setForm({ mood: '', note: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Card title="Autoestima & diário">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Humor do dia" name="mood" value={form.mood} onChange={handleChange} />
        <Input
          label="Nota rápida"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Como te sentes hoje?"
        />
        <Button type="submit">Guardar registo</Button>
        {message && <p className="text-sm text-[#7A7687]">{message}</p>}
      </form>
    </Card>
  );
}

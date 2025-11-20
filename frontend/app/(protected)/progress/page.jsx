'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { api } from '../../../lib/api.js';

export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');

  const loadProgress = async () => {
    try {
      const response = await api.get('/progress');
      setData(response.data);
    } catch (error) {
      console.error('Não foi possível carregar progresso', error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const submitCheckIn = async () => {
    try {
      await api.post('/progress/check-in', { mood: 'confiante', note });
      setNote('');
      loadProgress();
    } catch (error) {
      console.error('Não foi possível guardar o check-in', error);
    }
  };

  const submitPhoto = async () => {
    try {
      if (!photo) return;
      await api.post('/progress/photos', { url: photo });
      setPhoto('');
      loadProgress();
    } catch (error) {
      console.error('Não foi possível guardar a foto', error);
    }
  };

  if (!data) return <p>A acompanhar o teu progresso...</p>;

  return (
    <div className="space-y-4">
      <Card title="Streak atual">
        <p className="text-4xl font-semibold">{data.progress.streak} dias</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {(data.achievements || []).map((achievement) => (
            <Badge key={achievement}>{achievement}</Badge>
          ))}
        </div>
      </Card>
      <Card title="Check-in rápido">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input label="Nota" value={note} onChange={(event) => setNote(event.target.value)} />
          <Button onClick={submitCheckIn}>Guardar</Button>
        </div>
      </Card>
      <Card title="Fotos e referências">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input label="Link da foto" value={photo} onChange={(event) => setPhoto(event.target.value)} />
          <Button onClick={submitPhoto}>Adicionar</Button>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-[#7A7687]">
          {data.photos.map((item) => (
            <li key={item._id}>{item.url}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

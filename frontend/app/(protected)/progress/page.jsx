'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { api } from '../../../lib/api';

const placeholderPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60',
    label: 'Primeiro registo',
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=60',
    label: 'Semana 2',
  },
  {
    url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=60',
    label: 'Semana 4',
  },
];

export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/progress');
      setData(response?.data ?? response);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o progresso.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const submitCheckIn = async () => {
    try {
      await api.post('/api/progress/check-in', { mood: 'confiante', note });
      setNote('');
      loadProgress();
    } catch (err) {
      setError(err.message || 'Não foi possível guardar o check-in.');
    }
  };

  const submitPhoto = async () => {
    try {
      if (!photo) return;
      await api.post('/api/progress/photos', { url: photo });
      setPhoto('');
      loadProgress();
    } catch (err) {
      setError(err.message || 'Não foi possível guardar a foto.');
    }
  };

  const displayedPhotos = useMemo(() => {
    if (!data?.photos?.length) return placeholderPhotos;
    return data.photos.map((item, index) => ({
      url: item.url,
      label: item.label || `Registo ${index + 1}`,
    }));
  }, [data?.photos]);

  const userStats = useMemo(
    () => ({
      age: data?.user?.age ?? '24 anos',
      skinType: data?.user?.skinType ?? 'Mista',
      nationality: data?.user?.nationality ?? 'Portugal',
    }),
    [data?.user],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Os teus dados">
          {loading ? (
            <p className="text-sm text-[#7A7687]">A carregar dados...</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 text-sm text-[#120D26] md:grid-cols-3">
              <div className="rounded-lg bg-[color:var(--surface-muted)] p-3">
                <p className="text-xs text-[#7A7687]">Idade</p>
                <p className="text-lg font-semibold">{userStats.age}</p>
              </div>
              <div className="rounded-lg bg-[color:var(--surface-muted)] p-3">
                <p className="text-xs text-[#7A7687]">Tipo de pele</p>
                <p className="text-lg font-semibold">{userStats.skinType}</p>
              </div>
              <div className="rounded-lg bg-[color:var(--surface-muted)] p-3">
                <p className="text-xs text-[#7A7687]">Nacionalidade</p>
                <p className="text-lg font-semibold">{userStats.nationality}</p>
              </div>
            </div>
          )}
        </Card>
        <Card title="Atalhos rápidos">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Button variant="secondary">Notificações</Button>
            <Button variant="secondary">Plano premium</Button>
            <Button variant="secondary">Estatísticas gerais</Button>
          </div>
        </Card>
        <Card title="Streak atual">
          {loading ? (
            <p className="text-sm text-[#7A7687]">A acompanhar o teu progresso...</p>
          ) : (
            <>
              <p className="text-4xl font-semibold">{data?.progress?.streak ?? 0} dias</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(data?.achievements || []).length ? (
                  data.achievements.map((achievement) => <Badge key={achievement}>{achievement}</Badge>)
                ) : (
                  <p className="text-sm text-[#7A7687]">Nenhuma medalha atribuída ainda.</p>
                )}
              </div>
            </>
          )}
        </Card>
      </div>

      {error && (
        <Card muted>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#E43D3D]">{error}</p>
            <Button variant="secondary" onClick={loadProgress}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      )}

      <Card title="Carrossel de fotos">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayedPhotos.map((item) => (
            <div
              key={item.url}
              className="min-w-[200px] max-w-[220px] overflow-hidden rounded-xl border border-[color:var(--border-muted)] bg-white shadow-sm"
            >
              <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.url})` }} />
              <div className="p-3">
                <p className="text-sm font-medium text-[#120D26]">{item.label}</p>
                <p className="text-xs text-[#7A7687]">Foto ou referência</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <Input label="Link da foto" value={photo} onChange={(event) => setPhoto(event.target.value)} />
          <Button onClick={submitPhoto}>Adicionar</Button>
        </div>
      </Card>

      <Card title="Check-in rápido">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input label="Nota" value={note} onChange={(event) => setNote(event.target.value)} />
          <Button onClick={submitCheckIn}>Guardar</Button>
        </div>
      </Card>
    </div>
  );
}

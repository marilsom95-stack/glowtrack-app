'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Tabs from '../../../components/ui/Tabs';
import { api } from '../../../lib/api.js';

const fallbackDiagnosis = {
  questions: [
    'Sua pele costuma ficar oleosa no fim do dia?',
    'Você sente ressecamento após lavar o rosto?',
    'Percebe sensibilidade ou vermelhidão frequente?',
    'Costuma usar protetor solar diariamente?',
  ],
  result: {
    skinType: 'Pele mista',
    summary: 'Sua pele tem tendência a oleosidade na zona T e áreas secas nas bochechas. Combine limpeza suave com hidratação equilibrada e proteção solar diária.',
    recommendations: [
      'Use um gel de limpeza suave de manhã e à noite.',
      'Aposte em hidratantes leves e não comedogênicos.',
      'Finalize com protetor solar FPS 50 todos os dias.',
    ],
  },
  selfieResult: {
    headline: 'Análise pronta',
    summary: 'Sua selfie indica textura uniforme e poucas áreas de sensibilidade. Podemos otimizar a rotina para equilibrar hidratação e controle de brilho.',
  },
};

const tabs = [
  { value: 'questionnaire', label: 'Questionário' },
  { value: 'selfie', label: 'Selfie' },
];

export default function DiagnosisPage() {
  const [activeTab, setActiveTab] = useState('questionnaire');
  const [diagnosis, setDiagnosis] = useState(fallbackDiagnosis);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selfieStatus, setSelfieStatus] = useState('idle');

  const loadDiagnosis = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await api.get('/api/diagnosis');
      const source = payload?.data ?? payload ?? {};
      setDiagnosis({
        questions: source.questions?.length ? source.questions : fallbackDiagnosis.questions,
        result: source.result ?? fallbackDiagnosis.result,
        selfieResult: source.selfieResult ?? fallbackDiagnosis.selfieResult,
      });
    } catch (fetchError) {
      console.error('Não foi possível carregar o diagnóstico', fetchError);
      setError(fetchError.message || 'Não foi possível carregar o diagnóstico.');
      setDiagnosis(fallbackDiagnosis);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnosis();
  }, []);

  const handleCreateRoutine = () => {
    console.info('Mock: criar rotina com base no diagnóstico');
  };

  const handleSendSelfie = () => {
    console.info('Mock: enviar selfie para nova análise');
    setSelfieStatus('sending');
    setTimeout(() => setSelfieStatus('done'), 800);
  };

  const { questions, result, selfieResult } = diagnosis;

  const questionList = useMemo(
    () =>
      questions.map((question, index) => ({
        id: `${index + 1}`,
        text: question,
      })),
    [questions]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-[#7A7687]">Diagnóstico</p>
          <h1 className="text-2xl font-extrabold text-[#221C35]">Entenda a saúde da sua pele</h1>
        </div>
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 text-[#8C1F1F]" title="Erro ao carregar diagnóstico">
          <p className="text-sm">{error}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={loadDiagnosis}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'questionnaire' && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <Card title="Questionário de pele">
            {loading ? (
              <div className="space-y-3 text-sm text-muted">Carregando perguntas...</div>
            ) : (
              <ul className="space-y-3">
                {questionList.map((question) => (
                  <li
                    key={question.id}
                    className="flex items-start gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-3"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F8E5] text-[#1C7C3A]">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#7A7687]">
                        Pergunta {question.id}
                      </p>
                      <p className="text-sm text-[#221C35]">{question.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Resultado">
            {loading ? (
              <p className="text-sm text-muted">Gerando diagnóstico...</p>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl bg-[#F2E8FF] px-4 py-3 text-[#3E2C5E]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7A7687]">Tipo de pele</p>
                  <p className="text-xl font-extrabold">{result.skinType}</p>
                  <p className="mt-1 text-sm text-[#3E2C5E]">{result.summary}</p>
                </div>
                <ul className="space-y-2 text-sm text-[#7A7687]">
                  {result.recommendations?.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-[#5E3FC4]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={handleCreateRoutine}>
                  Criar rotina
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'selfie' && (
        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <Card title="Envie uma selfie">
            <div className="space-y-4">
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] text-center text-sm text-[#7A7687]">
                <div>
                  <p className="font-semibold text-[#3E2C5E]">Área para upload</p>
                  <p className="text-sm text-[#7A7687]">
                    Tire uma selfie em boa iluminação para avaliarmos textura e oleosidade.
                  </p>
                </div>
              </div>
              <Button disabled={selfieStatus === 'sending'} onClick={handleSendSelfie}>
                {selfieStatus === 'sending' ? 'Enviando...' : 'Enviar selfie'}
              </Button>
            </div>
          </Card>

          <Card title="Resumo da análise">
            {loading ? (
              <p className="text-sm text-muted">Aguardando resultados...</p>
            ) : (
              <div className="space-y-3 text-sm text-[#3E2C5E]">
                <div className="rounded-2xl bg-[#EAF7FF] px-4 py-3 text-[#114B7A]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#114B7A]">
                    {selfieResult.headline}
                  </p>
                  <p className="mt-1 text-[#0B304E]">{selfieResult.summary}</p>
                </div>
                <div className="rounded-2xl bg-[color:var(--surface-muted)] px-4 py-3 text-[#7A7687]">
                  {selfieStatus === 'done'
                    ? 'Selfie enviada! Em instantes você verá recomendações personalizadas.'
                    : 'Envie uma selfie para receber um resumo rápido da sua pele.'}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

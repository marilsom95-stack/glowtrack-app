'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import { api } from '../../../lib/api.js';

export default function DiagnosisPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/skin/questions');
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Não foi possível carregar o questionário', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/skin/diagnosis', { answers });
      setResult(response.data);
    } catch (error) {
      console.error('Não foi possível gerar o diagnóstico', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Questionário de pele">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question} className="flex flex-col gap-2">
              <label className="text-sm font-medium">{question}</label>
              <div className="flex gap-3">
                {['sim', 'não'].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleAnswer(question, option)}
                    className={`px-4 py-2 rounded-full border ${
                      answers[question] === option ? 'bg-[#DCC6E0]' : 'bg-white'
                    }`}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button type="submit">Gerar diagnóstico</Button>
        </form>
      </Card>
      {result && (
        <Card title={`Tipo de pele: ${result.skinType}`}>
          <ul className="list-disc pl-5 text-sm text-[#7A7687] space-y-1">
            {result.recommendations.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

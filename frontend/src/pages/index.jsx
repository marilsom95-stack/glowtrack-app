import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';
import { saveToken } from '../lib/authStorage';
import { setAuthToken } from '../lib/api';

const toggleWrapper = {
  display: 'flex',
  marginBottom: '1.5rem',
  borderRadius: '999px',
  backgroundColor: '#f0f1f7',
  padding: '0.25rem'
};

const toggleButton = (active) => ({
  flex: 1,
  padding: '0.75rem',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: active ? '#fff' : 'transparent',
  fontWeight: active ? 600 : 500,
  color: active ? '#1e1e2f' : '#6c6c80'
});

const HomePage = () => {
  const [mode, setMode] = useState('login');
  const router = useRouter();

  const handleAuthSuccess = (_user, token) => {
    saveToken(token);
    setAuthToken(token);
    router.push('/dashboard');
  };

  return (
    <Layout>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>GlowTrack — cuida da tua pele de forma inteligente</h1>
        <p style={{ color: '#6c6c80' }}>
          Acompanha rotinas, entende necessidades da tua pele e recebe recomendações personalizadas.
        </p>
      </div>

      <div style={toggleWrapper}>
        <button type="button" style={toggleButton(mode === 'login')} onClick={() => setMode('login')}>
          Entrar
        </button>
        <button type="button" style={toggleButton(mode === 'register')} onClick={() => setMode('register')}>
          Criar conta
        </button>
      </div>

      <AuthForm mode={mode} onAuthSuccess={handleAuthSuccess} />
    </Layout>
  );
};

export default HomePage;

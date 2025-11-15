import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

const fieldStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  marginBottom: '1rem'
};

const inputStyles = {
  padding: '0.75rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid #d5d8eb',
  fontSize: '1rem'
};

const buttonStyles = {
  padding: '0.85rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '1rem'
};

const secondaryButtonStyles = {
  ...buttonStyles,
  backgroundColor: '#fff',
  border: '1px solid #d5d8eb',
  color: '#1e1e2f'
};

const AuthForm = ({ mode = 'login', onAuthSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({ name: '', email: '', password: '' });
    setError('');
  }, [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register'
        ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }
        : { email: formData.email.trim(), password: formData.password };

      const response = await apiClient.post(endpoint, payload);
      const { user, token } = response?.data?.data || {};

      if (user && token) {
        onAuthSuccess(user, token);
      } else {
        setError('Resposta inesperada do servidor.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Não foi possível completar o pedido.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(28, 49, 94, 0.1)' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{mode === 'register' ? 'Criar conta' : 'Entrar'}</h2>
        <p style={{ color: '#6c6c80' }}>
          {mode === 'register' ? 'Começa a acompanhar a tua rotina de skincare.' : 'Bem-vindo de volta ao GlowTrack.'}
        </p>
      </div>

      {mode === 'register' && (
        <div style={fieldStyles}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ex.: Sofia Glow"
            style={inputStyles}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div style={fieldStyles}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          style={inputStyles}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyles}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="******"
          minLength={6}
          style={inputStyles}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <div style={{ color: '#d64545', marginBottom: '1rem', fontSize: '0.95rem' }}>{error}</div>
      )}

      <button
        type="submit"
        style={{ ...buttonStyles, backgroundColor: '#1e1e2f', color: '#fff', width: '100%', marginBottom: '1rem' }}
        disabled={submitting}
      >
        {submitting ? 'A carregar...' : mode === 'register' ? 'Criar conta' : 'Entrar'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          type="button"
          style={secondaryButtonStyles}
          onClick={() => console.log('Google OAuth placeholder')}
        >
          Continuar com Google
        </button>
        <button
          type="button"
          style={secondaryButtonStyles}
          onClick={() => console.log('Apple OAuth placeholder')}
        >
          Continuar com Apple
        </button>
      </div>
    </form>
  );
};

export default AuthForm;

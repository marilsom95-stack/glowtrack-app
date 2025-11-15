import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { apiClient, clearAuthToken, setAuthToken } from '../lib/api';
import { clearToken, getToken } from '../lib/authStorage';

const cardStyles = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 10px 30px rgba(28, 49, 94, 0.08)',
  marginBottom: '1.5rem'
};

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/');
      return;
    }

    setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/auth/me');
        setUser(response?.data?.data?.user || null);
      } catch (error) {
        console.error('Failed to load profile', error);
        clearToken();
        clearAuthToken();
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    clearToken();
    clearAuthToken();
    router.push('/');
  };

  return (
    <Layout>
      <div>
        <div style={cardStyles}>
          {loading && <p>A carregar a tua conta...</p>}
          {!loading && user && (
            <>
              <p style={{ color: '#6c6c80', margin: 0 }}>Sessão iniciada</p>
              <h2 style={{ marginTop: '0.25rem' }}>Olá, {user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Provider: {user.provider}</p>
              <button
                type="button"
                onClick={handleLogout}
                style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#1e1e2f', color: '#fff', cursor: 'pointer' }}
              >
                Terminar sessão
              </button>
            </>
          )}
        </div>

        <div style={cardStyles}>
          <h3>Onboarding de skincare</h3>
          <p style={{ color: '#6c6c80' }}>
            Esta secção será utilizada no próximo passo para recolher informação sobre a tua pele e rotina.
          </p>
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              border: '1px dashed #c8cbe0',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            OnboardingSection
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

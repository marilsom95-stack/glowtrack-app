import React from 'react';

const layoutStyles = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f4f6fb',
  color: '#1e1e2f',
  fontFamily: 'Inter, Arial, sans-serif'
};

const headerStyles = {
  padding: '1.5rem 2rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  fontWeight: 600,
  fontSize: '1.25rem'
};

const mainStyles = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem'
};

const contentStyles = {
  width: '100%',
  maxWidth: '420px'
};

const footerStyles = {
  padding: '1rem 2rem',
  textAlign: 'center',
  fontSize: '0.85rem',
  color: '#6c6c80'
};

const Layout = ({ children }) => {
  return (
    <div style={layoutStyles}>
      <header style={headerStyles}>GlowTrack</header>
      <main style={mainStyles}>
        <div style={contentStyles}>{children}</div>
      </main>
      <footer style={footerStyles}>GlowTrack © {new Date().getFullYear()}</footer>
    </div>
  );
};

export default Layout;

'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#FF6600',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      margin: 0,
      padding: 0
    }}>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
        
        html {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <h1 style={{
        fontSize: '100px',
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        fontFamily: 'Univers, Arial, sans-serif'
      }}>
        FadeFraud
      </h1>
      <Link href="/login">
        <button style={{
          backgroundColor: 'white',
          color: '#FF6600',
          padding: '1rem 2.5rem',
          borderRadius: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#f8f8f8'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          Log in
        </button>
      </Link>
    </main>
  );
}
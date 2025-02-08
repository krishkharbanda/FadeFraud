export const metadata = {
    title: 'Login Page',
    description: 'User login for the application',
  };
  
  export default function Login() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#FF6600',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#FF6600' }}>Login</h1>
          <form>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <input type="text" name="username" style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" name="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <button type="submit" style={{
              backgroundColor: '#FF6600',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
            }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
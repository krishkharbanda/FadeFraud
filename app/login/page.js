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
        backgroundColor: '#F8F9FA',
        backgroundImage: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          backdropFilter: 'blur(10px)', // Glassmorphism effect
          border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: 'scale(1)',
          ':hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          },
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Text shadow for better contrast
          }}>
            Login
          </h1>
          <form>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'white', 
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', // Text shadow for better contrast
              }}>
                Username
              </label>
              <input 
                type="text" 
                name="username" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255, 255, 255, 0.3)', 
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent input background
                  color: 'white',
                  transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  ':focus': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)', // Placeholder color
                  },
                }} 
                placeholder="Enter your username"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'white', 
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', // Text shadow for better contrast
              }}>
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255, 255, 255, 0.3)', 
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent input background
                  color: 'white',
                  transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  ':focus': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)', // Placeholder color
                  },
                }} 
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent button background
                color: 'white',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
                ':active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
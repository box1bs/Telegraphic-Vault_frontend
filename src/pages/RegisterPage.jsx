import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(formData);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      alert('Register failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div style={styles.pageContainer}>
        {/* Background animation */}
        <div style={styles.backgroundAnimation}></div>

        <div style={styles.formWrapper}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <span style={styles.logoEmoji}>♝</span>
              <h1 style={styles.title}>Hello, dear user</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                    style={styles.input}
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                    style={styles.input}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
              </div>

              <button
                  type="submit"
                  style={{
                    ...styles.button,
                    ...(isLoading ? styles.buttonDisabled : {})
                  }}
                  disabled={isLoading}
              >
                {isLoading ? 'Registering in...' : 'Register'}
              </button>
            </form>

            <p style={styles.linkText}>
              Do you have an account?{' '}
              <a href="/login" style={styles.link}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0c',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundAnimation: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, #1a1a1c 0%, #0a0a0c 100%)',
    animation: 'rotate 20s linear infinite',
    zIndex: 1,
  },
  formWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '440px',
    margin: '20px',
    zIndex: 2,
  },
  formContainer: {
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoEmoji: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#e4e4e7',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  input: {
    backgroundColor: 'rgba(58, 58, 60, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '16px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      backgroundColor: 'rgba(58, 58, 60, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  button: {
    backgroundColor: '#007AFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
    '&:hover': {
      backgroundColor: '#0066CC',
    },
  },
  buttonDisabled: {
    backgroundColor: '#4A4A4C',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  linkText: {
    color: '#a1a1aa',
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '24px',
  },
  link: {
    color: '#007AFF',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg)',
    },
  },
};

export default RegisterPage;
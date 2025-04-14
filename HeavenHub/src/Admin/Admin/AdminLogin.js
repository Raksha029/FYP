import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear any existing admin sessions on component mount
  useEffect(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }, []);

  const handleChange = (e) => {
    setError(''); // Clear error when user types
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      // Inside handleSubmit after successful login
      if (response.ok) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminData', JSON.stringify(data.admin));
          
          // Create login notification
          try {
              await fetch('http://localhost:4000/api/notifications/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${data.token}`
                  },
                  body: JSON.stringify({
                      userId: data.admin._id
                  })
              });
          } catch (error) {
              console.error('Error creating login notification:', error);
          }

          navigate('/admin/dashboard');
          toast.success('Login successful');
      }
      else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.logo}>
        <svg 
          className={styles.logoIcon} 
          viewBox="0 0 24 24" 
          width="40" 
          height="40"
        >
            <path fill="currentColor" d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3l-3-2.7zM17 18h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z"/>
        </svg>
        HeavenHub
      </div>
      <div className={styles.loginBox}>
        <h2>Admin Portal</h2>
        <p className={styles.subtitle}>Welcome back! Please enter your credentials</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Username</label>
            <div className={styles.inputWithIcon}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputWithIcon}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={styles.demoCredentials}>
          {"Demo credentials: admin123 / Admin@123"}
        </p>
      </div>
      <div className={styles.footer}>
        © {new Date().getFullYear()} HeavenHub. All rights reserved.
      </div>
    </div>
  );
};

export default AdminLogin;
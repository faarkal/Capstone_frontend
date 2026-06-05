import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage('login');
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      {user ? (
        <Home user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      ) : page === 'signup' ? (
        <SignUp onSwitchToLogin={() => setPage('login')} onSignUpSuccess={handleLoginSuccess} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setPage('signup')} />
      )}
    </>
  );
};

export default App;

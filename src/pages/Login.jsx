import { useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';

const Login = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      // LOGIN GAGAL

      if (!response.ok) {
        setError(data.detail || 'Login gagal');

        setLoading(false);

        return;
      }

      // SIMPAN TOKEN

      localStorage.setItem('token', data.access_token);

      // SIMPAN USER

      localStorage.setItem('user', JSON.stringify(data.user));

      // LOGIN BERHASIL

      onLoginSuccess(data.user);
    } catch (err) {
      console.log(err);

      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login To SaveWatch</h2>

      <h4 className="form-title">with</h4>

      <form className="login-form" onSubmit={handleSubmit}>

        <InputField type="email" name="email" placeholder="Email address" icon="mail" value={formData.email} onChange={handleChange} />


        <InputField type="password" name="password" placeholder="Password" icon="lock" value={formData.password} onChange={handleChange} />

        {error && <p className="error-msg">{error}</p>}

        <a href="#" className="forgot-pass-link">
          Forgot your password?
        </a>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p className="separator">
        <span>Or Login Use</span>
      </p>

      <SocialLogin onLoginSuccess={onLoginSuccess} />

      <p className="signup-text">
        Don&apos;t have an account?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();

            onSwitchToSignUp();
          }}
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  onSwitchToSignUp: PropTypes.func.isRequired,
};

export default Login;

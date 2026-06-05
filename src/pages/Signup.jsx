import { useState } from 'react';
import SocialLogin from '../components/SocialLogin';
import PropTypes from 'prop-types';

const SignUp = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Nama wajib diisi';
    if (!formData.email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Format email tidak valid';
    if (!formData.password) e.password = 'Password wajib diisi';
    else if (formData.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (!formData.confirmPassword) e.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Password tidak cocok';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          nama: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.detail || 'Register gagal');
        return;
      }

      alert('Register berhasil');

      onSwitchToLogin();
    } catch (error) {
      console.log(error);

      alert('Server error');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Create Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input type="text" name="name" placeholder="Full Name" className="input-field" value={formData.name} onChange={handleChange} />

          <i className="material-symbols-rounded">person</i>
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="input-wrapper">
          <input type="email" name="email" placeholder="Email address" className="input-field" value={formData.email} onChange={handleChange} />

          <i className="material-symbols-rounded">mail</i>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="input-wrapper">
          <input type="password" name="password" placeholder="Password" className="input-field" value={formData.password} onChange={handleChange} />

          <i className="material-symbols-rounded">lock</i>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="input-wrapper">
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input-field" value={formData.confirmPassword} onChange={handleChange} />

          <i className="material-symbols-rounded">lock</i>
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>

        <button className="login-button" type="submit">
          Sign Up
        </button>
      </form>

      <p className="separator">
        <span>Or Sign Up With</span>
      </p>
      <h4 className="form-title">with</h4>
      <SocialLogin onLoginSuccess={onSignUpSuccess} />

      <p className="signup-text">
        Already have an account?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
          }}
        >
          Login
        </a>
      </p>
    </div>
  );
};

SignUp.propTypes = {
  onSwitchToLogin: PropTypes.func.isRequired,
  onSignUpSuccess: PropTypes.func.isRequired,
};

export default SignUp;

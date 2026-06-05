import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import PropTypes from 'prop-types';

const SocialLogin = ({ onLoginSuccess }) => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // ambil data user google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        // kirim ke backend fastapi
        const response = await axios.post('http://127.0.0.1:8000/google-login', {
          nama: userInfo.data.name,
          email: userInfo.data.email,
        });

        // simpan token backend
        localStorage.setItem('token', response.data.access_token);

        // simpan data user
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // redirect/login sukses
        onLoginSuccess(response.data.user);
      } catch (error) {
        console.error('Gagal login Google:', error.response?.data || error);
      }
    },

    onError: (error) => {
      console.error('Login gagal:', error);
    },
  });

  return (
    <div className="social-login">
      <button className="social-button" type="button" onClick={() => handleGoogleLogin()}>
        <img src="google.svg" alt="Google" className="social-icon" />
        Google
      </button>
    </div>
  );
};

SocialLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default SocialLogin;

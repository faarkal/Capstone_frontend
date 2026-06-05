import PropTypes from 'prop-types';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} title={isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}>
      <span className="material-symbols-rounded">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
    </button>
  );
};

ThemeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggle;

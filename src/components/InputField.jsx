import { useState } from 'react';
import PropTypes from 'prop-types';

const InputField = ({ type, placeholder, icon, name, value, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input type={type === 'password' ? (isPasswordShown ? 'text' : 'password') : type} name={name} placeholder={placeholder} className="input-field" value={value} onChange={onChange} required />

      <i className="material-symbols-rounded">{icon}</i>

      {type === 'password' && (
        <i onClick={() => setIsPasswordShown((prev) => !prev)} className="material-symbols-rounded eye-icon">
          {isPasswordShown ? 'visibility_off' : 'visibility'}
        </i>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;

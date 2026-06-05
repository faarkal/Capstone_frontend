import { useState } from 'react';
import PropTypes from 'prop-types';

const AddCamera = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'USB Camera',
    location: '',
    status: 'Aktif',
  });

  const [errors, setErrors] = useState({});

  const availableLocations = ['Ruang Tamu', 'Kamar', 'Dapur', 'Garasi', 'Halaman Depan', 'Halaman Belakang', 'Ruang Keluarga'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama camera wajib diisi';
    if (!formData.code.trim()) newErrors.code = 'Kode camera wajib diisi';
    if (!formData.location) newErrors.location = 'Lokasi camera wajib dipilih';
    return newErrors;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newErrors = validate();
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const newCamera = {
  //     id: Date.now(),
  //     name: formData.name,
  //     code: formData.code,
  //     type: formData.type,
  //     location: formData.location,
  //     status: formData.status
  //   };

  //   onAdd(newCamera);
  //   onClose();
  //   setFormData({
  //     name: '',
  //     code: '',
  //     type: 'USB Camera',
  //     location: '',
  //     status: 'Aktif'
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newCamera = {
      nama_camera: formData.name,
      lokasi: formData.location,
      rtp_url: formData.code,
      status: formData.status,
    };

    onAdd(newCamera);

    onClose();

    setFormData({
      name: '',
      code: '',
      type: 'USB Camera',
      location: '',
      status: 'Aktif',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="camera-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tambah Camera</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Nama Camera <span className="required">*</span>
              </label>
              <input type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Contoh: Ruang Tamu" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Kode Camera <span className="required">*</span>
              </label>
              <input type="text" name="code" className={`form-input ${errors.code ? 'error' : ''}`} placeholder="Contoh: CAM-04" value={formData.code} onChange={handleChange} />
              {errors.code && <p className="form-error">{errors.code}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Tipe Camera</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="type" value="USB Camera" checked={formData.type === 'USB Camera'} onChange={handleChange} />
                  <span>USB Camera</span>
                  <small className="radio-desc">Camera USB / Webcam</small>
                </label>
                <label className="radio-label">
                  <input type="radio" name="type" value="IP Camera" checked={formData.type === 'IP Camera'} onChange={handleChange} />
                  <span>IP Camera</span>
                  <small className="radio-desc">Camera jaringan / WiFi</small>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Lokasi Camera <span className="required">*</span>
              </label>
              <select name="location" className={`form-select ${errors.location ? 'error' : ''}`} value={formData.location} onChange={handleChange}>
                <option value="">Pilih lokasi camera</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location && <p className="form-error">{errors.location}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="status-group">
                <label className="status-radio">
                  <input type="radio" name="status" value="Aktif" checked={formData.status === 'Aktif'} onChange={handleChange} />
                  <span className="status-badge-radio active">Aktif</span>
                </label>
                <label className="status-radio">
                  <input type="radio" name="status" value="Nonaktif" checked={formData.status === 'Nonaktif'} onChange={handleChange} />
                  <span className="status-badge-radio inactive">Nonaktif</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save">
              Simpan Camera
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddCamera.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddCamera;

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const EditCamera = ({ isOpen, onClose, onEdit, cameraData }) => {
  const [formData, setFormData] = useState({
    nama_camera: '',
    lokasi: '',
    rtp_url: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  const availableLocations = ['Ruang Tamu', 'Kamar', 'Dapur', 'Garasi', 'Halaman Depan', 'Halaman Belakang', 'Ruang Keluarga', 'Kamar Mandi'];

  // =========================
  // ISI DATA SAAT EDIT
  // =========================

  useEffect(() => {
    if (cameraData) {
      setFormData({
        nama_camera: cameraData.nama_camera || '',
        lokasi: cameraData.lokasi || '',
        rtp_url: cameraData.rtp_url || '',
        status: cameraData.status || 'active',
      });
    }
  }, [cameraData]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // =========================
  // VALIDASI
  // =========================

  const validate = () => {
    const newErrors = {};

    if (!formData.nama_camera.trim()) {
      newErrors.nama_camera = 'Nama camera wajib diisi';
    }

    if (!formData.lokasi) {
      newErrors.lokasi = 'Lokasi camera wajib dipilih';
    }

    if (!formData.rtp_url.trim()) {
      newErrors.rtp_url = 'RTP URL wajib diisi';
    }

    return newErrors;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedCamera = {
      ...cameraData,
      nama_camera: formData.nama_camera,
      lokasi: formData.lokasi,
      rtp_url: formData.rtp_url,
      status: formData.status,
    };

    onEdit(updatedCamera);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Camera</h2>

          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* NAMA CAMERA */}

            <div className="form-group">
              <label className="form-label">
                Nama Camera <span className="required">*</span>
              </label>

              <input type="text" name="nama_camera" className={`form-input ${errors.nama_camera ? 'error' : ''}`} placeholder="Contoh: Ruang Tamu" value={formData.nama_camera} onChange={handleChange} />

              {errors.nama_camera && <p className="form-error">{errors.nama_camera}</p>}
            </div>

            {/* LOKASI */}

            <div className="form-group">
              <label className="form-label">
                Lokasi Camera <span className="required">*</span>
              </label>

              <select name="lokasi" className={`form-select ${errors.lokasi ? 'error' : ''}`} value={formData.lokasi} onChange={handleChange}>
                <option value="">Pilih lokasi camera</option>

                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {errors.lokasi && <p className="form-error">{errors.lokasi}</p>}
            </div>

            {/* Kode Camera */}

            <div className="form-group">
              <label className="form-label">
                Kode Camera <span className="required">*</span>
              </label>

              <input type="text" name="rtp_url" className={`form-input ${errors.rtp_url ? 'error' : ''}`} placeholder="rtsp://..." value={formData.rtp_url} onChange={handleChange} />

              {errors.rtp_url && <p className="form-error">{errors.rtp_url}</p>}
            </div>

            {/* STATUS */}

            <div className="form-group">
              <label className="form-label">Status</label>

              <div className="status-group">
                <label className="status-radio">
                  <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange} />

                  <span className="status-badge-radio active">Aktif</span>
                </label>

                <label className="status-radio">
                  <input type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange} />

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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditCamera.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  cameraData: PropTypes.func.isRequired,
};

export default EditCamera;

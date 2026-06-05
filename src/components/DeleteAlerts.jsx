import { useEffect } from 'react';
import PropTypes from 'prop-types';

const DeleteAlerts = ({ isOpen, onClose, onConfirm, alertData }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !alertData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-delete-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-delete-header">
          <div className="delete-icon">
            <span className="material-symbols-rounded">warning</span>
          </div>
          <h2>Hapus Alerts</h2>
        </div>

        <div className="modal-delete-body">
          <p className="delete-question">Apakah Anda yakin untuk menghapus Alerts</p>
          <p className="delete-alert-name">
            &quot;{alertData.location} {alertData.camera}&quot;
          </p>

          <div className="delete-warning">
            <span className="material-symbols-rounded">info</span>
            <p>Alerts yang dihapus tidak dapat dipulihkan dan semua data terkait akan hilang.</p>
          </div>

          <div className="delete-details">
            <div className="delete-detail-item">
              <span className="detail-icon">
                <span className="material-symbols-rounded">event</span>
              </span>
              <div className="detail-text">
                <label>Jenis Kejadian</label>
                <span>{alertData.type}</span>
              </div>
            </div>
            <div className="delete-detail-item">
              <span className="detail-icon">
                <span className="material-symbols-rounded">location_on</span>
              </span>
              <div className="detail-text">
                <label>Lokasi</label>
                <span>{alertData.location}</span>
              </div>
            </div>
            <div className="delete-detail-item">
              <span className="detail-icon">
                <span className="material-symbols-rounded">videocam</span>
              </span>
              <div className="detail-text">
                <label>Camera</label>
                <span>{alertData.camera}</span>
              </div>
            </div>
            <div className="delete-detail-item">
              <span className="detail-icon">
                <span className="material-symbols-rounded">schedule</span>
              </span>
              <div className="detail-text">
                <label>Waktu</label>
                <span>{new Date(alertData.time).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-delete-footer">
          <button className="btn-cancel-delete" onClick={onClose}>
            Batal
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            <span className="material-symbols-rounded">delete</span>
            Hapus Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
DeleteAlerts.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,

  alertData: PropTypes.shape({
    location: PropTypes.string,
    camera: PropTypes.string,
    type: PropTypes.string,
    time: PropTypes.string,
  }),
};

export default DeleteAlerts;

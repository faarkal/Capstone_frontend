import PropTypes from 'prop-types';

const DeleteCamera = ({ isOpen, onClose, onConfirm, cameraData }) => {
  if (!isOpen) return null;

  // =========================
  // HANDLE DELETE
  // =========================

  const handleConfirm = () => {
    onConfirm(cameraData.id_camera);

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-center">
          <span className="material-symbols-rounded">delete_forever</span>
        </div>

        <div className="modal-body delete-body">
          <h2>Hapus Camera</h2>

          <p className="delete-question">
            Apakah Anda yakin untuk menghapus Camera <br />
            <strong>&quot;{cameraData?.nama_camera}&quot;</strong>?
          </p>

          <p className="delete-warning">Camera yang dihapus tidak akan dapat dipantau dan semua data terkait akan hilang.</p>
        </div>

        <div className="modal-footer delete-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Batal
          </button>

          <button type="button" className="btn-delete" onClick={handleConfirm}>
            <span className="material-symbols-rounded">delete</span>
            Hapus Camera
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================
// PROP TYPES
// =========================

DeleteCamera.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,

  cameraData: PropTypes.shape({
    id_camera: PropTypes.number,
    nama_camera: PropTypes.string,
  }),
};

export default DeleteCamera;

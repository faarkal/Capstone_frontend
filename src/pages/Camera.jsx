import { useState, useEffect } from 'react';

import AddCamera from '../components/AddCamera';
import EditCamera from '../components/EditCamera';
import DeleteCamera from '../components/DeleteCamera';

const Camera = () => {
  const [cameras, setCameras] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCamera, setSelectedCamera] = useState(null);

  // =========================
  // GET CAMERA
  // =========================

  // const fetchCameras = async () => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     const response = await fetch('http://127.0.0.1:8000/camera', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     setCameras(data);
  //   } catch (error) {
  //     console.log('Error fetch camera:', error);
  //   }
  // };

  const fetchCameras = async () => {
    try {
      const token = localStorage.getItem('token');

      // CEK TOKEN
      if (!token) {
        console.log('Token tidak ada');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/camera', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // CEK ERROR
      if (!response.ok) {
        console.log(data);
        setCameras([]);
        return;
      }

      // PASTIKAN ARRAY
      setCameras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error fetch camera:', error);

      setCameras([]);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // =========================
  // ADD CAMERA
  // =========================

  const handleAddCamera = async (newCamera) => {
    console.log(newCamera);
    try {
      const token = localStorage.getItem('token');

      // Ubah 'Aktif' menjadi 'active' agar sesuai dengan pengecekan statistik kamu
      const statusFormatted = newCamera.status === 'Aktif' ? 'active' : 'inactive';

      const response = await fetch('http://127.0.0.1:8000/camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_camera: newCamera.nama_camera,
          lokasi: newCamera.lokasi,
          rtp_url: newCamera.rtp_url,
          status: statusFormatted, // ✅ SEKARANG STATUS SUDAH DIKIRIM!
        }),
      });

      const data = await response.json();
      console.log(data);

      fetchCameras();
      setIsAddModalOpen(false);
    } catch (error) {
      console.log('Error add camera:', error);
    }
  };

  // =========================
  // EDIT CAMERA
  // =========================

  const handleEditCamera = async (updatedCamera) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://127.0.0.1:8000/camera/${updatedCamera.id_camera}`, {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          nama_camera: updatedCamera.nama_camera,
          lokasi: updatedCamera.lokasi,
          status: updatedCamera.status,
        }),
      });

      const data = await response.json();

      console.log(data);

      fetchCameras();

      setIsEditModalOpen(false);
    } catch (error) {
      console.log('Error edit camera:', error);
    }
  };

  // =========================
  // DELETE CAMERA
  // =========================

  const handleDeleteCamera = async (id_camera) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://127.0.0.1:8000/camera/${id_camera}`, {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

      fetchCameras();

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log('Error delete camera:', error);
    }
  };

  // =========================
  // OPEN MODAL
  // =========================

  const openEditModal = (camera) => {
    setSelectedCamera(camera);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (camera) => {
    setSelectedCamera(camera);
    setIsDeleteModalOpen(true);
  };

  // =========================
  // STATISTIK
  // =========================

  const totalCamera = cameras.length;

  const cameraAktif = cameras.filter((cam) => cam.status === 'active').length;

  const cameraNonaktif = cameras.filter((cam) => cam.status !== 'active').length;

  const jumlahLokasi = [...new Set(cameras.map((cam) => cam.lokasi))].length;

  return (
    <div className="camera-page">
      <div className="camera-header">
        <h1>Camera</h1>

        <p className="camera-subtitle">Kelola Camera yang digunakan untuk memantau aktivitas</p>
      </div>

      {/* CARD STATISTIK */}

      <div className="camera-stats-grid">
        <div className="camera-stat-card total">
          <div className="stat-icon">
            <span className="material-symbols-rounded">videocam</span>
          </div>

          <div className="stat-info">
            <h3>Total Camera</h3>
            <div className="stat-number">{totalCamera}</div>
          </div>
        </div>

        <div className="camera-stat-card aktif">
          <div className="stat-icon">
            <span className="material-symbols-rounded">check_circle</span>
          </div>

          <div className="stat-info">
            <h3>Camera Aktif</h3>
            <div className="stat-number">{cameraAktif}</div>
          </div>
        </div>

        <div className="camera-stat-card nonaktif">
          <div className="stat-icon">
            <span className="material-symbols-rounded">cancel</span>
          </div>

          <div className="stat-info">
            <h3>Camera Nonaktif</h3>
            <div className="stat-number">{cameraNonaktif}</div>
          </div>
        </div>

        <div className="camera-stat-card lokasi">
          <div className="stat-icon">
            <span className="material-symbols-rounded">location_on</span>
          </div>

          <div className="stat-info">
            <h3>Jumlah Lokasi</h3>
            <div className="stat-number">{jumlahLokasi}</div>
          </div>
        </div>
      </div>

      {/* TABLE CAMERA */}

      <div className="camera-table-container">
        <div className="table-header">
          <h2>Daftar Camera</h2>

          <button className="btn-add-camera" onClick={() => setIsAddModalOpen(true)}>
            <span className="material-symbols-rounded">add</span>
            Tambah Camera
          </button>
        </div>

        <div className="table-responsive">
          <table className="camera-table">
            <thead>
              <tr>
                <th>Nama Camera</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {cameras.map((camera) => (
                <tr key={camera.id_camera}>
                  <td>
                    <div className="camera-name-cell">
                      <span className="material-symbols-rounded">videocam</span>

                      {camera.nama_camera}
                    </div>
                  </td>

                  <td>{camera.lokasi}</td>

                  <td>
                    <span className={`status-badge ${camera.status === 'active' ? 'active' : 'inactive'}`}>{camera.status}</span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Edit" onClick={() => openEditModal(camera)}>
                        <span className="material-symbols-rounded">edit</span>
                      </button>

                      <button className="action-btn delete" title="Hapus" onClick={() => openDeleteModal(camera)}>
                        <span className="material-symbols-rounded">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      <AddCamera isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCamera} />

      <EditCamera isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onEdit={handleEditCamera} cameraData={selectedCamera} />

      <DeleteCamera isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteCamera} cameraData={selectedCamera} />
    </div>
  );
};

export default Camera;

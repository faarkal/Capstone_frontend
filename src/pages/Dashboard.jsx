import { useEffect, useState } from 'react';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [activeCamera, setActiveCamera] = useState(null);

  // Ambil data kamera dari Backend
  const fetchCameras = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/camera', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCameras(data);
        const defaultCam = data.find((cam) => cam.status === 'active' || cam.status === 'Aktif') || data[0];
        setActiveCamera(defaultCam);
      }
    } catch (error) {
      console.error('Error fetching cameras for dashboard:', error);
    }
  };

  // FIX: Ambil riwayat kejadian awal agar dashboard tidak kosong saat di-refresh
  const fetchRecentEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/events', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        // Berikan mapping fallback properti "type" agar terbaca oleh UI dashboard Anda
        const mappedData = data.map((item) => ({
          ...item,
          type: item.jenis_event,
        }));
        setEvents(mappedData);
      }
    } catch (error) {
      console.error('Error fetching recent events:', error);
    }
  };

  useEffect(() => {
    fetchCameras();
    fetchRecentEvents(); // Jalankan saat mount
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);
    ws.onmessage = (event) => {
      const dataAlert = JSON.parse(event.data);
      setEvents((prevEvents) => [dataAlert, ...prevEvents]);
    };
    return () => ws.close();
  }, []);

  const isDanger = events.length > 0 && (events[0].type === 'Jatuh' || events[0].type === 'Asap / Api');
  const totalCameraCount = cameras.length;
  const activeCameraCount = cameras.filter((cam) => cam.status === 'active' || cam.status === 'Aktif').length;

  return (
    <>
      <div className="dashboard-header">
        <h1>Dashboard Real-time</h1>
        <p className="dashboard-subtitle">Overview sistem pemantauan keselamatan lansia secara langsung</p>
      </div>

      <div className="stats-grid">
        <div className={`stat-card ${isDanger ? 'danger' : 'safe'}`}>
          <div className="stat-content">
            <h3>Status Rumah</h3>
            <div className="stat-value">{isDanger ? 'Bahaya!' : 'Aman'}</div>
          </div>
        </div>

        <div className="stat-card camera">
          <div className="stat-content">
            <h3>Camera Aktif</h3>
            <div className="stat-value">
              {activeCameraCount} / {totalCameraCount}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="camera-section">
          <h2>Live Camera</h2>

          {totalCameraCount > 1 && (
            <div className="camera-selector" style={{ marginBottom: '15px' }}>
              <label>Pilih Tampilan Kamera:</label>
              <select
                value={activeCamera?.id_camera || activeCamera?.id || ''}
                onChange={(e) => {
                  const selected = cameras.find((cam) => (cam.id_camera || cam.id) === parseInt(e.target.value));
                  setActiveCamera(selected);
                }}
              >
                {cameras.map((cam) => (
                  <option key={cam.id_camera || cam.id} value={cam.id_camera || cam.id}>
                    {cam.nama_camera} ({cam.lokasi})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="video-container" style={{ marginBottom: '20px' }}>
            {activeCamera ? (
              <>
                <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  {activeCamera.nama_camera} - {activeCamera.lokasi}
                </h3>
                <img src={`http://127.0.0.1:8000/api/video_feed?camera_id=${activeCamera.id_camera}`} alt="Live CCTV SafeWatch" style={{ width: '100%', borderRadius: '8px', border: '2px solid #333' }} />
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f5' }}>
                <p>Belum ada kamera yang didaftarkan atau status kamera nonaktif.</p>
              </div>
            )}
          </div>
        </div>

        <div className="notification-section">
          <h2>Notifikasi Hari Ini (Real-time)</h2>
          <div className="notification-list">
            {events.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>Belum ada kejadian bahaya terdeteksi.</p>
            ) : (
              events.map((notif, idx) => (
                <div key={idx} className="notification-item">
                  <div className="notif-content">
                    <div style={{ fontWeight: 'bold' }}>{notif.type}</div>
                    <p style={{ fontSize: '12px' }}>{notif.deskripsi || `Terdeteksi ${notif.jenis_event}`}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

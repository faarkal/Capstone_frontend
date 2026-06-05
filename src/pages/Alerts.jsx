import { useState, useEffect } from 'react';
import DeleteAlerts from '../components/DeleteAlerts';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);

  const formatAlertData = (item) => ({
    id: item.id_event || item.id,
    type: item.jenis_event || item.type, // Menangani perbedaan kunci
    location: item.location || `Ruangan Kamera ${item.id_camera}`,
    camera: item.camera || `CAM-0${item.id_camera}`,
    time: item.waktu_event || item.time,
    status: item.status === 'baru' ? 'Belum Dibaca' : 'Sudah Dibaca',
    icon: item.jenis_event === 'Jatuh' ? 'personal_injury' : 'local_fire_department',
    deskripsi: item.deskripsi || 'Tidak ada deskripsi',
    confidence: item.confidence || 0,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const fetchAlertsFromBackend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/events', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((item) => formatAlertData(item));
        setAlerts(formattedData);
      }
    } catch (error) {
      console.error('Gagal memuat riwayat:', error);
    }
  };

  useEffect(() => {
    fetchAlertsFromBackend(); // Ambil riwayat

    const token = localStorage.getItem('token');
    if (!token) return;

    let ws;
    const connect = () => {
      ws = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

      ws.onopen = () => console.log('WebSocket Terhubung');

      ws.onmessage = (event) => {
        try {
          const dataAlert = JSON.parse(event.data);
          const formatted = formatAlertData(dataAlert);
          setAlerts((prev) => [formatted, ...prev]);
        } catch (e) {
          console.error(e);
        }
      };

      ws.onclose = () => {
        console.log('WS Terputus, mencoba reconnect dalam 3 detik...');
        setTimeout(connect, 3000); // RECONNECT OTOMATIS
      };

      ws.onerror = (err) => console.error('WS Error:', err);
    };

    connect();
    return () => ws && ws.close();
  }, []);

  const totalAlerts = alerts.length;
  const unreadAlerts = alerts.filter((alert) => alert.status === 'Belum Dibaca').length;
  const readAlerts = alerts.filter((alert) => alert.status === 'Sudah Dibaca').length;

  const getFilteredAlerts = () => {
    let filtered = alerts;
    if (filter === 'belum_dibaca') {
      filtered = filtered.filter((alert) => alert.status === 'Belum Dibaca');
    } else if (filter === 'sudah_dibaca') {
      filtered = filtered.filter((alert) => alert.status === 'Sudah Dibaca');
    }
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((alert) => alert.type.toLowerCase().includes(searchQuery.toLowerCase()) || alert.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  };

  const filteredAlerts = getFilteredAlerts();

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/${id}?status_event=dibaca`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: 'Sudah Dibaca' } : alert)));
      }
    } catch (error) {
      console.error('Gagal mengupdate status event:', error);
    }
  };

  const openDeleteModal = (alert) => {
    setAlertToDelete(alert);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (alertToDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${alertToDelete.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          setAlerts(alerts.filter((alert) => alert.id !== alertToDelete.id));
          setIsDeleteModalOpen(false);
          setAlertToDelete(null);
        }
      } catch (error) {
        console.error('Gagal menghapus event:', error);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAlertToDelete(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const openDetail = (alert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
    if (alert.status === 'Belum Dibaca') {
      markAsRead(alert.id);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      default:
        return '#6b7280';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical':
        return '#fee2e2';
      case 'high':
        return '#ffedd5';
      case 'medium':
        return '#fef9c3';
      default:
        return '#f1f5f9';
    }
  };

  const alertTypes = [...new Set(alerts.map((alert) => alert.type))];
  const alertLocations = [...new Set(alerts.map((alert) => alert.location))];
  const searchSuggestions = [...new Set([...alertTypes, ...alertLocations])];

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h1>Alerts</h1>
        <p className="alerts-subtitle">Daftar Kejadian bahaya yang terdeteksi oleh sistem</p>
      </div>

      <div className="alerts-stats-grid">
        <div className="alerts-stat-card total">
          <div className="stat-icon">
            <span className="material-symbols-rounded">notifications</span>
          </div>
          <div className="stat-info">
            <h3>Total Alert</h3>
            <div className="stat-number">{totalAlerts}</div>
          </div>
        </div>
        <div className="alerts-stat-card unread">
          <div className="stat-icon">
            <span className="material-symbols-rounded">mark_email_unread</span>
          </div>
          <div className="stat-info">
            <h3>Belum Dibaca</h3>
            <div className="stat-number">{unreadAlerts}</div>
          </div>
        </div>
        <div className="alerts-stat-card read">
          <div className="stat-icon">
            <span className="material-symbols-rounded">mark_email_read</span>
          </div>
          <div className="stat-info">
            <h3>Sudah Dibaca</h3>
            <div className="stat-number">{readAlerts}</div>
          </div>
        </div>
      </div>

      <div className="alerts-toolbar">
        <div className="filter-buttons">
          <button className={`filter-btn ${filter === 'semua' ? 'active' : ''}`} onClick={() => setFilter('semua')}>
            Semua ({totalAlerts})
          </button>
          <button className={`filter-btn ${filter === 'belum_dibaca' ? 'active' : ''}`} onClick={() => setFilter('belum_dibaca')}>
            Belum Dibaca ({unreadAlerts})
          </button>
          <button className={`filter-btn ${filter === 'sudah_dibaca' ? 'active' : ''}`} onClick={() => setFilter('sudah_dibaca')}>
            Sudah Dibaca ({readAlerts})
          </button>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <span className="material-symbols-rounded search-icon">search</span>
            <input type="text" className="search-input" placeholder="Cari jenis alert, lokasi...." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} list="search-suggestions" />
            {searchQuery && (
              <button className="search-clear" onClick={clearSearch}>
                <span className="material-symbols-rounded">close</span>
              </button>
            )}
            <datalist id="search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      <div className="alerts-list-container">
        <div className="alerts-table-container">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Jenis Kejadian</th>
                <th>Lokasi</th>
                <th>Camera</th>
                <th>Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className={alert.status === 'Belum Dibaca' ? 'unread-row' : ''}>
                  <td>
                    <div className="alert-icon-cell" style={{ backgroundColor: getSeverityBg(alert.severity) }}>
                      <span className="material-symbols-rounded" style={{ color: getSeverityColor(alert.severity) }}>
                        {alert.icon}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="alert-type-cell">
                      <strong>{alert.type}</strong>
                      <span style={{ fontSize: '11px', color: '#777' }}> ({Math.round(alert.confidence * 100)}%)</span>
                    </div>
                  </td>
                  <td>{alert.location}</td>
                  <td>{alert.camera}</td>
                  <td>
                    <div className="alert-time">
                      <span className="material-symbols-rounded">schedule</span>
                      {alert.time ? new Date(alert.time).toLocaleString('id-ID') : '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge-alert ${alert.status === 'Belum Dibaca' ? 'unread' : 'read'}`}>{alert.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons-alert">
                      <button className="action-view" title="Lihat Detail" onClick={() => openDetail(alert)}>
                        <span className="material-symbols-rounded">visibility</span>
                      </button>
                      {alert.status === 'Belum Dibaca' && (
                        <button className="action-mark-read" title="Tandai Sudah Dibaca" onClick={() => markAsRead(alert.id)}>
                          <span className="material-symbols-rounded">check_circle</span>
                        </button>
                      )}
                      <button className="action-delete" title="Hapus" onClick={() => openDeleteModal(alert)}>
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

      {isDetailOpen && selectedAlert && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-detail-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Kejadian</h2>
              <button className="modal-close" onClick={() => setIsDetailOpen(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <div className="modal-body-detail">
              <div className="detail-icon-large" style={{ backgroundColor: getSeverityBg(selectedAlert.severity) }}>
                <span className="material-symbols-rounded" style={{ color: getSeverityColor(selectedAlert.severity), fontSize: '64px' }}>
                  {selectedAlert.icon}
                </span>
              </div>
              <div className="detail-info">
                <div className="detail-row">
                  <label>Jenis Kejadian:</label>
                  <span>{selectedAlert.type}</span>
                </div>
                <div className="detail-row">
                  <label>Akurasi (AI):</label>
                  <span>{Math.round(selectedAlert.confidence * 100)}%</span>
                </div>
                <div className="detail-row">
                  <label>Deskripsi:</label>
                  <span>{selectedAlert.deskripsi}</span>
                </div>
                <div className="detail-row">
                  <label>Lokasi:</label>
                  <span>{selectedAlert.location}</span>
                </div>
                <div className="detail-row">
                  <label>Waktu Kejadian:</label>
                  <span>{selectedAlert.time ? new Date(selectedAlert.time).toLocaleString('id-ID') : '-'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setIsDetailOpen(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteAlerts isOpen={isDeleteModalOpen} onClose={cancelDelete} onConfirm={confirmDelete} alertData={alertToDelete} />
    </div>
  );
};

export default Alerts;

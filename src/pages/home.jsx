import { useState } from 'react';
import Camera from './Camera';
import Alerts from './Alerts';
import Dashboard from './Dashboard';
import PropTypes from 'prop-types';
import ThemeToggle from '../components/ThemeToggle';

const Home = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Menentukan komponen mana yang aktif di area main content
  const renderContent = () => {
    if (activeMenu === 'dashboard') {
      return <Dashboard />;
    } else if (activeMenu === 'camera') {
      return <Camera />;
    } else if (activeMenu === 'alerts') {
      return <Alerts />;
    }
    return null;
  };

  return (
    <div className="dashboard-wrapper">
      {/* ==================== TOP NAVBAR ==================== */}
      <nav className="top-navbar">
        <div className="nav-left">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <span className="material-symbols-rounded">{sidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>

          <div className="nav-logo">
            <img src={isDarkMode ? '/logo-putih.png' : '/logo-terbaru.png'} alt="SafeWatch" className="nav-logo-img" />
            <h2>SafeWatch</h2>
          </div>
        </div>

        <div className="nav-right">
          {/* ThemeToggle digunakan di sini */}
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          <span className="user-name">{user?.name || user?.email?.split('@')[0]}</span>

          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            <span className="material-symbols-rounded">logout</span>
          </button>
        </div>
      </nav>

      <div className="app-body">
        {/* ==================== SIDEBAR LEFT ==================== */}
        <aside className={`sidebar-left ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <nav className="sidebar-nav">
            <button className={`sidebar-link ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenu('dashboard')}>
              <span className="material-symbols-rounded">dashboard</span>
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            <button className={`sidebar-link ${activeMenu === 'camera' ? 'active' : ''}`} onClick={() => setActiveMenu('camera')}>
              <span className="material-symbols-rounded">videocam</span>
              {sidebarOpen && <span>Camera</span>}
            </button>

            <button className={`sidebar-link ${activeMenu === 'alerts' ? 'active' : ''}`} onClick={() => setActiveMenu('alerts')}>
              <span className="material-symbols-rounded">notifications</span>
              {sidebarOpen && <span>Alerts</span>}
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <span className="user-avatar">
                <span className="material-symbols-rounded">account_circle</span>
              </span>

              {sidebarOpen && <span className="user-name-sidebar">{user?.name || user?.email?.split('@')[0]}</span>}
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="main-content">
          {renderContent()}

          <footer className="dashboard-footer">
            <p>Copyright © 2026 Dicoding - All rights reserved. | Create by PSU-083.</p>
          </footer>
        </main>
      </div>

      {/* ==================== MODAL CONFIRM LOGOUT ==================== */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">
              <span className="material-symbols-rounded">logout</span>
            </div>

            <h3>Konfirmasi Keluar</h3>
            <p>Apakah Anda yakin ingin keluar dari SafeWatch?</p>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Batal
              </button>

              {/* onLogout digunakan di sini */}
              <button className="btn-confirm-logout" onClick={onLogout}>
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== VALIDASI PROPS (Mencegah Error ESLint) ====================
Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Home;

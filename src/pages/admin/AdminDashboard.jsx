// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import MainContent from '../../components/admin/MainContent';
import '../../assets/styles/admin/dashboard.css';
import '../../assets/styles/admin/modern-dashboard.css';
import '../../assets/styles/admin/redesigned-dashboard.css';
import '../../assets/styles/admin/no-hover.css';
import '../../assets/styles/custom-colors.css';
import '../../assets/styles/custom-theme.css';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div
      className={`admin-dashboard ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}
      style={{minHeight: '100vh'}}
    >
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
      />

      <div className="d-flex" style={{ paddingTop: '60px' }}>
        <div
          className={`sidebar-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}
          style={{
            width: sidebarCollapsed ? '70px' : '240px',
            transition: 'width 0.3s ease',
            flexShrink: 0
          }}
        >
          <Sidebar
            setActiveView={setActiveView}
            activeView={activeView}
            darkMode={darkMode}
            collapsed={sidebarCollapsed}
          />
        </div>

        <main
          className="flex-grow-1"
          style={{
            transition: 'margin-left 0.3s ease',
            overflowX: 'hidden'
          }}
        >
          <MainContent activeView={activeView} darkMode={darkMode} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

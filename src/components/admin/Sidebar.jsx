import React from 'react';
import { Nav, Badge } from 'react-bootstrap';
import {
  House,
  Database,
  Person,
  Calculator,
  Calendar2,
  Gear,
  BoxArrowRight,
  Heart,
  Images,
  InfoCircle
} from 'react-bootstrap-icons';

const Sidebar = ({ setActiveView, activeView, darkMode, collapsed }) => {
  const handleSelect = (view) => {
    setActiveView(view);
  };

  // Group navbar items for better organization
  const navItems = [
    {
      section: "Main",
      items: [
        { id: 'dashboard', icon: <House size={16} />, label: 'Dashboard' }
      ]
    },
    {
      section: "Management",
      items: [
        { id: 'animal', icon: <Database size={16} />, label: 'Pet Data', badge: { text: 'New', variant: 'success' } },
        { id: 'account', icon: <Person size={16} />, label: 'Accounts' },
        { id: 'accounting', icon: <Calculator size={16} />, label: 'Fund Donations' },
        { id: 'calendar', icon: <Calendar2 size={16} />, label: 'Upcoming Events' },
        { id: 'adoption', icon: <House size={16} />, label: 'Adoptions' },
        { id: 'rescue', icon: <Heart size={16} />, label: 'Pet Rescue' },
        { id: 'gallery', icon: <Images size={16} />, label: 'Pet Gallery' },
        { id: 'rainbow', icon: <Heart size={16} />, label: 'Rainbow Bridge' },
        { id: 'aboutus', icon: <InfoCircle size={16} />, label: 'About Organization' }
      ]
    }
  ];

  // Determine sidebar theme classes based on dark mode
  const sidebarThemeClass = darkMode
    ? 'bg-dark text-light'
    : 'bg-white text-dark';

  const activeItemClass = darkMode
    ? 'bg-info bg-opacity-10 text-info fw-medium'
    : 'bg-deep-raspberry bg-opacity-10 text-deep-raspberry fw-medium';

  const inactiveItemClass = darkMode
    ? 'text-light-emphasis'
    : 'text-secondary';

  return (
    <div
      className={`${sidebarThemeClass} h-100 d-flex flex-column`}
      style={{
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.2)' : '2px 0 10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <div className="sidebar-content d-flex flex-column h-100">
        <div className="flex-grow-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
          {/* Navigation Items */}
          {navItems.map((section, index) => (
            <div key={index} className="mb-2 mt-3">
              {!collapsed && (
                <div className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} text-uppercase px-3 py-1 small fw-semibold`}>
                  {section.section}
                </div>
              )}
              <Nav className="flex-column">
                {section.items.map(item => (
                  <Nav.Item key={item.id}>
                    <Nav.Link
                      onClick={() => handleSelect(item.id)}
                      active={activeView === item.id}
                      className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''} px-3 py-2 ${
                        activeView === item.id
                          ? activeItemClass
                          : inactiveItemClass
                      }`}
                      style={{
                        borderRadius: '6px',
                        margin: '2px 8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span className={collapsed ? '' : 'me-3'}>{item.icon}</span>
                      {!collapsed && <span className="small">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <Badge bg={item.badge.variant} className="ms-auto rounded-pill" style={{ fontSize: '0.65rem' }}>
                          {item.badge.text}
                        </Badge>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
          ))}
        </div>

        {/* Settings & Logout - fixed at the bottom */}
        <div className={`${darkMode ? 'border-secondary' : ''} mt-auto mb-3`}>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link
                onClick={() => handleSelect('settings')}
                active={activeView === 'settings'}
                className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''} px-3 py-2 ${
                  activeView === 'settings'
                    ? activeItemClass
                    : inactiveItemClass
                }`}
                style={{
                  borderRadius: '6px',
                  margin: '2px 8px',
                  transition: 'all 0.2s'
                }}
              >
                <span className={collapsed ? '' : 'me-3'}><Gear size={16} /></span>
                {!collapsed && <span className="small">Settings</span>}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleSelect('logout')}
                className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''} px-3 py-2 ${inactiveItemClass}`}
                style={{
                  borderRadius: '6px',
                  margin: '2px 8px',
                  transition: 'all 0.2s'
                }}
              >
                <span className={collapsed ? '' : 'me-3'}><BoxArrowRight size={16} /></span>
                {!collapsed && <span className="small">Logout</span>}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
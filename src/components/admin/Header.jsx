// src/components/Header.jsx
import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import {
  Bell,
  Moon,
  Sun,
  List,
  PersonCircle,
  BoxArrowRight
} from 'react-bootstrap-icons';

const Header = ({ darkMode, toggleTheme, toggleSidebar }) => {
  // Define theme-based styles
  const headerBg = darkMode
    ? 'rgba(26, 32, 44, 1)'
    : 'rgba(255, 255, 255, 1)';

  const textColor = darkMode
    ? 'text-white'
    : 'text-dark';

  const accentColor = darkMode
    ? 'text-info'
    : 'text-deep-raspberry';

  const iconBtnClass = `d-flex align-items-center justify-content-center ${darkMode ? 'text-light' : 'text-secondary'}`;

  return (
    <Navbar
      style={{
        backgroundColor: headerBg,
        height: '60px',
        borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.05)'
      }}
      className="py-0"
      fixed="top"
    >
      <Container fluid className="px-3">
        {/* Left side with toggle and brand */}
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className={`me-2 p-0 ${iconBtnClass} border-0`}
            style={{ width: '34px', height: '34px' }}
            onClick={toggleSidebar}
          >
            <List size={20} />
          </Button>

          <Navbar.Brand className={`fw-bold mb-0 ${accentColor}`} style={{ fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
            TAARA<span className={`ms-1 fw-light ${textColor}`}>Admin</span>
          </Navbar.Brand>
        </div>

        {/* Right Side Icons */}
        <Nav className="ms-auto d-flex align-items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="link"
            className={`p-0 ${iconBtnClass} border-0`}
            style={{ width: '34px', height: '34px' }}
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Notification Bell */}
          <div className="position-relative">
            <Button
              variant="link"
              className={`p-0 ${iconBtnClass} border-0`}
              style={{ width: '34px', height: '34px' }}
            >
              <Bell size={16} />
              <span
                className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}
              >
                3
              </span>
            </Button>
          </div>

          {/* User Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="link"
              id="dropdown-profile"
              className={`p-0 border-0 shadow-none d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}
              style={{ background: 'transparent' }}
            >
              <div
                className={`d-flex align-items-center justify-content-center rounded-circle ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}
                style={{
                  width: '34px',
                  height: '34px',
                  overflow: 'hidden'
                }}
              >
                <span className={`fw-medium ${darkMode ? 'text-info' : 'text-deep-raspberry'}`}>A</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className={`border-0 shadow ${darkMode ? 'dropdown-menu-dark' : ''}`}
              style={{ borderRadius: '8px', marginTop: '8px', minWidth: '200px' }}
            >
              <div className="px-3 py-2 d-flex align-items-center">
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle me-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}
                  style={{ width: '32px', height: '32px' }}
                >
                  <span className={`fw-medium ${darkMode ? 'text-info' : 'text-deep-raspberry'}`}>A</span>
                </div>
                <div>
                  <p className="mb-0 fw-medium">Admin User</p>
                  <small className={`${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>admin@example.com</small>
                </div>
              </div>

              <Dropdown.Divider className="my-1" />

              <Dropdown.Item className="d-flex align-items-center py-2">
                <PersonCircle size={14} className="me-2" /> Profile
              </Dropdown.Item>

              <Dropdown.Divider className="my-1" />

              <Dropdown.Item className="d-flex align-items-center py-2 text-danger">
                <BoxArrowRight size={14} className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;

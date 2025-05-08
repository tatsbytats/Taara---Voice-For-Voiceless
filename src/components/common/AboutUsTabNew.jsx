import React, { useState, useEffect } from 'react';
import { Tab, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getOrganizationInfo } from '../../services/organizationService';

const AboutUsTab = () => {
  const [organizationInfo, setOrganizationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      try {
        setLoading(true);
        const data = await getOrganizationInfo();
        
        if (data) {
          setOrganizationInfo(data);
          setError(null);
        } else {
          throw new Error('Failed to load organization information');
        }
      } catch (err) {
        console.error('Error fetching organization info:', err);
        setError('Failed to load organization information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationInfo();
  }, []);

  if (loading) {
    return (
      <Tab.Pane eventKey="AboutUs" className="about-us-tab px-3 py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading organization information...</p>
        </div>
      </Tab.Pane>
    );
  }

  if (error) {
    return (
      <Tab.Pane eventKey="AboutUs" className="about-us-tab px-3 py-4">
        <Alert variant="danger" className="my-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Tab.Pane>
    );
  }

  return (
    <Tab.Pane eventKey="AboutUs" className="about-us-tab px-3 py-4">
      {/* Intro Section */}
      <div className="text-center mb-5">
        <h2 className="mb-3 text-deep-raspberry fw-bold">About Our Organization</h2>
        <p className="lead text-muted">Compassionate care for animals since {organizationInfo?.foundedYear || '2010'}</p>
      </div>

      {/* Mission and History */}
      <Row className="mb-5 g-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm hover-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-circle bg-primary text-white me-3">
                  <i className="bi bi-bullseye fs-4"></i>
                </div>
                <h4 className="mb-0">Our Mission</h4>
              </div>
              <p className="text-muted mb-0">
                {organizationInfo?.mission || 'To improve animal welfare through awareness, food, shelter, and fostering compassion.'}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm hover-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-circle bg-success text-white me-3">
                  <i className="bi bi-clock-history fs-4"></i>
                </div>
                <h4 className="mb-0">Our Vision</h4>
              </div>
              <p className="text-muted mb-0">
                {organizationInfo?.vision || 'Founded in 2010, we\'ve helped over 5,000 animals find loving homes and provided medical care to thousands more.'}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Info */}
      <Card className="border-gradient mb-5 shadow-sm">
        <Card.Header className="bg-gradient text-black py-3">
          <h5 className="mb-0">
            <i className="bi bi-envelope me-2"></i>
            Contact Information
          </h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-4">
            <Col md={6}>
              <div>
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-geo-alt-fill text-primary me-2"></i> Our Location
                </h6>
                <address className="text-muted mb-0">
                  <strong>{organizationInfo?.name || 'TAARA for the Love of Strays'}</strong><br />
                  {organizationInfo?.address || 'P-3 Burac St., San Lorenzo, Tabaco, Philippines'}<br />
                  <i className="bi bi-telephone-fill text-primary me-2"></i>
                  {organizationInfo?.phone || '(+63) 905 523 8105'}
                </address>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-info-circle-fill text-primary me-2"></i> Additional Details
                </h6>
                <p className="text-muted mb-2">
                  <i className="bi bi-envelope-fill text-primary me-2"></i>
                  <strong>Email:</strong> {organizationInfo?.email || 'tabacoanimalrescueadoption2022@gmail.com'}
                </p>
                <p className="text-muted mb-2">
                  <i className="bi bi-clock-fill text-primary me-2"></i>
                  <strong>Hours:</strong> {organizationInfo?.operatingHours || 'Mon–Fri, 9am–5pm'}
                </p>
                <p className="text-muted mb-0">
                  <i className="bi bi-calendar-event-fill text-primary me-2"></i>
                  <strong>Emergency:</strong> {organizationInfo?.emergencyAvailability || 'Available 24/7'}
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Social Media Links */}
      {organizationInfo?.socialMedia && (
        <div className="text-center mb-4">
          <h5 className="mb-3">Connect With Us</h5>
          <div className="d-flex justify-content-center gap-3">
            {organizationInfo.socialMedia.facebook && (
              <a href={`https://${organizationInfo.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-facebook fs-4"></i>
              </a>
            )}
            {organizationInfo.socialMedia.instagram && (
              <a href={`https://${organizationInfo.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-instagram fs-4"></i>
              </a>
            )}
            {organizationInfo.socialMedia.twitter && (
              <a href={`https://${organizationInfo.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-twitter fs-4"></i>
              </a>
            )}
          </div>
        </div>
      )}
    </Tab.Pane>
  );
};

export default AboutUsTab;

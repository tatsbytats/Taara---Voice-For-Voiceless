import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { PencilSquare, Save, Building, People, GeoAlt, Telephone, Envelope, Globe } from 'react-bootstrap-icons';
import { getOrganizationInfo, updateOrganizationInfo } from '../../services/organizationService';

const AboutOrganization = ({ darkMode }) => {
  const [organizationInfo, setOrganizationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Mock data for organization info as fallback
  const mockOrganizationInfo = useMemo(() => ({
    name: 'TAARA - Voice For Voiceless',
    logo: 'https://via.placeholder.com/150',
    mission: 'To rescue, rehabilitate, and rehome abandoned and abused animals, while educating the community about responsible pet ownership.',
    vision: 'A world where all animals are treated with compassion and respect.',
    foundedYear: '2015',
    address: '123 Animal Rescue Lane, Anytown, USA 12345',
    phone: '(555) 123-4567',
    email: 'info@taara.org',
    website: 'www.taara.org',
    socialMedia: {
      facebook: 'facebook.com/taaraorg',
      instagram: 'instagram.com/taaraorg',
      twitter: 'twitter.com/taaraorg'
    },
    teamMembers: [
      {
        name: 'Jane Doe',
        position: 'Founder & Director',
        bio: 'Jane has been an animal advocate for over 15 years and founded TAARA in 2015.'
      },
      {
        name: 'John Smith',
        position: 'Veterinarian',
        bio: 'Dr. Smith provides medical care to all rescued animals and has been with TAARA since its inception.'
      },
      {
        name: 'Alice Johnson',
        position: 'Volunteer Coordinator',
        bio: 'Alice manages our network of dedicated volunteers and organizes community outreach events.'
      }
    ],
    achievements: [
      'Rescued over 1,000 animals since 2015',
      'Established a state-of-the-art animal shelter in 2018',
      'Launched community education programs in 2020',
      'Received the "Outstanding Animal Welfare Organization" award in 2022'
    ]
  }), []);

  // Fetch organization info
  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      try {
        setLoading(true);
        const data = await getOrganizationInfo();

        if (data) {
          setOrganizationInfo(data);
          setFormData(data);
          setError(null);
        } else {
          // If API returns null, use mock data as fallback
          setOrganizationInfo(mockOrganizationInfo);
          setFormData(mockOrganizationInfo);
          console.warn('Using mock data as fallback');
        }
      } catch (err) {
        console.error('Error fetching organization info:', err);
        setError('Failed to load organization information. Please try again later.');
        // Use mock data as fallback on error
        setOrganizationInfo(mockOrganizationInfo);
        setFormData(mockOrganizationInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationInfo();
  }, [mockOrganizationInfo]);

  const handleEditToggle = async () => {
    if (editing) {
      try {
        setLoading(true);
        // Save changes to the server
        const response = await updateOrganizationInfo(formData);

        if (response && response.success) {
          setOrganizationInfo(response.organization);
          setError(null);
          alert('Organization information updated successfully!');
        } else {
          throw new Error('Failed to update organization information');
        }
      } catch (err) {
        console.error('Error updating organization info:', err);
        setError('Failed to update organization information. Please try again.');
        // Keep the form data as is so user can retry
      } finally {
        setLoading(false);
      }
    }
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [name]: value
      }
    });
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>About Organization</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={handleEditToggle}
        >
          {editing ? (
            <>
              <Save size={14} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <PencilSquare size={14} />
              <span>Edit Information</span>
            </>
          )}
        </Button>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant={darkMode ? "info" : "deep-raspberry"} />
          <p className="mt-3">Loading organization information...</p>
        </div>
      )}

      {error && (
        <div className={`alert ${darkMode ? 'alert-danger' : 'alert-danger'} my-4`}>
          <p className="mb-0">{error}</p>
          <Button
            variant={darkMode ? "outline-light" : "outline-danger"}
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Organization Information */}
      {!loading && !error && organizationInfo && (
        <div className="organization-info">
          {editing ? (
            <Form>
              <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="mb-3 d-flex align-items-center">
                    <Building className="me-2" /> Basic Information
                  </h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Founded Year</Form.Label>
                        <Form.Control
                          type="text"
                          name="foundedYear"
                          value={formData.foundedYear || ''}
                          onChange={handleInputChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Mission Statement</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="mission"
                      value={formData.mission || ''}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Vision</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="vision"
                      value={formData.vision || ''}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="mb-3 d-flex align-items-center">
                    <GeoAlt className="me-2" /> Contact Information
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="mb-3 d-flex align-items-center">
                    <Globe className="me-2" /> Social Media
                  </h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Facebook</Form.Label>
                        <Form.Control
                          type="text"
                          name="facebook"
                          value={formData.socialMedia?.facebook || ''}
                          onChange={handleSocialMediaChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Instagram</Form.Label>
                        <Form.Control
                          type="text"
                          name="instagram"
                          value={formData.socialMedia?.instagram || ''}
                          onChange={handleSocialMediaChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Twitter</Form.Label>
                        <Form.Control
                          type="text"
                          name="twitter"
                          value={formData.socialMedia?.twitter || ''}
                          onChange={handleSocialMediaChange}
                          className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          ) : (
            <>
              <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <img
                        src={organizationInfo.logo}
                        alt={organizationInfo.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    </div>
                    <div>
                      <h3 className="mb-1">{organizationInfo.name}</h3>
                      <p className={`mb-0 ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>
                        Founded in {organizationInfo.foundedYear}
                      </p>
                    </div>
                  </div>

                  <h5 className="mb-2">Mission</h5>
                  <p>{organizationInfo.mission}</p>

                  <h5 className="mb-2">Vision</h5>
                  <p>{organizationInfo.vision}</p>
                </Card.Body>
              </Card>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className={`h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                    <Card.Body>
                      <h5 className="mb-3 d-flex align-items-center">
                        <GeoAlt className="me-2" /> Contact Information
                      </h5>
                      <ul className="list-unstyled">
                        <li className="mb-2 d-flex align-items-center">
                          <GeoAlt className="me-2" /> {organizationInfo.address}
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <Telephone className="me-2" /> {organizationInfo.phone}
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <Envelope className="me-2" /> {organizationInfo.email}
                        </li>
                        <li className="d-flex align-items-center">
                          <Globe className="me-2" /> {organizationInfo.website}
                        </li>
                      </ul>

                      <h6 className="mt-4 mb-2">Social Media</h6>
                      <ul className="list-unstyled">
                        <li className="mb-1">Facebook: {organizationInfo.socialMedia.facebook}</li>
                        <li className="mb-1">Instagram: {organizationInfo.socialMedia.instagram}</li>
                        <li>Twitter: {organizationInfo.socialMedia.twitter}</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className={`h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                    <Card.Body>
                      <h5 className="mb-3 d-flex align-items-center">
                        <People className="me-2" /> Key Team Members
                      </h5>
                      {organizationInfo.teamMembers.map((member, index) => (
                        <div key={index} className={index < organizationInfo.teamMembers.length - 1 ? 'mb-3 pb-3 border-bottom' : ''}>
                          <h6 className="mb-1">{member.name}</h6>
                          <p className={`mb-1 ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>{member.position}</p>
                          <p className="mb-0 small">{member.bio}</p>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className={`${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <Card.Body>
                  <h5 className="mb-3">Key Achievements</h5>
                  <ul>
                    {organizationInfo.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutOrganization;

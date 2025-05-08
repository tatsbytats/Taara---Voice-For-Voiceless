import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form, Modal, Spinner, Alert, Badge, Nav, Tab } from 'react-bootstrap';
import { PlusCircle, Trash, PencilSquare, Heart, CheckCircle, XCircle, EnvelopeFill } from 'react-bootstrap-icons';
import {
  getMemorials,
  createMemorial,
  updateMemorial,
  deleteMemorial,
  updateMemorialStatus,
  getPendingMemorials
} from '../../services/memorialService';

const RainbowBridge = ({ darkMode }) => {
  const [memorials, setMemorials] = useState([]);
  const [pendingMemorials, setPendingMemorials] = useState([]);
  const [activeTab, setActiveTab] = useState('approved');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Form state
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch memorials based on active tab
  const fetchMemorials = async (status = 'approved') => {
    try {
      setLoading(true);

      if (status === 'pending') {
        // Fetch pending memorials
        const data = await getPendingMemorials();
        setPendingMemorials(data);
      } else {
        // Fetch approved memorials
        const data = await getMemorials(status, true);
        setMemorials(data);
      }

      setError(null);
    } catch (err) {
      console.error(`Error fetching ${status} memorials:`, err);
      setError(`Failed to load ${status} memorial data. Please try again later.`);

      // Reset the appropriate state
      if (status === 'pending') {
        setPendingMemorials([]);
      } else {
        setMemorials([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchMemorials(tab);
  };

  // Fetch memorials on component mount and when tab changes
  useEffect(() => {
    fetchMemorials(activeTab);
  }, [activeTab]);

  // Handle memorial approval/rejection
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setProcessingId(id);

      // Update the memorial status
      await updateMemorialStatus(id, newStatus);

      // Show success message
      setSuccessMessage(`Memorial ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);

      // Refresh the memorials list
      fetchMemorials(activeTab);

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error(`Error ${newStatus} memorial:`, err);
      setError(`Failed to ${newStatus} memorial. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };





  // Open add memorial modal
  const handleAddMemorial = () => {
    setSelectedMemorial(null);
    setShowAddModal(true);
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedMemorial(null);
    setSuccessMessage('');
    setError(null);
  };

  // Refresh memorials list
  const refreshMemorials = async () => {
    await fetchMemorials(activeTab);
  };

  // Handle form submission
  const handleMemorialSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const form = e.target;
      const formData = new FormData(form);

      // Add featured flag
      const featuredCheckbox = form.querySelector('input[name="featured"]');
      formData.set('featured', featuredCheckbox?.checked || false);

      if (selectedMemorial) {
        // Update existing memorial
        await updateMemorial(selectedMemorial._id, formData);
        setSuccessMessage('Memorial updated successfully!');
      } else {
        // Create new memorial
        await createMemorial(formData);
        setSuccessMessage('Memorial added successfully!');
      }

      // Refresh the memorials list
      await refreshMemorials();

      // Close the modal after a short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (err) {
      console.error('Error submitting memorial:', err);
      setError('Failed to save memorial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit memorial modal
  const handleEditMemorial = (memorial) => {
    setSelectedMemorial(memorial);
    setShowAddModal(true);
  };

  // Delete memorial
  const handleDeleteMemorial = async (memorialId) => {
    if (window.confirm('Are you sure you want to delete this memorial?')) {
      try {
        setLoading(true);
        await deleteMemorial(memorialId);

        // Update the UI
        setMemorials(memorials.filter(mem => mem._id !== memorialId));
        setSuccessMessage('Memorial deleted successfully!');

        // Clear success message after a delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting memorial:', err);
        setError('Failed to delete memorial. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Rainbow Bridge</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={handleAddMemorial}
        >
          <PlusCircle size={14} />
          <span>Add Memorial</span>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Approved Memorials
                  </h6>
                  <h3 className="fw-bold mb-0">{loading && activeTab === 'approved' ? '...' : memorials.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Heart size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Pending Approvals
                  </h6>
                  <h3 className="fw-bold mb-0">
                    {loading && activeTab === 'pending' ? '...' : (
                      <span className="d-flex align-items-center">
                        {pendingMemorials.length}
                        {pendingMemorials.length > 0 && (
                          <Badge
                            bg={darkMode ? "info" : "warning"}
                            className="ms-2"
                            pill
                          >
                            New
                          </Badge>
                        )}
                      </span>
                    )}
                  </h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-warning bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                  <EnvelopeFill size={18} className={darkMode ? 'text-warning' : 'text-warning'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
        <Nav
          variant="tabs"
          className="mb-4 border-bottom-0"
        >
          <Nav.Item>
            <Nav.Link
              eventKey="approved"
              className={`${darkMode ? 'text-light' : ''}`}
            >
              Approved Memorials
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="pending"
              className={`${darkMode ? 'text-light' : ''} position-relative`}
            >
              Pending Approvals
              {pendingMemorials.length > 0 && (
                <Badge
                  bg={darkMode ? "info" : "warning"}
                  className="ms-2 position-absolute top-0 start-100 translate-middle"
                  pill
                >
                  {pendingMemorials.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Tab.Container>

      {/* Success message */}
      {successMessage && (
        <Alert
          variant="success"
          className="mb-4 d-flex justify-content-between align-items-center"
          dismissible
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant={darkMode ? "info" : "deep-raspberry"} />
          <p className="mt-3">Loading memorials...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert
          variant="danger"
          className="my-4 d-flex justify-content-between align-items-center"
        >
          <div>
            <p className="mb-0">{error}</p>
            <Button
              variant={darkMode ? "outline-light" : "outline-danger"}
              size="sm"
              className="mt-2"
              onClick={refreshMemorials}
            >
              Retry
            </Button>
          </div>
          <Button
            variant="link"
            className="text-danger p-0 ms-3"
            onClick={() => setError(null)}
          >
            &times;
          </Button>
        </Alert>
      )}

      {/* Memorials Grid */}
      {!loading && !error && (
        <Tab.Content>
          {/* Approved Memorials Tab */}
          <Tab.Pane eventKey="approved">
            {memorials.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No approved memorials found. Add your first memorial to get started.</p>
              </div>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {memorials.map(memorial => (
                  <Col key={memorial._id}>
                    <Card className={`h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={memorial.image || '/default-pet-image.jpg'}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-pet-image.jpg';
                          }}
                        />
                        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                          {memorial.featured && (
                            <span className="badge bg-primary">
                              Featured
                            </span>
                          )}
                          {memorial.submitterEmail && (
                            <span className="badge bg-info">
                              Shared
                            </span>
                          )}
                        </div>
                        <div className="position-absolute bottom-0 end-0 m-2 d-flex gap-1">
                          <Button
                            variant={darkMode ? "dark" : "light"}
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-1"
                            style={{ width: '30px', height: '30px' }}
                            onClick={() => handleEditMemorial(memorial)}
                          >
                            <PencilSquare size={14} />
                          </Button>
                          <Button
                            variant={darkMode ? "dark" : "light"}
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-1"
                            style={{ width: '30px', height: '30px' }}
                            onClick={() => handleDeleteMemorial(memorial._id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="h5 mb-1">{memorial.name}</Card.Title>
                        <Card.Subtitle className={`mb-2 ${darkMode ? 'text-light-emphasis' : 'text-muted'} small`}>
                          {memorial.type} • {memorial.breed} • {memorial.years}
                        </Card.Subtitle>
                        <div className="mb-2">
                          <span className="small fw-bold">"{memorial.quote}"</span>
                        </div>
                        <Card.Text className="small">
                          {memorial.story}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="small text-muted">
                            <Heart size={14} className="me-1" /> {memorial.candleCount || 0} candles
                          </span>
                          <span className={`small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>
                            {memorial.submitterEmail ? (
                              <span className="d-flex align-items-center">
                                <span className="badge bg-info me-1" style={{ fontSize: '0.7em' }}>Shared</span>
                                By {memorial.ownerName || 'Anonymous'}
                              </span>
                            ) : (
                              <>By {memorial.ownerName || 'Anonymous'}</>
                            )}
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab.Pane>

          {/* Pending Memorials Tab */}
          <Tab.Pane eventKey="pending">
            {pendingMemorials.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No pending memorials found. All submissions have been reviewed.</p>
              </div>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {pendingMemorials.map(memorial => (
                  <Col key={memorial._id}>
                    <Card className={`h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'} border-warning`}>
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={memorial.image || '/default-pet-image.jpg'}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-pet-image.jpg';
                          }}
                        />
                        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                          {memorial.submitterEmail && (
                            <span className="badge bg-info">
                              Shared
                            </span>
                          )}
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="h5 mb-1">{memorial.name}</Card.Title>
                        <Card.Subtitle className={`mb-2 ${darkMode ? 'text-light-emphasis' : 'text-muted'} small`}>
                          {memorial.type} • {memorial.breed} • {memorial.years}
                        </Card.Subtitle>
                        <div className="mb-2">
                          <span className="small fw-bold">"{memorial.quote}"</span>
                        </div>
                        <Card.Text className="small">
                          {memorial.story}
                        </Card.Text>

                        {memorial.submitterEmail && (
                          <div className="mb-3 small">
                            <div className="d-flex align-items-center mb-1">
                              <span className="badge bg-info me-1">Shared</span>
                              <span>User Submitted Memorial</span>
                            </div>
                            <EnvelopeFill className="me-1" /> {memorial.submitterEmail}
                          </div>
                        )}

                        {memorial.submissionNotes && (
                          <div className="mb-3 p-2 bg-light rounded small">
                            <strong>Notes:</strong> {memorial.submissionNotes}
                          </div>
                        )}

                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => handleUpdateStatus(memorial._id, 'rejected')}
                            disabled={processingId === memorial._id}
                          >
                            {processingId === memorial._id ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1"
                              />
                            ) : (
                              <XCircle className="me-1" />
                            )}
                            Reject
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => handleUpdateStatus(memorial._id, 'approved')}
                            disabled={processingId === memorial._id}
                          >
                            {processingId === memorial._id ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1"
                              />
                            ) : (
                              <CheckCircle className="me-1" />
                            )}
                            Approve
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab.Pane>
        </Tab.Content>
      )}

      {/* Add/Edit Memorial Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseModal}
        centered
        contentClassName={darkMode ? 'bg-dark text-light' : ''}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedMemorial ? 'Edit Memorial' : 'Add New Memorial'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Success/Error messages in modal */}
          {successMessage && (
            <Alert variant="success" className="mb-3">{successMessage}</Alert>
          )}
          {error && (
            <Alert variant="danger" className="mb-3">{error}</Alert>
          )}

          <Form ref={formRef} onSubmit={handleMemorialSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pet Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Pet's name"
                    defaultValue={selectedMemorial?.name || ''}
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ownerName"
                    placeholder="Owner's name (optional)"
                    defaultValue={selectedMemorial?.ownerName || ''}
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal Type*</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    placeholder="Dog, Cat, Bird, etc."
                    defaultValue={selectedMemorial?.type || ''}
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Breed*</Form.Label>
                  <Form.Control
                    type="text"
                    name="breed"
                    placeholder="Golden Retriever, Siamese, etc."
                    defaultValue={selectedMemorial?.breed || ''}
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Years*</Form.Label>
              <Form.Control
                type="text"
                name="years"
                placeholder="2010 - 2023"
                defaultValue={selectedMemorial?.years || ''}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder="https://example.com/image.jpg (leave empty for default)"
                defaultValue={selectedMemorial?.image || ''}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              />
              <Form.Text className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                If left empty, a default image will be used
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quote*</Form.Label>
              <Form.Control
                type="text"
                name="quote"
                placeholder="A short quote or memory"
                defaultValue={selectedMemorial?.quote || ''}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Story*</Form.Label>
              <Form.Control
                as="textarea"
                name="story"
                rows={3}
                placeholder="Share a memory or story about your pet..."
                defaultValue={selectedMemorial?.story || ''}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Memorial"
                defaultChecked={selectedMemorial?.featured || false}
                className={darkMode ? 'text-light' : ''}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant={darkMode ? "info" : "deep-raspberry"}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {selectedMemorial ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{selectedMemorial ? 'Update' : 'Add'} Memorial</>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RainbowBridge;

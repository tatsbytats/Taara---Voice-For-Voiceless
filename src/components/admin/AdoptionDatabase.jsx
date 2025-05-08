import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Image, Spinner, Card, Modal, Form, Alert } from 'react-bootstrap';
import { CheckCircle, XCircle, Eye, Heart, ClipboardCheck } from 'react-bootstrap-icons';
import { format } from 'date-fns';

const AdoptionDatabase = ({ darkMode }) => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Mock data for adoptions - using useMemo to avoid recreation on every render
  const mockAdoptions = React.useMemo(() => [
    {
      _id: 'adpt1001',
      petName: 'Max',
      petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      adopterName: 'John Smith',
      adopterEmail: 'john.smith@example.com',
      adopterPhone: '(555) 123-4567',
      date: '2023-08-15',
      status: 'completed',
      trackingNumber: 'TAARA-2023-1234'
    },
    {
      _id: 'adpt1002',
      petName: 'Bella',
      petImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      adopterName: 'Sarah Johnson',
      adopterEmail: 'sarah.j@example.com',
      adopterPhone: '(555) 987-6543',
      date: '2023-08-20',
      status: 'pending',
      trackingNumber: 'TAARA-2023-5678'
    },
    {
      _id: 'adpt1003',
      petName: 'Charlie',
      petImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      adopterName: 'Michael Brown',
      adopterEmail: 'michael.b@example.com',
      adopterPhone: '(555) 456-7890',
      date: '2023-08-25',
      status: 'completed',
      trackingNumber: 'TAARA-2023-9012'
    }
  ], []);

  // Fetch adoptions data
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);

        // For development, use localhost:5000 if in development mode
        const apiUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api/adoptions'
          : `${process.env.REACT_APP_API_URL || ''}/api/adoptions`;

        console.log('Fetching adoptions from:', apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAdoptions(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching adoptions:', err);
        // Fallback to mock data if API fails
        setAdoptions(mockAdoptions);
        setError('Failed to load adoption data from server. Using sample data instead.');
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, [mockAdoptions]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
  };

  // Handler for viewing adoption details
  const handleViewAdoption = (adoption) => {
    setSelectedAdoption(adoption);
    setShowViewModal(true);
  };

  // Handler for opening action modal (accept/decline)
  const handleActionModal = (adoption, action) => {
    setSelectedAdoption(adoption);
    setActionType(action);
    setNotes('');
    setShowActionModal(true);
  };

  // Handler for submitting action (accept/decline)
  const handleSubmitAction = async () => {
    if (!selectedAdoption) return;

    try {
      setLoading(true);

      const apiUrl = process.env.NODE_ENV === 'development'
        ? `http://localhost:5000/api/adoptions/${selectedAdoption._id}`
        : `${process.env.REACT_APP_API_URL || ''}/api/adoptions/${selectedAdoption._id}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: actionType === 'accept' ? 'approved' : 'declined',
          notes: notes
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setAdoptions(adoptions.map(adoption =>
        adoption._id === selectedAdoption._id
          ? { ...adoption, status: actionType === 'accept' ? 'approved' : 'declined' }
          : adoption
      ));

      // Show notification
      setNotification({
        show: true,
        message: `Adoption request ${actionType === 'accept' ? 'approved' : 'declined'} successfully`,
        type: actionType === 'accept' ? 'success' : 'warning'
      });

      // Close modal
      setShowActionModal(false);
      setLoading(false);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('Error updating adoption status:', error);
      setNotification({
        show: true,
        message: `Failed to ${actionType} adoption request. Please try again.`,
        type: 'danger'
      });
      setLoading(false);
    }
  };

  // Handler for copying tracking number to clipboard
  const copyTrackingNumber = (trackingNumber) => {
    navigator.clipboard.writeText(trackingNumber)
      .then(() => {
        setNotification({
          show: true,
          message: 'Tracking number copied to clipboard',
          type: 'info'
        });

        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy tracking number:', err);
      });
  };

  // Status badge renderer
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-success d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <CheckCircle size={10} /> Completed
          </Badge>
        );
      case 'approved':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-success d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <CheckCircle size={10} /> Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-warning d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <XCircle size={10} /> Pending
          </Badge>
        );
      case 'declined':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-danger d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <XCircle size={10} /> Declined
          </Badge>
        );
      default:
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-secondary d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <XCircle size={10} /> {status || 'Unknown'}
          </Badge>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Adoptions</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
        >
          <Heart size={14} />
          <span>New Adoption</span>
        </Button>
      </div>

      {/* Stats card */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Total Adoptions
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : adoptions.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Heart size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant={darkMode ? "info" : "deep-raspberry"} />
          <p className="mt-3">Loading adoptions...</p>
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

      {/* Notification Alert */}
      {notification.show && (
        <Alert
          variant={notification.type}
          className="mb-4 d-flex align-items-center justify-content-between"
          dismissible
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Clean table */}
      {!loading && !error && (
        <div className="card">
          <div className={`card-body p-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="table-responsive">
              <Table
                className={`table-clean align-middle mb-0 ${darkMode ? 'text-light' : ''}`}
              >
                <thead>
                  <tr className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>
                    <th className="ps-3">Pet</th>
                    <th>Adopter</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Tracking #</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No adoptions found in the database.
                      </td>
                    </tr>
                  ) : (
                    adoptions.map((adoption) => (
                      <tr key={adoption._id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center">
                            {adoption.petImage ? (
                              <Image
                                src={adoption.petImage}
                                width={40}
                                height={40}
                                roundedCircle
                                className="me-3 border"
                                style={{ objectFit: 'cover' }}
                                onError={handleImageError}
                              />
                            ) : (
                              <div
                                className={`rounded-circle d-flex justify-content-center align-items-center me-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}
                                style={{ width: 40, height: 40 }}
                              >
                                <span className={darkMode ? 'text-white' : 'text-secondary'}>N/A</span>
                              </div>
                            )}
                            <div>
                              <p className="mb-0 fw-medium">{adoption.petName}</p>
                              <p className={`mb-0 small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>ID: {adoption._id}</p>
                            </div>
                          </div>
                        </td>
                        <td>{adoption.adopterName}</td>
                        <td>
                          <div>
                            <p className="mb-0 small">{adoption.adopterEmail}</p>
                            <p className="mb-0 small">{adoption.adopterPhone}</p>
                          </div>
                        </td>
                        <td>{formatDate(adoption.date)}</td>
                        <td>
                          {renderStatusBadge(adoption.status)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{adoption.trackingNumber}</span>
                            <Button
                              variant="link"
                              className="btn-icon p-0"
                              onClick={() => copyTrackingNumber(adoption.trackingNumber)}
                              title="Copy tracking number"
                            >
                              <ClipboardCheck size={14} className={darkMode ? "text-info" : "text-deep-raspberry"} />
                            </Button>
                          </div>
                        </td>
                        <td className="text-end pe-3">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant="link"
                              className="btn-icon p-1"
                              onClick={() => handleViewAdoption(adoption)}
                              title="View details"
                            >
                              <Eye size={15} className={darkMode ? "text-info" : "text-deep-raspberry"} />
                            </Button>
                            {adoption.status === 'pending' && (
                              <>
                                <Button
                                  variant="link"
                                  className="btn-icon p-1"
                                  onClick={() => handleActionModal(adoption, 'accept')}
                                  title="Approve adoption"
                                >
                                  <CheckCircle size={15} className="text-success" />
                                </Button>
                                <Button
                                  variant="link"
                                  className="btn-icon p-1"
                                  onClick={() => handleActionModal(adoption, 'decline')}
                                  title="Decline adoption"
                                >
                                  <XCircle size={15} className="text-danger" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* View Adoption Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        size="lg"
        className={darkMode ? 'modal-dark' : ''}
      >
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>Adoption Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          {selectedAdoption && (
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="text-center">
                  {selectedAdoption.petImage ? (
                    <Image
                      src={selectedAdoption.petImage}
                      alt={selectedAdoption.petName}
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className={`rounded d-flex justify-content-center align-items-center mx-auto mb-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}
                      style={{ height: '200px', width: '200px' }}
                    >
                      <span className={darkMode ? 'text-white' : 'text-secondary'}>No Image</span>
                    </div>
                  )}
                  <h5 className="mb-1">{selectedAdoption.petName}</h5>
                </div>
              </div>
              <div className="col-md-8">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>Adopter Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedAdoption.adopterName}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedAdoption.adopterEmail}</p>
                    <p className="mb-1"><strong>Phone:</strong> {selectedAdoption.adopterPhone}</p>
                    <p className="mb-1"><strong>Address:</strong> {selectedAdoption.adopterAddress || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>Adoption Details</h6>
                    <p className="mb-1"><strong>Date:</strong> {formatDate(selectedAdoption.date)}</p>
                    <p className="mb-1"><strong>Status:</strong> {selectedAdoption.status}</p>
                    <p className="mb-1"><strong>Tracking #:</strong> {selectedAdoption.trackingNumber}</p>
                    <p className="mb-1"><strong>ID:</strong> {selectedAdoption._id}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>Reason for Adoption</h6>
                  <p>{selectedAdoption.reason || 'No reason provided.'}</p>
                </div>
                {selectedAdoption.experience && (
                  <div className="mb-3">
                    <h6 className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>Previous Experience</h6>
                    <p>{selectedAdoption.experience}</p>
                  </div>
                )}
                {selectedAdoption.notes && (
                  <div>
                    <h6 className={darkMode ? 'text-light-emphasis' : 'text-secondary'}>Notes</h6>
                    <p>{selectedAdoption.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark text-light' : ''}>
          <Button variant={darkMode ? "outline-light" : "outline-secondary"} onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {selectedAdoption && selectedAdoption.status === 'pending' && (
            <>
              <Button
                variant="success"
                onClick={() => {
                  setShowViewModal(false);
                  handleActionModal(selectedAdoption, 'accept');
                }}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowViewModal(false);
                  handleActionModal(selectedAdoption, 'decline');
                }}
              >
                Decline
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Action Modal (Accept/Decline) */}
      <Modal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        centered
        className={darkMode ? 'modal-dark' : ''}
      >
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            {actionType === 'accept' ? 'Approve Adoption Request' : 'Decline Adoption Request'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          {selectedAdoption && (
            <>
              <p>
                {actionType === 'accept'
                  ? `Are you sure you want to approve the adoption request for ${selectedAdoption.petName} by ${selectedAdoption.adopterName}?`
                  : `Are you sure you want to decline the adoption request for ${selectedAdoption.petName} by ${selectedAdoption.adopterName}?`
                }
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Notes (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark text-light' : ''}>
          <Button variant={darkMode ? "outline-light" : "outline-secondary"} onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'accept' ? "success" : "danger"}
            onClick={handleSubmitAction}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Processing...
              </>
            ) : (
              actionType === 'accept' ? 'Approve' : 'Decline'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdoptionDatabase;

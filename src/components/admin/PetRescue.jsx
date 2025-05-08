import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Image, Spinner, Card, Form, Row, Col } from 'react-bootstrap';
import { CheckCircle, XCircle, PencilSquare, Trash, Eye, Heart, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { format } from 'date-fns';

const PetRescue = ({ darkMode }) => {
  const [rescueRequests, setRescueRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Mock data for rescue requests
  const mockRescueRequests = [
    {
      _id: 'resc1001',
      petType: 'Dog',
      petBreed: 'Mixed',
      location: '123 Main St, Anytown, USA',
      reporterName: 'Jane Doe',
      reporterPhone: '(555) 123-4567',
      date: '2023-09-01',
      status: 'pending',
      description: 'Stray dog found wandering near the park. Appears to be injured.'
    },
    {
      _id: 'resc1002',
      petType: 'Cat',
      petBreed: 'Tabby',
      location: '456 Oak Ave, Somewhere, USA',
      reporterName: 'John Smith',
      reporterPhone: '(555) 987-6543',
      date: '2023-09-05',
      status: 'in-progress',
      description: 'Cat stuck in a tree for over 24 hours. Unable to get down.'
    },
    {
      _id: 'resc1003',
      petType: 'Dog',
      petBreed: 'Golden Retriever',
      location: '789 Pine St, Nowhere, USA',
      reporterName: 'Alice Johnson',
      reporterPhone: '(555) 456-7890',
      date: '2023-09-10',
      status: 'completed',
      description: 'Abandoned dog found tied to a fence. Appears to be malnourished.'
    }
  ];

  // Fetch rescue requests data
  useEffect(() => {
    // Simulate API call
    const fetchRescueRequests = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/rescue-requests');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setRescueRequests(mockRescueRequests);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load rescue request data. Please try again later.');
        setLoading(false);
      }
    };

    fetchRescueRequests();
  }, []);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
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
      case 'in-progress':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-primary d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <CheckCircle size={10} /> In Progress
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
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setShowForm(false);
    // In a real app, you would send the data to the server
    alert('Rescue request submitted successfully!');
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Pet Rescue</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <Heart size={14} />
          <span>New Rescue Request</span>
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
                    Total Rescue Requests
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : rescueRequests.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Heart size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rescue Request Form */}
      {showForm && (
        <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Body>
            <h5 className="mb-3">New Rescue Request</h5>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet Type</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Dog, Cat, etc."
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet Breed (if known)</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Breed"
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Address where the pet was found"
                  className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Your name"
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                      type="tel" 
                      placeholder="Your phone number"
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Describe the situation and condition of the pet"
                  className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant={darkMode ? "info" : "deep-raspberry"} 
                  type="submit"
                >
                  Submit Request
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Loading and error states */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant={darkMode ? "info" : "deep-raspberry"} />
          <p className="mt-3">Loading rescue requests...</p>
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
                    <th className="ps-3">ID</th>
                    <th>Pet Info</th>
                    <th>Location</th>
                    <th>Reporter</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rescueRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No rescue requests found.
                      </td>
                    </tr>
                  ) : (
                    rescueRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="ps-3">
                          <span className="small">{request._id}</span>
                        </td>
                        <td>
                          <div>
                            <p className="mb-0 fw-medium">{request.petType}</p>
                            <p className={`mb-0 small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>{request.petBreed}</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <GeoAlt size={14} className="me-1" />
                            <span className="small">{request.location}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <p className="mb-0 small">{request.reporterName}</p>
                            <p className="mb-0 small d-flex align-items-center">
                              <Telephone size={12} className="me-1" />
                              {request.reporterPhone}
                            </p>
                          </div>
                        </td>
                        <td>{formatDate(request.date)}</td>
                        <td>
                          {renderStatusBadge(request.status)}
                        </td>
                        <td className="text-end pe-3">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant="link"
                              className="btn-icon p-1"
                            >
                              <Eye size={15} className={darkMode ? "text-info" : "text-deep-raspberry"} />
                            </Button>
                            <Button
                              variant="link"
                              className="btn-icon p-1"
                            >
                              <PencilSquare size={15} className={darkMode ? "text-warning" : "text-warning"} />
                            </Button>
                            <Button
                              variant="link"
                              className="btn-icon p-1"
                            >
                              <Trash size={15} className="text-danger" />
                            </Button>
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
    </div>
  );
};

export default PetRescue;

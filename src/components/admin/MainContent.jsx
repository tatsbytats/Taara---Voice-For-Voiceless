// src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Button, Modal, Container, Card, Badge, Image, Form, Spinner } from 'react-bootstrap';
import { Database, Calendar2, BoxArrowRight, CheckCircle, XCircle, PencilSquare, Trash, Eye, CurrencyDollar, FileEarmarkText, Bell, Person } from 'react-bootstrap-icons';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import AnimalReportForm from './AnimalReportForm';
import EventCalendar from './EventCalendar';
import AccountDatabase from './AccountDatabase';
import AdoptionDatabase from './AdoptionDatabase';
import PetRescue from './PetRescue';
import PetGallery from './PetGallery';
import RainbowBridge from './RainbowBridge';
import AboutOrganization from './AboutOrganization';
import { getEvents } from '../../services/eventService';
import { getAnimals, deleteAnimal } from '../../services/animalService';

const AnimalDatabase = ({ darkMode }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch animals from the database
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      console.log('Fetching animals from database...');
      const data = await getAnimals();
      console.log('Animals data received:', data);

      // Add status field if not present (for backward compatibility)
      const processedData = data.map(animal => ({
        ...animal,
        status: animal.status || 'active' // Default to active if status is not set
      }));

      setAnimals(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching animal data:', err);
      setError(`Failed to load animal data. ${err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch animals when component mounts
  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleViewDetails = (animal) => {
    setSelectedAnimal(animal);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const handleEdit = (id) => {
    console.log(`Edit pet with ID: ${id}`);
    // For now, just log the action
    // In a real implementation, you would navigate to an edit form or open an edit modal
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet record?')) {
      try {
        await deleteAnimal(id);
        // Remove the deleted animal from the state
        setAnimals(animals.filter(animal => animal._id !== id));
      } catch (error) {
        console.error(`Error deleting pet with ID ${id}:`, error);
        alert(`Failed to delete pet: ${error.message || 'Unknown error'}`);
      }
    }
  };

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

  // Status badge renderer
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return (
          <Badge
            bg="transparent"
            className="badge-outline badge-outline-success d-flex align-items-center gap-1 rounded-pill px-2 py-1"
          >
            <CheckCircle size={10} /> Active
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Pets</h2>
        <Button
          variant={darkMode ? "outline-info" : "deep-raspberry"}
          onClick={() => setShowFormModal(true)}
          size="sm"
          className="d-flex align-items-center gap-2"
        >
          <PencilSquare size={14} />
          <span>Add Pet</span>
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
                    Total Pets
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : animals.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Database size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
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
          <p className="mt-3">Loading pets...</p>
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
                    <th className="ps-3">Pet</th>
                    <th>Breed</th>
                    <th>Reporter</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {animals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No pets found in the database.
                      </td>
                    </tr>
                  ) : (
                    animals.map((animal) => (
                      <tr key={animal._id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center">
                            {animal.imageUrl ? (
                              <Image
                                src={animal.imageUrl}
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
                              <p className="mb-0 fw-medium">{animal.name}</p>
                              <p className={`mb-0 small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>ID: {animal._id}</p>
                            </div>
                          </div>
                        </td>
                        <td>{animal.breed}</td>
                        <td>{animal.reporter}</td>
                        <td>{formatDate(animal.date)}</td>
                        <td>
                          {renderStatusBadge(animal.status)}
                        </td>
                        <td className="text-end pe-3">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant="link"
                              onClick={() => handleViewDetails(animal)}
                              className="btn-icon p-1"
                            >
                              <Eye size={15} className={darkMode ? "text-info" : "text-deep-raspberry"} />
                            </Button>
                            <Button
                              variant="link"
                              onClick={() => handleEdit(animal._id)}
                              className="btn-icon p-1"
                            >
                              <PencilSquare size={15} className={darkMode ? "text-warning" : "text-warning"} />
                            </Button>
                            <Button
                              variant="link"
                              onClick={() => handleDelete(animal._id)}
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

      {/* Pet Report Form Modal */}
      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        size="lg"
        centered
        contentClassName={darkMode ? 'bg-dark text-light' : ''}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className={darkMode ? 'text-light' : 'text-deep-raspberry'}>New Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AnimalReportForm
            onSuccess={() => {
              setShowFormModal(false);
              fetchAnimals(); // Refresh the animal list after successful submission
            }}
            darkMode={darkMode}
          />
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="link"
            onClick={() => setShowFormModal(false)}
            className="text-secondary"
          >
            Cancel
          </Button>
          <Button
            variant={darkMode ? "info" : "deep-raspberry"}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        size="lg"
        centered
        contentClassName={darkMode ? 'bg-dark text-light' : ''}
      >
        {selectedAnimal && (
          <>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className={darkMode ? 'text-light' : 'text-deep-raspberry'}>
                {selectedAnimal.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  {selectedAnimal.imageUrl ? (
                    <Image
                      src={selectedAnimal.imageUrl}
                      className="w-100 rounded"
                      style={{
                        height: '220px',
                        objectFit: 'cover'
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className="w-100 rounded d-flex justify-content-center align-items-center"
                      style={{
                        height: '220px',
                        backgroundColor: darkMode ? 'rgba(30, 42, 56, 0.4)' : 'rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <span className={darkMode ? 'text-light-emphasis' : 'text-muted'}>No Image</span>
                    </div>
                  )}
                  <div className="mt-3">
                    {renderStatusBadge(selectedAnimal.status)}
                  </div>
                </Col>
                <Col md={8}>
                  <div className="card h-100">
                    <div className={`card-body ${darkMode ? 'bg-dark text-light' : ''}`}>
                      <Row className="mb-3">
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>ID:</Col>
                        <Col xs={8}>{selectedAnimal._id}</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>Breed:</Col>
                        <Col xs={8}>{selectedAnimal.breed}</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>Reporter:</Col>
                        <Col xs={8}>{selectedAnimal.reporter}</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>Date:</Col>
                        <Col xs={8}>{formatDate(selectedAnimal.date)}</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>Address:</Col>
                        <Col xs={8}>{selectedAnimal.address}</Col>
                      </Row>
                      <Row>
                        <Col xs={4} className={darkMode ? 'text-light-emphasis' : 'text-muted'}>Remarks:</Col>
                        <Col xs={8}>{selectedAnimal.remarks}</Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button
                variant="link"
                onClick={handleCloseDetailsModal}
                className="text-secondary"
              >
                Close
              </Button>
              <Button
                variant={darkMode ? "info" : "deep-raspberry"}
                onClick={() => handleEdit(selectedAnimal._id)}
              >
                Edit
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

const DashboardOverview = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events and animals for the dashboard
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch events
      const eventsData = await getEvents();
      console.log('Dashboard fetched events:', eventsData);

      // Sort by date and take the first 3
      const sortedEvents = Array.isArray(eventsData) ? eventsData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3) : [];

      setEvents(sortedEvents);

      // Fetch animals
      const animalsData = await getAnimals();
      console.log('Dashboard fetched animals:', animalsData);
      setAnimals(animalsData || []);

      // Generate activity data based on events and animals
      generateActivityData(animalsData, eventsData);
    } catch (error) {
      console.error('Error fetching data for dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate activity data from events and animals
  const generateActivityData = (animalsData, eventsData) => {
    const activityItems = [];

    // Add recent animals as "added to database" activities
    if (Array.isArray(animalsData) && animalsData.length > 0) {
      // Sort by date descending and take most recent
      const recentAnimals = [...animalsData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

      recentAnimals.forEach(animal => {
        activityItems.push({
          id: `animal-${animal._id}`,
          type: 'animal',
          title: `${animal.name} added to database`,
          date: animal.date,
          icon: <Database size={16} />,
          iconBg: darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10',
          iconColor: darkMode ? 'text-info' : 'text-deep-raspberry'
        });
      });
    }

    // Add recent events as "scheduled" activities
    if (Array.isArray(eventsData) && eventsData.length > 0) {
      // Sort by date descending and take most recent
      const recentEvents = [...eventsData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

      recentEvents.forEach(event => {
        activityItems.push({
          id: `event-${event._id}`,
          type: 'event',
          title: `${event.title} event scheduled`,
          date: event.date,
          icon: <Calendar2 size={16} />,
          iconBg: 'bg-warning bg-opacity-10',
          iconColor: 'text-warning'
        });
      });
    }

    // Add a donation activity as an example
    activityItems.push({
      id: 'donation-example',
      type: 'donation',
      title: 'Donation received',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: <CurrencyDollar size={16} />,
      iconBg: 'bg-success bg-opacity-10',
      iconColor: 'text-success'
    });

    // Sort all activities by date (newest first)
    const sortedActivities = activityItems.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    setActivities(sortedActivities);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch (error) {
      return dateString;
    }
  };

  // Format relative time for activity items
  const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);

      if (isToday(date)) {
        return `Today, ${format(date, 'h:mm a')}`;
      } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      } else {
        return formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Dashboard</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
        >
          <span className="d-none d-sm-inline">Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className={`card h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Pets
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : animals.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Database size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className={`card h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Events
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : events.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-warning bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                  <Calendar2 size={18} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className={`card h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Accounts
                  </h6>
                  <h3 className="fw-bold mb-0">12</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-success bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                  <Person size={18} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className={`card h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Donations
                  </h6>
                  <h3 className="fw-bold mb-0">$1,250</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-primary bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                  <CurrencyDollar size={18} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="row g-3">
        <div className="col-lg-8">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <h5 className="card-title mb-3">Recent Activity</h5>

              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 small">Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <p className="text-center py-3">No recent activity found.</p>
              ) : (
                <div className="timeline">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`timeline-item ${index < activities.length - 1 ? 'pb-3 mb-3 border-bottom' : ''}`}
                    >
                      <div className="d-flex">
                        <div className={`rounded-circle p-2 me-3 ${activity.iconBg}`}>
                          {activity.icon && React.cloneElement(activity.icon, { className: activity.iconColor })}
                        </div>
                        <div>
                          <p className="mb-0 fw-medium">{activity.title}</p>
                          <p className={`mb-0 small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>
                            {formatRelativeTime(activity.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <h5 className="card-title mb-3">Upcoming Events</h5>

              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 small">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <p className="text-center py-3">No upcoming events found.</p>
              ) : (
                <div className="upcoming-events">
                  {events.map(event => (
                    <div
                      key={event._id}
                      className={`p-3 mb-2 rounded ${darkMode ? 'bg-dark' : 'bg-light'}`}
                      style={{ border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <div className="d-flex justify-content-between">
                        <span className="badge bg-primary">{formatDate(event.date)}</span>
                        <span className={`badge ${event.status === 'confirmed' ? 'bg-success' : event.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <h6 className="mt-2 mb-1">{event.title}</h6>
                      <p className={`small ${darkMode ? 'text-light-emphasis' : 'text-muted'} mb-0`}>{event.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const AccountingDatabase = ({ darkMode }) => {
  // Mock data
  const transactions = [
    { id: 'TX1001', date: '2023-08-01', description: 'Donation', amount: 250, type: 'income' },
    { id: 'TX1002', date: '2023-08-03', description: 'Vet Expense', amount: -75, type: 'expense' },
    { id: 'TX1003', date: '2023-08-05', description: 'Supplies Purchase', amount: -120, type: 'expense' },
    { id: 'TX1004', date: '2023-08-10', description: 'Fundraiser', amount: 500, type: 'income' },
    { id: 'TX1005', date: '2023-08-15', description: 'Staff Salary', amount: -350, type: 'expense' }
  ];

  const handleEdit = (id) => {
    console.log(`Edit transaction with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete transaction with ID: ${id}`);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'auto'
    }).format(amount);
  };

  // Transaction type badge renderer
  const renderTypeBadge = (type) => {
    let color, borderStyle, icon;

    if (type === 'income') {
      color = darkMode ? 'rgba(25, 135, 84, 0.9)' : 'rgba(25, 135, 84, 0.9)';
      borderStyle = darkMode ? '1px solid rgba(25, 135, 84, 0.5)' : '1px solid rgba(25, 135, 84, 0.5)';
      icon = <CurrencyDollar size={12} />;
    } else {
      color = darkMode ? 'rgba(220, 53, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)';
      borderStyle = darkMode ? '1px solid rgba(220, 53, 69, 0.5)' : '1px solid rgba(220, 53, 69, 0.5)';
      icon = <CurrencyDollar size={12} />;
    }

    return (
      <Badge
        bg={darkMode ? "transparent" : "transparent"}
        className="d-flex align-items-center gap-1 rounded-pill px-2 py-1"
        style={{
          width: 'fit-content',
          border: borderStyle,
          color: color
        }}
      >
        {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Financial Transactions</h2>
        <Button
          variant={darkMode ? "info" : "deep-raspberry"}
          size="sm"
          className="px-3"
          style={{ borderRadius: '4px' }}
        >
          Add Transaction
        </Button>
      </div>

      {/* Summary cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card
            className={`h-100 border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-0 fs-6`}>
                  Total Income
                </Card.Title>
                <div className={`rounded-circle p-2 ${darkMode ? 'bg-success bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                  <CurrencyDollar size={18} className="text-success" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="fw-bold mb-0 text-success">
                  {formatAmount(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className={`h-100 border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-0 fs-6`}>
                  Total Expenses
                </Card.Title>
                <div className={`rounded-circle p-2 ${darkMode ? 'bg-danger bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                  <CurrencyDollar size={18} className="text-danger" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="fw-bold mb-0 text-danger">
                  {formatAmount(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className={`h-100 border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-0 fs-6`}>
                  Net Balance
                </Card.Title>
                <div className={`rounded-circle p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <CurrencyDollar size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="fw-bold mb-0">
                  {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0))}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transactions count badge */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Badge
          bg={darkMode ? "info" : "deep-raspberry"}
          className="rounded-pill px-3 py-2"
        >
          {transactions.length} Transactions
        </Badge>
      </div>

      {/* Clean table */}
      <div className="table-responsive">
        <Table
          hover
          className={`align-middle ${darkMode ? 'text-light table-dark' : 'table-striped'}`}
          style={{
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr className={darkMode ? 'text-light-emphasis border-bottom border-secondary' : 'text-secondary border-bottom'}>
              <th className="fw-medium fs-6 ps-3">Transaction ID</th>
              <th className="fw-medium fs-6">Date</th>
              <th className="fw-medium fs-6">Description</th>
              <th className="fw-medium fs-6">Type</th>
              <th className="fw-medium fs-6">Amount</th>
              <th className="fw-medium fs-6 text-end pe-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={darkMode ? 'border-bottom border-secondary' : index % 2 === 0 ? 'bg-white' : 'bg-light'}
              >
                <td className="ps-3 py-2">
                  {transaction.id}
                </td>
                <td className="py-2">{formatDate(transaction.date)}</td>
                <td className="py-2">{transaction.description}</td>
                <td className="py-2">{renderTypeBadge(transaction.type)}</td>
                <td className="py-2" style={{
                  color: transaction.amount > 0
                    ? (darkMode ? 'rgba(25, 235, 84, 0.9)' : 'rgba(25, 135, 84, 0.9)')
                    : (darkMode ? 'rgba(220, 53, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)')
                }}>
                  {formatAmount(transaction.amount)}
                </td>
                <td className="text-end pe-3 py-2">
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="link"
                      onClick={() => handleEdit(transaction.id)}
                      className="d-flex align-items-center justify-content-center p-0"
                      style={{
                        width: '28px',
                        height: '28px'
                      }}
                    >
                      <PencilSquare size={15} className={darkMode ? "text-warning" : "text-warning"} />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(transaction.id)}
                      className="d-flex align-items-center justify-content-center p-0"
                      style={{
                        width: '28px',
                        height: '28px'
                      }}
                    >
                      <Trash size={15} className="text-danger" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};





const Settings = ({ darkMode }) => {
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Settings</h2>
        <Button
          variant={darkMode ? "info" : "deep-raspberry"}
          size="sm"
          className="px-3"
          style={{ borderRadius: '4px' }}
        >
          Save Changes
        </Button>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card
            className={`border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-4">System Settings</h5>

              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label className={darkMode ? 'text-light' : ''}>Site Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="TAARA Animal Rescue"
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label className={darkMode ? 'text-light' : ''}>Admin Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="admin@example.com"
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label className={darkMode ? 'text-light' : ''}>Default Language</Form.Label>
                    <Form.Select
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label className={darkMode ? 'text-light' : ''}>Timezone</Form.Label>
                    <Form.Select
                      className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    >
                      <option>UTC-08:00 Pacific Time</option>
                      <option>UTC-05:00 Eastern Time</option>
                      <option>UTC+00:00 Greenwich Mean Time</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className={darkMode ? 'text-light' : ''}>Database Backup Frequency</Form.Label>
                  <Form.Select
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="enable-notifications"
                    label="Enable Email Notifications"
                    className={darkMode ? 'text-light' : ''}
                    defaultChecked
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="enable-audit-log"
                    label="Enable Audit Logging"
                    className={darkMode ? 'text-light' : ''}
                    defaultChecked
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card
            className={`border-0 mb-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-3">System Information</h5>

              <div className="mb-3">
                <div className={`small ${darkMode ? 'text-light-emphasis' : 'text-secondary'}`}>Version</div>
                <div>2.5.1</div>
              </div>

              <div className="mb-3">
                <div className={`small ${darkMode ? 'text-light-emphasis' : 'text-secondary'}`}>Last Backup</div>
                <div>August 20, 2023 - 03:45 AM</div>
              </div>

              <div className="mb-3">
                <div className={`small ${darkMode ? 'text-light-emphasis' : 'text-secondary'}`}>Database Size</div>
                <div>245 MB</div>
              </div>

              <div>
                <div className={`small ${darkMode ? 'text-light-emphasis' : 'text-secondary'}`}>Server Status</div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Online</span>
                  <Badge bg="success" className="rounded-circle p-1"></Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card
            className={`border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-3">Quick Actions</h5>

              <div className="d-grid gap-2">
                <Button variant={darkMode ? "outline-info" : "outline-deep-raspberry"} className="d-flex align-items-center justify-content-center gap-2">
                  <FileEarmarkText size={16} /> Export Data
                </Button>

                <Button variant={darkMode ? "outline-info" : "outline-deep-raspberry"} className="d-flex align-items-center justify-content-center gap-2">
                  <Bell size={16} /> Test Notifications
                </Button>

                <Button variant="outline-danger" className="d-flex align-items-center justify-content-center gap-2">
                  <Trash size={16} /> Clear Cache
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const Logout = ({ darkMode }) => {
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card
            className={`border-0 text-center ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
            style={{
              borderRadius: '10px',
              boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Card.Body className="p-5">
              <div className={`rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center ${darkMode ? 'bg-danger bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                style={{ width: '80px', height: '80px' }}>
                <BoxArrowRight size={40} className="text-danger" />
              </div>

              <h3 className="mb-3">You've Been Logged Out</h3>
              <p className={`mb-4 ${darkMode ? 'text-light-emphasis' : 'text-secondary'}`}>
                Thank you for using the TAARA Admin Dashboard. You have been successfully logged out of your account.
              </p>

              <div className="d-grid gap-2">
                <Button variant={darkMode ? "info" : "deep-raspberry"} size="lg">
                  Log In Again
                </Button>
                <Button variant="link" className={darkMode ? 'text-light' : 'text-secondary'}>
                  Return to Homepage
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const MainContent = ({ activeView, darkMode }) => {
  switch (activeView) {
    case 'dashboard':
      return <DashboardOverview darkMode={darkMode} />;
    case 'animal':
      return <AnimalDatabase darkMode={darkMode} />;
    case 'account':
      return <AccountDatabase darkMode={darkMode} />;
    case 'accounting':
      return <AccountingDatabase darkMode={darkMode} />;
    case 'calendar':
      return <EventCalendar darkMode={darkMode} />;
    case 'adoption':
      return <AdoptionDatabase darkMode={darkMode} />;
    case 'rescue':
      return <PetRescue darkMode={darkMode} />;
    case 'gallery':
      return <PetGallery darkMode={darkMode} />;
    case 'rainbow':
      return <RainbowBridge darkMode={darkMode} />;
    case 'aboutus':
      return <AboutOrganization darkMode={darkMode} />;
    case 'settings':
      return <Settings darkMode={darkMode} />;
    case 'logout':
      return <Logout darkMode={darkMode} />;
    default:
      return <DashboardOverview darkMode={darkMode} />;
  }
};

export default MainContent;

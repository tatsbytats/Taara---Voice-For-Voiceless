import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Container, Spinner, Alert, Modal } from 'react-bootstrap';
import { getMemorials, incrementCandleCount } from '../../services/memorialService';
import MemorialSubmissionForm from './MemorialSubmissionForm';
import '../../assets/styles/custom-text-colors.css';
import '../../assets/styles/custom-buttons.css';
import '../../assets/styles/default.css';

const RainbowBridge = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Handle opening and closing the submission modal
  const handleOpenSubmissionModal = () => setShowSubmissionModal(true);
  const handleCloseSubmissionModal = () => setShowSubmissionModal(false);

  // Handle successful submission
  const handleSubmissionSuccess = () => {
    // Close the modal after a delay
    setTimeout(() => {
      setShowSubmissionModal(false);
      // Refresh the memorials list to show newly approved ones
      fetchMemorials();
    }, 2000);
  };

  // Fetch memorials from the API
  const fetchMemorials = async () => {
    try {
      setLoading(true);
      // Only fetch approved memorials for public display
      const data = await getMemorials('approved');
      setMemorials(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching memorials:', err);
      setError('Failed to load memorial data. Please try again later.');
      // Use mock data as fallback if API fails
      setMemorials([
        {
          _id: '1',
          name: 'Max',
          type: 'Dog',
          breed: 'Golden Retriever',
          years: '2008 - 2020',
          image: '/default-pet-image.jpg',
          quote: 'The most loyal companion one could ask for.',
          story: 'Max was more than a pet — he was family. Rain or shine, he was always there to bring comfort and joy to our home.'
        },
        {
          _id: '2',
          name: 'Whiskers',
          type: 'Cat',
          breed: 'Siamese',
          years: '2012 - 2022',
          image: '/default-pet-image.jpg',
          quote: 'Always curious, forever in our hearts.',
          story: 'Whiskers had a gentle soul and loved sleeping in sunny windows. She would greet every visitor and curl up with us every night.'
        },
        {
          _id: '3',
          name: 'Bella',
          type: 'Dog',
          breed: 'Labrador',
          years: '2015 - 2023',
          image: '/default-pet-image.jpg',
          quote: 'Brought joy to every moment.',
          story: 'Bella loved swimming and long walks in the park. She comforted us during hard times and always had a wagging tail to share.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch memorials on component mount
  useEffect(() => {
    fetchMemorials();
  }, []);

  return (
    <div className="bg-light py-5">
      <Container className="text-center">
        <h2 className="mb-3 text-deep-raspberry fw-bold">Rainbow Bridge</h2>

        <p className="lead text-muted mb-3">
          In loving memory of the animals we've loved and lost.
        </p>

        <blockquote className="blockquote text-secondary">
          <p className="mb-0 fst-italic">
            "Until one has loved an animal, a part of one's soul remains unawakened."
          </p>
          <footer className="blockquote-footer mt-2 small">Anatole France</footer>
        </blockquote>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="deep-raspberry" />
            <p className="mt-2 text-muted">Loading memorials...</p>
          </div>
        ) : error ? (
          <Alert variant="warning" className="my-4">
            {error}
          </Alert>
        ) : (
          <div className="mt-5">
            <h4 className="mb-4 text-deep-raspberry">Our Beloved Companions</h4>
            {memorials.length === 0 ? (
              <p className="text-muted">No memorials available at this time.</p>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {memorials.map((pet) => (
                  <Col key={pet._id || pet.id}>
                    <PetCard pet={pet} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        <Button
          variant="sunrise-coral"
          className="mt-5"
          onClick={handleOpenSubmissionModal}
        >
          Share Your Memorial
        </Button>

        {/* Memorial Submission Modal */}
        <Modal
          show={showSubmissionModal}
          onHide={handleCloseSubmissionModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Share Your Memorial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MemorialSubmissionForm
              onClose={handleCloseSubmissionModal}
              onSuccess={handleSubmissionSuccess}
              darkMode={false}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

const PetCard = ({ pet }) => {
  const petId = pet._id || pet.id;
  const [candleCount, setCandleCount] = useState(() => {
    // First try to get from API data if available
    if (pet.candleCount !== undefined) {
      return pet.candleCount;
    }
    // Fall back to localStorage if needed
    const saved = localStorage.getItem(`candleCount_${petId}`);
    return saved ? parseInt(saved) : 0;
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLightCandle = async () => {
    try {
      setIsUpdating(true);
      const updated = candleCount + 1;
      setCandleCount(updated);

      // Store in localStorage as backup
      localStorage.setItem(`candleCount_${petId}`, updated.toString());

      // Update in database if we have a real ID
      if (pet._id) {
        await incrementCandleCount(pet._id);
      }
    } catch (error) {
      console.error('Error updating candle count:', error);
      // Keep the UI updated even if API fails
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={pet.image || '/default-pet-image.jpg'}
          alt={pet.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-pet-image.jpg';
          }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-deep-raspberry">{pet.name}</Card.Title>
        <Card.Subtitle className="mb-1 text-muted small">
          {pet.type} • {pet.breed}
        </Card.Subtitle>
        <Card.Text className="text-muted small">{pet.years}</Card.Text>

        <Card.Text className="fst-italic text-secondary small">
          "{pet.quote}"
        </Card.Text>

        {pet.story && (
          <Card.Text className="mt-2 small text-dark">
            {pet.story}
          </Card.Text>
        )}
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 pt-0">
        <Button
          variant="outline-secondary"
          size="sm"
          className="w-100"
          onClick={handleLightCandle}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
              Lighting...
            </>
          ) : (
            <>🕯 Light a Candle ({candleCount})</>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default RainbowBridge;

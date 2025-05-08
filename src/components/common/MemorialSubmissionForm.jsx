import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { createMemorial } from '../../services/memorialService';

const MemorialSubmissionForm = ({ onClose, onSuccess, darkMode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const form = e.target;
      const formData = new FormData(form);
      
      // Add status as pending (this will be the default on the server too)
      formData.append('status', 'pending');
      
      // Submit the memorial
      await createMemorial(formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
      
      // Notify parent component if needed
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (err) {
      console.error('Error submitting memorial:', err);
      setError('Failed to submit your memorial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={darkMode ? 'text-light' : ''}>
      <h4 className="mb-4">Share Your Memorial</h4>
      
      {success ? (
        <Alert variant="success">
          <Alert.Heading>Thank you for your submission!</Alert.Heading>
          <p>
            Your memorial has been submitted for review. Once approved by our team, 
            it will appear on the Rainbow Bridge page. We'll notify you by email when 
            it's published.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              variant={darkMode ? "outline-light" : "outline-success"} 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </Alert>
      ) : (
        <>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pet Name*</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="Your pet's name"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="ownerName"
                    placeholder="Your name (optional)"
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
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Your Email*</Form.Label>
              <Form.Control 
                type="email" 
                name="submitterEmail"
                placeholder="your.email@example.com"
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
              <Form.Text className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                We'll notify you when your memorial is approved
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control 
                as="textarea" 
                name="submissionNotes"
                rows={2}
                placeholder="Any additional information you'd like to share with our team..."
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
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
                    Submitting...
                  </>
                ) : (
                  'Submit Memorial'
                )}
              </Button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default MemorialSubmissionForm;

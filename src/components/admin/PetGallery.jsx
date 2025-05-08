import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form, Modal, Spinner, Alert, Badge, InputGroup } from 'react-bootstrap';
import { PlusCircle, Trash, PencilSquare, Images, Tags, Upload, SortDown, XCircleFill } from 'react-bootstrap-icons';

// Mock data for fallback when API is not available
const MOCK_GALLERY_DATA = [
  {
    _id: 'mock1',
    title: 'Sample Dog Image',
    caption: 'A beautiful rescue dog',
    category: 'dogs',
    tags: ['#rescue', '#adoption'],
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock2',
    title: 'Sample Cat Image',
    caption: 'A cute rescue cat',
    category: 'cats',
    tags: ['#rescue', '#kitten'],
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
    createdAt: new Date().toISOString()
  }
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PetGallery = ({ darkMode }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    currentTag: '',
    featured: false,
    imageUrl: '',
    imageFile: null
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file
      });

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      setLoading(true);
      // Fix: Use the correct API URL format
      // API_URL already includes '/api', so we should NOT add it again
      const galleryUrl = `${API_URL.replace(/\/api$/, '')}/api/gallery`;
      console.log('Fetching gallery images from:', galleryUrl);

      // Add a timeout to the fetch to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(galleryUrl, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gallery data received:', data);
      setImages(data);
      setFilteredImages(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching gallery images:', err);

      // Use mock data as fallback when API is not available
      console.log('Using mock gallery data as fallback');
      setImages(MOCK_GALLERY_DATA);
      setFilteredImages(MOCK_GALLERY_DATA);
      setError('Could not connect to the server. Using sample data for preview.');
      setLoading(false);
    }
  };

  // Apply filters and sorting to images
  useEffect(() => {
    if (!images.length) return;

    let result = [...images];

    // Apply tag filter
    if (filterTag) {
      const searchTag = filterTag.startsWith('#') ? filterTag : `#${filterTag}`;
      result = result.filter(img =>
        img.tags && img.tags.some(tag =>
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredImages(result);
  }, [images, filterTag, sortBy]);

  // Initial data fetch
  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImage = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedImage(null);
    setSuccessMessage('');
    setError(null);
    setFormData({
      title: '',
      tags: '',
      currentTag: '',
      featured: false,
      imageUrl: '',
      imageFile: null
    });
    setPreviewUrl('');
    setUploadType('url');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };



  const handleUploadTypeChange = (type) => {
    setUploadType(type);
    // Clear the other upload type data
    if (type === 'url') {
      setFormData({
        ...formData,
        imageFile: null
      });
    } else {
      setFormData({
        ...formData,
        imageUrl: ''
      });
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData object for file uploads
      const submitData = new FormData();
      submitData.append('title', formData.title);
      // Set default values for required fields in the backend
      submitData.append('caption', formData.title); // Use title as caption
      submitData.append('category', 'other'); // Default category
      submitData.append('tags', formData.tags);
      submitData.append('featured', formData.featured);

      // Handle file upload or URL
      if (uploadType === 'file' && formData.imageFile) {
        submitData.append('image', formData.imageFile);
      } else if (uploadType === 'url' && formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
      }

      // Add a timeout to the fetch to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      let response;

      // Fix: Use the correct API URL format
      const galleryUrl = `${API_URL.replace(/\/api$/, '')}/api/gallery`;

      if (selectedImage) {
        // Update existing image
        response = await fetch(`${galleryUrl}/${selectedImage._id}`, {
          method: 'PUT',
          body: submitData,
          signal: controller.signal
        });
      } else {
        // Create new image
        response = await fetch(galleryUrl, {
          method: 'POST',
          body: submitData,
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save image');
      }

      await response.json(); // Process the response

      // Show success message
      setSuccessMessage(selectedImage ? 'Image updated successfully!' : 'Image added to gallery successfully!');

      // Refresh the gallery
      fetchImages();

      // Close modal after a short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (err) {
      console.error('Error saving gallery image:', err);

      if (err.name === 'AbortError') {
        setError('Request timed out. The server might be unavailable. Please try again later.');
      } else {
        setError(err.message || 'Failed to save image. Please try again.');
      }

      // If we're in development/testing mode, simulate success for UI testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating successful image submission');
        setSuccessMessage(selectedImage ? 'Image updated successfully (simulated)!' : 'Image added to gallery successfully (simulated)!');

        // Close modal after a short delay
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditImage = (image) => {
    setSelectedImage(image);

    // Format tags for display in form
    const tagsString = image.tags ? image.tags.map(tag => tag.replace('#', '')).join(', ') : '';

    setFormData({
      title: image.title || '',
      tags: tagsString,
      currentTag: '',
      featured: image.featured || false,
      imageUrl: image.imageUrl || '',
      imageFile: null
    });

    // Default to URL upload for editing
    setUploadType('url');
    setShowAddModal(true);
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      try {
        setLoading(true);

        // Add a timeout to the fetch to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Fix: Use the correct API URL format
        const galleryUrl = `${API_URL.replace(/\/api$/, '')}/api/gallery`;
        const response = await fetch(`${galleryUrl}/${imageId}`, {
          method: 'DELETE',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        // Update the UI
        setImages(images.filter(img => img._id !== imageId));
        setSuccessMessage('Image deleted successfully!');

        // Clear success message after a delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);

      } catch (err) {
        console.error('Error deleting image:', err);

        if (err.name === 'AbortError') {
          setError('Request timed out. The server might be unavailable. Please try again later.');
        } else {
          setError('Failed to delete image. Please try again.');
        }

        // If we're in development/testing mode, simulate success for UI testing
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Simulating successful image deletion');
          setImages(images.filter(img => img._id !== imageId));
          setSuccessMessage('Image deleted successfully (simulated)!');

          // Clear success message after a delay
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`fw-bold ${darkMode ? 'text-light' : 'text-deep-raspberry'}`}>Gallery Management</h2>
        <Button
          variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={handleAddImage}
        >
          <PlusCircle size={14} />
          <span>Add Image</span>
        </Button>
      </div>

      {/* Filtering and Sorting Controls */}
      <div className="mb-4">
        <Row className="g-2">
          <Col md={6}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <Tags size={14} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Filter by tag..."
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              />
              {filterTag && (
                <Button
                  variant={darkMode ? "outline-secondary" : "outline-secondary"}
                  onClick={() => setFilterTag('')}
                >
                  <XCircleFill size={14} />
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={6}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <SortDown size={14} />
              </InputGroup.Text>
              <Form.Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className={`alert ${darkMode ? 'alert-info' : 'alert-success'} my-3 d-flex align-items-center justify-content-between`}>
          <p className="mb-0">{successMessage}</p>
          <Button
            variant="close"
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          />
        </div>
      )}

      {/* Stats card */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className={`card ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`${darkMode ? 'text-light-emphasis' : 'text-secondary'} mb-1 small text-uppercase`}>
                    Total Images
                  </h6>
                  <h3 className="fw-bold mb-0">{loading ? '...' : images.length}</h3>
                </div>
                <div className={`rounded p-2 ${darkMode ? 'bg-info bg-opacity-10' : 'bg-deep-raspberry bg-opacity-10'}`}>
                  <Images size={18} className={darkMode ? 'text-info' : 'text-deep-raspberry'} />
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
          <p className="mt-3">Loading gallery images...</p>
        </div>
      )}

      {error && (
        <div className={`alert ${darkMode ? 'alert-danger' : 'alert-danger'} my-4`}>
          <p className="mb-0">{error}</p>
          <Button
            variant={darkMode ? "outline-light" : "outline-danger"}
            size="sm"
            className="mt-2"
            onClick={() => fetchImages()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <>
          {filteredImages.length === 0 ? (
            <div className="text-center py-5 my-4">
              <div className="mb-3">
                <Images size={48} className={darkMode ? 'text-secondary' : 'text-muted'} />
              </div>
              <h4 className={darkMode ? 'text-light' : 'text-dark'}>No images found</h4>
              <p className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                {images.length > 0
                  ? 'Try adjusting your filters to see more results.'
                  : 'Add your first image to the gallery.'}
              </p>
              {images.length > 0 && (
                <Button
                  variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
                  size="sm"
                  onClick={() => {
                    setFilterTag('');
                    setSortBy('newest');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {filteredImages.map(image => (
                <Col key={image._id}>
                  <Card
                    className={`h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
                    style={{
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={image.imageUrl}
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
                        {image.featured && (
                          <span className="badge bg-primary">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="position-absolute bottom-0 end-0 m-2 d-flex gap-1">
                        <Button
                          variant={darkMode ? "dark" : "light"}
                          size="sm"
                          className="d-flex align-items-center justify-content-center p-1"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => handleEditImage(image)}
                        >
                          <PencilSquare size={14} />
                        </Button>
                        <Button
                          variant={darkMode ? "dark" : "light"}
                          size="sm"
                          className="d-flex align-items-center justify-content-center p-1"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => handleDeleteImage(image._id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title className="h6 mb-2">{image.title}</Card.Title>
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {image.tags && image.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            bg={darkMode ? 'info' : 'deep-raspberry'}
                            className="bg-opacity-25 text-dark"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setFilterTag(tag.replace('#', ''))}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Add/Edit Image Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        contentClassName={darkMode ? 'bg-dark text-light' : ''}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage ? 'Edit Image' : 'Add New Image'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}

          <Form onSubmit={handleImageSubmit}>
            {/* Image Upload Options */}
            <div className="mb-3">
              <div className="btn-group w-100">
                <Button
                  variant={uploadType === 'url' ? (darkMode ? 'info' : 'deep-raspberry') : (darkMode ? 'outline-info' : 'outline-deep-raspberry')}
                  onClick={() => handleUploadTypeChange('url')}
                  className="w-50"
                >
                  Image URL
                </Button>
                <Button
                  variant={uploadType === 'file' ? (darkMode ? 'info' : 'deep-raspberry') : (darkMode ? 'outline-info' : 'outline-deep-raspberry')}
                  onClick={() => handleUploadTypeChange('file')}
                  className="w-50"
                >
                  Upload File
                </Button>
              </div>
            </div>

            {/* URL Input */}
            {uploadType === 'url' && (
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                  required={uploadType === 'url'}
                />
                <Form.Text className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                  Enter a direct link to an image
                </Form.Text>
              </Form.Group>
            )}

            {/* File Upload */}
            {uploadType === 'file' && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <div className={`p-3 rounded text-center ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light border'}`}>
                  <Upload size={24} className={`mb-2 ${darkMode ? 'text-info' : 'text-deep-raspberry'}`} />
                  <p className="mb-2">Select an image to upload</p>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className={`${darkMode ? 'bg-dark text-light border-secondary' : ''} mb-2`}
                    required={uploadType === 'file' && !selectedImage}
                  />
                  <Form.Text className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                    Max file size: 5MB. Supported formats: JPG, PNG, GIF
                  </Form.Text>
                </div>

                {formData.imageFile && previewUrl && (
                  <div className="mt-3 p-3 rounded border">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-bold">{formData.imageFile.name}</p>
                        <p className="mb-0 small text-muted">
                          {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant={darkMode ? "outline-danger" : "outline-danger"}
                        size="sm"
                        onClick={() => {
                          setFormData({...formData, imageFile: null});
                          setPreviewUrl('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <XCircleFill />
                      </Button>
                    </div>
                  </div>
                )}
              </Form.Group>
            )}

            {/* Image Preview */}
            {(formData.imageUrl || (selectedImage && selectedImage.imageUrl)) && uploadType === 'url' && (
              <div className="mb-3 text-center">
                <img
                  src={formData.imageUrl || selectedImage.imageUrl}
                  alt="Preview"
                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Image title"
                value={formData.title}
                onChange={handleInputChange}
                className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className={`p-2 rounded ${darkMode ? 'bg-dark text-light border-secondary' : 'border'}`}>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {formData.tags.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
                    .map((tag, index) => (
                      <Badge
                        key={index}
                        bg={darkMode ? "info" : "deep-raspberry"}
                        className="d-flex align-items-center py-2 px-3"
                      >
                        #{tag}
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 ms-2 text-light"
                          onClick={() => {
                            const updatedTags = formData.tags
                              .split(',')
                              .map(t => t.trim())
                              .filter((_, i) => i !== index)
                              .join(', ');
                            setFormData({...formData, tags: updatedTags});
                          }}
                        >
                          <XCircleFill size={14} />
                        </Button>
                      </Badge>
                    ))
                  }
                  {formData.tags.split(',').filter(tag => tag.trim().length > 0).length === 0 && (
                    <div className={`small ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>
                      No tags added yet
                    </div>
                  )}
                </div>

                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Type a tag and press Enter"
                    value={formData.currentTag || ''}
                    onChange={(e) => setFormData({...formData, currentTag: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && formData.currentTag?.trim()) {
                        e.preventDefault();
                        const newTag = formData.currentTag.trim();
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

                        // Only add if it doesn't already exist
                        if (!currentTags.includes(newTag)) {
                          const updatedTags = [...currentTags, newTag].join(', ');
                          setFormData({
                            ...formData,
                            tags: updatedTags,
                            currentTag: ''
                          });
                        } else {
                          setFormData({...formData, currentTag: ''});
                        }
                      }
                    }}
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                  />
                  <Button
                    variant={darkMode ? "outline-info" : "outline-deep-raspberry"}
                    onClick={() => {
                      if (formData.currentTag?.trim()) {
                        const newTag = formData.currentTag.trim();
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

                        // Only add if it doesn't already exist
                        if (!currentTags.includes(newTag)) {
                          const updatedTags = [...currentTags, newTag].join(', ');
                          setFormData({
                            ...formData,
                            tags: updatedTags,
                            currentTag: ''
                          });
                        } else {
                          setFormData({...formData, currentTag: ''});
                        }
                      }
                    }}
                  >
                    Add
                  </Button>
                </InputGroup>
                <Form.Text className={`mt-2 ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>
                  The # symbol will be added automatically. Press Enter or click Add after typing each tag.
                </Form.Text>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Image"
                checked={formData.featured}
                onChange={handleInputChange}
                className={darkMode ? 'text-light' : ''}
              />
              <Form.Text className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                Featured images may be displayed prominently on the landing page
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
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
                    {selectedImage ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  selectedImage ? 'Update Image' : 'Add Image'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PetGallery;

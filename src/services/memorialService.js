import axios from 'axios';

// For development, use localhost:5000 if REACT_APP_API_URL is not set
const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api/memorials'
  : `${process.env.REACT_APP_API_URL || ''}/api/memorials`;

console.log('Memorial service using BASE_URL:', BASE_URL);

// Get all memorials with optional status filter
export const getMemorials = async (status, isAdmin = false) => {
  try {
    const params = {};

    // Add status filter if provided
    if (status) {
      params.status = status;
    }

    // Add admin flag if needed
    if (isAdmin) {
      params.isAdmin = true;
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching memorials:', error);
    throw error;
  }
};

// Get single memorial by ID
export const getMemorialById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching memorial with ID ${id}:`, error);
    throw error;
  }
};

// Create new memorial
export const createMemorial = async (memorialData) => {
  try {
    // Handle form data if there's a file upload
    let formData;
    if (memorialData instanceof FormData) {
      formData = memorialData;
    } else {
      formData = new FormData();
      Object.keys(memorialData).forEach(key => {
        formData.append(key, memorialData[key]);
      });
    }

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating memorial:', error);
    throw error;
  }
};

// Update memorial
export const updateMemorial = async (id, memorialData) => {
  try {
    // Handle form data if there's a file upload
    let formData;
    if (memorialData instanceof FormData) {
      formData = memorialData;
    } else {
      formData = new FormData();
      Object.keys(memorialData).forEach(key => {
        formData.append(key, memorialData[key]);
      });
    }

    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating memorial with ID ${id}:`, error);
    throw error;
  }
};

// Delete memorial
export const deleteMemorial = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting memorial with ID ${id}:`, error);
    throw error;
  }
};

// Update candle count
export const incrementCandleCount = async (id) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/candle`);
    return response.data;
  } catch (error) {
    console.error(`Error updating candle count for memorial with ID ${id}:`, error);
    throw error;
  }
};

// Update memorial status
export const updateMemorialStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for memorial with ID ${id}:`, error);
    throw error;
  }
};

// Get pending memorials (admin only)
export const getPendingMemorials = async () => {
  return getMemorials('pending', true);
};

// Don't use default export to avoid circular dependencies
// Individual named exports are already available

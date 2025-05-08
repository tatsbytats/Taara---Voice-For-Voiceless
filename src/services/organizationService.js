import axios from 'axios';

// For development, use localhost:5000 if REACT_APP_API_URL is not set
const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api/organization'
  : `${process.env.REACT_APP_API_URL || ''}/api/organization`;

console.log('Organization service using BASE_URL:', BASE_URL);

// Get organization information
export const getOrganizationInfo = async () => {
  try {
    console.log(`Fetching organization info from: ${BASE_URL}`);
    const response = await axios.get(BASE_URL, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Organization API response status:', response.status);

    if (!response.data) {
      console.warn('Organization API returned empty data');
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching organization info:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Update organization information
export const updateOrganizationInfo = async (organizationData) => {
  try {
    console.log(`Updating organization info at: ${BASE_URL}`);
    console.log('Data being sent:', organizationData);

    const response = await axios.put(BASE_URL, organizationData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Organization update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating organization info:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Don't use default export to avoid circular dependencies
// Individual named exports are already available

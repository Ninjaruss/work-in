import axios from 'axios';

const API_URL = '/api/calendars/';

// Set the authentication token in the request headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Access-Control-Allow-Origin'] = '*'; // Add this line to enable CORS
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'; // Add the allowed methods for CORS
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle API errors
const handleApiError = (error) => {
  if (error.response && error.response.data) {
    throw new Error(error.response.data.message);
  } else {
    throw new Error(`An error occurred: ${error.message}`);
  }
};

// Construct URL with API base and endpoint
const constructApiUrl = (endpoint) => `${API_URL}${endpoint}`;

// Create a new calendar
export const createCalendar = async (calendarData) => {
  try {
    const response = await axios.post(constructApiUrl(''), calendarData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get a calendar by ID
export const getCalendarById = async (calendarId) => {
  try {
    const response = await axios.get(constructApiUrl(`${calendarId}`));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update a calendar by ID
export const updateCalendar = async (calendarId, calendarData) => {
  try {
    const response = await axios.put(constructApiUrl(`${calendarId}`), calendarData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete a calendar by ID
export const deleteCalendar = async (calendarId) => {
  try {
    const response = await axios.delete(constructApiUrl(`${calendarId}`));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get a calendar by user ID
export const getCalendarByUserId = async (userId) => {
  try {
    const response = await axios.get(constructApiUrl(`user/${userId}`));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update a calendar by user ID
export const updateCalendarByUserId = async (userId, calendarData) => {
  try {
    const response = await axios.put(constructApiUrl(`user/${userId}`), calendarData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch calendar by organization ID
export const getCalendarByOrganizationId = async (organizationId) => {
  try {
    const response = await axios.get(constructApiUrl(`organization/${organizationId}`));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update calendar by organization ID
export const updateCalendarByOrganizationId = async (organizationId, calendarData) => {
  try {
    const response = await axios.put(constructApiUrl(`organization/${organizationId}`), calendarData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete a calendar by user ID
export const deleteCalendarByUserId = async (userId) => {
  try {
    const response = await axios.delete(constructApiUrl(`user/${userId}`));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

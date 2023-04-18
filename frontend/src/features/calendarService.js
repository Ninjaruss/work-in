import axios from 'axios';

const API_URL = '/api/calendars/'

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


// Create a new calendar
export const createCalendar = async (calendarData) => {
  try {
    const response = await axios.post(`${API_URL}`, calendarData);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to create calendar: ${error.message}`);
  }
};

// Get a calendar by ID
export const getCalendarById = async (calendarId) => {
  try {
    const response = await axios.get(`${API_URL}/${calendarId}`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to get calendar by ID: ${error.message}`);
  }
};

// Update a calendar by ID
export const updateCalendar = async (calendarId, calendarData) => {
  try {
    const response = await axios.put(`${API_URL}/${calendarId}`, calendarData);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to update calendar by ID: ${error.message}`);
  }
};

// Delete a calendar by ID
export const deleteCalendar = async (calendarId) => {
  try {
    const response = await axios.delete(`${API_URL}/${calendarId}`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to delete calendar by ID: ${error.message}`);
  }
};

// Get a calendar by user ID
export const getCalendarByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to get calendar by user ID: ${error.message}`);
  }
};

// Update a calendar by user ID
export const updateCalendarByUserId = async (userId, calendarData) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}`, calendarData);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to update calendar by user ID: ${error.message}`);
  }
};

// Update a calendar by organization ID
export const updateCalendarByOrganizationId = async (organizationId, calendarData) => {
  try {
    const response = await axios.put(`${API_URL}/organization/${organizationId}`, calendarData);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to update calendar by organization ID: ${error.message}`);
  }
};

// Delete a calendar by user ID
export const deleteCalendarByUserId = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error(`Failed to delete calendar by user ID: ${error.message}`);
  }
};

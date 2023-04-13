import axios from 'axios';

const API_URL = '/api/calendars/'; // Your backend API URL

// Create a new calendar
export const createCalendar = (calendarData) => {
  return axios.post(`${API_URL}`, calendarData);
};

// Get a calendar by id
export const getCalendarById = (calendarId) => {
  return axios.get(`${API_URL}/${calendarId}`);
};

// Update a calendar
export const updateCalendar = (calendarId, calendarData) => {
  return axios.put(`${API_URL}/${calendarId}`, calendarData);
};

// Delete a calendar
export const deleteCalendar = (calendarId) => {
  return axios.delete(`${API_URL}/${calendarId}`);
};

// Get a calendar by user id
export const getCalendarByUserId = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};
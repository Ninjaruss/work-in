import axios from 'axios';

const API_URL = '/api/users/'; // Use this as the base URL for API requests

const validateEmail = (email) => {
  // Regular expression for email validation
  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegExp.test(email);
};

// Register user
const register = async (userData) => {
  // Perform email validation check
  if (!validateEmail(userData.email)) {
    throw new Error('Invalid email address');
  }

  try {
    const response = await axios.post(API_URL, userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw new Error('Failed to register user');
  }
};

// Register user
const registerAll = async (orgData) => {
  try {
    const response = await axios.post(API_URL + 'registerAll', orgData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to register all users');
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Extract error message from response object and throw custom error object
      throw new Error(error.response.data.message);
    } else {
      // Throw generic error message for other types of errors
      throw new Error('Failed to login user');
    }
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Send email verification request
const sendEmailVerification = async (email, verificationToken) => {
  try {
    const response = await axios.post(API_URL + 'sendEmailVerification', { email, token: verificationToken });

    if (response.data && response.data.data) {
      // Update Redux store with email verification status
      // Assuming response.data.data.emailVerified is a boolean value indicating whether the email is verified or not
      return Boolean(response.data.data.verified);
    }
  } catch (error) {
    throw new Error('Failed to send email verification request');
  }
};

// Verify email
const verifyEmail = async (verificationToken) => {
  const response = await axios.post(API_URL + 'verifyEmail', { token: verificationToken });

  if (response.data && response.data.message === 'Email verified successfully') {
    // Update Redux store with email verification status
    // Assuming response.data.emailVerified is a boolean value indicating whether the email is verified or not
    return true;
  } else {
    throw new Error('Email verification failed');
  }
};

const authService = {
  register,
  registerAll,
  logout,
  login,
  sendEmailVerification,
  verifyEmail
};

export default authService;

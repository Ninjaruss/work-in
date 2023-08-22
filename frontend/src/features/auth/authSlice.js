import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

const validateEmail = (email) => {
  // Regular expression for email validation
  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegExp.test(email);
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    const { email } = user; // Extract email from user object
    // Validate email
    if (!validateEmail(email)) {
      // If email is invalid, reject with an error message
      return thunkAPI.rejectWithValue('Invalid email address');
    }

    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register multiple users
export const registerAll = createAsyncThunk(
  'auth/registerAll',
  async (data, thunkAPI) => {
    const { user, orgName, employees, employeeSchedules } = data; // Extract email from user object

    try {
      return await authService.registerAll(data);
    } catch (error) {
      console.error('Error in registerAll async thunk:', error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Async thunk for verifying email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      await authService.verifyEmail(token);
      // Update localstorage's user data
      localStorage.setItem('user');
      return { success: true, user };
    } catch (error) {
      // Handle error, e.g. show error message or dispatch failure action
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Failed to verify email';
        return thunkAPI.rejectWithValue({ success: false, error: message });
    }
  }
);

// Async thunk for sending email verification request
export const sendEmailVerification = createAsyncThunk(
  'auth/sendEmailVerification',
  async (email, thunkAPI) => {
    try {
      // Call the backend API to send email verification request
      await authService.sendEmailVerification(email);
      return; // Add return statement here
    } catch (error) {
      // Handle error, e.g. show error message or dispatch failure action
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Failed to resend verification email';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || '' // Set empty string if no message
        state.user = null
      })
      .addCase(registerAll.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerAll.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(registerAll.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || '' // Set empty string if no message
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || '' // Set empty string if no message
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, verified: true };
      })      
      .addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload || ''; // Set empty string if no message
      });
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer

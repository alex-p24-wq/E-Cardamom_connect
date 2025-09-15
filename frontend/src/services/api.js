import axios from 'axios';

const API_URL = (import.meta?.env?.VITE_API_URL) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token and App Check token
api.interceptors.request.use(
  async (config) => {
    // Attach JWT if present
    const jwt = localStorage.getItem('token');
    if (jwt) config.headers.Authorization = `Bearer ${jwt}`;

    // Try to attach Firebase App Check token (non-blocking)
    try {
      const { getAppCheckToken } = await import('../utils/firebase');
      const appCheckToken = await getAppCheckToken();
      if (appCheckToken) config.headers['X-App-Check'] = appCheckToken;
    } catch (_) {
      // Ignore failures silently
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message || 'Network error';
    throw { message: msg };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message || 'Network error';
    throw { message: msg };
  }
};

export const sendEmailOtp = async (email) => {
  try {
    const res = await api.post('/auth/send-email-otp', { email });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message || 'Network error';
    throw { message: msg };
  }
};

export const verifyEmailOtp = async (email, otp) => {
  try {
    const res = await api.post('/auth/verify-email-otp', { email, otp });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message || 'Network error';
    throw { message: msg };
  }
};

// Customer orders services
export const getCustomerOrders = async ({ status, page = 1, limit = 20 } = {}) => {
  try {
    const response = await api.get('/customer/orders', { params: { status, page, limit } });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch orders';
    throw { message: msg };
  }
};

export const getCustomerOrderById = async (orderId) => {
  try {
    const response = await api.get(`/customer/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch order';
    throw { message: msg };
  }
};

export const cancelCustomerOrder = async (orderId) => {
  try {
    const response = await api.patch(`/customer/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to cancel order';
    throw { message: msg };
  }
};

// Orders: create a simple order (buy now)
export const createCustomerOrder = async ({ productId, quantity = 1 }) => {
  try {
    const response = await api.post('/customer/orders', { productId, quantity });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to create order';
    throw { message: msg };
  }
};

// Wishlist services
export const getWishlist = async () => {
  try {
    const res = await api.get('/customer/wishlist');
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch wishlist';
    throw { message: msg };
  }
};

export const addToWishlist = async (productId) => {
  try {
    const res = await api.post(`/customer/wishlist/${productId}`);
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to add to wishlist';
    throw { message: msg };
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const res = await api.delete(`/customer/wishlist/${productId}`);
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to remove from wishlist';
    throw { message: msg };
  }
};

export default api;
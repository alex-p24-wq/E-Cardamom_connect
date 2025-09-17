import axios from 'axios';

// Normalize base URL: ensure it includes "/api" and no trailing slash issues
const RAW_URL = import.meta?.env?.VITE_API_URL;
const API_URL = (() => {
  const def = 'http://localhost:5000/api';
  if (!RAW_URL) return def;
  const trimmed = RAW_URL.replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
})();

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

// Orders: create an order with optional shipping and payment
export const createCustomerOrder = async ({ productId, quantity = 1, shippingAddress, notes, paymentMethod }) => {
  try {
    const response = await api.post('/customer/orders', { productId, quantity, shippingAddress, notes, paymentMethod });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to create order';
    throw { message: msg };
  }
};

// Products
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/customer/products/${productId}`);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch product';
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

// Admin services
export const adminGetSummary = async () => {
  try { const res = await api.get('/admin'); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch admin summary'; throw { message: msg }; }
};

export const adminListUsers = async (params = {}) => {
  try { const res = await api.get('/admin/users', { params }); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch users'; throw { message: msg }; }
};

export const adminGetUser = async (id) => {
  try { const res = await api.get(`/admin/users/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch user'; throw { message: msg }; }
};

export const adminCreateUser = async (data) => {
  try { const res = await api.post('/admin/users', data); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to create user'; throw { message: msg }; }
};

export const adminUpdateUser = async (id, data) => {
  try { const res = await api.patch(`/admin/users/${id}`, data); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to update user'; throw { message: msg }; }
};

export const adminDeleteUser = async (id) => {
  try { const res = await api.delete(`/admin/users/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to delete user'; throw { message: msg }; }
};

export const adminListProducts = async (params = {}) => {
  try { const res = await api.get('/admin/products', { params }); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch products'; throw { message: msg }; }
};

export const adminGetProduct = async (id) => {
  try { const res = await api.get(`/admin/products/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch product'; throw { message: msg }; }
};

export const adminCreateProduct = async (data) => {
  try { const res = await api.post('/admin/products', data); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to create product'; throw { message: msg }; }
};

export const adminUpdateProduct = async (id, data) => {
  try { const res = await api.patch(`/admin/products/${id}`, data); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to update product'; throw { message: msg }; }
};

export const adminDeleteProduct = async (id) => {
  try { const res = await api.delete(`/admin/products/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to delete product'; throw { message: msg }; }
};

export const adminListOrders = async (params = {}) => {
  try { const res = await api.get('/admin/orders', { params }); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch orders'; throw { message: msg }; }
};

export const adminGetOrder = async (id) => {
  try { const res = await api.get(`/admin/orders/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to fetch order'; throw { message: msg }; }
};

export const adminUpdateOrder = async (id, data) => {
  try { const res = await api.patch(`/admin/orders/${id}`, data); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to update order'; throw { message: msg }; }
};

export const adminDeleteOrder = async (id) => {
  try { const res = await api.delete(`/admin/orders/${id}`); return res.data; }
  catch (error) { const msg = error?.response?.data?.message || error?.message || 'Failed to delete order'; throw { message: msg }; }
};

export default api;
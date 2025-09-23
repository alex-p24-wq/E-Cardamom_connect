// Utility functions for creating different types of notifications

export const createSuccessNotification = (title, message, options = {}) => ({
  type: 'success',
  title,
  message,
  icon: '✅',
  ...options
});

export const createErrorNotification = (title, message, options = {}) => ({
  type: 'error',
  title,
  message,
  icon: '❌',
  ...options
});

export const createWarningNotification = (title, message, options = {}) => ({
  type: 'warning',
  title,
  message,
  icon: '⚠️',
  ...options
});

export const createInfoNotification = (title, message, options = {}) => ({
  type: 'info',
  title,
  message,
  icon: 'ℹ️',
  ...options
});

// Predefined notification templates for common actions
export const notificationTemplates = {
  orderPlaced: (orderId) => createSuccessNotification(
    'Order Placed Successfully!',
    `Your order #${orderId} has been placed and is being processed.`,
    { icon: '🛒' }
  ),
  
  orderShipped: (orderId) => createInfoNotification(
    'Order Shipped',
    `Your order #${orderId} has been shipped and is on its way!`,
    { icon: '📦' }
  ),
  
  productAdded: (productName) => createSuccessNotification(
    'Product Added',
    `${productName} has been successfully added to the marketplace.`,
    { icon: '🌿' }
  ),
  
  profileUpdated: () => createSuccessNotification(
    'Profile Updated',
    'Your profile information has been saved successfully.',
    { icon: '👤' }
  ),
  
  paymentSuccess: (amount) => createSuccessNotification(
    'Payment Successful',
    `Payment of ₹${amount} has been processed successfully.`,
    { icon: '💳' }
  ),
  
  lowStock: (productName, stock) => createWarningNotification(
    'Low Stock Alert',
    `${productName} is running low (${stock} kg remaining).`,
    { icon: '📉' }
  ),
  
  welcome: (username) => createInfoNotification(
    'Welcome to Cardo!',
    `Hello ${username}! Welcome to your dashboard.`,
    { icon: '🎉' }
  ),
  
  loginSuccess: () => createSuccessNotification(
    'Login Successful',
    'You have been logged in successfully.',
    { icon: '🔐' }
  ),
  
  logoutSuccess: () => createInfoNotification(
    'Logged Out',
    'You have been logged out successfully.',
    { icon: '👋' }
  )
};

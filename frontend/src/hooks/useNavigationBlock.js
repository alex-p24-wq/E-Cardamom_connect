import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfirmation } from '../contexts/ConfirmationContext';

/**
 * Custom hook to block navigation away from protected pages
 * Only allows navigation through explicit logout action
 */
export function useNavigationBlock(isEnabled = true) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirmation } = useConfirmation();

  const showLogoutConfirmation = useCallback(async () => {
    const confirmed = await showConfirmation({
      title: "Are you sure you want to logout?",
      message: "You must logout to leave the dashboard. All unsaved changes will be lost.",
      confirmText: "Yes, Logout",
      cancelText: "Stay Here",
      type: "warning",
      icon: "🚪",
      onConfirm: () => {
        // User confirmed - redirect to logout
        window.dispatchEvent(new CustomEvent('forceLogout'));
      }
    });
    return confirmed;
  }, [showConfirmation]);

  const blockNavigation = useCallback((event) => {
    if (isEnabled) {
      // Prevent default browser navigation
      event.preventDefault();
      
      // Show custom confirmation dialog
      showLogoutConfirmation();
      
      // Return the message for older browsers (fallback)
      return 'You must logout to leave the dashboard.';
    }
  }, [isEnabled, showLogoutConfirmation]);

  useEffect(() => {
    if (!isEnabled) return;

    // Block browser back/forward navigation
    const handlePopState = (event) => {
      // Push current state back to prevent navigation
      window.history.pushState(null, '', location.pathname);
      
      // Show custom confirmation
      showLogoutConfirmation();
    };

    // Block page refresh/close
    const handleBeforeUnload = (event) => {
      const message = 'You must logout to leave the dashboard.';
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Push current state to history to enable popstate detection
    window.history.pushState(null, '', location.pathname);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEnabled, location.pathname, showLogoutConfirmation]);

  return {
    blockNavigation
  };
}

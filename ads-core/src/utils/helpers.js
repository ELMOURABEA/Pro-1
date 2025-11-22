/**
 * Helper utilities for Ads Core
 */

const helpers = {
  /**
   * Generate unique ID
   */
  generateId: (prefix = 'ad') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Parse ad size string (e.g., "728x90")
   */
  parseSize: (sizeString) => {
    const [width, height] = sizeString.split('x').map(Number);
    return { width, height };
  },

  /**
   * Format size object to string
   */
  formatSize: (size) => {
    return `${size.width}x${size.height}`;
  },

  /**
   * Check if element is in viewport
   */
  isInViewport: (element, threshold = 0.5) => {
    if (!element || typeof IntersectionObserver === 'undefined') {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    const visiblePercentage = totalArea > 0 ? visibleArea / totalArea : 0;

    return vertInView && horInView && visiblePercentage >= threshold;
  },

  /**
   * Calculate viewability percentage
   */
  getViewabilityPercentage: (element) => {
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    
    if (visibleHeight <= 0 || visibleWidth <= 0) return 0;

    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;

    return totalArea > 0 ? (visibleArea / totalArea) * 100 : 0;
  },

  /**
   * Debounce function
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Deep merge objects
   */
  deepMerge: (target, source) => {
    const output = Object.assign({}, target);
    
    if (helpers.isObject(target) && helpers.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (helpers.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = helpers.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  },

  /**
   * Check if value is object
   */
  isObject: (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  /**
   * Get cookie value
   */
  getCookie: (name) => {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    
    return null;
  },

  /**
   * Set cookie
   */
  setCookie: (name, value, days = 365) => {
    if (typeof document === 'undefined') return;

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    
    document.cookie = `${name}=${value};${expires};path=/`;
  },

  /**
   * Get localStorage item safely
   */
  getLocalStorage: (key) => {
    if (typeof localStorage === 'undefined') return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage error:', error);
      return null;
    }
  },

  /**
   * Set localStorage item safely
   */
  setLocalStorage: (key, value) => {
    if (typeof localStorage === 'undefined') return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('localStorage error:', error);
      return false;
    }
  },

  /**
   * Format currency
   */
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  /**
   * Calculate eCPM
   */
  calculateECPM: (revenue, impressions) => {
    if (impressions === 0) return 0;
    return (revenue / impressions) * 1000;
  },

  /**
   * Calculate CTR
   */
  calculateCTR: (clicks, impressions) => {
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  },

  /**
   * Calculate fill rate
   */
  calculateFillRate: (filled, requested) => {
    if (requested === 0) return 0;
    return (filled / requested) * 100;
  },

  /**
   * Sanitize HTML
   */
  sanitizeHTML: (html) => {
    if (typeof document === 'undefined') return html;

    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },

  /**
   * Load script dynamically
   */
  loadScript: (src, async = true) => {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') {
        reject(new Error('Document not available'));
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * Check if mobile device
   */
  isMobile: () => {
    if (typeof navigator === 'undefined') return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  /**
   * Get device type
   */
  getDeviceType: () => {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    }
    
    if (/mobile|android|touch|webos|hpwos/i.test(ua)) {
      return 'mobile';
    }
    
    return 'desktop';
  }
};

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = helpers;
}

if (typeof window !== 'undefined') {
  window.AdsHelpers = helpers;
}

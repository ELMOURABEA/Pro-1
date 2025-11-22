/**
 * Default configuration for Ads Core
 */

const defaultConfig = {
  // API Configuration
  api: {
    endpoint: '/api/ads',
    analyticsEndpoint: '/api/analytics',
    timeout: 5000
  },

  // Ad Networks
  networks: {
    enabled: ['google-adsense', 'custom'],
    priority: ['custom', 'google-adsense'],
    timeout: 3000
  },

  // Ad Formats
  formats: {
    banner: {
      enabled: true,
      sizes: ['728x90', '300x250', '160x600', '320x50', '970x250'],
      defaultSize: '728x90'
    },
    native: {
      enabled: true,
      templates: ['product-card', 'article', 'inline'],
      defaultTemplate: 'product-card'
    },
    video: {
      enabled: true,
      maxDuration: 30,
      skipAfter: 5,
      autoplay: false,
      muted: true
    },
    interstitial: {
      enabled: true,
      closeable: true,
      closeDelay: 5,
      frequency: 'once-per-session'
    }
  },

  // Targeting
  targeting: {
    contextual: {
      enabled: true,
      categories: true,
      keywords: true
    },
    audience: {
      enabled: true,
      demographics: true,
      interests: true,
      behavior: true
    },
    geographic: {
      enabled: true,
      country: true,
      state: true,
      city: true
    }
  },

  // Privacy & Compliance
  privacy: {
    respectDoNotTrack: true,
    gdpr: {
      enabled: false,
      consentRequired: false,
      consentManagement: 'built-in' // 'built-in' or 'external'
    },
    ccpa: {
      enabled: false,
      optOutLink: true
    }
  },

  // Performance
  performance: {
    lazyLoading: {
      enabled: true,
      margin: '200px',
      threshold: 0.5
    },
    autoRefresh: {
      enabled: false,
      interval: 30000,
      maxRefreshes: 10
    },
    viewabilityTracking: {
      enabled: true,
      threshold: 0.5,
      duration: 1000
    }
  },

  // Frequency Capping
  frequencyCap: {
    enabled: true,
    rules: {
      banner: { impressions: 10, period: 'hour' },
      interstitial: { impressions: 1, period: 'session' },
      video: { impressions: 3, period: 'day' }
    }
  },

  // A/B Testing
  experiments: {
    enabled: true,
    framework: 'built-in',
    defaultDuration: 7 // days
  },

  // Analytics
  analytics: {
    enabled: true,
    batchSize: 10,
    flushInterval: 5000,
    trackImpressions: true,
    trackClicks: true,
    trackViewability: true,
    trackConversions: true
  },

  // Debug
  debug: false,
  verbose: false
};

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = defaultConfig;
}

if (typeof window !== 'undefined') {
  window.AdsDefaultConfig = defaultConfig;
}

/**
 * AdManager - Core advertising management system
 * Handles ad loading, display, tracking, and optimization
 */

class AdManager {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      publisherId: config.publisherId || '',
      debug: config.debug || false,
      autoInit: config.autoInit !== false,
      ...config
    };

    this.networks = new Map();
    this.activeAds = new Map();
    this.adZones = new Map();
    this.targeting = {};
    this.privacySettings = {};
    this.isInitialized = false;

    if (this.config.autoInit) {
      this.initialize();
    }
  }

  /**
   * Initialize the ad manager
   */
  async initialize() {
    if (this.isInitialized) {
      this.log('AdManager already initialized');
      return;
    }

    this.log('Initializing AdManager...');

    // Check for ad blockers
    this.adBlockerDetected = await this.detectAdBlocker();
    if (this.adBlockerDetected) {
      this.log('Ad blocker detected', 'warn');
    }

    // Set up privacy compliance
    this.setupPrivacyCompliance();

    // Load saved targeting preferences
    this.loadTargeting();

    this.isInitialized = true;
    this.log('AdManager initialized successfully');

    return this;
  }

  /**
   * Add an ad network
   */
  addNetwork(networkConfig) {
    const { name, config, adapter } = networkConfig;

    if (!name) {
      throw new Error('Network name is required');
    }

    this.networks.set(name, {
      config,
      adapter,
      enabled: true
    });

    this.log(`Network '${name}' added successfully`);
  }

  /**
   * Display an ad
   */
  async showAd(options) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      zoneId,
      container,
      format = 'banner',
      size = '728x90',
      ...additionalOptions
    } = options;

    if (!container && !zoneId) {
      throw new Error('Either container or zoneId is required');
    }

    // Check privacy settings
    if (!this.canShowAds()) {
      this.log('Ads blocked due to privacy settings', 'warn');
      return null;
    }

    const adRequest = {
      zoneId,
      container,
      format,
      size,
      targeting: this.targeting,
      timestamp: Date.now(),
      ...additionalOptions
    };

    try {
      const ad = await this.requestAd(adRequest);
      
      if (ad) {
        this.renderAd(ad, container);
        this.trackImpression(ad);
        this.activeAds.set(ad.id, ad);
      }

      return ad;
    } catch (error) {
      this.log(`Error showing ad: ${error.message}`, 'error');
      return null;
    }
  }

  /**
   * Show banner ad
   */
  async showBanner(options) {
    return this.showAd({ ...options, format: 'banner' });
  }

  /**
   * Show native ad
   */
  async showNative(options) {
    return this.showAd({ ...options, format: 'native' });
  }

  /**
   * Show video ad
   */
  async showVideo(options) {
    return this.showAd({ ...options, format: 'video' });
  }

  /**
   * Show interstitial ad
   */
  async showInterstitial(options) {
    const {
      trigger = 'manual',
      frequency = 'always',
      closeable = true,
      closeDelay = 5
    } = options;

    // Check frequency cap
    if (!this.checkFrequency('interstitial', frequency)) {
      this.log('Interstitial frequency cap reached', 'warn');
      return null;
    }

    return this.showAd({
      ...options,
      format: 'interstitial',
      closeable,
      closeDelay
    });
  }

  /**
   * Request ad from networks
   */
  async requestAd(adRequest) {
    const { format, size, targeting } = adRequest;

    // Try each enabled network
    for (const [name, network] of this.networks) {
      if (!network.enabled) continue;

      try {
        const ad = await this.fetchAdFromNetwork(name, adRequest);
        
        if (ad) {
          this.log(`Ad fetched from network: ${name}`);
          return ad;
        }
      } catch (error) {
        this.log(`Error fetching from ${name}: ${error.message}`, 'error');
      }
    }

    // Fallback: create placeholder ad
    return this.createPlaceholderAd(adRequest);
  }

  /**
   * Fetch ad from specific network
   */
  async fetchAdFromNetwork(networkName, adRequest) {
    const network = this.networks.get(networkName);
    
    if (!network || !network.adapter) {
      return null;
    }

    return network.adapter.fetchAd(adRequest, network.config);
  }

  /**
   * Render ad in container
   */
  renderAd(ad, containerId) {
    const container = typeof containerId === 'string' 
      ? document.querySelector(containerId)
      : containerId;

    if (!container) {
      this.log('Container not found', 'error');
      return;
    }

    // Clear existing content safely
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create ad element based on format
    const adElement = this.createAdElement(ad);
    container.appendChild(adElement);

    // Set up click tracking
    adElement.addEventListener('click', () => {
      this.trackClick(ad);
    });

    this.log(`Ad rendered: ${ad.id}`);
  }

  /**
   * Create ad element
   */
  createAdElement(ad) {
    const element = document.createElement('div');
    element.className = `ad-unit ad-${ad.format}`;
    element.setAttribute('data-ad-id', ad.id);

    switch (ad.format) {
      case 'banner':
        const bannerDiv = document.createElement('div');
        bannerDiv.className = 'ad-banner';
        
        const bannerImg = document.createElement('img');
        bannerImg.src = this.sanitizeUrl(ad.imageUrl);
        bannerImg.alt = ad.title || 'Advertisement';
        
        bannerDiv.appendChild(bannerImg);
        element.appendChild(bannerDiv);
        break;

      case 'native':
        const nativeDiv = document.createElement('div');
        nativeDiv.className = 'ad-native';
        
        const nativeImg = document.createElement('img');
        nativeImg.src = this.sanitizeUrl(ad.imageUrl);
        nativeImg.alt = ad.title || 'Advertisement';
        nativeImg.className = 'ad-image';
        
        const title = document.createElement('h3');
        title.className = 'ad-title';
        title.textContent = ad.title || '';
        
        const description = document.createElement('p');
        description.className = 'ad-description';
        description.textContent = ad.description || '';
        
        const cta = document.createElement('a');
        cta.href = this.sanitizeUrl(ad.clickUrl);
        cta.className = 'ad-cta';
        cta.textContent = ad.ctaText || 'Learn More';
        cta.rel = 'noopener noreferrer';
        cta.target = '_blank';
        
        nativeDiv.appendChild(nativeImg);
        nativeDiv.appendChild(title);
        nativeDiv.appendChild(description);
        nativeDiv.appendChild(cta);
        element.appendChild(nativeDiv);
        break;

      case 'video':
        const videoDiv = document.createElement('div');
        videoDiv.className = 'ad-video';
        
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        
        const source = document.createElement('source');
        source.src = this.sanitizeUrl(ad.videoUrl);
        source.type = 'video/mp4';
        
        video.appendChild(source);
        videoDiv.appendChild(video);
        element.appendChild(videoDiv);
        break;

      default:
        const placeholder = document.createElement('div');
        placeholder.className = 'ad-placeholder';
        placeholder.textContent = 'Ad';
        element.appendChild(placeholder);
    }

    return element;
  }

  /**
   * Sanitize URL to prevent XSS
   */
  sanitizeUrl(url) {
    if (!url) return '#';
    
    // Only allow http, https, and relative URLs
    const urlStr = String(url);
    if (urlStr.match(/^(https?:)?\/\//i) || urlStr.match(/^\/[^\/]/)) {
      return urlStr;
    }
    
    // Block javascript: and data: URLs
    if (urlStr.match(/^(javascript|data):/i)) {
      return '#';
    }
    
    return urlStr;
  }

  /**
   * Create placeholder ad for testing
   */
  createPlaceholderAd(adRequest) {
    return {
      id: `placeholder-${Date.now()}`,
      format: adRequest.format,
      title: 'Sample Ad',
      description: 'This is a placeholder advertisement',
      imageUrl: 'https://via.placeholder.com/728x90?text=Advertisement',
      clickUrl: '#',
      ctaText: 'Learn More',
      network: 'placeholder'
    };
  }

  /**
   * Set contextual targeting
   */
  setContextualTargeting(targeting) {
    this.targeting = {
      ...this.targeting,
      contextual: targeting
    };
    this.log('Contextual targeting updated');
  }

  /**
   * Set audience targeting
   */
  setAudienceTargeting(targeting) {
    this.targeting = {
      ...this.targeting,
      audience: targeting
    };
    this.log('Audience targeting updated');
  }

  /**
   * Set geographic targeting
   */
  setGeoTargeting(targeting) {
    this.targeting = {
      ...this.targeting,
      geo: targeting
    };
    this.log('Geographic targeting updated');
  }

  /**
   * Set privacy settings
   */
  setPrivacySettings(settings) {
    this.privacySettings = {
      ...this.privacySettings,
      ...settings
    };
    this.log('Privacy settings updated');
  }

  /**
   * Check if ads can be shown based on privacy settings
   */
  canShowAds() {
    // Check DNT
    if (this.privacySettings.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }

    // Check GDPR consent
    if (this.privacySettings.gdpr?.enabled && !this.privacySettings.gdpr?.consentString) {
      return false;
    }

    // Check CCPA
    if (this.privacySettings.ccpa?.enabled && this.privacySettings.ccpa?.doNotSell) {
      return false;
    }

    return true;
  }

  /**
   * Track ad impression
   */
  trackImpression(ad) {
    this.log(`Impression tracked: ${ad.id}`);
    
    // Send to analytics
    this.sendAnalytics('impression', {
      adId: ad.id,
      format: ad.format,
      network: ad.network,
      timestamp: Date.now()
    });
  }

  /**
   * Track ad click
   */
  trackClick(ad) {
    this.log(`Click tracked: ${ad.id}`);
    
    // Send to analytics
    this.sendAnalytics('click', {
      adId: ad.id,
      format: ad.format,
      network: ad.network,
      timestamp: Date.now()
    });
  }

  /**
   * Track conversion
   */
  trackConversion(data) {
    this.log(`Conversion tracked: ${data.adId}`);
    
    this.sendAnalytics('conversion', {
      ...data,
      timestamp: Date.now()
    });
  }

  /**
   * Send analytics data
   */
  sendAnalytics(eventType, data) {
    if (!this.config.analyticsEndpoint) {
      return;
    }

    // In production, send to analytics server
    fetch(this.config.analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, data })
    }).catch(error => {
      this.log(`Analytics error: ${error.message}`, 'error');
    });
  }

  /**
   * Get revenue metrics
   */
  async getRevenue(options) {
    const { startDate, endDate, groupBy = 'day' } = options;

    // Mock implementation - in production, fetch from analytics API
    return {
      total: 1234.56,
      eCPM: 3.45,
      fillRate: 92.5,
      impressions: 357000,
      clicks: 8925,
      ctr: 2.5
    };
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics() {
    // Mock implementation
    return {
      avgLoadTime: 245,
      viewabilityRate: 78.5,
      adBlockRate: 12.3
    };
  }

  /**
   * Check frequency cap
   */
  checkFrequency(adType, frequency) {
    // Mock implementation - in production, check against user history
    return true;
  }

  /**
   * Detect ad blocker
   */
  async detectAdBlocker() {
    // Simple ad blocker detection
    try {
      const testAd = document.createElement('div');
      testAd.className = 'ad advertisement adsbox';
      testAd.style.cssText = 'position:absolute;width:1px;height:1px;';
      document.body.appendChild(testAd);
      
      const blocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      
      return blocked;
    } catch (error) {
      return false;
    }
  }

  /**
   * Setup privacy compliance
   */
  setupPrivacyCompliance() {
    // Default privacy settings
    this.privacySettings = {
      respectDoNotTrack: true,
      gdpr: {
        enabled: false,
        consentRequired: false
      },
      ccpa: {
        enabled: false,
        doNotSell: false
      }
    };
  }

  /**
   * Load targeting from storage
   */
  loadTargeting() {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('adTargeting');
        if (saved) {
          this.targeting = JSON.parse(saved);
        }
      } catch (error) {
        this.log('Error loading targeting', 'error');
      }
    }
  }

  /**
   * Save targeting to storage
   */
  saveTargeting() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('adTargeting', JSON.stringify(this.targeting));
      } catch (error) {
        this.log('Error saving targeting', 'error');
      }
    }
  }

  /**
   * Disable tracking
   */
  disableTracking() {
    this.trackingDisabled = true;
    this.log('Tracking disabled');
  }

  /**
   * Enable tracking
   */
  enableTracking() {
    this.trackingDisabled = false;
    this.log('Tracking enabled');
  }

  /**
   * Destroy ad manager and clean up
   */
  destroy() {
    this.activeAds.clear();
    this.networks.clear();
    this.isInitialized = false;
    this.log('AdManager destroyed');
  }

  /**
   * Debug logging
   */
  log(message, level = 'info') {
    if (!this.config.debug) return;

    const prefix = '[AdManager]';
    switch (level) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'warn':
        console.warn(prefix, message);
        break;
      default:
        console.log(prefix, message);
    }
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdManager;
}

if (typeof window !== 'undefined') {
  window.AdManager = AdManager;
}

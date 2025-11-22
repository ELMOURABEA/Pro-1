/**
 * AdPlacement - Manages ad placement zones and rendering
 */

class AdPlacement {
  constructor(config = {}) {
    this.config = config;
    this.placements = new Map();
    this.observers = new Map();
    this.adManager = null;
  }

  /**
   * Set the ad manager instance
   */
  setAdManager(adManager) {
    this.adManager = adManager;
    
    // Load any placements that were registered with autoLoad before adManager was set
    for (const [zoneId, placement] of this.placements) {
      if (placement.autoLoad && !placement.lazyLoad && !placement.loaded) {
        this.loadAd(zoneId, adManager).catch(error => {
          console.error(`Error loading deferred ad for zone ${zoneId}:`, error);
        });
      }
    }
  }

  /**
   * Register an ad placement zone
   */
  register(zoneId, config) {
    if (this.placements.has(zoneId)) {
      console.warn(`Zone ${zoneId} already registered`);
      return;
    }

    this.placements.set(zoneId, {
      id: zoneId,
      format: config.format || 'banner',
      size: config.size || '728x90',
      priority: config.priority || 'medium',
      container: config.container,
      autoLoad: config.autoLoad !== false,
      lazyLoad: config.lazyLoad || false,
      refresh: config.refresh || false,
      refreshInterval: config.refreshInterval || 30000,
      ...config
    });

    if (config.lazyLoad) {
      this.setupLazyLoading(zoneId);
    }

    if (config.autoLoad && !config.lazyLoad && this.adManager) {
      // Load ad asynchronously without blocking registration
      this.loadAd(zoneId, this.adManager).catch(error => {
        console.error(`Error auto-loading ad for zone ${zoneId}:`, error);
      });
    }
  }

  /**
   * Unregister a placement zone
   */
  unregister(zoneId) {
    if (this.observers.has(zoneId)) {
      this.observers.get(zoneId).disconnect();
      this.observers.delete(zoneId);
    }

    this.placements.delete(zoneId);
  }

  /**
   * Load ad into placement
   */
  async loadAd(zoneId, adManager) {
    const placement = this.placements.get(zoneId);
    
    if (!placement) {
      console.error(`Zone ${zoneId} not found`);
      return null;
    }

    if (!adManager) {
      console.error('AdManager required to load ads');
      return null;
    }

    try {
      const ad = await adManager.showAd({
        zoneId: placement.id,
        container: placement.container,
        format: placement.format,
        size: placement.size
      });

      if (ad) {
        placement.loaded = true;
        
        if (placement.refresh) {
          this.scheduleRefresh(zoneId, adManager);
        }
      }

      return ad;
    } catch (error) {
      console.error(`Error loading ad for zone ${zoneId}:`, error);
      return null;
    }
  }

  /**
   * Setup lazy loading for a zone
   */
  setupLazyLoading(zoneId) {
    const placement = this.placements.get(zoneId);
    
    if (!placement || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const container = typeof placement.container === 'string'
      ? document.querySelector(placement.container)
      : placement.container;

    if (!container) {
      console.error(`Container not found for zone ${zoneId}`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !placement.loaded) {
            placement.loaded = true;
            if (this.adManager) {
              this.loadAd(zoneId, this.adManager).catch(error => {
                console.error(`Error lazy-loading ad for zone ${zoneId}:`, error);
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: placement.lazyLoadMargin || '200px',
        threshold: placement.lazyLoadThreshold || 0.5
      }
    );

    observer.observe(container);
    this.observers.set(zoneId, observer);
  }

  /**
   * Schedule ad refresh
   */
  scheduleRefresh(zoneId, adManager) {
    const placement = this.placements.get(zoneId);
    
    if (!placement || !placement.refresh) {
      return;
    }

    if (placement.refreshTimer) {
      clearTimeout(placement.refreshTimer);
    }

    placement.refreshTimer = setTimeout(() => {
      placement.refreshCount = (placement.refreshCount || 0) + 1;
      
      const maxRefreshes = placement.maxRefreshes || 10;
      if (placement.refreshCount < maxRefreshes) {
        this.loadAd(zoneId, adManager);
      }
    }, placement.refreshInterval);
  }

  /**
   * Clear all placements
   */
  clearAll() {
    for (const [zoneId, placement] of this.placements) {
      if (placement.refreshTimer) {
        clearTimeout(placement.refreshTimer);
      }
    }

    for (const observer of this.observers.values()) {
      observer.disconnect();
    }

    this.placements.clear();
    this.observers.clear();
  }

  /**
   * Get placement info
   */
  getPlacement(zoneId) {
    return this.placements.get(zoneId);
  }

  /**
   * Get all placements
   */
  getAllPlacements() {
    return Array.from(this.placements.values());
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdPlacement;
}

if (typeof window !== 'undefined') {
  window.AdPlacement = AdPlacement;
}

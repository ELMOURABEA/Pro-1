/**
 * AnalyticsTracker - Track and analyze ad performance
 */

class AnalyticsTracker {
  constructor(config = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/analytics',
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      debug: config.debug || false,
      ...config
    };

    this.eventQueue = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();

    // Start auto-flush
    this.startAutoFlush();
  }

  /**
   * Track ad impression
   */
  trackImpression(data) {
    this.track('impression', {
      adId: data.adId,
      zoneId: data.zoneId,
      format: data.format,
      network: data.network,
      size: data.size,
      timestamp: Date.now()
    });
  }

  /**
   * Track ad click
   */
  trackClick(data) {
    this.track('click', {
      adId: data.adId,
      destinationUrl: data.destinationUrl,
      timestamp: Date.now()
    });
  }

  /**
   * Track ad viewability
   */
  trackViewability(data) {
    this.track('viewability', {
      adId: data.adId,
      viewableTime: data.viewableTime,
      viewablePercentage: data.viewablePercentage,
      timestamp: Date.now()
    });
  }

  /**
   * Track conversion
   */
  trackConversion(data) {
    this.track('conversion', {
      adId: data.adId,
      conversionType: data.conversionType,
      value: data.value,
      currency: data.currency || 'USD',
      timestamp: Date.now()
    });
  }

  /**
   * Track revenue
   */
  trackRevenue(data) {
    this.track('revenue', {
      adId: data.adId,
      amount: data.amount,
      currency: data.currency || 'USD',
      type: data.type, // cpm, cpc, cpa
      timestamp: Date.now()
    });
  }

  /**
   * Track error
   */
  trackError(data) {
    this.track('error', {
      adId: data.adId,
      errorType: data.errorType,
      errorMessage: data.errorMessage,
      timestamp: Date.now()
    });
  }

  /**
   * Generic track method
   */
  track(eventType, data) {
    const event = {
      eventType,
      sessionId: this.sessionId,
      data: {
        ...data,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location.href : null
      }
    };

    this.eventQueue.push(event);
    this.log(`Event tracked: ${eventType}`, event);

    // Flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush events to server
   */
  async flush() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.sendEvents(events);
      this.log(`Flushed ${events.length} events`);
    } catch (error) {
      this.log(`Flush error: ${error.message}`, 'error');
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Send events to analytics endpoint
   */
  async sendEvents(events) {
    if (typeof fetch === 'undefined') {
      this.log('Fetch not available, skipping send', 'warn');
      return;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Start auto-flush timer
   */
  startAutoFlush() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Stop auto-flush timer
   */
  stopAutoFlush() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Get session metrics
   */
  getSessionMetrics() {
    const sessionDuration = Date.now() - this.startTime;
    
    return {
      sessionId: this.sessionId,
      duration: sessionDuration,
      eventsCount: this.eventQueue.length
    };
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Clean up and flush remaining events
   */
  async destroy() {
    this.stopAutoFlush();
    await this.flush();
    this.log('AnalyticsTracker destroyed');
  }

  /**
   * Debug logging
   */
  log(message, data = null, level = 'info') {
    if (!this.config.debug) return;

    const prefix = '[AnalyticsTracker]';
    const output = data ? [prefix, message, data] : [prefix, message];

    switch (level) {
      case 'error':
        console.error(...output);
        break;
      case 'warn':
        console.warn(...output);
        break;
      default:
        console.log(...output);
    }
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsTracker;
}

if (typeof window !== 'undefined') {
  window.AnalyticsTracker = AnalyticsTracker;
}

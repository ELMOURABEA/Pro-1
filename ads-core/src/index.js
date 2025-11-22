/**
 * Ads Core - Main entry point
 * Integrated advertising framework for MOST-PHARMA-GRO
 */

// Import core modules
const AdManager = require('./managers/AdManager');
const AnalyticsTracker = require('./analytics/AnalyticsTracker');
const AdPlacement = require('./placements/AdPlacement');
const defaultConfig = require('./config/defaultConfig');
const helpers = require('./utils/helpers');

// Version
const VERSION = '1.0.0';

/**
 * Initialize Ads Core with configuration
 */
function init(config = {}) {
  const mergedConfig = helpers.deepMerge(defaultConfig, config);
  
  const adManager = new AdManager(mergedConfig);
  const analytics = new AnalyticsTracker(mergedConfig.analytics);
  const placement = new AdPlacement(mergedConfig);

  return {
    adManager,
    analytics,
    placement,
    config: mergedConfig,
    version: VERSION
  };
}

// Export modules
module.exports = {
  AdManager,
  AnalyticsTracker,
  AdPlacement,
  defaultConfig,
  helpers,
  init,
  VERSION
};

// Browser export
if (typeof window !== 'undefined') {
  window.AdsCore = {
    AdManager,
    AnalyticsTracker,
    AdPlacement,
    defaultConfig,
    helpers,
    init,
    VERSION
  };
}

# 📢 Ads Core Framework

**Integrated Advertising Engine for MOST-PHARMA-GRO**

## Overview

The Ads Core is a flexible, powerful advertising framework built into MOST-PHARMA-GRO that enables pharmacies to generate revenue through targeted advertising while maintaining excellent user experience.

## Features

### 🎯 Smart Ad Placement
- Multiple ad formats (banner, native, video, interstitial)
- Contextual targeting based on user behavior
- A/B testing capabilities
- Responsive ad units

### 📊 Analytics & Reporting
- Real-time performance tracking
- Revenue analytics
- Impression and click tracking
- Conversion attribution

### 🔧 Easy Integration
- Simple API for ad placement
- Configurable ad zones
- Custom styling support
- Plugin architecture

### 💰 Revenue Optimization
- Automatic bid optimization
- Smart frequency capping
- Yield management
- Multiple ad network support

## Architecture

```
ads-core/
├── src/
│   ├── config/          # Configuration files
│   ├── managers/        # Core ad management logic
│   ├── placements/      # Ad placement handlers
│   ├── analytics/       # Tracking and analytics
│   └── utils/           # Helper utilities
├── examples/            # Usage examples
├── docs/               # Detailed documentation
└── README.md           # This file
```

## Quick Start

### Installation

The Ads Core is included by default in MOST-PHARMA-GRO. No additional installation required.

### Basic Usage

```javascript
import { AdManager } from './ads-core/src/managers/AdManager';

// Initialize the ad manager
const adManager = new AdManager({
  apiKey: 'your-api-key',
  publisherId: 'your-publisher-id',
  debug: false
});

// Display a banner ad
adManager.showAd({
  zoneId: 'homepage-banner',
  format: 'banner',
  size: '728x90'
});
```

### Configuration

Create an ads configuration file:

```javascript
// ads.config.js
export default {
  networks: ['google-adsense', 'custom-network'],
  defaultFormat: 'banner',
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  targeting: {
    contextual: true,
    behavioral: true,
    geographic: true
  },
  privacy: {
    respectDoNotTrack: true,
    gdprCompliant: true,
    ccpaCompliant: true
  }
};
```

## Ad Formats

### 1. Banner Ads
Traditional display advertising in various sizes.

```javascript
adManager.showBanner({
  container: '#ad-container',
  size: '728x90',
  position: 'top'
});
```

**Supported Sizes:**
- Leaderboard: 728x90
- Medium Rectangle: 300x250
- Wide Skyscraper: 160x600
- Mobile Banner: 320x50

### 2. Native Ads
Ads that match the look and feel of the content.

```javascript
adManager.showNative({
  container: '#native-ad',
  template: 'product-card',
  fields: ['image', 'title', 'description', 'cta']
});
```

### 3. Video Ads
Pre-roll, mid-roll, or post-roll video advertisements.

```javascript
adManager.showVideo({
  container: '#video-player',
  type: 'pre-roll',
  skipAfter: 5,
  maxDuration: 30
});
```

### 4. Interstitial Ads
Full-screen ads at natural transition points.

```javascript
adManager.showInterstitial({
  trigger: 'page-transition',
  frequency: 'once-per-session',
  closeable: true,
  closeDelay: 5
});
```

## Ad Zones

Define strategic ad placements throughout your application:

```javascript
const adZones = {
  'homepage-hero': {
    format: 'banner',
    size: '970x250',
    priority: 'high'
  },
  'sidebar-primary': {
    format: 'medium-rectangle',
    size: '300x250',
    priority: 'medium'
  },
  'product-listing': {
    format: 'native',
    template: 'product-card',
    priority: 'medium'
  },
  'checkout-page': {
    format: 'banner',
    size: '728x90',
    priority: 'low' // Less intrusive during checkout
  }
};
```

## Targeting

### Contextual Targeting

```javascript
adManager.setContextualTargeting({
  category: 'pharmaceuticals',
  keywords: ['vitamins', 'supplements', 'health'],
  pageType: 'product-listing'
});
```

### Audience Targeting

```javascript
adManager.setAudienceTargeting({
  demographics: {
    ageRange: '25-55',
    interests: ['health', 'wellness']
  },
  behavior: {
    previousPurchases: true,
    browsing: ['category:vitamins']
  }
});
```

### Geographic Targeting

```javascript
adManager.setGeoTargeting({
  country: 'US',
  state: 'CA',
  city: 'San Francisco',
  radius: 50 // miles
});
```

## Analytics Integration

### Track Ad Performance

```javascript
import { AnalyticsTracker } from './ads-core/src/analytics/AnalyticsTracker';

const tracker = new AnalyticsTracker();

// Track impressions
tracker.trackImpression({
  adId: 'ad-12345',
  zoneId: 'homepage-banner',
  format: 'banner'
});

// Track clicks
tracker.trackClick({
  adId: 'ad-12345',
  destinationUrl: 'https://example.com'
});

// Track conversions
tracker.trackConversion({
  adId: 'ad-12345',
  conversionType: 'purchase',
  value: 49.99
});
```

### Revenue Tracking

```javascript
// Get revenue metrics
const revenue = await adManager.getRevenue({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  groupBy: 'day'
});

console.log(`Total Revenue: $${revenue.total}`);
console.log(`eCPM: $${revenue.eCPM}`);
console.log(`Fill Rate: ${revenue.fillRate}%`);
```

## Privacy & Compliance

### GDPR Compliance

```javascript
adManager.setPrivacySettings({
  gdpr: {
    enabled: true,
    consentRequired: true,
    consentString: 'user-consent-string'
  }
});
```

### CCPA Compliance

```javascript
adManager.setPrivacySettings({
  ccpa: {
    enabled: true,
    doNotSell: false // User's choice
  }
});
```

### Do Not Track

```javascript
// Automatically respect DNT header
if (navigator.doNotTrack === '1') {
  adManager.disableTracking();
}
```

## Ad Networks Integration

### Google AdSense

```javascript
adManager.addNetwork({
  name: 'google-adsense',
  config: {
    publisherId: 'ca-pub-xxxxxxxxxxxxxxxx',
    adClient: 'ca-pub-xxxxxxxxxxxxxxxx'
  }
});
```

### Custom Ad Network

```javascript
adManager.addNetwork({
  name: 'custom-network',
  config: {
    endpoint: 'https://ads.example.com/api',
    apiKey: 'your-api-key'
  },
  adapter: customNetworkAdapter
});
```

## Advanced Features

### A/B Testing

```javascript
adManager.createExperiment({
  name: 'banner-size-test',
  variants: [
    { id: 'control', size: '728x90', weight: 50 },
    { id: 'variant', size: '970x250', weight: 50 }
  ],
  metric: 'ctr',
  duration: 7 // days
});
```

### Frequency Capping

```javascript
adManager.setFrequencyCap({
  adId: 'ad-12345',
  impressions: 3,
  period: 'hour'
});
```

### Ad Refresh

```javascript
adManager.enableAutoRefresh({
  zoneId: 'sidebar-primary',
  interval: 30000, // 30 seconds
  maxRefreshes: 10
});
```

### Lazy Loading

```javascript
adManager.enableLazyLoading({
  margin: '200px', // Load when within 200px of viewport
  threshold: 0.5
});
```

## Performance Optimization

### Best Practices

1. **Lazy load ads** to improve initial page load time
2. **Limit ad density** to maintain user experience
3. **Use responsive ad units** for better mobile experience
4. **Implement viewability tracking** to optimize placement
5. **Enable ad refresh** for increased impressions
6. **A/B test placements** to maximize revenue

### Performance Metrics

```javascript
const performance = await adManager.getPerformanceMetrics();

console.log(`Average Load Time: ${performance.avgLoadTime}ms`);
console.log(`Viewability Rate: ${performance.viewabilityRate}%`);
console.log(`Ad Block Rate: ${performance.adBlockRate}%`);
```

## Troubleshooting

### Common Issues

**Ads not displaying:**
1. Check ad blocker is disabled
2. Verify API credentials
3. Check browser console for errors
4. Ensure ad zone IDs are correct

**Low fill rate:**
1. Review targeting settings
2. Check network configuration
3. Verify inventory availability
4. Review pricing floor

**Poor performance:**
1. Enable lazy loading
2. Optimize ad sizes
3. Reduce ad density
4. Implement caching

## API Reference

See [API Documentation](docs/API.md) for complete API reference.

## Examples

Check the [examples directory](examples/) for:
- Basic integration
- Advanced targeting
- Custom ad formats
- Analytics implementation
- A/B testing setup

## Support

- **Documentation**: [Full Documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/ELMOURABEA/MOST-PHARMA-GRO/issues)
- **Email**: ads-support@most-pharma-gro.com

## License

This module is part of MOST-PHARMA-GRO and is licensed under the Boost Software License 1.0.

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](../CONTRIBUTING.md) before submitting a pull request.

---

**Built with ❤️ for sustainable pharmacy monetization**

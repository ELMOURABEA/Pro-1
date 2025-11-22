# Ads Core API Documentation

Complete API reference for the Ads Core framework.

## Table of Contents

- [AdManager](#admanager)
- [AnalyticsTracker](#analyticstracker)
- [AdPlacement](#adplacement)
- [Helpers](#helpers)

---

## AdManager

The main class for managing advertisements.

### Constructor

```javascript
new AdManager(config)
```

**Parameters:**
- `config` (Object) - Configuration options
  - `apiKey` (string) - API key for authentication
  - `publisherId` (string) - Publisher identifier
  - `debug` (boolean) - Enable debug logging
  - `autoInit` (boolean) - Auto-initialize on creation (default: true)

**Example:**
```javascript
const adManager = new AdManager({
  apiKey: 'your-api-key',
  publisherId: 'your-publisher-id',
  debug: true
});
```

### Methods

#### initialize()

Initialize the ad manager.

```javascript
await adManager.initialize()
```

**Returns:** Promise<AdManager>

---

#### addNetwork(networkConfig)

Add an ad network.

```javascript
adManager.addNetwork({
  name: 'network-name',
  config: { /* network config */ },
  adapter: networkAdapter
})
```

**Parameters:**
- `networkConfig` (Object)
  - `name` (string) - Network identifier
  - `config` (Object) - Network-specific configuration
  - `adapter` (Object) - Network adapter implementation

---

#### showAd(options)

Display an advertisement.

```javascript
await adManager.showAd(options)
```

**Parameters:**
- `options` (Object)
  - `zoneId` (string) - Ad zone identifier
  - `container` (string|Element) - Container selector or element
  - `format` (string) - Ad format ('banner', 'native', 'video', 'interstitial')
  - `size` (string) - Ad size (e.g., '728x90')

**Returns:** Promise<Ad|null>

**Example:**
```javascript
const ad = await adManager.showAd({
  zoneId: 'homepage-banner',
  container: '#ad-container',
  format: 'banner',
  size: '728x90'
});
```

---

#### showBanner(options)

Display a banner ad.

```javascript
await adManager.showBanner(options)
```

**Parameters:**
- `options` (Object) - Same as showAd but format is set to 'banner'

**Returns:** Promise<Ad|null>

---

#### showNative(options)

Display a native ad.

```javascript
await adManager.showNative(options)
```

**Parameters:**
- `options` (Object)
  - All showAd options
  - `template` (string) - Native ad template

**Returns:** Promise<Ad|null>

---

#### showVideo(options)

Display a video ad.

```javascript
await adManager.showVideo(options)
```

**Parameters:**
- `options` (Object)
  - All showAd options
  - `skipAfter` (number) - Seconds before skip button appears
  - `maxDuration` (number) - Maximum video duration

**Returns:** Promise<Ad|null>

---

#### showInterstitial(options)

Display an interstitial ad.

```javascript
await adManager.showInterstitial(options)
```

**Parameters:**
- `options` (Object)
  - `trigger` (string) - Trigger type ('manual', 'page-transition')
  - `frequency` (string) - Frequency cap ('always', 'once-per-session')
  - `closeable` (boolean) - Can user close the ad
  - `closeDelay` (number) - Seconds before close button appears

**Returns:** Promise<Ad|null>

---

#### setContextualTargeting(targeting)

Set contextual targeting parameters.

```javascript
adManager.setContextualTargeting({
  category: 'pharmaceuticals',
  keywords: ['vitamins', 'supplements'],
  pageType: 'product-listing'
})
```

**Parameters:**
- `targeting` (Object)
  - `category` (string) - Content category
  - `keywords` (Array<string>) - Target keywords
  - `pageType` (string) - Page type identifier

---

#### setAudienceTargeting(targeting)

Set audience targeting parameters.

```javascript
adManager.setAudienceTargeting({
  demographics: {
    ageRange: '25-55',
    interests: ['health', 'wellness']
  },
  behavior: {
    previousPurchases: true
  }
})
```

**Parameters:**
- `targeting` (Object)
  - `demographics` (Object) - Demographic targeting
  - `behavior` (Object) - Behavioral targeting

---

#### setGeoTargeting(targeting)

Set geographic targeting parameters.

```javascript
adManager.setGeoTargeting({
  country: 'US',
  state: 'CA',
  city: 'San Francisco',
  radius: 50
})
```

**Parameters:**
- `targeting` (Object)
  - `country` (string) - Country code
  - `state` (string) - State code
  - `city` (string) - City name
  - `radius` (number) - Radius in miles

---

#### setPrivacySettings(settings)

Set privacy and compliance settings.

```javascript
adManager.setPrivacySettings({
  gdpr: {
    enabled: true,
    consentRequired: true,
    consentString: 'user-consent-string'
  },
  ccpa: {
    enabled: true,
    doNotSell: false
  }
})
```

**Parameters:**
- `settings` (Object)
  - `gdpr` (Object) - GDPR settings
  - `ccpa` (Object) - CCPA settings

---

#### trackConversion(data)

Track an ad conversion.

```javascript
adManager.trackConversion({
  adId: 'ad-12345',
  conversionType: 'purchase',
  value: 49.99,
  currency: 'USD'
})
```

**Parameters:**
- `data` (Object)
  - `adId` (string) - Ad identifier
  - `conversionType` (string) - Type of conversion
  - `value` (number) - Conversion value
  - `currency` (string) - Currency code

---

#### getRevenue(options)

Get revenue metrics.

```javascript
await adManager.getRevenue({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  groupBy: 'day'
})
```

**Parameters:**
- `options` (Object)
  - `startDate` (string) - Start date (ISO format)
  - `endDate` (string) - End date (ISO format)
  - `groupBy` (string) - Grouping ('day', 'week', 'month')

**Returns:** Promise<RevenueMetrics>

---

#### getPerformanceMetrics()

Get performance metrics.

```javascript
await adManager.getPerformanceMetrics()
```

**Returns:** Promise<PerformanceMetrics>

---

#### destroy()

Clean up and destroy the ad manager.

```javascript
adManager.destroy()
```

---

## AnalyticsTracker

Track and analyze ad performance.

### Constructor

```javascript
new AnalyticsTracker(config)
```

**Parameters:**
- `config` (Object)
  - `endpoint` (string) - Analytics API endpoint
  - `batchSize` (number) - Events per batch
  - `flushInterval` (number) - Flush interval in ms
  - `debug` (boolean) - Enable debug logging

---

### Methods

#### trackImpression(data)

Track an ad impression.

```javascript
tracker.trackImpression({
  adId: 'ad-12345',
  zoneId: 'homepage-banner',
  format: 'banner'
})
```

---

#### trackClick(data)

Track an ad click.

```javascript
tracker.trackClick({
  adId: 'ad-12345',
  destinationUrl: 'https://example.com'
})
```

---

#### trackViewability(data)

Track ad viewability.

```javascript
tracker.trackViewability({
  adId: 'ad-12345',
  viewableTime: 5000,
  viewablePercentage: 75
})
```

---

#### trackConversion(data)

Track a conversion.

```javascript
tracker.trackConversion({
  adId: 'ad-12345',
  conversionType: 'purchase',
  value: 99.99
})
```

---

#### trackRevenue(data)

Track revenue.

```javascript
tracker.trackRevenue({
  adId: 'ad-12345',
  amount: 5.50,
  type: 'cpm'
})
```

---

#### flush()

Manually flush queued events.

```javascript
await tracker.flush()
```

---

#### destroy()

Clean up and flush remaining events.

```javascript
await tracker.destroy()
```

---

## AdPlacement

Manage ad placement zones.

### Constructor

```javascript
new AdPlacement(config)
```

---

### Methods

#### register(zoneId, config)

Register an ad placement zone.

```javascript
placement.register('homepage-banner', {
  format: 'banner',
  size: '728x90',
  container: '#banner-container',
  autoLoad: true,
  lazyLoad: false,
  refresh: true,
  refreshInterval: 30000
})
```

**Parameters:**
- `zoneId` (string) - Zone identifier
- `config` (Object)
  - `format` (string) - Ad format
  - `size` (string) - Ad size
  - `container` (string|Element) - Container
  - `autoLoad` (boolean) - Auto-load on registration
  - `lazyLoad` (boolean) - Enable lazy loading
  - `refresh` (boolean) - Enable auto-refresh
  - `refreshInterval` (number) - Refresh interval in ms

---

#### unregister(zoneId)

Unregister a placement zone.

```javascript
placement.unregister('homepage-banner')
```

---

#### loadAd(zoneId, adManager)

Load an ad into a placement zone.

```javascript
await placement.loadAd('homepage-banner', adManager)
```

---

#### clearAll()

Clear all placement zones.

```javascript
placement.clearAll()
```

---

## Helpers

Utility functions.

### generateId(prefix)

Generate a unique ID.

```javascript
const id = helpers.generateId('ad'); // Returns: ad_1234567890_abc123
```

---

### parseSize(sizeString)

Parse ad size string.

```javascript
const { width, height } = helpers.parseSize('728x90');
// Returns: { width: 728, height: 90 }
```

---

### isInViewport(element, threshold)

Check if element is in viewport.

```javascript
const inView = helpers.isInViewport(element, 0.5);
```

---

### calculateECPM(revenue, impressions)

Calculate effective CPM.

```javascript
const ecpm = helpers.calculateECPM(1000, 500000);
// Returns: 2.00
```

---

### calculateCTR(clicks, impressions)

Calculate click-through rate.

```javascript
const ctr = helpers.calculateCTR(1250, 50000);
// Returns: 2.5
```

---

### isMobile()

Check if device is mobile.

```javascript
const mobile = helpers.isMobile();
```

---

### getDeviceType()

Get device type.

```javascript
const deviceType = helpers.getDeviceType();
// Returns: 'mobile', 'tablet', or 'desktop'
```

---

## Type Definitions

### Ad

```typescript
interface Ad {
  id: string;
  format: 'banner' | 'native' | 'video' | 'interstitial';
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  clickUrl: string;
  ctaText?: string;
  network: string;
}
```

### RevenueMetrics

```typescript
interface RevenueMetrics {
  total: number;
  eCPM: number;
  fillRate: number;
  impressions: number;
  clicks: number;
  ctr: number;
}
```

### PerformanceMetrics

```typescript
interface PerformanceMetrics {
  avgLoadTime: number;
  viewabilityRate: number;
  adBlockRate: number;
}
```

---

## Events

The Ads Core emits various events that you can listen to:

```javascript
// Ad loaded
adManager.on('ad-loaded', (ad) => {
  console.log('Ad loaded:', ad);
});

// Ad error
adManager.on('ad-error', (error) => {
  console.error('Ad error:', error);
});

// Ad clicked
adManager.on('ad-clicked', (ad) => {
  console.log('Ad clicked:', ad);
});
```

---

## Error Handling

All async methods can throw errors. Always use try-catch:

```javascript
try {
  const ad = await adManager.showAd(options);
} catch (error) {
  console.error('Failed to show ad:', error);
}
```

---

## Best Practices

1. **Initialize once**: Create a single AdManager instance
2. **Handle errors**: Always catch errors from async methods
3. **Respect privacy**: Set privacy settings appropriately
4. **Optimize performance**: Use lazy loading for below-fold ads
5. **Track metrics**: Use AnalyticsTracker for insights
6. **Test thoroughly**: Test across different devices and browsers

---

For more examples, see the [examples directory](../examples/).

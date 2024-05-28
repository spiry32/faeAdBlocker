chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true, whitelisted: [] });
  updateRules(true);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.enabled !== undefined) {
    updateRules(message.enabled);
  }
  if (message.updateRules) {
    chrome.storage.sync.get('enabled', (data) => {
      updateRules(data.enabled);
    });
  }
});

function updateRules(enabled) {
  chrome.storage.sync.get('whitelisted', (data) => {
    const whitelisted = data.whitelisted || [];

    // Common ad URLs and patterns to block
    const adBlockingRules = [
      { id: 1, priority: 1, action: { type: 'block' }, condition: { urlFilter: '*://*.doubleclick.net/*' } },
      { id: 2, priority: 1, action: { type: 'block' }, condition: { urlFilter: '*://*.adservice.google.com/*' } },
      { id: 3, priority: 1, action: { type: 'block' }, condition: { urlFilter: '*://*.googlesyndication.com/*' } },
      // Add more rules here as needed
    ];

    // Add rules to whitelist sites
    const whitelistRules = whitelisted.map((domain, index) => ({
      id: adBlockingRules.length + index + 1,
      priority: 1,
      action: { type: 'allow' },
      condition: { urlFilter: `*://${domain}/*` }
    }));

    const allRules = enabled ? [...adBlockingRules, ...whitelistRules] : [];

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: adBlockingRules.length + whitelistRules.length }, (_, i) => i + 1),
      addRules: allRules
    });
  });
}

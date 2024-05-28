document.addEventListener('DOMContentLoaded', function () {
  var toggleSwitch = document.getElementById('toggleSwitch');
  var whitelistButton = document.getElementById('whitelistButton');

  // Initialize the toggle switch and whitelist button
  chrome.storage.sync.get(['enabled', 'whitelisted'], function (data) {
    toggleSwitch.checked = data.enabled !== false; // Default to enabled if not set

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var hostname = new URL(currentTab.url).hostname;

      if (data.whitelisted && data.whitelisted.includes(hostname)) {
        whitelistButton.style.backgroundColor = 'red';
        whitelistButton.textContent = 'Ads allowed for this site';
      } else {
        whitelistButton.style.backgroundColor = 'green';
        whitelistButton.textContent = 'Block ads for this site';
      }
    });
  });

  // Toggle ad blocker on/off
  toggleSwitch.addEventListener('change', function () {
    var enabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: enabled });
    chrome.runtime.sendMessage({ enabled: enabled });
  });

  // Whitelist current site
  whitelistButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var hostname = new URL(currentTab.url).hostname;

      chrome.storage.sync.get('whitelisted', function (data) {
        var whitelisted = data.whitelisted || [];
        var index = whitelisted.indexOf(hostname);

        if (index !== -1) {
          whitelisted.splice(index, 1);
          whitelistButton.style.backgroundColor = 'green';
          whitelistButton.textContent = 'Block ads for this site';
        } else {
          whitelisted.push(hostname);
          whitelistButton.style.backgroundColor = 'red';
          whitelistButton.textContent = 'Ads allowed for this site';
        }

        chrome.storage.sync.set({ whitelisted: whitelisted });
        chrome.runtime.sendMessage({ updateRules: true });
      });
    });
  });
});

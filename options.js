document.addEventListener('DOMContentLoaded', function () {
  var domainsTextArea = document.getElementById('domains');
  var saveBtn = document.getElementById('saveBtn');

  // Load saved domains from storage
  chrome.storage.sync.get('blockedDomains', function (data) {
    if (data.blockedDomains) {
      domainsTextArea.value = data.blockedDomains.join('\n');
    }
  });

  // Save domains to storage
  saveBtn.addEventListener('click', function () {
    var domains = domainsTextArea.value.split('\n').map(domain => domain.trim()).filter(domain => domain);
    chrome.storage.sync.set({ 'blockedDomains': domains }, function () {
      alert('Domains saved!');
    });
  });
});

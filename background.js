const deniedList = new Set(['fbclid'])

const filter = {urls: ['https://*/*', 'http://*/*'], types: ['main_frame']}

chrome.webRequest.onBeforeRequest.addListener(({url, tabId}) => {
  const parsedURL = new URL(url)
  const found = []
  for (let key of parsedURL.searchParams.keys()) {
    if (key.match(/^utm_.*/) || deniedList.has(key)) {
      found.push(key)
    }
  }
  if (found.length) {
    found.forEach(key => parsedURL.searchParams.delete(key))
    chrome.tabs.update(tabId, {url: parsedURL.href})
    return {cancel: true}
  }
}, filter)

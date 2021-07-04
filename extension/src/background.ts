const buttonPressed = (tab: any, attempts: number = 2) => {
  chrome.tabs.sendMessage(tab.id as number, {
    // command: abc
    }, function(_response) {
      if(chrome.runtime.lastError) {
        // Swallow the error
        // setTimeout(() => {
        //   buttonPressed(tab, attempts - 1) 
        // }, 500)
      }
  })
}

chrome.browserAction.onClicked.addListener(function(tab) {
  buttonPressed(tab)
})

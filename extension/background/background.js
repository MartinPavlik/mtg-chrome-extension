
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      request.cards.forEach(function(card, index) {
         loadCard(card.name, console.info, console.log);
      });
      sendResponse();
});

var URL_CERNY_RYTIR = 'http://www.cernyrytir.cz';
var URL_RISHADA = 'rishada.cz';

var onTabUpdate = function(tabId, changeInfo, tab) {
   console.info(tab.url.indexOf(URL_RISHADA), tab.url)
   if(tab.url.indexOf(URL_CERNY_RYTIR) >= 0 ||  tab.url.indexOf(URL_RISHADA) >= 0) {
      chrome.pageAction.show(tabId);
   }
};


// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(onTabUpdate);
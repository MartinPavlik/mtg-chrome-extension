document.getElementById('open-page').addEventListener('click', function(){
  //alert(chrome.extension.getURL('src/page.html'));
  chrome.tabs.create({'url': chrome.extension.getURL('app/index.html')}, function(tab) {
    // Tab opened
  });
});
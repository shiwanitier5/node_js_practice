
console.log("Genius Mail Installed");
const RegURL = /^(http|https):\/\/(mail.)*(google)(\.com)/;

 chrome.runtime.onInstalled.addListener(function (details) {
    console.log("Genius Mail Installed");
    chrome.tabs.create({ url: "http://www.gmail.com/" }, function (tab) {
      console.log("tab");
   
        })

 })
 chrome.browserAction.onClicked.addListener(function callback(){

console.log("clicking")
chrome.tabs.getSelected(null,function(tab) {
   var tablink = tab.url;
   console.log(tab.url)
   if (!RegURL.test(tablink)) {
       chrome.tabs.create({ url: "http://www.gmail.com/" }, function (tab) {
         console.log("tab");
  
               chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                  chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response) {

                          console.log("message sent")

                  });  
               });
          
      
           })

   }
   else{
      // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {    
      //    console.log(changeInfo,tab)      
      //    if (changeInfo.status == 'complete') {   
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
               chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response) {

                       console.log("message sent")

               });  
            });
      //    }
      // });
   }

  
   });


  

 })
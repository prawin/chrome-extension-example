// Listen to the requests sent from popup.js using chrome.tabs.sendRequest
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
   if (request.action == "getDOM"){
     var elem_html = $("title").html();
     sendResponse({dom_response: elem_html});
   }
   else{
     sendResponse({}); // Send nothing..
   }
});
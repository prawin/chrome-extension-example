
//Get current tab object. Callbacks are importatnt to keep things waiting.
//Here we call getCurrentTab function and get a function in return,
// which accepts tab object as an argument.

function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    callback(tab);
  });
}

// Used to set status for user in popup in cases like time consuming API wait.
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

// Send a message to content.js to perform some action on current tab DOM and
// return dom or anything in the current tab in ca callback as response
function getPageElement(tab, callback) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {action: "getDOM"}, function(response) {
      callback(response);
    });
  });
};

// Hits an external api. Probably some data received from getPageElement.
// current_tab_dom_data contains current page title, which can be any data
// to be passed into the API
function getApiData(current_tab_dom_data, callback){
  var h = $("#resp").html()
  // Free APIs for testing :)
  var root = 'https://jsonplaceholder.typicode.com';
  $.ajax({
    url: root + '/posts/1',
    method: 'GET'
  }).then(function(data) {
    // API response is passed into a callback to the calling function
    callback(data);
  });
}


// Listen when popup.html is loaded
document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab(function(tab) {
    renderStatus('Loading....');
    getPageElement(tab, function(current_tab_dom_data){
      getApiData(current_tab_dom_data, function(results){
        var result_html = "<br/><strong>API result.body </strong>:" + results.body
        result_html += "<br/><strong>current tab title</strong>: " + current_tab_dom_data.dom_response
        $("#resp").html(result_html);
      })
    })
    renderStatus('EVERYTHING LOADED! Enjoy :)');
  });
});

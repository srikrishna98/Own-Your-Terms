"use strict";

// global variable to store search results
var searchResults = null;

// helper function to add text to correct subdivision
function displayText(text) {
  var textSpan = document.getElementById("myDiv");
  console.log(text);
  for (let i = 0; i < text.length; i = i + 1) {
    var redflagDiv = document.createElement("div");
    redflagDiv.classList.add("card");
    redflagDiv.classList.add("bg-light");
    redflagDiv.classList.add("mb-2");

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    var p = document.createElement("p");
    p.classList.add("card-text");
    p.innerHTML = text[i];

    cardBody.appendChild(p);
    redflagDiv.appendChild(cardBody);
    textSpan.appendChild(redflagDiv);
  }
}

function showErrorMessage() {
  var errorDiv = document.getElementById("errorDiv");
  var contentDiv = document.getElementById("myDiv");
  errorDiv.style.display = "block";
  contentDiv.style.display = "none";
}
function showContent() {
  var errorDiv = document.getElementById("errorDiv");
  var contentDiv = document.getElementById("myDiv");
  errorDiv.style.display = "none";
  contentDiv.style.display = "block";
}
// listen for messages sent by getPagesSource.js
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log(request);
  if (request.action == "getSource") {
    console.log("cibi", request.source);
    if (
      request?.source?.sentences === null ||
      request.source === null ||
      request.source === undefined ||
      !request.source
    ) {
      var textSpan = document.getElementById("errorDiv");
      var span = document.createElement("span");
      span.innerText =
        "This format is not supported. Please upload the document in our website.";
      textSpan.appendChild(span);
      showErrorMessage();
    } else {
      var results = request;
      console.log(results);
      // store the results
      searchResults = results.source.sentences;
      console.log(searchResults);
      // display results
      // for (var category in results["sentences"]) {
      displayText(searchResults);
      showContent();
      // }
    }
  }
});

function onWindowLoad() {
  var btn = document.querySelector("#ownItBtn");
  var my_tabid = null;
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    my_tabid = tabs[0].id;

    chrome.storage.local.set(
      {
        url: tabs[0].url,
        title: tabs[0].title,
      },
      () => {
        chrome.scripting
          .executeScript({
            target: { tabId: my_tabid },
            files: ["scripts/mark.min.js"],
          })
          .then(
            chrome.scripting
              .executeScript({
                target: { tabId: my_tabid },
                files: ["scripts/content.js"],
              })
              .then(function () {
                // error catching
                if (chrome.runtime.lastError) {
                  var textSpan = document.getElementById("myDiv");
                  var span = document.createElement("span");
                  span.innerText =
                    "This page is not supported. Please upload the T&C document in our website.";
                  textSpan.appendChild(span);
                  showErrorMessage();
                }
              })
              .catch(function (err) {
                var textSpan = document.getElementById("myDiv");
                var span = document.createElement("span");
                span.innerText =
                  "This page is not supported. Please upload the T&C document in our website.";
                textSpan.appendChild(span);
                showErrorMessage();
              })
          );
      }
    );
  });
}

var filterKeys = [
  "govt", // Disclose info to the government: https://regex101.com/r/jpBIp1/2/tests
  "track", // Track you on other websites "DNT" header (Do Not Track), "track" https://regex101.com/r/c2DOeX/2
  "share", // Shares data with 3rd parties "share...information" "share...data" https://regex101.com/r/OQG4fv/2
  "sell", // Right to sell data in financial transactions https://regex101.com/r/fzEr74/2
  "copyright", // Owns copyright on your content https://regex101.com/r/STXxpi/1
  "court", // Waive right to go to court https://regex101.com/r/UY04SZ/2
];

// BUTTON SYNTAX:
document.addEventListener("DOMContentLoaded", function () {
  // settings button
  var myBtn = document.getElementById("ownItBtn");
  console.log(myBtn);
});

function goToSettings() {
  var settingsDiv = document.getElementById("settings box");
  settingsDiv.classList.remove("hidden");

  var mainDiv = document.getElementById("box");
  mainDiv.classList.add("hidden");
}

function backToMain() {
  var settingsDiv = document.getElementById("settings box");
  settingsDiv.classList.add("hidden");

  var mainDiv = document.getElementById("box");
  mainDiv.classList.remove("hidden");
}

function closeApp() {
  window.close();
}

function goToHighlighted(id) {
  var category = id.split(" ")[0];
  var index = id.split(" ")[2];

  var sentenceID = category + " element " + index;
  var cleanSentence = document.getElementById(sentenceID).innerHTML;
  var rawSentence = searchResults["cleanToRaw"][cleanSentence];

  var splitRaw = rawSentence.split(/<[^>]*>/);
  if (splitRaw.length > 1) {
    rawSentence = splitRaw[0];
    var i = 0;
    while (rawSentence.length < 10) {
      i = i + 1;
      if (i == splitRaw.length) {
        return;
      }
      rawSentence = splitRaw[i];
    }
  }

  var params = { sentence: rawSentence, category: category };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "scroll",
      source: JSON.stringify(params),
    });
  });

  return;
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;

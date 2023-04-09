// ***********************************
//
// Constant Values and Util functions
//
// ***********************************

var hostedURL = "http://localhost:8080/";
var storeURL = "store";

// helper to check whether a piece of text contains terms of interest
function containsTOS(text) {
  return (
    text.search("Terms of Use") != -1 ||
    text.search("Terms of Service") != -1 ||
    text.search("Privacy Policy") != -1
  );
}

// *****************************
//
// DOM Manipulation
//
// *****************************

// *****************************
//
// External API call methods
//
// *****************************

function getAnalysis(sentences) {
  let baseUrl = hostedURL + storeURL;

  var urlParams = [
    {
      TOS_Data: sentences,
    },
  ];

  return fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(urlParams),
    headers: new Headers({ "Content-Type": "text/plain" }),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
}

// ****************************************
//
// MutationObserver creation and definition
//
// ****************************************
function highlightText(wordQuery, category) {
  var instance = new Mark(document.querySelector("*"));
  var options = {
    separateWordSearch: false,
    className: category,
    noMatch: function (term) {
      // term is the not found term
      var split = term.split(/<[^>]*>/);
      for (var j = 0; j < split.length; j++) {
        if (split[j].split(" ").length < 10) {
          continue;
        }
        instance.mark(split[j], {
          separateWordSearch: false,
          className: category,
        });
      }
    },
  };
  instance.mark(wordQuery, options);
}

var instance = new Mark(document.querySelector("*"));

// Let's have a dictionary of regex for each ToS element, start with 6 most impt to highlight
// Making a txt file with common strings for each of these terms from TOSDR page
var filterKeys = ["*"];

// Lookarounds are more concise, but slower for some of these, so avoiding using them for now
var filterDict = [/.*/gim];

var filterLength = filterDict.length;

function filterSentence(sentence) {
  // Assuming this is a legitimate sentence, apply filters
  var toReturn = [];
  for (var i = 0; i < filterLength; i++) {
    if (filterDict[i].exec(sentence) !== null) {
      // if (sentence.search(filterDict[i]) > -1) {
      toReturn.push(i);
    }
  }
  return toReturn;
}

function cleanupSentence(sentence) {
  if (sentence.length > 1000) {
    return "";
  } // get rid of long ones (likely code)

  // Let's identify some strings that indicate parsing has messed up
  /*
    var urlCount = (sentence.match(/Url/g) || []).length; // If encoding Urls in page
    var imgCount = (sentence.match(/img|svg|png/gi) || []).length; // If code embedding images
    var slashCount = (sentence.match(/\//g) || []).length; // If url string(s)
    var colonCount = (sentence.match(/\:/g) || []).length; // If url string(s)
    var quoteCount = (sentence.match(/\"/g) || []).length; // If url string(s)
    */

  // if (urlCount > 0) { return ""; }
  // if (imgCount > 0) { return ""; }
  // if (slashCount > 3) { return ""; }
  // if (colonCount > 3) { return ""; }
  // if (quoteCount > 6) { return ""; }

  //var clean = sentence.replace(/<(div|\/div|b|\/b|br|\/br|li|\/li|ul|\/ul|p|\/p)[^>]*>/, ' ');
  var clean = sentence.replace(/<[^>]*>/gi, ""); // remove all HTML tags
  clean = clean.replace(/[^a-z .,?!-:;\"\']/gi, " "); // Replace \s with ' ', see what happens
  clean = clean.replace(/&.t;/g, "");
  clean = clean.replace(/&nbsp;/g, "");
  clean = clean.replace(/a href/g, "");
  clean = clean.replace(/\/p /g, "");
  clean = clean.replace(/\/a /g, "");
  // Replace alternating unquoted and quoted words...
  clean = clean.replace(/([a-zA-Z-]* "[a-zA-Z0-9- #:\/,']*".){2,}/gm, " ");
  // Replace more than two spaces in a row with a single space
  clean = clean.replace(/ {2,}/g, " ");
  clean = clean.trim();

  if (clean.split(" ").length < 10) {
    return "";
  } // get rid of short ones (likely headers)

  return clean;
}

function breakIntoSentences(text) {
  var finalSentences = [];

  var firstIteration = text.split(/\.(\s|\"|\'|\|![A-Za-z0-9])/);

  for (var k = 0; k < firstIteration.length; k++) {
    var secondIteration = firstIteration[k].split(/(<b>|<br>|<div>|<li>|<ul>)/);
    for (var l = 0; l < secondIteration.length; l++) {
      finalSentences.push(secondIteration[l]);
    }
  }

  return finalSentences;
}

function DOMtoString(document_root) {
  // 1. Grab all the text from the page
  var acceptedTags = ["A", "UL", "LI", "BR", "B", "P", "SPAN", "TEXT"];
  var all = document.getElementsByTagName("*");
  var pageText = "";
  var numSentences = 0;

  // three maps:
  var keptSentences = {}; // categories -> list of cleaned sentences (for display)
  var cleanToRaw = {}; // cleaned sentence -> raw sentence (for highlighting)
  var hashes = {}; // string hashes

  // iterate over all elements
  for (var i = 0; i < all.length; i++) {
    var curElem = all[i];
    pageText += curElem.tagName + "\n";

    // look only at valid tags
    if (acceptedTags.indexOf(curElem.tagName) > -1) {
      pageText += "\n" + curElem.innerHTML + "\n";
      var text = curElem.innerHTML;

      // basic TOS check
      //   if(!isTOS && containsTOS(text)){ isTOS = true; }

      // split sentences
      var curSentences = breakIntoSentences(text);

      // pass sentences through a cleanup + filters
      for (var j = 0; j < curSentences.length; j++) {
        var cleanSentence = cleanupSentence(curSentences[j]);

        var filters = filterSentence(cleanSentence);
        if (filters.length > 0 && !(cleanSentence in cleanToRaw)) {
          cleanToRaw[cleanSentence] = curSentences[j];

          // console.log(cleanSentence);
          // add to our maps
          for (f = 0; f < filters.length; f++) {
            var filterFound = filterKeys[filters[f]];
            if (!(filterFound in keptSentences)) {
              keptSentences[filterFound] = [];
              hashes[filterFound] = [];
            }
            var thisHash = hashCode(cleanSentence.substr(0, 50));
            if (!hashes[filterFound].includes(thisHash)) {
              hashes[filterFound].push(thisHash);
              keptSentences[filterFound].push(cleanSentence);
              numSentences += 1;
            }
          }
        }
      }
    }
  }
  console.log(numSentences);
  console.log(keptSentences["*"]);

  return getAnalysis(keptSentences)
    .then(function (res) {
      if (res.redflags === null) {
        return {
          sentences: null,
        };
      } else {
        return {
          sentences: res,
        };
      }
    })
    .catch((err) => {
      throw err;
    });
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "scroll") {
    var scrollParams = JSON.parse(request.source);
    var sentence = scrollParams["sentence"];
    var category = scrollParams["category"];

    var all = document.getElementsByClassName(category);

    var div = "NONE";
    for (var i = 0; i < all.length; i++) {
      if (all[i].innerHTML.includes(sentence)) {
        div = all[i];
        div.scrollIntoView({ block: "center" });
        break;
      }
    }
  }
});

// send a message back to popup.js (calls the Listener there)

DOMtoString(document)
  .then((res) => {
    chrome.runtime.sendMessage({
      action: "getSource",
      source: res,
    });
  })
  .catch((err) => {
    chrome.runtime.sendMessage({
      action: "getSource",
      source: null,
    });
  });

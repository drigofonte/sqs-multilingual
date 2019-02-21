$(document).ready(function () {
  var lang = (function(){
    var visibleClass = "visible";
    var hiddenClass = "hidden";
    var defaultLang = "en-gb";
    var currentLang = defaultLang;
    var cookieBannerClass = "sqs-cookie-banner";
    var pathname = window.location.pathname.split("/")[1];
    if (pathname != "")
      currentLang = pathname;
    
    var langMappings = {
      "en-gb": {
        "cookie": {
          "message": "We use cookies to provide you with a great experience. Click on the button below to agree with our use of cookies.",
          "button": "I agree"
        }
      },
      "pt-br": {
        "cookie": {
          "message": "Esse site usa cookies para lhe proporcionar uma excelente experiência. Clique no botão abaixo para concordar com o uso de cookies.",
          "button": "Concordo"
        }
      }
    };
        
    var updateLogoLink = function(e) {
      if (e != null)
        currentLang = e.currentTarget.href.split("/")[3];
      if (currentLang == "")
        currentLang = defaultLang;
      var root = "/" + currentLang;
      $(".mobile-site-title a[href]").attr("href", root);
      $(".site-title a[href]").attr("href", root);
    };
      
    var updateCookieMessage = function() {
      var cookieMessage = langMappings[currentLang].cookie.message;
      var cookieButton = langMappings[currentLang].cookie.button;
      $("[class^=" + cookieBannerClass + "] > p").text(cookieMessage);
      $("[class^=" + cookieBannerClass + "] > button").text(cookieButton);
    };
    
    var makeVisible = function(e) {
      $(e).addClass(visibleClass);
      $(e).removeClass(hiddenClass);
    };
    
    var makeHidden = function(e) {
      $(e).addClass(hiddenClass);
      $(e).removeClass(visibleClass);
    };
    
    var updateNavigationLinks = function() {
      // Show menu items for selected language
      var currentLangHref = "[href^=\\/"+currentLang+"]";
      var currentLangLink = "a" + currentLangHref;
      $(".nav-item.collection > " + currentLangLink + ", .folder-link.collection > " + currentLangLink).each(function(i, v) {
        makeVisible($(v).parent());
      });
      
      // Hide menu items for all other languages
      $(".nav-item.collection > a, .folder-link.collection > a").not(currentLangHref).each(function(i, v) {
        makeHidden($(v).parent());
      });
      
      // Hide menu item for the current language
      makeHidden($(".nav-item.external > " + currentLangLink + ", .folder-link.external > " + currentLangLink).parent());
      
      // Show menu items for other languages
      $(".nav-item.external > a, .folder-link.external > a").not(currentLangHref).each(function(i, v) {
        makeVisible($(v).parent());
      });
      
      // Update visibility of the home menu item
      var homeNavItem = $(".nav-item.collection > a[href=\\/], .folder-link.collection > a[href=\\/]").parent();
      if (homeNavItem != undefined) {
        if (currentLang == defaultLang)
          makeVisible(homeNavItem);
        else
          makeHidden(homeNavItem);   
      }
    };

    var updateLangLinks = function() {
      // Add a language class to each language link. This should allow language links to be customised to be displayed as country flags.
      $(".nav-item.external > a, .folder-link.external > a").each(function(i, v) {
        // Check if it is a recognised language link
        var langIso = $(v).attr("href").substring(1);
        if (langMappings[langIso] != undefined) {
          var country = langIso.split("-")[1];
          
          // Add flag icon classes to the 'a' element
          $(v).addClass("flag flag-icon-background flag-icon-"+country+" flag-icon-squared");
        }
      });
    };
    
    var update = function(e) {
      updateLogoLink(e);
      updateCookieMessage();
      updateNavigationLinks();
    };
    
    return {
      cookieBannerClass: cookieBannerClass,
      udpateLogoLink: updateLogoLink,
      updateLangLinks: updateLangLinks,
      updateCookieMessage: updateCookieMessage,
      update: update
    };
  })();
  
  $(".nav-item a, .folder-link a").click(function(e) {
      lang.update(e);
  });
  
  lang.update();
  lang.updateLangLinks();
  
  // Select the node that will be observed for mutations
  var targetNode = $("[class^=" + lang.cookieBannerClass + "]")[0];

  if (targetNode != undefined) {
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                observer.disconnect();
                lang.update();
                observer.observe(targetNode, config);
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
});
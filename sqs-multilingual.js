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
      
      var cookieLangMappings = {
        "en-gb": {
          "message": "We use cookies to provide you with a great experience. Click on the button below to agree with our use of cookies.",
          "button": "I agree"
        },
        "pt-br": {
          "message": "Usamos cookies para lhe proporcionar com uma excelente experiência. Clique no botão abaixo para concordar com o uso de cookies.",
          "button": "Concordo"
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
        var cookieMessage = cookieLangMappings[currentLang].message;
        var cookieButton = cookieLangMappings[currentLang].button;
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
        $(".nav-item.collection > a[href^=\\/"+currentLang+"]").each(function(i, v) {
          makeVisible($(v).parent());
        });
        
        // Hide menu items for all other languages
        $(".nav-item.collection > a").not("[href^=\\/"+currentLang+"]").each(function(i, v) {
          makeHidden($(v).parent());
        });
        
        // Hide menu item for the current language
        makeHidden($(".nav-item.external > a[href^=\\/"+currentLang+"]").parent());
        
        // Show menu items for other languages
        $(".nav-item.external > a").not("[href^=\\/"+currentLang+"]").each(function(i, v) {
          makeVisible($(v).parent());
        });
        
        // Update visibility of the home menu item
        var homeNavItem = $(".nav-item.collection > a[href=\\/]").parent();
        if (homeNavItem != undefined) {
          if (currentLang == defaultLang)
            makeVisible(homeNavItem);
          else
            makeHidden(homeNavItem);   
        }
      };
      
      var update = function(e) {
        updateLogoLink(e);
        updateCookieMessage();
        updateNavigationLinks();
      };
      
      return {
        cookieBannerClass: cookieBannerClass,
        udpateLogoLink: updateLogoLink,
        updateCookieMessage: updateCookieMessage,
        update: update
      };
    })();
    
    $(".nav-item a").click(function(e) {
        lang.update(e);
    });
    
    lang.update();
    
    console.log($("[class^=sqs-cookie-banner]").html());
    
    // Select the node that will be observed for mutations
    var targetNode = $("[class^=" + lang.cookieBannerClass + "]")[0];

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
  });
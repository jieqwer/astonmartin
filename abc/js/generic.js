/*
*
* Aston Martin Generic 
* @author John Laramy AML 2012
*
*/

/*
* Global namespace
*/
var aston = aston || {};


/*  
*   @namespace generic 
*   Hold some generic functions which we can reuse in all plugins
*/
aston.generic = function () {

    // PRIVATE variables    
    var config = {
        bitly: {
            login: "o_58beie1q12",
            apiKey: "R_aab2b8474edc0bc88efc35e9b1510cdf"
        }
    };

    /**       
        @public
        @name getTranslatedText
        @function
        @description Get translated text from aston.langauges object
    */
    var getTranslatedText = function (whichLanguage, whichObject, whichProperty) {

        // Not all things have been translated - cater for this
        var retValue = aston.lang[whichLanguage] && aston.lang[whichLanguage][whichObject] && aston.lang[whichLanguage][whichObject][whichProperty];

        // No matches so return English as default
        if (!retValue) {
            retValue = aston.lang.en[whichObject][whichProperty];
        }

        return (typeof retValue !== 'undefined') ? retValue : "";
    };

       
    /**
        @public
        @name GetValueForSelect
        @function
        @description Get value from the RGA Styled Select, return default as 0
    */
    var getValueForSelect = function ($whichSelect) {

        var $whichSelect = $whichSelect,
            whichSelected = $whichSelect.parent().children('span').text(),
			options = $whichSelect.children('option'),
			optionWithValue;

        // Hack for Purchase Timeframe - Replace characters
        if ($whichSelect.attr('id') == "cmbPurchaseTimeframe") {
            whichSelected = whichSelected.replace('<', '&lt;');
        }

        // Look through the options
        options.each(function () {

            if ($(this).html() == whichSelected) {
                optionWithValue = $(this);
                return false;
            }
        });

        // Just in case the Select hasn't been stylised
        return (typeof optionWithValue !== 'undefined') ? optionWithValue.attr('value') : 0;
    };


    /**
        @public
        @name getTextForSelect
        @function
        @description Get the text value from the RGA Styled Select, return default as ''
    */
    var getTextForSelect = function ($whichSelect) {

        var $whichSelect = $whichSelect,
            whichSelected = $whichSelect.parent().children('span').text(),
			options = $whichSelect.children('option'),
			optionWithValue;

        // Hack for Purchase Timeframe - Replace charscters
        if ($whichSelect.attr('id') == "cmbPurchaseTimeframe") {
            whichSelected = whichSelected.replace('<', '&lt;');
        }

        // Look through the options
        options.each(function () {

            if ($(this).html() == whichSelected) {
                optionWithValue = $(this);
                return false;
            }
        });

        // Just in case the Select hasn't been stylised
        return (typeof optionWithValue !== 'undefined') ? optionWithValue.text() : '';
    };


    /**
        @public
        @name getQueryStringValue
        @function
        @description Get Query String Value, supply Default Value
    */
    var getQueryStringValue = function (key, defaultVal) {

        if (defaultVal == null) defaultVal = "";
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if (qs == null)
            return defaultVal;
        else
            return qs[1];
    };


    /**
        @public
        @name isValidEmailAddress
        @function
        @description Return whether an email address is valid
    */
    var isValidEmailAddress = function(email) {
        var emailAddress = $.trim(email),
		    pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    };


    /**
        @public
        @name isStringNullOrEmpty
        @function
        @description Return whether an email address is valid
    */
    var isStringNullOrEmpty = function (value) {
        return (value === undefined || value == null || value.length <= 0 || value == '') ? true : false;
    };


    /**
        @public
        @name getBitlyUrl
        @function
        @description Turn social share url into a BitLy link
        NOTE: Bitly API wont shorten url's which contain localhost
    */
    var getBitlyUrl = function (shareUrl) {
        return $.Deferred(function (dfd) {

            $.getJSON('http://api.bitly.com/v3/shorten?apiKey=' + config.bitly.apiKey + '&login=' + config.bitly.login + '&longUrl=' + shareUrl + '&format=json&callback=?')
				.always(function (data) {

				    if (data && data.status_code == 200) {
				        dfd.resolve(data.data.url);
				    }
				    else {
				        // Problem shortening the url - so just return the long url
				        dfd.resolve(shareUrl);
				    }
				});
        }).promise();
    };


    /**
        @public
        @name addBackgroundImage
        @function
        @description Add background image		
	*/
    var addBackgroundImage = function (imageUrl) {

        // Try and use CSS background-size: cover            
        if (!Modernizr.backgroundsize) {

            $('html').css({
                'background-image': 'url(' + imageUrl + ')',
                'background-position-x': 'top',
                'background-position-y': 'left',
                'background-color': '#000',
                'background-attachment': 'fixed',
                'background-repeat': 'no-repeat'
            });
        }
        else {

            $('html').css({
                'background-image': 'url(' + imageUrl + ')',
                'background-attachment': 'fixed',
                'background-repeat': 'no-repeat',
                'background-size': 'cover'
            });
        }
    };


    /**
		@public
		@name getContentSize
		@function
		@description Calculate content width and height based on parent element and ratio
	*/
    var getContentSize = function ($el, contentRatio) {

        var $parent = $el.parent(),
            width = $parent.outerWidth();

        return {
            width: width,
            height: width / contentRatio
        }
    };


    /**
        @public
        @name loginAndRedirect
        @function
        @description Client side login and redirect using Claims
    */
    var loginAndRedirect = function (iframeUrl, redirectUrl) {
        var $iframe = createIframe();

        $iframe.load(function () {
            window.location.href = redirectUrl;
        });

        $iframe.attr('src', iframeUrl);
    };
    

    /**
        @private
        @name createIframe
        @function
        @description Create iFrame
    */
    var createIframe = function () {

        // Create unique iframe id
        var iframeId = _.uniqueId('iframe_'),
            iframeHtml = '<iframe id="' + iframeId + '" name="' + iframeId + '" style="position:absolute; top:-9999px; left:-9999px;"';

        // IE fix - prevent access denied when submitting the form
        if (window.ActiveXObject) {
            iframeHtml += ' src="' + 'javascript:false' + '"';
        }

        iframeHtml += '></iframe>';

        $(iframeHtml).appendTo(document.body);

        // Append new element
        return $('#' + iframeId);
    };


    /**
        @private
        @name trackPageView
        @function
        @description Log page view with Google Analaytics
    */
    var logPageView = function (pageUrl) {
        var _gaq = _gaq || [];

        try {
            _gaq.push(['_trackPageview', pageUrl]);
        } catch (e) {

        }
    };


    /**
        @private
        @name showLoginPopup
        @function
        @description Show login popup
    */
    var showLoginPopup = function (pageUrl) {

        // Use underscore to create a unique id
        var uniqueId = _.uniqueId('login-'),
            tmpObj = {
                Id: uniqueId,
                LoginUrl: "/login?ReturnUrl=" + window.location.href
            },
            $html = $('#loginTemplate').tmpl(tmpObj);

        // Write to dom
        $('body').append($html);

        // Get reference to newly created 
        var $elem = $('#' + uniqueId);

        // Use fancybox to display
        $.fancybox.open(
            $elem,
            {
                padding: 0,
                autoSize: true,
                afterClose: function () {
                    // Remove the element on close
                    $elem.remove();
                }
            }
        );
    };

    

    // Reveal PUBLIC methods
    return {
        getTranslatedText: getTranslatedText,
        getValueForSelect: getValueForSelect,
        getTextForSelect: getTextForSelect,
        getQueryStringValue: getQueryStringValue,
        isValidEmailAddress: isValidEmailAddress,
        isStringNullOrEmpty: isStringNullOrEmpty,
        getBitlyUrl: getBitlyUrl,
        addBackgroundImage: addBackgroundImage,
        getContentSize: getContentSize,
        loginAndRedirect: loginAndRedirect,
        logPageView: logPageView,
        showLoginPopup: showLoginPopup
    }
}();
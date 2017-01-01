/*
 * Common
 *
 * Utilities and help for the whole library
 */
///#GLOBALS=jQuery
///#DEBUG=Iit.OpenApi.log,Iit.OpenApi.setLogLevel

(function ($) {
    "use strict";

    /* Private fields */
    var Iit_OpenApi = createNamespace("Iit.OpenApi");

    /* public methods */

    Iit_OpenApi.createNamespace = createNamespace;
    function createNamespace(namespace) {
        /// <summary>
        ///   Creates a namespace in the global scope e.g. createNamespace("Iit.OpenApi") creates
        ///   window.Iit = { OpenApi: {} };
        ///   in a non-destructive way
        /// </summary>

        var namespaces = namespace.split('.'),
            container = window,
            i;

        for (i = 0; i < namespaces.length; i++) {
            container = container[namespaces[i]] = container[namespaces[i]] || {};
        }
        return container;
    }

    Iit_OpenApi.copyToNamespace = function Iit$OpenApi$copyToNamespace(ns) {
        /// <summary>
        ///   Copy to namespace, so that everything in Iit.OpenApi is available in the argument
        /// </summary>
        /// <param name="copyToNamespace" type="Object" mayBeNull="true" />
        $.extend(true, ns||window, Iit.OpenApi);
    };

    Iit_OpenApi.padZero = function Iit$OpenApi$padZero(str, number) {
        /// <summary>pads a string with a number of zeros</summary>
        str = String(str);
        var i;
        for (i = 0; i < number - str.length; i++) {
            str = '0' + str;
        }
        return str;
    };

    Iit_OpenApi.endsWith = function Iit$OpenApi$endsWith(haystack, needle) {
        /// <summary>Returns whether the haystack ends with the needle</summary>
        return haystack.substr(haystack.length - needle.length) === needle;
    };

    Iit_OpenApi.startsWith = function Iit$OpenApi$startsWith(haystack, needle) {
        /// <summary>Returns whether the haystack starts with the needle</summary>
        return haystack.substr(0, needle.length) === needle;
    };

    ///#DEBUG
    var logLevel = Iit_OpenApi.logErrors;

    Iit_OpenApi.logErrors = 1;
    Iit_OpenApi.logWarnings = 2;
    Iit_OpenApi.logInfo = 3;
    Iit_OpenApi.logDebug = 4;

    Iit_OpenApi.log = function Iit$OpenApi$log(message, level) {
        /// <summary>logs a message to the console</summary>
        if (window.console && console.log && (logLevel >= (level || Iit_OpenApi.logDebug))) {
            console.log(message);
        }
    };

    Iit_OpenApi.setLogLevel = function II$OpenApi$setLogLevel(newLogLevel) {
        logLevel = newLogLevel;
    };
    ///#ENDDEBUG

} (jQuery));/*
 * Enumeration
 *
 * A class representing a enumeration value
 *
 * Definitions should look like this
 * var enumDef = {
 *   FxSpot: "FxSpot",
 *   FxForward: "FxForward"
 * }
 */


(function ($, Iit_OpenApi) {
    "use strict";

    /* private fields*/

    /* constructor */

    Iit_OpenApi.Enum = function Iit$OpenApi$Enum(args) {
        /// <summary>
        ///  Creates a new enumeration value
        /// </summary>

        var values,
            value,
            i, j, enumValues = !$.isArray(args) ? arguments : args;

        for (j = 0; j < enumValues.length; j++) {
            values = enumValues[j];
            if (typeof values !== "string") {
                ///#DEBUG
                if (!(values instanceof Iit_OpenApi.Enum)) {
                    throw new Error("Enum takes strings in the form 'a,b' and enumeration objects, nothing else");
                }
                ///#ENDDEBUG
                for (value in values) {
                    if (values.hasOwnProperty(value) && values[value]) {
                        this[value] = true;
                    }
                }
            } else {
                values = values.split(",");
                for (i = 0; i < values.length; i++) {
                    value = $.trim(values[i]);
                    if (value) {
                        this[value] = true;
                    }
                }
            }
        }
    };

    /* Public methods */

    Iit_OpenApi.Enum.makeDefinition = function Iit$OpenApi$Enum$makeDefinition(values, aggregates) {
        var enumDefinition = {}, i, aggregatesProperty;

        for(i = 0; i < values.length; i++) {
            enumDefinition[values[i]] = values[i];
        }

        if (aggregates) {
            enumDefinition.aggregates = aggregatesProperty = {};

            for (i in aggregates) {
                if (aggregates.hasOwnProperty(i)) {
                    aggregatesProperty[i] = new Iit_OpenApi.Enum(aggregates[i]);
                }
            }
        }

        return enumDefinition;
    };

    /* prototype methods */

    Iit_OpenApi.Enum.prototype.toString = function Iit$OpenApi$Enum$toString() {
        var value, str = "";
        for (value in this) {
            if (this.hasOwnProperty(value) && this[value]) {
                str += str ? ", " : "";
                str += value;
            }
        }
        return str;
    };

    Iit_OpenApi.Enum.prototype.union = function Iit$OpenApi$Enum$union(enumB) {

        if ($.isArray(enumB)) {
            enumB = new Iit_OpenApi.Enum(enumB);
        }

        return new Iit_OpenApi.Enum(this, enumB);
    };

    Iit_OpenApi.Enum.prototype.intersection = function Iit$OpenApi$Enum$intersection(enumB) {
        var returner = new Iit_OpenApi.Enum(), value;

        if (!(enumB instanceof Iit_OpenApi.Enum)) {
            enumB = new Iit_OpenApi.Enum(enumB);
        }

        for (value in this) {
            if (this.hasOwnProperty(value) && this[value] && enumB.hasOwnProperty(value) && enumB[value]) {
                returner[value] = true;
            }
        }
        return returner;
    };

    Iit_OpenApi.Enum.prototype.hasAllOf = function Iit$OpenApi$Enum$hasAllOf(enumB) {
        var value;

        if (!(enumB instanceof Iit_OpenApi.Enum)) {
            enumB = new Iit_OpenApi.Enum(enumB);
        }

        for (value in enumB) {
            if (enumB.hasOwnProperty(value) && enumB[value]) {
                if (!(this.hasOwnProperty(value) && this[value])) {
                    return false;
                }
            }
        }
        return true;
    };

    Iit_OpenApi.Enum.prototype.hasAnyOf = function Iit$OpenApi$Enum$hasAnyOf(enumB) {
        var value;

        if (!(enumB instanceof Iit_OpenApi.Enum)) {
            enumB = new Iit_OpenApi.Enum(enumB);
        }

        for (value in enumB) {
            if (enumB.hasOwnProperty(value) && enumB[value]) {
                if (this.hasOwnProperty(value) && this[value]) {
                    return true;
                }
            }
        }
        return false;
    };

    Iit_OpenApi.Enum.prototype.equals = function Iit$OpenApi$Enum$equals(enumB) {
        if (!(enumB instanceof Iit_OpenApi.Enum)) {
            enumB = new Iit_OpenApi.Enum(enumB);
        }

        return enumB.hasAllOf(this) && this.hasAllOf(enumB);
    };

} (jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi")));/*
 * InstrumentType enumeration definition (used for e.g. historical positions, InstrumentType property)
 */

(function ($, Iit_OpenApi) {
    "use strict";

    Iit_OpenApi.InstrumentType = Iit.OpenApi.Enum.makeDefinition([
        "Bonds",
        "Cash",
        "Cfd",
        "CfdOnFutures",
        "ContractFutures",
        "ContractOptionsAll",
        "FxSpot",
        "FxVanillaOption",
        "KnockInOptions",
        "KnockOutOptions",
        "BinaryOptions",
        "OneTouchOptions",
        "NoTouchOptions",
        "ManagedFunds",
        "Shares"
    ]);
}(jQuery, Iit.OpenApi));/*
 * TimeSpan
 *
 * A class representing a time span in order to communicate these with Open API
 */


(function ($, Iit_OpenApi) {
    "use strict";

    /* private fields*/
    var deserializeRegExp = /^(-)?(?:(\d+)\.)?(\d+):(\d+):(\d+)(?:\.(\d+))?$/;

    /* constructor */

    Iit_OpenApi.TimeSpan = function Iit$OpenApi$TimeSpan() {
        /// <summary>
        ///  Creates a new timespan
        ///   new TimeSpan()
        ///    - defaults to 0
        ///   new TimeSpan("-3.23:11:04.3123432")
        ///    - From a .NET format signature
        ///   new TimeSpan(hours, mins, seconds)
        ///   new TimeSpan(days, hours, mins, seconds)
        /// </summary>

        var neg = false, days = 0, hours = 0, mins = 0, secs = 0, milli = 0, formattedTimeSpan;

        // figure out the arguments
        if (arguments.length > 0) {
            if (typeof arguments[0] === "string") {
                formattedTimeSpan = arguments[0];
            } else if (arguments.length === 3) {
                hours = arguments[0];
                mins = arguments[1];
                secs = arguments[2];
            } else if (arguments.length === 4) {
                days = arguments[0];
                hours = arguments[1];
                mins = arguments[2];
                secs = arguments[3];
            }
        }

        // de-serialise
        if (formattedTimeSpan) {
            //[-][d.]hh:mm:ss[.fffffff]
            formattedTimeSpan = formattedTimeSpan.match(deserializeRegExp);

            neg = Boolean(formattedTimeSpan[1]);
            days = Number(formattedTimeSpan[2]) || 0;
            hours = Number(formattedTimeSpan[3]);
            mins = Number(formattedTimeSpan[4]);
            secs = Number(formattedTimeSpan[5]);
            milli = Number(formattedTimeSpan[6]) || 0;
        }

        // set values
        this.negative = neg;
        this.days = days;
        this.hours = hours;
        this.minutes = mins;
        this.seconds = secs;
        this.milliseconds = milli;
    };

    /* prototype methods */

    Iit_OpenApi.TimeSpan.prototype.toString = function Iit$OpenApi$TimeSpan$toString() {
        /// <summary>Serialises into a .NET format - [-][d.]hh:mm:ss[.fffffff]</summary>

        var returner = this.negative ? "-" : "",
            miliStr;

        if (this.days > 0) {
            returner += this.days + ".";
        }

        returner += this.hours + ":" + this.minutes + ":" + this.seconds;

        if (this.milliseconds > 0) {
            miliStr = String(this.milliseconds);
            returner += "." + Iit.OpenApi.padZero(miliStr, 7);
        }

        return returner;
    };

} (jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi")));/*
 * ISO8601
 *
 * A class for parsing and serialising dates in the 8601 basic format
 * Only supporting formats as discusssed in http://www.w3.org/TR/NOTE-datetime
 */


(function ($, Iit_OpenApi_ISO8601) {
    "use strict";

    /* private fields */
    // IE8 and below does not support
    var hasBrowserSupport = !isNaN(Date.parse("1997-07-16T19:20:30.32Z")) && !isNaN(Date.parse("1997-07-16Z")),
        //    YYYY       MM          DD      T  HH      MM         SS       .ms       time zone  +/-   HH      MM
        iso8601RegExp = /(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(?:Z|(?:([\-+])(\d{2}):(\d{2})))?)?)?)?/,
        hasTimeZoneRegExp = /(Z|[\-+]\d{2}(:\d{2})?)$/,
        UTCTimeZoneIdentifier = "Z";

    // reference: http://www.w3.org/TR/NOTE-datetime

    /* public functions */

    ///#DEBUG
    Iit_OpenApi_ISO8601.set_BrowserSupport = function Iit$OpenApi$ISO8601$set_BrowserSupport(hasSupport) {
        hasBrowserSupport = hasSupport;
    };
    Iit_OpenApi_ISO8601.get_BrowserSupport = function Iit$OpenApi$ISO8601$get_BrowserSupport() {
        return hasBrowserSupport;
    };
    ///#ENDDEBUG

    Iit_OpenApi_ISO8601.parseDateTime = function Iit$OpenApi$ISO8601$parseDateTime(strDateTime) {
        /// <summary>
        ///  Parses a ISO8601 date into a Date
        /// </summary>
        /// <param type="String" name="strDateTime">ISO8601 formatted date</param>

        if (hasBrowserSupport) {
            if (!hasTimeZoneRegExp.test(strDateTime)) {
                strDateTime += UTCTimeZoneIdentifier;
            }
            return new Date(strDateTime);
        }

        if (!strDateTime) {
            return new Date();
        }

        // extract out the components
        var offset,
            d = strDateTime.match(iso8601RegExp),
            date = new Date(
                Date.UTC(    // constructs as a UTC date which we can later adjust if there is an offset
                    d[1],   //Year
                    (d[2] || 1) - 1, //Months - js is 0-11, ISO8601 is 1-12
                    d[3] || 0, //Day
                    d[4] || 0, //Hours
                    d[5] || 0, //mins
                    d[6] || 0, //Seconds
                    d[7] || 0)); //milliseconds

        // time zone d[8] is +|-
        if (d[8]) {
            // get offset in minutes
            offset = (Number(d[9]) * 60) + Number(d[10]);
            // get offset + or -, backwards to adjust to UTC
            offset *= ((d[8] === '-') ? 1 : -1);
            //apply offset.. setTime is neutral to UTC
            date.setTime((Number(date) + (offset * 60 * 1000)));
        }

        return date;
    };

    Iit_OpenApi_ISO8601.toString = function Iit$OpenApi$ISO8601$toString(date) {
        /// <summary>
        ///  Serialises a date time as a ISO8601 string
        /// </summary>
        return Iit_OpenApi_ISO8601.toDateString(date) + 'T' +
            Iit.OpenApi.padZero(date.getUTCHours(), 2) + ':' +
            Iit.OpenApi.padZero(date.getUTCMinutes(), 2) + ':' +
            Iit.OpenApi.padZero(date.getUTCSeconds(), 2) + 'Z';
    };

    Iit_OpenApi_ISO8601.toDateString = function Iit$OpenApi$ISO8601$toDateString(date) {
        /// <summary>
        ///  Serialises a date time as a ISO8601 string
        /// </summary>
        return date.getUTCFullYear() + '-' +
            Iit.OpenApi.padZero(date.getUTCMonth() + 1, 2) + '-' +
            Iit.OpenApi.padZero(date.getUTCDate(), 2);
    };

} (jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.ISO8601")));/*
 * Default Store
 *
 * A small in browser cache, used by default
 */

(function ($, Iit_OpenApi_DefaultStore) {
    "use strict";

    Iit_OpenApi_DefaultStore.getNew = function Iit$OpenApi$DefaultStore$getNew() {
        var store = {};

        function doGet(key) {
            return store[key];
        }

        function doSet(key, value) {
            store[key] = value;
        }

        function doDel(key) {
            if (typeof key !== 'undefined') {
                store[key] = null;
                delete store[key];
            }
            else {
                store = {};
            }
        }
        return {
            "get": doGet,
            "set": doSet,
            "del": doDel
        };
    };

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.DefaultStore")));/*
* IO
*
* Utilities/Extensions to help IO and REST communication through jQuery
*/


(function ($, Iit_OpenApi_IO) {
    "use strict";

    Iit_OpenApi_IO._serviceCallProxies = [];

    /* private fields*/
    var METHOD_POST = "POST",
        METHOD_GET = "GET",
        METHOD_PUT = "PUT",
        METHOD_DELETE = "DELETE",
        DATA_TYPE = "JSON",
        preserveOriginalData,
        baseUrl,
        sessionUrl,
        language,
        retryAttempts,
        retryInterval,
        retryCodes,
        caching,
        toString = Object.prototype.toString,
        urlArgDatePattern = "yyyy-MM-dd",
        latestAuthToken,
        tokenRefreshCallback = null,
        tokenRefreshTimer = null,
        tokenExpiry,
        authenticationStore = null;

    /* Public functions - initialise and dispose */

    Iit_OpenApi_IO.initialise = function Iit$OpenApi$IO$initialise(options) {
        /// <summary>Initialises the IO component</summary>
        baseUrl = options.baseUrl;
        sessionUrl = options.sessionUrl;
        preserveOriginalData = options.preserveOriginalData;
        retryAttempts = options.retryAttempts;
        retryInterval = options.retryInterval;
        retryCodes = options.retryCodes;
        caching = options.caching,
        authenticationStore = options.authenticationStore;
        this.set_Token(options.authenticationToken, options.expiry, options.refreshCallback);
    };

    /* Public functions */
    Iit_OpenApi_IO.set_Token = function Iit$OpenApi$IO$set_Token(token, exp, callback) {
        /// <summary></summary>
        if (token) {
            latestAuthToken = token;
            tokenExpiry = (new Date()).getTime() + exp * 1000;
            if (authenticationStore) {
                authenticationStore.set("token", token);
                authenticationStore.set("expiry", tokenExpiry);
            }
        }
        else {
            latestAuthToken = authenticationStore.get("token");
            tokenExpiry = parseInt(authenticationStore.get("expiry"));
        }

        if (callback) {
            tokenRefreshCallback = callback;
        }

        if (tokenRefreshCallback) {
            if (tokenRefreshTimer) {
                clearTimeout(tokenRefreshTimer);
            }
            var time = tokenExpiry - (new Date()).getTime();
            tokenRefreshTimer = setTimeout(tokenRefreshCallback, time);
        }
    };

    Iit_OpenApi_IO.set_Language = function Iit$OpenApi$IO$set_Language(lang) {
        /// <summary>Change the language to request data in</summary>
        language = lang;
    };

    Iit_OpenApi_IO.sendRequest = function Iit$OpenApi$IO$sendRequest(url, method, data, headerParameters, methodParameters, dataType) {
        /// <summary>Uses jQuery to send a REST request</summary>
        method = method || METHOD_GET;

        var thisRetryAttempts = retryAttempts,
            thisRetryInterval = retryInterval,
            thisCaching = methodParameters && methodParameters.hasOwnProperty('caching') ? methodParameters.caching : caching,
            retryCount = 0,
            $deferred = $.Deferred();
        ///#DEBUG
        Iit.OpenApi.log("sending request '" + url + "' via " + method);
        ///#ENDDEBUG

        $.ajax({
            type: method,
            data: data,
            url: url,
            dataType: dataType,
            contentType: "application/json",
            cache: thisCaching,
            beforeSend: function (jqXHR) {
                var header;
                if (headerParameters) {
                    for (header in headerParameters) {
                        jqXHR.setRequestHeader(header, headerParameters[header]);
                        if (header === "Authorization") {
                            latestAuthToken = headerParameters[header];
                        }
                    }
                }
                if (language) {
                    jqXHR.setRequestHeader("Accept-Language", language);
                }

                //Workaround to be used inside format collection. Think of a better alternative
                if (!headerParameters.hasOwnProperty("Authorization") && latestAuthToken) {
                    jqXHR.setRequestHeader("Authorization", "BEARER " + latestAuthToken);
                }
            },
            success: function (responseData) {
                $deferred.resolve(responseData);
            },
            error: function (jqXHR, status, error) {
                retryCount++;
                if (retryCodes && retryCodes.indexOf(jqXHR.status) >= 0 && retryCount <= thisRetryAttempts) {
                    ///#DEBUG
                    Iit.OpenApi.log("Call to " + method + " '" + url + "' failed. Retrying to call again. Attempt " + retryCount + " out of " + thisRetryAttempts);
                    ///#ENDDEBUG
                    var self = this;
                    setTimeout(function () {
                        $.ajax(self);
                    }, thisRetryInterval);
                } else {
                    $deferred.reject(jqXHR, status, error);
                }
            }
        });

        return $deferred;
    };

    Iit_OpenApi_IO.registerProxy = function Iit$OpenApi$IO$registerProxy(proxy) {
        /// <summary>Adds a proxy that will be called for all service calls</summary>

        Iit_OpenApi_IO._serviceCallProxies.splice(0, 0, proxy);

        // could add registering of proxy's at a smaller level by adding arguments here, storing them at each level fo granularity
        // and concatenating them in doServiceCall
    };

    Iit_OpenApi_IO.doServiceCall = function Iit$OpenApi$IO$doServiceCall(request) {
        /// <summary>does a service call, preparing the arguments, running through proxies and processing the output</summary>
        /// <param name="request" type="Object">
        ///  An object containing the parameters for the request
        ///   serviceName - Required name of the service (e.g. port)
        ///   serviceObjectName - Required name of the object (e.g. account)
        ///   method - Required method, e.g. POST/PUT/GET/DELETE
        ///   params - Required. From the method information, an array of parameters e.g. ["accountid", "clientid"]
        ///   responseDescriptor - Optional. From the method information, an object describing type transformations required
        ///   requestArgs - Optional. arguments to make the request, e.g. {clientid: "12", $top: 2 }
        ///   requestData - optional data arguments to send to the client
        /// </param>

        return doServiceProxyCall(Iit_OpenApi_IO._serviceCallProxies, request);
    };

    Iit_OpenApi_IO.serviceCall = function Iit$OpenApi$IO$serviceCall(request) {
        /// <summary>does a service call, converting the arguments into a call and processing the output</summary>
        var i,
        arg,
        oargKey,
        urlArguments = "",
        method = request.method,
        params = request.params,
        urlParams = request.urlParams,
        headerParams = request.headerParams,
        methodParams = request.methodParams,
        headerParamsAccepted = {},
        methodParamsAccepted = {},
        requestArgs = request.requestArgs,
        url = "/" + request.serviceName + (request.version ? "/v" + request.version : "") + "/" + request.serviceObjectName,
        $deferred;

        // add the normal parameters in order
        if (params) {
            for (i = 0; i < params.length; i++) {
                if (requestArgs) {
                    arg = requestArgs[params[i]];
                    if (arg || arg === 0) {
                        if (typeof arg === "string") {
                            arg = arg.replace("/", "|");
                        }
                        else if (toString.call(arg) === "[object Date]") {
                            arg = Iit.OpenApi.Formatting.formatDateTime(arg, { dateTimeFormat: { pattern: urlArgDatePattern } });
                        }

                        url += "/";
                        url += encodeURIComponent(arg);
                    }
                }
            }
        }

        // O-Data arguments begin with $ - extract
        if (requestArgs) {
            for (oargKey in requestArgs) {
                if (requestArgs.hasOwnProperty(oargKey) && oargKey.indexOf('$') === 0) {
                    if (urlArguments) {
                        urlArguments += "&";
                    }

                    urlArguments += oargKey + "=" + requestArgs[oargKey];
                }
            }
        }
        //Url Parameters from Service descriptor
        if (urlParams && requestArgs) {
            $.each(urlParams, function (index, value) {
                if (requestArgs.hasOwnProperty(value)) {
                    if (requestArgs[value] instanceof Array) {
                        $.each(requestArgs[value], function (argIndex, argValue) {
                            urlArguments = appendUrlArg(urlArguments, value, argValue);
                        });
                    } else {
                        urlArguments = appendUrlArg(urlArguments, value, requestArgs[value]);
                    }
                }
            });
        }

        if (urlArguments) {
            urlArguments = "?" + urlArguments;
        }

        //Header Parameters from Service descriptor
        if (headerParams && requestArgs) {
            $.each(headerParams, function (index, value) {
                if (requestArgs.hasOwnProperty(value)) {
                    headerParamsAccepted[value] = requestArgs[value];
                }
            });
        }

        //Method Parameters from Service descriptor
        if (methodParams && requestArgs) {
            $.each(methodParams, function (index, value) {
                if (requestArgs.hasOwnProperty(value)) {
                    methodParamsAccepted[value] = requestArgs[value];
                }
            });
        }

        // do the actual call
        $deferred = Iit_OpenApi_IO.sendRequest(baseUrl + url + urlArguments, method, request.requestData, headerParamsAccepted, methodParamsAccepted, DATA_TYPE);

        // pipe into a single argument and do data processing
        $deferred = $deferred.pipe(
                        getCallSuccess(request),
                        callFailure);

        ///#DEBUG
        $deferred.done(function () {
            Iit.OpenApi.log("Call to " + method + " '" + url + "' succeeded");
        });
        $deferred.fail(function () {
            Iit.OpenApi.log("Call to " + method + " '" + url + "' failed", Iit.OpenApi.logErrors);
        });
        ///#ENDDEBUG

        return $deferred;
    };

    /* Private functions */
    function appendUrlArg(urlArguments, key, value) {
        var result = "";
        if (urlArguments) {
            result = urlArguments + "&";
        }

        result += key + "=" + value;
        return result;
    }

    function doServiceProxyCall(proxyList, request) {
        /// <summary>
        ///  call all the proxies in a chain, passing the request object which they can modify
        ///  and then returning the deferred through them all
        /// </summary>

        // no more proxies, so make the direct call
        if (proxyList.length === 0) {
            return Iit_OpenApi_IO.serviceCall(request);
        }

        // call the next proxy
        return proxyList[0]
            .call(null, function () {
                // when this calls the next one in the chain, call ourselves to do that request
                // and remove the first item in the list
                return doServiceProxyCall(proxyList.slice(1), request);
            }, request);
    }



    function getCallSuccess(request) {
        /// <summary>Gets the function to process the call success</summary>
        var responseDescriptor = request.responseDescriptor;
        if (responseDescriptor) {
            return function (data, status, jqHxr) {
                data = typeResponse(data, responseDescriptor);
                return callSuccess.call(this, data, status, jqHxr);
            };
        }
        return callSuccess;
    }

    function callSuccess(data) {
        /// <summary>On success, combines the arguments into a consistent format</summary>
        return { data: data, request: this };
    }

    function callFailure(jqXHR, status, error) {
        /// <summary>On failure, combines the arguments into a consistent format</summary>
        return { jqXHR: jqXHR, status: status, error: error, request: this };
    }
    function typeUpField(typeOfField, data) {
        switch (typeOfField) {
            case "Date":
            case "DateTime":
                return Iit.OpenApi.ISO8601.parseDateTime(data);
            case "TimeSpan":
                return new Iit.OpenApi.TimeSpan(data);
            case "Enum":
                return new Iit.OpenApi.Enum(data);
            default:
                return data;
        }
    }

    function typeResponse(data, responseSchema) {
        /// <summary>
        ///  Recursive function that converts data based on a response schema
        ///   e.g.
        ///   typeResponse([{foo: [{bar:"2001-12-11", fun: "data"}]}], {foo: {bar: "Date"}});
        ///   =>
        ///   [{ foo: [{bar:Date("2001-12-11"), fun: "data"}]}]
        /// </summary>

        var i, key;

        // ignore arrays in the response schema for now, so we can cope with getting a array or object equally
        if (responseSchema instanceof Array) {
            responseSchema = responseSchema[0];
        }

        // convert simple data types = date/datetime/timespan
        if (typeof data === "string") {
            return typeUpField(responseSchema, data);
        }

        // loop through arrays
        if (data instanceof Array) {
            for (i = 0; i < data.length; i++) {
                data[i] = typeResponse(data[i], responseSchema);
            }
        } else if (data && data.Results instanceof Array) {
            for (i = 0; i < data.Results.length; i++) {
                data.Results[i] = typeResponse(data.Results[i], responseSchema);
            }
        }
        else if (responseSchema instanceof Object) {
            // loop through objects
            for (key in responseSchema) {
                if (responseSchema.hasOwnProperty(key) && data.hasOwnProperty(key)) {
                    if (!preserveOriginalData || typeof responseSchema[key] !== 'string') {
                        data[key] = typeResponse(data[key], responseSchema[key]);
                    }
                    else {
                        data[key + responseSchema[key]] = typeResponse(data[key], responseSchema[key]);
                    }
                }
            }
        }

        return data;
    }

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.IO")));/*
* Services Descriptor
*
* The intention is that this file is written in such a way that it can be auto-generated in the future
* it should NOT contain code itself
*/


(function ($, Iit_OpenApi_ServiceDescriptors) {
    "use strict";

    Iit_OpenApi_ServiceDescriptors.root = {
        sessions: [
            { method: "POST", parameters: ["authenticationRequest"], headerParameters: ["Authorization"] },
            { method: "PUT", parameters: ["id"], headerParameters: ["Authorization"] }],
        isalive: [{ method: "GET", headerParameters: ["Authorization"] }]
    };

    Iit_OpenApi_ServiceDescriptors.port = {
        positions: [{
            method: "GET",
            parameters: ["clientId", "accountId"], urlParameters: ["netPositionId"], headerParameters: ["Authorization"],
            response: [{
                ExecutionTime: "DateTime",
                BuyOrSell: "Enum",
                LongOrShort: "Enum",
                FXOptionsData: { ExpiryCut: "Enum", ExpiryDate: "DateTime" },
                SpotDate: "Date",
                ValueDate: "Date",
                ToOpenClose: "Enum"
            }]
        }],
        "positions/public": [{
            method: "GET",
            parameters: ["clientKey", "accountKey"], urlParameters: ["netPositionId"], headerParameters: ["X-Auth", "Authorization"],
            response: [{
                ExecutionTime: "DateTime",
                BuyOrSell: "Enum",
                LongOrShort: "Enum",
                FXOptionsData: { ExpiryCut: "Enum", ExpiryDate: "DateTime" },
                SpotDate: "Date",
                ValueDate: "Date",
                ToOpenClose: "Enum"
            }]
        }],
        netpositions: [{
            method: "GET",
            parameters: ["clientId", "accountId"], headerParameters: ["Authorization"],
            response: [{
                ExecutionTime: "DateTime",
                BuyOrSell: "Enum",
                LongOrShort: "Enum",
                FXOptionsData: { ExpiryCut: "Enum", ExpiryDate: "DateTime" },
                SpotDate: "Date",
                ValueDate: "Date",
                ToOpenClose: "Enum"
            }],
        }],
        "netpositions/public": [{
            method: "GET",
            parameters: ["clientKey", "accountKey"], headerParameters: ["X-Auth", "Authorization"],
            response: [{
                ExecutionTime: "DateTime",
                BuyOrSell: "Enum",
                LongOrShort: "Enum",
                FXOptionsData: { ExpiryCut: "Enum", ExpiryDate: "DateTime" },
                SpotDate: "Date",
                ValueDate: "Date",
                ToOpenClose: "Enum"
            }]
        }],
        users: [{
            method: "GET",
            parameters: ["userId"], headerParameters: ["Authorization"]
        }],
        clients: [{
            method: "GET",
            parameters: ["clientId"], headerParameters: ["Authorization"]
        }],
        accounts: [{
            method: "GET",
            parameters: ["clientId"], methodParameters: ['caching'], headerParameters: ["Authorization"],
            response: { Sharing: ["Enum"] }
        }],
        "accounts/shared": [
                { method: "GET", parameters: ["clientId", "accountId"], headerParameters: ["Authorization"] },
                { method: "POST", parameters: ["clientId", "accountId"], headerParameters: ["Authorization"] },
                { method: "DELETE", parameters: ["clientId", "accountId", "applicationId"], headerParameters: ["Authorization"] }],
        orders: [{
            method: "GET",
            parameters: ["clientId", "accountId"], headerParameters: ["Authorization"],
            response: [{ BuyOrSell: "Enum", Duration: "Enum", OrderTime: "DateTime", OrderType: "Enum", RelatedOrder: { OpenOrderRelation: "Enum" }, Status: "Enum" }]
        }],
        "orders/public": [{
            method: "GET",
            parameters: ["clientKey", "accountKey"], headerParameters: ["X-Auth", "Authorization"],
            response: [{ BuyOrSell: "Enum", Duration: "Enum", OrderTime: "DateTime", OrderType: "Enum", RelatedOrder: { OpenOrderRelation: "Enum" }, Status: "Enum" }]
        }],
        order: [{
            method: "GET",
            parameters: ["clientId", "orderId"], headerParameters: ["Authorization"],
            response: [{ BuyOrSell: "Enum", Duration: "Enum", OrderTime: "DateTime", OrderType: "Enum", RelatedOrder: { OpenOrderRelation: "Enum" }, Status: "Enum" }]
        }],
        balance: [{ method: "GET", parameters: ["clientId", "accountId"], headerParameters: ["Authorization"] }],
        "balance/public": [{ method: "GET", parameters: ["clientKey", "accountKey"], headerParameters: ["X-Auth", "Authorization"] }]
    };

    Iit_OpenApi_ServiceDescriptors.trade = {
        copy: [{ method: "GET", parameters: ["smartLinkId"], headerParameters: ["Authorization"] }],
        prices: [{
            method: "GET",
            urlParameters: ["instrumentType", "uic", "amount", "accountId"], headerParameters: ["Authorization"],
            response: [{ LastUpdated: "DateTime", PriceTimestamp: "DateTime", InstrumentType: "Enum" }]
        }, {
            method: "POST",
            urlParameters: ["accountId"], headerParameters: ["Authorization"],
            response: [{ LastUpdated: "DateTime", PriceTimestamp: "DateTime", InstrumentType: "Enum" }]
        }]
    };

    Iit_OpenApi_ServiceDescriptors.hist = {
        positions: [{
            method: "GET",
            parameters: ["clientId", "accountId"], urlParameters: ["fromDate", "thruDate", "instrumentTypes", "correlationTypes", "symbol"], headerParameters: ["Authorization"],
            response: [{ ExecutionTimeOpen: "DateTime", ExecutionTimeClose: "DateTime", InstrumentType: "Enum", LongOrShort: "Enum" }]
        }],
        "positions/public": [{
            method: "GET",
            parameters: ["clientKey", "accountKey"], urlParameters: ["fromDate", "thruDate", "instrumentTypes", "correlationTypes", "symbol"], headerParameters: ["X-Auth", "Authorization"],
            response: [{ ExecutionTimeOpen: "DateTime", ExecutionTimeClose: "DateTime", InstrumentType: "Enum", LongOrShort: "Enum" }]
        }],
        perf: [{
            method: "GET",
            parameters: ["clientId", "accountId"], urlParameters: ["fromDate", "thruDate"], headerParameters: ["Authorization"]
        }],
        "perf/public": [{
            method: "GET",
            parameters: ["accountKey"], urlParameters: ["fromDate", "thruDate"], headerParameters: ["X-Auth", "Authorization"]
        }]
    };

    Iit_OpenApi_ServiceDescriptors.ref = {
        countries: [{ method: "GET", headerParameters: ["Authorization"] }],
        languages: [{ method: "GET", headerParameters: ["Authorization"] }],
        exchanges: [{ method: "GET", parameters: ["exchangeId"], headerParameters: ["Authorization"] }],
        "instruments/search": [{
            method: "POST",
            headerParameters: ["Authorization"],
            response: [{ LegalTypes: "Enum", InstrumentType: "Enum", PriceFormat: "Enum" }]
        }],
        "instruments/cs/search": [{
            method: "POST",
            headerParameters: ["Authorization"],
            response: [{ LegalTypes: "Enum", InstrumentType: "Enum", PriceFormat: "Enum" }]
        }]
    };

    Iit_OpenApi_ServiceDescriptors.chart = {
        chart: [{
            method: "GET",
            parameters: ["symbol"], headerParameters: ["Authorization"], urlParameters: ["mode", "symbol", "horizon", "time", "count", "version", "tz", "Seq"]
        }]
    };
    Iit_OpenApi_ServiceDescriptors.at = {
        tradeleaders: [{
            method: "GET",
            parameters: ["clientId"],
            headerParameters: ["Authorization"]
        }],
        "tradeleaders/portfolioItems": [{
            method: "GET",
            parameters: ["clientId", "tradeLeaderAccountId"],
            headerParameters: ["Authorization"]
        }],
        "tradeleaders/follow": [
            { method: "POST", parameters: ["clientId", "tradeLeaderAccountId"], headerParameters: ["Authorization"] },
            { method: "PUT", parameters: ["clientId", "tradeLeaderAccountId"], headerParameters: ["Authorization"] },
            { method: "DELETE", parameters: ["clientId", "tradeLeaderAccountId" ], headerParameters: ["Authorization"] }
        ]
    };
    Iit_OpenApi_ServiceDescriptors.vas = {
        "pricealerts/usersettings": [{
            method: "GET",
            headerParameters: ["Authorization"],
            version: "1"
        }]
    };

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.ServiceDescriptors")));/*
 * Service Builder
 *
 * Takes the content of ServicesDescriptor.js and generates an interface
 * This file should just generate the interface using utility methods
 * In the future we may remove this service builder and generate the javascript server-side
 * So this file should purely generate the services object
 */


(function ($, Iit_OpenApi_ServiceBuilder, Iit_OpenApi_Services) {
    "use strict";

    /* public methods - initialise and dispose */

    Iit_OpenApi_ServiceBuilder.initialise = function Iit$OpenApi$ServiceBuilder$_initialise() {
        /// <summary>Initialises the services so they are ready for use</summary>

        Iit_OpenApi_ServiceBuilder.eachService(initialiseFunction);
    };

    /* public methods */

    Iit_OpenApi_ServiceBuilder.eachService = function Iit$OpenApi$ServiceBuilder$eachService(func) {
        /// <summary>Loops round every function and calls the func parameter for each one</summary>

        var i,
            serviceName,
            serviceObjectAndFilter,
            serviceDescriptorObjects,
            serviceDescriptorObject,
            Iit_OpenApi_ServiceDescriptors = Iit.OpenApi.ServiceDescriptors;

        for (serviceName in Iit_OpenApi_ServiceDescriptors) {
            if (Iit_OpenApi_ServiceDescriptors.hasOwnProperty(serviceName)) {

                serviceDescriptorObjects = Iit_OpenApi_ServiceDescriptors[serviceName];

                for (serviceObjectAndFilter in serviceDescriptorObjects) {
                    if (serviceDescriptorObjects.hasOwnProperty(serviceObjectAndFilter)) {
                        serviceDescriptorObject = serviceDescriptorObjects[serviceObjectAndFilter];
                        for (i = 0; i < serviceDescriptorObject.length; i++) {
                            func(serviceDescriptorObject[i], serviceName, serviceObjectAndFilter);
                        }
                    }
                }
            }
        }
    };

    Iit_OpenApi_ServiceBuilder.getfunctionName = function Iit$OpenApi$ServiceBuilder$getfunctionName(method, serviceObjectAndFilter) {
        /// <summary>formats the function name, e.g. "GET", "accounts/shared" => getSharedAccounts</summary>
        /// <param name="method" type="String" />
        /// <param name="serviceObjectAndFilter" type="String" />

        var serviceObjectAndFilterSplit = serviceObjectAndFilter.split("/"),
            serviceObjectName = serviceObjectAndFilterSplit[0],
            serviceFilters = serviceObjectAndFilterSplit.slice(1),
            serviceFilterPart = "",
            i;

        for (i = 0; i < serviceFilters.length; i++) {
            serviceFilterPart += toTitleCase(serviceFilters[i]);
        }

        return method.toLowerCase() + serviceFilterPart + toTitleCase(serviceObjectName);
    };

    /* private methods */

    function initialiseFunction(functionDescriptor, serviceName, serviceObjectAndFilter) {
        /// <summary>Given a single function, initialises that function as a service call</summary>

        var service = Iit_OpenApi_Services[serviceName];
        if (!service) {
            service = {};
            Iit_OpenApi_Services[serviceName] = service;
        }

        service[Iit_OpenApi_ServiceBuilder.getfunctionName(functionDescriptor.method, serviceObjectAndFilter)] =
            function Iit$OpenApi$ServiceBuilder$serviceCall(args, data) {
                /// <summary>Perform a OpenAPI call</summary>
                /// <param name="args" type="Object">
                ///   An object containing the parameters, e.g. {accountid:"acc_1"}.
                ///   OData parameters must begin with $.
                /// </param>
                /// <param name="data" type="Object">
                ///  Data to PUT or POST. only valid for these method types.
                /// </param>

                return Iit.OpenApi.IO.doServiceCall(
                    {
                        serviceName: serviceName,
                        serviceObjectName: serviceObjectAndFilter,
                        method: functionDescriptor.method,
                        params: functionDescriptor.parameters,
                        version: functionDescriptor.version,
                        urlParams: functionDescriptor.urlParameters,
                        headerParams: functionDescriptor.headerParameters,
                        methodParams: functionDescriptor.methodParameters,
                        responseDescriptor: functionDescriptor.response,
                        requestArgs: args,
                        requestData:  (typeof data === 'string') ? data : toJSONString(data)
                    });
            };
    }

    // Move to common and make public if we think there is another need for this
    function toTitleCase(str) {
        /// <summary>Converts hello to Hello</summary>

        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Converts obj into JSON string
    function toJSONString(obj) {
        if (typeof JSON === 'undefined') {
            throw new Error('Serialization depends on JSON!');
        }

        return JSON.stringify(obj);
    }

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.ServiceBuilder"), Iit.OpenApi.createNamespace("Iit.OpenApi.Services")));/*
* OpenAPI
*
* The central place for applications to communicate with the client side library
*/


(function ($, Iit_OpenApi) {
    "use strict";

    var defaultOptions = {
        preserveOriginalData: false,
        retryAttempts: 0,
        retryInterval: 3000,
        caching: true,
        tokenKey: 'token'
    };

    /* public methods - initialise and dispose */
    Iit_OpenApi.initialise = function Iit$OpenApi$initialise(options) {
        /// <summary>Initialise the open api library</summary>

        options = $.extend(defaultOptions, options);

        ///#DEBUG
        if (!options.baseUrl) {
            throw new Error("You must specify 'baseUrl' on the options - this is the base url to use to contact open api");
        }
        ///#ENDDEBUG

        ///#DEBUG
        if (options.logLevel !== undefined) {
            Iit_OpenApi.setLogLevel(options.logLevel);
        }
        ///#ENDDEBUG

        Iit_OpenApi.IO.initialise(options);
        Iit_OpenApi.ServiceBuilder.initialise();
        Iit_OpenApi.InstrumentCache.initialise(options);

        if (options.priceFormat) {
            Iit_OpenApi.Formatting.initialisePriceFormatting(options.priceFormat);
        }
        if (options.dateTimeFormat) {
            Iit_OpenApi.Formatting.initialiseDateTimeFormatting(options.dateTimeFormat);
        }
    };
}(jQuery, Iit.OpenApi));/*
 * Price Formatting
 *
 * Functions that perform all price formatting
 */


(function ($, Iit_OpenApi_Formatting, Iit_OpenApi_Formatting_Base) {
    "use strict";

    /* private fields*/
    var noBreakSpace = "\u00a0",
        noBreakSpaceRegex = /\u00A0/g,
        specialFuturesSeparator = "'", //US T-Bond/T-Note future decimal separator (104'16.5)
        altSpecialFuturesSeparator = "\"",  //For the people using ' as thousand separator
        divisionChars = ['/', '\u2044', '\u2215'],
    // 1/4, 1/2, 3/4, 1/3, 2/3, 1/5, 2/5, 3/5, 4/5, 1/6, 5/6, 1/8, 3/8, 5/8, 7/8
        fractionChars = ['\u00BC', '\u00BD', '\u00BE', '\u2153', '\u2154', '\u2155', '\u2156', '\u2157', '\u2158', '\u2159', '\u215A', '\u215B', '\u215C', '\u215D', '\u215E'],
        returnTypeTemplate = "Template",
        returnTypeString = "String",
        returnTypeObject = "Object",
        defaultOptions = {
            numberFormat: {
                groupSizes: [3],
                groupSeparator: ',',
                decimalSeparator: '.',
                negativePattern: '-{0}'
            },
            returnType: returnTypeString,
            returnTemplate: "{Pre}{First}{Pips}<small>{DeciPips}</small>{Post}"
        };

    /* Public functions - initialise and dispose */

    Iit_OpenApi_Formatting.initialisePriceFormatting = function Iit$OpenApi$Formatting$initialisePriceFormatting(options) {
        defaultOptions = getOptions(options);
    };

    Iit_OpenApi_Formatting.getPriceFormattingOptions = function Iit$OpenApi$Formatting$getPriceFormattingOptions(options) {
        return getOptions(options);
    };

    /* Public Enumerations */

    /// Options for price formatting.
    Iit_OpenApi_Formatting.PriceFormatOptions = Iit.OpenApi.Enum.makeDefinition([
        //Use only specified (number of decimals/fraction size).
        "None",

        // Pad fractional formats with spaces, e.g. "7/128" -> "  7/128"
        // Only used with fractional formats (decimals &lt; 0).
        "AdjustFractions",

        // Include fractions that are zero, e.g. "42" -&gt; "42 0/8"
        // Only used with fractional formats (decimals &lt; 0).
        "IncludeZeroFractions",

        // Special US Bonds futures fractional format (1/32s without nominator).
        // 1/32 fractional (decimals: -5) or with 1/2 or 1/4 of 1/32 extra precison (decimals: -6, -7)
        // e.g. 102.9140625 == 102 29/32 + 1/128 -&gt; "102'29.25"
        // Only used with fractional formats (decimals &lt; 0).
        "SpecialFutures",

        "Percentage",

        //CONSIDER: Adding support for using normal spaces instead of no-break spaces
        //NormalSpaces

        // Use digits for deci/half-pips.
        "DeciPipsDigit",
        // Use a space as separator between pips and deci-pips
        "DeciPipsSpaceSeparator",
        // Use culture specific decimal separator as separator.
        // Only used with DeciPipsDigit.
        "DeciPipsDecimalSeparator",
        // Use '1/2' fraction character for half-pips
        "DeciPipsFraction",
        // Use a space instead of zero.
        // Only used with DeciPipsFraction.
        "DeciPipsSpaceForZero",
        // Indicates that no rounding should be done - that decimals should be treated as a max decimals
        "NoRounding"],

        // Use '1/2' or ' ' (no-break Space) for half-pips.
        {
            "DeciPipsFractionOrSpace": ["DeciPipsFraction", "DeciPipsSpaceForZero"],
            // Use digits for deci-pips with a (non-break) space as separator between pips and deci-pips.
            "DeciPipsDigitWithSpaceSeparator": ["DeciPipsSpaceSeparator", "DeciPipsDigit"],
            // Use digits for deci-pips with a decimal separator between pips and deci-pips.
            "DeciPipsDigitWithDecimalSeparator": ["DeciPipsDecimalSeparator", "DeciPipsDigit"]
        });

    /* Public functions */

    Iit_OpenApi_Formatting.formatNumber = function Iit$OpenApi$Formatting$formatNumber(num, decimals, options) {
        /// <summary>
        ///  Generic localizable number formatting routine.
        /// </summary>
        /// <param name="decimals" maybeNull="true">
        ///  Optional. The number of decimals to display after the decimal point. If undefined then the number is formatted with however many decimal
        ///  places it needs to display the number (upto 8)
        /// </param>
        /// <param name="options" maybeNull="true">
        ///  Optional. Price options.
        /// </param>

        options = getOptions(options);

        if (decimals === undefined || decimals === null) {
            decimals = getActualDecimals(num);
        }

        return formatNumber(num, decimals, options);
    };

    Iit_OpenApi_Formatting.formatNumberNoRounding = function Iit$OpenApi$Formatting$formatNumberNoRounding(num, minDecimals, maxDecimals, options) {
        /// <summary>
        ///  Generic localizable number formatting routine. Does not round the number, e.g. 1.12 formatted with 1 decimal place is "1.12"
        /// </summary>
        /// <param name="minDecimals">
        ///  The minimum number of decimals to display after the decimal point.
        /// </param>
        /// <param name="maxDecimals" maybeNull="true">
        ///  Optional. The maximum number of decimals to display after the decimal point.
        /// </param>
        /// <param name="options" maybeNull="true">
        ///  Optional. Price options.
        /// </param>

        if (!minDecimals) { minDecimals = 0; }
        if (!maxDecimals) { maxDecimals = 8; }

        return formatNumber(num,
            Math.min(maxDecimals, Math.max(minDecimals, getActualDecimals(num))),
            getOptions(options));
    };

    Iit_OpenApi_Formatting.getValidPriceCharacters = function Iit$OpenApi$Formatting$getValidPriceCharacters(includeScenarios, options) {
        /// <summary>
        ///  Returns characters valid for entering prices
        /// </summary>

        var characters;

        options = getOptions(options);

        if (!includeScenarios) {
            includeScenarios = {};
        }

        characters = options.numberFormat.groupSeparator;

        if (characters.charCodeAt(0) === 160) { // if non breaking space
            characters += " ";    // add normal space
        }

        if (!includeScenarios.integer) {
            characters += options.numberFormat.decimalSeparator;
        }

        if (includeScenarios.negative) {
            characters += options.numberFormat.negativePattern.replace("{0}", "");
        }

        if (includeScenarios.price) {
            characters += Iit_OpenApi_Formatting.getSpecialFuturesSeparator(options) + " /" + String.fromCharCode(160);
        }

        if (includeScenarios.numbers !== false) {
            characters += "0123456789";
        }

        return characters;
    };

    Iit_OpenApi_Formatting.getValidPriceRegex = function Iit$OpenApi$Formatting$getValidPriceRegex(includeScenarios, options) {
        var valid, regex = "", i;

        valid = Iit_OpenApi_Formatting.getValidPriceCharacters($.extend({}, includeScenarios || {}, { numbers: false }), options);

        for (i = 0; i < valid.length; i++) {
            regex += "\\x" + valid.charCodeAt(i).toString(16);
        }

        return new RegExp("^[\\d" + regex + "]+$");
    };

    Iit_OpenApi_Formatting_Base.formatPrice = function Iit$OpenApi$Formatting$Base$formatPrice(value, decimals, formatFlags, options) {
        /// <summary>
        ///   Formats a price value with the specified options
        /// </summary>
        /// <param name="value" type="Number">
        ///   The price value to format.
        /// </param>
        /// <param name="decimals" type="Number">
        ///   The (normal) number of decimals for the instrument.
        /// </param>
        /// <param name="formatFlags" mayBeNull="true" type="Object">
        ///   Optional. Indicates if the price also include half-pips (decimal pips), and which format should be used.
        ///   Defaults to PriceFormatOptions.None.
        /// </param>
        /// <param name="options" mayBeNull="true" type="Object">
        ///    Optional. The price options to default to.
        /// </param>
        /// <returns>
        ///    Returns the formatted price string or an object, depending on options.returnType
        /// </returns>

        options = getOptions(options);

        if (typeof formatFlags === "string") {
            formatFlags = new Iit.OpenApi.Enum(formatFlags);
        } else if (formatFlags === null || formatFlags === undefined) {
            formatFlags = new Iit.OpenApi.Enum("None");
        }

        decimals = Number(decimals); // make sure it is a number

          //parts = { Pre: "", Post: "", First: "", Pips: "", DeciPips: "" }
        var parts = formatPriceParts(value, decimals, formatFlags, options),
            returner, prop;

        switch (options.returnType) {
            case returnTypeTemplate:
                returner = options.returnTemplate;
                for (prop in parts) {
                    if (parts.hasOwnProperty(prop)) {
                        returner = returner.replace("{" + prop + "}", parts[prop]);
                    }
                }
                break;
            case returnTypeString:
                returner = parts.Pre + parts.First + parts.Pips + parts.DeciPips + parts.Post;
                break;
            case returnTypeObject:
                returner = parts;
                break;
            default:
                return "Unknown Return Type";
        }

        return returner;
    };

    Iit_OpenApi_Formatting.parseNumber = function Iit$OpenApi$Formatting$parseNumber(value, options) {

        options = getOptions(options);

        return parseNumber(value, options);
    };

    Iit_OpenApi_Formatting_Base.parsePrice = function Iit$OpenApi$Formatting$Base$parsePrice(str, decimals, formatFlags, options) {
        /// <summary>
        /// From IitClientStation/Parsing.cs TryParsePrice()
        /// Parses a text string to a price value
        /// </summary>
        /// <param name="decimals">The decimals to use. Also partly specifies the expected format (positive/negative).</param>
        /// <param name="formatFlags">The formatting options used.</param>
        /// <param name="options">The price formatting options</param>
        /// <returns>The passed value, 0 if not parsed.</returns>

        if (typeof formatFlags === "string") {
            formatFlags = new Iit.OpenApi.Enum(formatFlags);
        } else if (formatFlags === null || formatFlags === undefined) {
            formatFlags = new Iit.OpenApi.Enum("None");
        }
        options = getOptions(options);

        var s = $.trim(String(str));

        //TrimLeadingNumberGroupSeparator
        if (s.substr(0, 1) === options.numberFormat.groupSeparator) {
            if (s.length > options.numberFormat.groupSeparator.length) {
                s = s.substring(options.numberFormat.groupSeparator.length);
            }
        }

        if (!s) { //null, undefined, ""
            return 0;
        }

        var result, integerPart;

        try {
            if (decimals >= 0) {
                if (formatFlags.Percentage) {
                    s = s.replace(/\s*%\s*$/, "");
                }

                if (!formatFlags.DeciPipsSpaceSeparator &&
                    !formatFlags.DeciPipsDecimalSeparator &&
                    !formatFlags.DeciPipsFraction) {

                    result = parseNumber(s, options);

                    if (formatFlags.Percentage) {
                        result = result / 100;
                    }

                } else {
                    result = 0;
                }
            } else {
                // with fractions 1/2^(decimals)
                //var denominator = 1 << Math.min(8, Math.abs(decimals));

                if (formatFlags.SpecialFutures) {
                    // special futures

                    var separator = Iit_OpenApi_Formatting.getSpecialFuturesSeparator(options);

                    var pipIndex = s.indexOf(separator);
                    if (pipIndex !== -1) {
                        integerPart = $.trim(s.substring(0, pipIndex));
                        if (integerPart.length > 0) {
                            result = parseNumber(integerPart, options);
                        } else {
                            result = 0;
                        }

                        if (pipIndex + 1 < s.length) {
                            var pipPart = parseNumber($.trim(s.substring(pipIndex + 1)), options);
                            // todo: verify pipPart < nominator?
                            if (pipPart < 32.0) {
                                result = result += (pipPart / 32.0);
                            } else {
                                result = 0;
                            }
                        }
                    }
                    else {
                        result = parseNumber(s, options);
                    }
                }
                else {
                    var fracIndex = findFractionalPart(s);

                    if (fracIndex !== -1 && fracIndex < s.length) {
                        integerPart = $.trim(s.substring(0, fracIndex));
                        result = (integerPart.length > 0 ? parseNumber(integerPart, options) : 0.0);

                        var fractionalPart = $.trim(s.substring(fracIndex));
                        if (fractionalPart.length === 1 && isVulgarFraction(fractionalPart[0])) {
                            result += parseNumber(fractionalPart[0], options);
                        }
                        else {
                            var divIndex = indexofarray(fractionalPart, divisionChars);
                            if (divIndex !== -1 && divIndex < fractionalPart.length) {
                                var numeratorPart = $.trim(fractionalPart.substring(0, divIndex));
                                var denominatorPart = $.trim(fractionalPart.substring(divIndex + 1));

                                var numeratorParsed = parseFloat(numeratorPart);
                                var denominatorParsed = parseFloat(denominatorPart);
                                if (numeratorParsed < denominatorParsed) {
                                    var frac = numeratorParsed / denominatorParsed;
                                    if (result >= 0) {
                                        result += frac;
                                    } else {
                                        result -= frac;
                                    }
                                } else {
                                    result = 0;
                                }
                            } else {
                                result = 0;
                            }
                        }
                    } else {
                        result = parseInt(s, 10);
                    }
                }
            }
            return result;
        } catch (e) {
            return 0;
        }
    };

    Iit_OpenApi_Formatting.shortFormat = function Iit$OpenApi$Formatting$shortFormat(num, options) {
        /// <summary>
        /// Converts from a number to a string like 1k or 100m
        /// </summary>
        /// <returns type="String">
        /// Returns 0 when dates are equal. -1 when date1 less than date2. 1 when date1 greater than date2.
        /// </returns>

        var numberSize = String(num).length, // Unfortunately Logs are too inaccurate - Math.round(Math.log(num) / Math.LN10)
            boundary;

        options = getOptions(options);

        if (numberSize >= 5) { //bigger than 10,000
            boundary = Math.pow(10, numberSize) - (Math.pow(10, numberSize - 3) / 2); //e.g. 100,000 -> 9,9950 - closer to 100k than 99.9k
            if (num >= boundary) {
                numberSize++;
            }
        }

        if (numberSize >= 7) { // > 999500
            return formatNumber(num / 1000000, 2 - (numberSize - 7), options) + "m";
        }

        if (numberSize >= 5) { // > 9995 => 10.2k
            return formatNumber(num / 1000, 2 - (numberSize - 4), options) + "k";
        }

        return formatNumber(num, 0, options);
    };
    Iit_OpenApi_Formatting.getSpecialFuturesSeparator = function Iit$OpenApi$Formatting$getSpecialFuturesSeparator(options) {
        var separator = specialFuturesSeparator;
        if (options.numberFormat.groupSeparator === specialFuturesSeparator) {
            separator = altSpecialFuturesSeparator;
        }
        return separator;
    };

    /* Private functions */

    function getActualDecimals(number) {
        number = Math.abs(number);
        return (number - Math.floor(number)).toFixed(8).substring(2, 10).replace(/0+$/, "").length;
    }

    function getOptions(options) {
        if (!options) {
            return defaultOptions;
        }
        return $.extend(true, { numberFormat: {} }, defaultOptions, options);
    }

    function formatNumber(num, decimals, options) {
        if (isNaN(num) || num === null || num === "") {
            return "";
        }

        var factor = Math.pow(10, decimals);

        var number = Math.round(num * factor) / factor;

        var numStr = expandNumber(Math.abs(number),
                                    decimals,
                                    options.numberFormat.groupSizes,
                                    options.numberFormat.groupSeparator,
                                    options.numberFormat.decimalSeparator);
        if (number < 0) {
            numStr = formatNegativeNumber(numStr, options);
        }

        return numStr;
    }

    function formatPriceParts(value, decimals, formatFlags, options) {

        var parts = { Pre: "", Post: "", First: "", Pips: "", DeciPips: "" };

        if (isNaN(value)) {
            parts.First = "-";
            return parts;
        }

        var isNegative = value < 0,
            isNoRounding = formatFlags.NoRounding,
            actualDecimals;
        value = Math.abs(value);

        if (decimals >= 0) {

            ///#DEBUG
            if (formatFlags.Percentage && isNoRounding) {
                throw new Error("No rounding is not supported on percentage");
            }
            ///#ENDDEBUG

            if (isNoRounding) {
                actualDecimals = getActualDecimals(value);
                if (actualDecimals <= decimals) {
                    isNoRounding = false;
                }
            }

            if (formatFlags.Percentage) {
                parts.First = formatNumber(value * 100, decimals, options) + " %";
            }
            else if (isNoRounding || (!formatFlags.DeciPipsDigit && !formatFlags.DeciPipsFraction)) {
                getFirstAndPipsParts(formatNumber(value, isNoRounding ? actualDecimals : decimals, options), parts, options);
            }
            else {
                var extra = decimals + 1;
                var fullPrice = formatNumber(value, extra, options);

                //basePart may contain a decimal separator that may or may not need to be removed
                var basePart = fullPrice.substr(0, fullPrice.length - 1);
                var deciPipsPart = fullPrice.substr(fullPrice.length - 1, 1);

                if (formatFlags.DeciPipsDigit) {
                    if (!formatFlags.DeciPipsSpaceSeparator && !formatFlags.DeciPipsDecimalSeparator) {
                        if (Iit.OpenApi.endsWith(basePart, options.numberFormat.decimalSeparator)) {
                            basePart = basePart.substr(0, basePart.length - 1);
                            deciPipsPart = options.numberFormat.decimalSeparator + deciPipsPart;
                        }
                    }
                    else {
                        if (formatFlags.DeciPipsDecimalSeparator) {
                            if (Iit.OpenApi.endsWith(basePart, options.numberFormat.decimalSeparator)) {
                                basePart = basePart.substr(0, basePart.length - 1);
                                deciPipsPart = options.numberFormat.decimalSeparator + deciPipsPart;
                            }
                            else {
                                deciPipsPart = options.numberFormat.decimalSeparator + deciPipsPart;
                            }
                        }
                        else { //SpaceSeparator
                            if (Iit.OpenApi.endsWith(basePart, options.numberFormat.decimalSeparator)) {
                                basePart = basePart.substr(0, basePart.length - 1);
                                deciPipsPart = options.numberFormat.decimalSeparator + deciPipsPart;
                            }
                            else {
                                deciPipsPart = noBreakSpace + deciPipsPart;
                            }
                        }
                    }
                }
                else { //Fraction
                    var deciPipsIsFractionalPart = false;

                    if (Iit.OpenApi.endsWith(basePart, options.numberFormat.decimalSeparator)) {
                        basePart = basePart.substr(0, basePart.length - 1);
                        deciPipsIsFractionalPart = true;
                    }

                    if (deciPipsPart === "5") {
                        deciPipsPart = "\u00bd";
                        deciPipsIsFractionalPart = false;
                    }
                    else if (formatFlags.DeciPipsSpaceForZero && deciPipsPart === "0") {
                        deciPipsPart = noBreakSpace;
                        deciPipsIsFractionalPart = false;
                    }

                    if (formatFlags.DeciPipsSpaceSeparator) {
                        deciPipsPart = noBreakSpace + deciPipsPart;
                    } else if (deciPipsIsFractionalPart) {
                        deciPipsPart = options.numberFormat.decimalSeparator + deciPipsPart;
                    }
                }

                getFirstAndPipsParts(basePart, parts, options);
                parts.DeciPips = deciPipsPart;
            }
        }
        else { // format with fractions 1/2^(decimals)

            if (formatFlags.SpecialFutures) {
                if (decimals > -5) {
                    decimals = -5;
                } else if (decimals < -7) {
                    decimals = -7;
                }
            }
            var denominator = 1 << Math.min(8, Math.abs(decimals));

            var integerPart = Math.floor(value);
            var fractionalPart = value - integerPart;
            var numerator = fractionalPart * denominator;

            var numeratorDecimals = 0;
            if (isNoRounding) {
                numeratorDecimals = getActualDecimals(numerator);
            }

            var numeratorText = formatNumber(numerator, numeratorDecimals, options);
            var denominatorText = formatNumber(denominator, 0, options);
            var fractionalPartText = ""; //Not really pips - just fractional part string

            if (denominatorText === numeratorText) {
                numeratorText = "0";
                denominator = 0.0;
                integerPart += 1;
            }

            var first = formatNumber(integerPart, 0, options);

            if (formatFlags.SpecialFutures) { //Special futures format
                if (denominator !== 32) {
                    var fracnum = 0;
                    if (denominator !== 0) {
                        fracnum = (isNoRounding ? numerator : Math.round(numerator)) / (denominator / 32.0);
                    }
                    if (isNoRounding) {
                        numeratorDecimals = getActualDecimals(fracnum);
                    }
                    numeratorDecimals = Math.max(numeratorDecimals, decimals === -6 ? 1 : 2);
                    numeratorText = formatNumber(fracnum, numeratorDecimals, options);
                }
                var separator = Iit_OpenApi_Formatting.getSpecialFuturesSeparator(options);
                var padSize;
                if (decimals === -5) {
                    padSize = 2; //two 'integer' numerator digits
                } else {
                    padSize = isNoRounding ?
                                numeratorDecimals + 3 :     //two digits + seperator + all the decimal bits
                                Math.abs(decimals + 2);     //two digits + separator + 1-2 fractional (i.e. 4 or 5)

                }

                fractionalPartText = separator + rightAdjust(numeratorText, padSize, '0');

            }
            else if (numeratorText === "0" && !formatFlags.IncludeZeroFractions) {
                if (formatFlags.AdjustFractions) { //# spaces = Separator + #d spaces + fraction slash space + #n spaces
                    fractionalPartText = multiply(noBreakSpace, 1 + 2 * denominatorText.length + 1);
                }
            }
            else {
                if (formatFlags.AdjustFractions && numeratorText.length < denominatorText.length) {
                    numeratorText = rightAdjust(numeratorText, denominatorText.length, noBreakSpace);
                }

                //use NO-BREAK SPACE to separate fraction
                fractionalPartText = noBreakSpace + numeratorText + "/" + denominatorText;
            }

            parts.First = first;
            parts.Pips = fractionalPartText;
            parts.DeciPips = "";
        }

        if (isNegative) {
            var prePost = getNegativePrePost(options);

            parts.Post = prePost.post;
            parts.Pre = prePost.pre;
        }

        return parts;
    }

    function expandNumber(number, precision, groupSizes, sep, decimalChar) {
        /// <summary>
        ///  Internal function for expanding the number of decimals and introducing decimal groups.
        /// </summary>
        var curSize = groupSizes[0],
                curGroupIndex = 1,
                numberString = String(number),
                decimalIndex = numberString.indexOf('.'),
                right = "",
                i;

        if (decimalIndex > 0) {
            right = numberString.slice(decimalIndex + 1);
            numberString = numberString.slice(0, decimalIndex);
        }

        if (precision > 0) {
            var rightDifference = right.length - precision;
            if (rightDifference > 0) {
                right = right.slice(0, precision);
            } else if (rightDifference < 0) {
                var absRightDifference = Math.abs(rightDifference);
                for (i = absRightDifference - 1; i >= 0; i--) {
                    right += '0';
                }
            }

            right = decimalChar + right;
        } else {
            right = "";
        }

        var stringIndex = numberString.length - 1;
        var ret = "";
        while (stringIndex >= 0) {
            if (curSize === 0 || curSize > stringIndex) {
                if (ret.length > 0) {
                    return numberString.slice(0, stringIndex + 1) + sep + ret + right;
                }

                return numberString.slice(0, stringIndex + 1) + right;
            }

            if (ret.length > 0) {
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
            } else {
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
            }

            stringIndex -= curSize;

            if (curGroupIndex < groupSizes.length) {
                curSize = groupSizes[curGroupIndex];
                curGroupIndex++;
            }
        }
        return numberString.slice(0, stringIndex + 1) + sep + ret + right;
    }

    function formatNegativeNumber(str, options) {
        return options.numberFormat.negativePattern.replace("{0}", str);
    }

    function getNegativePrePost(options) {
        return {
            pre: options.numberFormat.negativePattern.substr(0, options.numberFormat.negativePattern.indexOf('{')),
            post: options.numberFormat.negativePattern.substr(options.numberFormat.negativePattern.indexOf('}') + 1)
        };
    }

    function indexofarray(needle, haystack) {
        var i, index;
        for (i = 0; i < haystack.length; i++) {
            index = needle.indexOf(haystack[i]);
            if (index > -1) {
                return index;
            }
        }
        return -1;
    }

   function getFirstAndPipsParts(price, parts, options) {
        var minSize = (price.indexOf(options.numberFormat.decimalSeparator) < 0 ? 2 : 3);
        if (price.length > minSize) {
            var pc = 2;
            parts.Pips = price.substr(price.length - pc, pc);
            if (parts.Pips.indexOf(options.numberFormat.decimalSeparator) >= 0) {
                pc = 3;
                parts.Pips = price.substr(price.length - pc, pc);
            }
            parts.First = price.substr(0, price.length - pc);
        }
        else {
            parts.First = price;
            parts.Pips = "";
        }
    }

    function multiply(s, count) {
        var res = "", i;
        for (i = 0; i < count; i++) {
            res = res + s;
        }
        return res;
    }

    function rightAdjust(value, size, padChar) {
        if (size <= value.length) {
            return value;
        }

        return multiply(padChar, size - value.length) + value;
    }

    //Finds the fractional part of a price formatted with negative decimals
    //e.g. 1 234 31 / 64
    //->   1234 31/64
    //So the last whitespace before the last digit(s) before the fractional char
    function findFractionalPart(value) {
        var index = -1;

        var divIndex = indexofarray(value, divisionChars);

        if (divIndex > 0) { //-1 not found, 0 means nothing before
            index = divIndex - 1;
            var foundDigit = false;
            while (index >= 0) {
                if (foundDigit && isNaN(parseInt(value.substring(index, index + 1), 10))) {
                    break;
                } else if (!isNaN(value.substring(index, index + 1))) {
                    foundDigit = true;
                }

                --index;
            }
            if (foundDigit && index < 0) {
                index = 0;
            }
        }
        else {
            index = indexofarray(value, fractionChars);
        }

        return index;
    }

    function isVulgarFraction(c) {
        var i;
        for (i = 0; i < fractionChars.length; ++i) {
            if (c === fractionChars[i]) {
                return true;
            }
        }

        return false;
    }

    function parseNumber(value, options) {
        value = $.trim(value);
        if (value.match(/^[+\-]?infinity$/i)) {
            return parseFloat(value);
        }
        if (value.match(/^0x[a-f0-9]+$/i)) {
            return parseInt(value, 10);
        }

        var signInfo = parseNumberNegativePattern(value, options, true);
        var sign = signInfo[0];
        var num = signInfo[1];
        if (sign === "") {
            sign = "+";
        }

        var exponent;
        var intAndFraction;
        var exponentPos = num.indexOf("e");
        if (exponentPos < 0) {
            exponentPos = num.indexOf("E");
        }
        if (exponentPos < 0) {
            intAndFraction = num;
            exponent = null;
        } else {
            intAndFraction = num.substr(0, exponentPos);
            exponent = num.substr(exponentPos + 1);
        }
        var integer;
        var fraction;
        var decimalPos = intAndFraction.indexOf(options.numberFormat.decimalSeparator);
        if (decimalPos < 0) {
            integer = intAndFraction;
            fraction = null;
        } else {
            integer = intAndFraction.substr(0, decimalPos);
            fraction = intAndFraction.substr(decimalPos + options.numberFormat.decimalSeparator.length);
        }
        integer = integer.split(options.numberFormat.groupSeparator).join("");
        var altNumGroupSeparator = options.numberFormat.groupSeparator.replace(noBreakSpaceRegex, " ");
        if (options.numberFormat.groupSeparator !== altNumGroupSeparator) {
            integer = integer.split(altNumGroupSeparator).join("");
        }
        var p = sign + integer;
        if (fraction !== null) {
            p += "." + fraction;
        }
        if (exponent !== null) {
            var expSignInfo = parseNumberNegativePattern(exponent, options);
            if (expSignInfo[0] === "") {
                expSignInfo[0] = "+";
            }
            p += "e" + expSignInfo[0] + expSignInfo[1];
        }
        if (p.match(/^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/)) {
            return parseFloat(p);
        }
        return NaN;
    }

    function parseNumberNegativePattern(value, options, tryFallback) {
        var prePost = getNegativePrePost(options);

        prePost.pre = prePost.pre.replace(noBreakSpaceRegex, " ");
        prePost.post = prePost.post.replace(noBreakSpaceRegex, " ");
        value = value.replace(noBreakSpaceRegex, " ");

        if (Iit.OpenApi.startsWith(value, prePost.pre) && Iit.OpenApi.endsWith(value, prePost.post)) {
            return ["-", value.substr(prePost.pre.length, value.length - (prePost.pre.length + prePost.post.length))];
        }

        if (tryFallback && Iit.OpenApi.startsWith(value, "-")) {
            return ["-", value.substr(1)];
        }

        return ["", value];
    }

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.Formatting"), Iit.OpenApi.createNamespace("Iit.OpenApi.Formatting.Base")));/*
 * Date Time Formatting
 *
 * Functions that perform all date formatting
 */


(function ($, Iit_OpenApi_Formatting) {
    "use strict";

    /* private fields*/

    var datePartRegEx = /\/|dd|d|MMM|MM|M|yyyy|tt|t|hh|h|HH|H|mm|m|ss|s/g,
        defaultOptions = {
            dateTimeFormat: {
                pattern: 'dd-MMM-yyyy',
                abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                am: "a.m.",
                pm: "p.m.",
                dateSeperator: "/"
            },
            isUTC: true
        },
        parseRegExps = {};

    /* Public functions - initialise and dispose */

    Iit_OpenApi_Formatting.initialiseDateTimeFormatting = function Iit$OpenApi$Formatting$initialiseDateTimeFormatting(options) {
        defaultOptions = getOptions(options);
    };

    /* Public functions */

    Iit_OpenApi_Formatting.formatDateTime = function Iit$OpenApi$Formatting$formatDateTime(date, options) {
        /// <summary>
        ///  Formats a date in the standard custom format using the localeFormat() from the Microsoft ASP.NET AJAX Extensions
        /// </summary>
        /// <param name="date" type="Date" />
        /// <param name="options" type="Object" />

        options = getOptions(options);

        if (date && date.getFullYear() > 1900) {
            return (options.isUTC ? UTCFormat : localeFormat)(date, options.dateTimeFormat);
        }

        return "";
    };

    Iit_OpenApi_Formatting.parseDateTime = function Iit$OpenApi$Formatting$parseDateTime(strDate, options) {
        /// <summary>
        ///  Parses a date
        /// </summary>
        /// <param name="strDate" type="String" />
        /// <param name="options" type="Object" />

        options = getOptions(options);

        var patterns = options.dateTimeFormat.patterns || [options.dateTimeFormat.pattern],
            date, i;
        for(i =0; !date && i < patterns.length; i++) {
            date = _parseExact(strDate, patterns[i], options.dateTimeFormat);
        }

        if (!date) {
            return date;
        }

        if (options.isUTC) {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        }

        return date;
    };

    /* Private functions */

    function getOptions(options) {
        if (!options) {
            return defaultOptions;
        }
        return $.extend(true, { dateTimeFormat: {} }, defaultOptions, options);
    }

    function localeFormat(date, dateTimeFormat) {
        /// <summary>
        ///  formats the date using the supplied date format
        /// </summary>
        /// <param name="date" type="Date" />
        /// <param name="dateTimeFormat" type="Object" />

        var pattern = dateTimeFormat.pattern,
            formattedDate = "",
            hours;

        datePartRegEx.lastIndex = 0;

        while (true) {
            var sectionStartIndex = datePartRegEx.lastIndex,
                nextSectionMatch = datePartRegEx.exec(pattern),
                textUntilSectionMatch = pattern.slice(sectionStartIndex, nextSectionMatch ? nextSectionMatch.index : pattern.length);

            if (textUntilSectionMatch) {
                formattedDate += textUntilSectionMatch;
            }

            if (!nextSectionMatch) {
                break;
            }

            switch (nextSectionMatch[0]) {
                case "dd":
                    formattedDate += Iit.OpenApi.padZero(date.getDate(), 2);
                    break;
                case "d":
                    formattedDate += date.getDate();
                    break;
                case "MMM":
                    formattedDate += dateTimeFormat.abbreviatedMonthNames[date.getMonth()];
                    break;
                case "MM":
                    formattedDate += Iit.OpenApi.padZero(date.getMonth() + 1, 2);
                    break;
                case "M":
                    formattedDate += date.getMonth() + 1;
                    break;
                case "yyyy":
                    formattedDate += date.getFullYear();
                    break;
                case "hh":
                    hours = date.getHours() % 12;
                    if (hours === 0) {
                        hours = 12;
                    }
                    formattedDate += Iit.OpenApi.padZero(hours, 2);
                    break;
                case "h":
                    hours = date.getHours() % 12;
                    if (hours === 0) {
                        hours = 12;
                    }
                    formattedDate += hours;
                    break;
                case "HH":
                    formattedDate += Iit.OpenApi.padZero(date.getHours(), 2);
                    break;
                case "H":
                    formattedDate += date.getHours();
                    break;
                case "mm":
                    formattedDate += Iit.OpenApi.padZero(date.getMinutes(), 2);
                    break;
                case "m":
                    formattedDate += date.getMinutes();
                    break;
                case "ss":
                    formattedDate += Iit.OpenApi.padZero(date.getSeconds(), 2);
                    break;
                case "s":
                    formattedDate += date.getSeconds();
                    break;
                case "tt":
                    formattedDate += date.getHours() < 12 ? dateTimeFormat.am : dateTimeFormat.pm;
                    break;
                case "t":
                    formattedDate += (date.getHours() < 12 ? dateTimeFormat.am : dateTimeFormat.pm).charAt(0);
                    break;
                case "/":
                    formattedDate += dateTimeFormat.dateSeperator;
                    break;
                default:
            }
        }
        return formattedDate;
    }

    function UTCFormat(date, dateTimeFormat) {
        /// <summary>
        ///  Formats the date, adjusted to UTC in the standard custom format
        /// </summary>
        /// <param name="date" type="Date" />
        /// <param name="dateTimeFormat" type="Object" />

        // set locale time as utc
        var utcDate = new Date(date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return localeFormat(utcDate, dateTimeFormat);
    }

    function _appendPreOrPostMatch(preMatch) {
        var quoteCount = 0,
            escaped = false,
            returnStr = "", i;
        for (i = 0; i < preMatch.length; i++) {
            var c = preMatch.charAt(i);
            switch (c) {
                case '\'':
                    if (escaped) {
                        returnStr += "'";
                    }
                    else {
                        quoteCount++;
                    }
                    escaped = false;
                    break;
                case '\\':
                    if (escaped) {
                        returnStr += "\\";
                    }
                    escaped = !escaped;
                    break;
                default:
                    returnStr += c;
                    escaped = false;
                    break;
            }
        }
        return { str: returnStr, quoteCount: quoteCount };
    }

    function _getParseRegExp(pattern, dateTimeFormat) {

        if (parseRegExps[pattern]) {
            return parseRegExps[pattern];
        }
        var expFormat = pattern.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
        var regexp = "^";
        var groups = [];
        var index = 0;
        var quoteCount = 0;
        var match;
        while ((match = datePartRegEx.exec(expFormat)) !== null) {
            var preMatch = expFormat.slice(index, match.index);
            index = datePartRegEx.lastIndex;
            var appendOrPostMatch = _appendPreOrPostMatch(preMatch);
            regexp += appendOrPostMatch.str;
            quoteCount += appendOrPostMatch.quoteCount;
            if ((quoteCount % 2) === 1) {
                regexp += match[0];
                continue;
            }
            switch (match[0]) {
                    case 'MMM':
                    regexp += "(\\D+)";
                    break;
                case 'tt':
                case 't':
                    regexp += "(\\D*)";
                    break;
                case 'yyyy':
                    regexp += "(\\d{4})";
                    break;
                case 'dd': case 'd':
                case 'MM': case 'M':
                case 'yy': case 'y':
                case 'HH': case 'H':
                case 'hh': case 'h':
                case 'mm': case 'm':
                case 'ss': case 's':
                    regexp += "(\\d\\d?)";
                    break;
                case '/':
                    regexp += "(\\" + dateTimeFormat.dateSeperator + ")";
                    break;
            }
            groups.push(match[0]);
        }
        regexp += _appendPreOrPostMatch(expFormat.slice(index)).str;
        regexp += "$";
        var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
        var parseRegExp = { 'regExp': regexpStr, 'groups': groups };
        parseRegExps[pattern] = parseRegExp;
        return parseRegExp;
    }

    function _parseExact(value, pattern, dateTimeFormat) {
        value = $.trim(value);
        var parseInfo = _getParseRegExp(pattern, dateTimeFormat),
            match = new RegExp(parseInfo.regExp).exec(value);
        if (match === null) {
            return null;
        }

        var groups = parseInfo.groups,
            year = null, month = null, date = null,
            hour = 0, min = 0, sec = 0, msec = 0,
            pmHour = false, i, j, upperToken;
        for (j = 0; j < groups.length; j++) {
            var matchGroup = match[j + 1];
            if (matchGroup) {
                switch (groups[j]) {
                    case 'dd': case 'd':
                        date = parseInt(matchGroup, 10);
                        if ((date < 1) || (date > 31)) {
                            return null;
                        }
                        break;
                    case 'MMM':
                        month = -1;
                        upperToken = matchGroup.toUpperCase();
                        for (i = 0; i < 12; i++) {
                            if (upperToken === dateTimeFormat.abbreviatedMonthNames[i].toUpperCase()) {
                                month = i;
                                break;
                            }
                        }
                        if (month === -1) {
                            return null;
                        }
                        break;
                    case 'M': case 'MM':
                        month = parseInt(matchGroup, 10) - 1;
                        if ((month < 0) || (month > 11)) {
                            return null;
                        }
                        break;
                    case 'yyyy':
                        year = parseInt(matchGroup, 10);
                        if ((year < 0) || (year > 9999)) {
                            return null;
                        }
                        break;
                    case 'h': case 'hh':
                        hour = parseInt(matchGroup, 10);
                        if (hour === 12) {
                            hour = 0;
                        }
                        if ((hour < 0) || (hour > 11)) {
                            return null;
                        }
                        break;
                    case 'H': case 'HH':
                        hour = parseInt(matchGroup, 10);
                        if ((hour < 0) || (hour > 23)) {
                            return null;
                        }
                        break;
                    case 'm': case 'mm':
                        min = parseInt(matchGroup, 10);
                        if ((min < 0) || (min > 59)) {
                            return null;
                        }
                        break;
                    case 's': case 'ss':
                        sec = parseInt(matchGroup, 10);
                        if ((sec < 0) || (sec > 59)) {
                            return null;
                        }
                        break;
                    case 'tt': case 't':
                        upperToken = matchGroup.toUpperCase();
                        pmHour = (upperToken === dateTimeFormat.pm.toUpperCase());
                        if (!pmHour && (upperToken !== dateTimeFormat.am.toUpperCase())) {
                            return null;
                        }
                        break;
                }
            }
        }
        var result = new Date();

        if (year === null) {
            year = result.getFullYear();
        }
        if (month === null) {
            month = 0;
        }
        if (date === null) {
            date = 1;
        }
        result.setFullYear(year, month, date);
        if (result.getDate() !== date) {
            return null;
        }

        if (pmHour && (hour < 12)) {
            hour += 12;
        }
        result.setHours(hour, min, sec, msec);
        return result;
    }
} (jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.Formatting")));/*
 * Instrument Cache
 *
 * A class representing a instrument cache to get instruments from open api
 */


(function ($, Iit_OpenApi_InstrumentCache) {
    "use strict";

    /* private fields */
    var cache = Iit.OpenApi.DefaultStore.getNew(),
        requestedInstruments = {};

    /* Public functions */

    ///#DEBUG
    Iit_OpenApi_InstrumentCache.clear = function Iit$OpenApi$InstrumentCache$clear() {
        cache.del();
        requestedInstruments = {};
    };
    ///#ENDDEBUG

    Iit_OpenApi_InstrumentCache.initialise = function Iit$OpenApi$InstrumentCache$initialise(options) {
        if (options.instrumentCacheStore) {
            ///#DEBUG
            var implementsCorrectMethods =
            typeof options.instrumentCacheStore.get === 'function' &&
            typeof options.instrumentCacheStore.set === 'function' &&
            typeof options.instrumentCacheStore.del === 'function';
            if (!implementsCorrectMethods) {
                throw new Error("The configured instrumentCacheStore does not implement the correct methods (get/set/del)");
            }
            ///#ENDDEBUG
            cache = options.instrumentCacheStore;
        }
    };

    Iit_OpenApi_InstrumentCache.request = function Iit$OpenApi$InstrumentCache$request(uics) {
        /// <signature>
        ///   <summary>
        ///      Gets a collection of instruments asyncronously
        ///   </summary>
        ///   <param name="uics" type="Array" />
        ///   <returns type="jQuery.Deferred"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///      Gets a single instrument asyncronously
        ///   </summary>
        ///   <param name="uics" type="String" />
        ///   <returns type="jQuery.Deferred"></returns>
        /// </signature>

        var singleResult, i, instrumentsToGet = [], instrumentsToGetByUIC = {}, callsToWaitOn = [], returner = {}, cacheItem, dependency, uic;
        if (!$.isArray(uics)) {
            uics = [String(uics)];
            singleResult = true;
        }
        for (i = 0; i < uics.length; i++) {

            uic = String(uics[i]);

            if (instrumentsToGetByUIC[uic]) {
                continue;
            }
            instrumentsToGetByUIC[uic] = true;

            cacheItem = cache.get(uic);
            if (cacheItem !== undefined) {
                returner[uic] = cacheItem;
                continue;
            }

            dependency = requestedInstruments[uic];
            if (dependency) {
                callsToWaitOn.push(dependency.done((function (uic) {
                    return function (instrObject) {
                        returner[uic] = instrObject[uic];
                    };
                }(uic))));
                continue;
            }

            instrumentsToGet.push(uic);
        }

        if (instrumentsToGet.length) {
            callsToWaitOn.push(
                requestInstrumentsFromService(instrumentsToGet)
                .done(function (instrObject) {
                    $.extend(returner, instrObject);
                }));
        }

        return $.when.apply($.when, callsToWaitOn)
            .pipe(function () {
                if (singleResult) {
                    return returner[uics[0]];
                }
                return returner;
            });
    };

    Iit_OpenApi_InstrumentCache.getForCollection = function Iit$OpenApi$InstrumentCache$getForCollection(collection, options) {
        var defaultOptions = { instrumentDataProperty: "InstrumentData", instrumentProperty: "Instrument" };

        options = options ? $.extend({}, defaultOptions, options) : defaultOptions;

        var propInstData = options.instrumentDataProperty,
            propInst = options.instrumentProperty,
            i, uics = [], item;

        for (i = 0; i < collection.length; i++) {
            item = collection[i];
            if (item[propInstData]) {
                uics.push(item[propInstData].Uic);
            }
        }
        return Iit_OpenApi_InstrumentCache.request(uics)
            .pipe(function (instrumentList) {
                var i, item;
                for (i = 0; i < collection.length; i++) {
                    item = collection[i];
                    if (item[propInstData]) {
                        item[propInst] = instrumentList[item[propInstData].Uic];
                    }
                }
                return collection;
            });
    };

    /* Private functions */
    function requestInstrumentsFromService(uics) {
        var i, $deferred = $.Deferred(), uicCommaSeperated = uics.join(',');

        Iit.OpenApi.Services.ref.postCsSearchInstruments(null, "{\"Uics\":[" + uicCommaSeperated + "]}")
            .pipe(function (response) {
                var j, instr, fetchedInstrumentList = response.data, processedList = {};
                for (j = 0; j < fetchedInstrumentList.length; j++) {
                    instr = fetchedInstrumentList[j];
                    delete requestedInstruments[instr.Uic];
                    cache.set(instr.Uic, instr);
                    processedList[instr.Uic] = instr;
                }
                $deferred.resolve(cleanUpFailures(uics, processedList));
            },
            function () {
                $deferred.resolve(cleanUpFailures(uics, {}));
            });

        for (i = 0; i < uics.length; i++) {
            requestedInstruments[uics[i]] = $deferred;
        }

        return $deferred;
    }

    function cleanUpFailures(uics, processedList) {
        var i, uic;
        for (i = 0; i < uics.length; i++) {
            uic = uics[i];
            if (requestedInstruments[uic]) {
                delete requestedInstruments[uic];
                cache.del(uic);
                processedList[uic] = null;
            }
        }
        return processedList;
    }

}(jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.InstrumentCache")));/*
 * Instrument Price Formatting
 *
 * Support functions to help using the price formatting functions and do bulk formatting
 */


(function ($, Iit_OpenApi_Formatting) {
    "use strict";

    /* private fields*/
    var priceType = 0,
        dateType = 1;

    /* public fields */

    Iit_OpenApi_Formatting.formatPrice = function Iit$OpenApi$Formatting$formatPrice(value, instrument, options, account) {
        /// <summary>
        ///   Formats a price value with the specified options
        /// </summary>
        /// <param name="value" type="Number">
        ///   The price value to format.
        /// </param>
        /// <param name="instrument" type="Number">
        ///   The open api instrument
        /// </param>
        /// <param name="account" mayBeNull="true" type="Object">
        ///   Optional. The account (used for calculating whether deci-pips should be shown for products that might need a deci-pip for commission)
        /// </param>
        /// <param name="options" mayBeNull="true" type="Object">
        ///    Optional. The price options to default to.
        /// </param>
        /// <returns>
        ///    Returns the formatted price string or an object, depending on options.returnType
        /// </returns>

        // instrument no longer exists
        if (!instrument) {
            return Iit_OpenApi_Formatting.formatNumber(value);
        }

        return Iit_OpenApi_Formatting.Base.formatPrice(value, instrument.Decimals, instrument.PriceFormat, options);
    };

    Iit_OpenApi_Formatting.parsePrice = function Iit$OpenApi$Formatting$parsePrice(str, instrument, options) {
        /// <summary>
        /// From IitClientStation/Parsing.cs TryParsePrice()
        /// Parses a text string to a price value
        /// </summary>
        /// <param name="instrument">The instrument object to use</param>
        /// <param name="options">The price formatting options</param>
        /// <returns>The passed value, 0 if not parsed.</returns>

        return Iit_OpenApi_Formatting.Base.parsePrice(str, instrument.Decimals, instrument.PriceFormatOptions, options);
    };

    Iit_OpenApi_Formatting.formatCollection = function Iit$OpenApi$Formatting$formatCollection(data, fieldInfo) {
        /// <summary>
        ///  formats a collection
        /// </summary>

        var instrumentProperty = fieldInfo.instrumentProperty || "Instrument";

        return Iit.OpenApi.InstrumentCache.getForCollection(data, {
            instrumentDataProperty: fieldInfo.instrumentDataProperty,
            instrumentProperty: instrumentProperty
        }).pipe(function () {
            var i, j, formatProperty, format, formatToProperty;
            for (i = 0; i < data.length; i++) {
                for (j = 0; j < fieldInfo.fields.length; j++) {
                    if (typeof fieldInfo.fields[j] === "string") {
                        format = priceType;
                        formatProperty = fieldInfo.fields[j];
                    } else {
                        if (fieldInfo.fields[j].priceFormat) {
                            format = priceType;
                            formatProperty = fieldInfo.fields[j].priceFormat;
                        } else {
                            format = dateType;
                            formatProperty = fieldInfo.fields[j].dateFormat;
                        }
                    }
                    formatToProperty = fieldInfo.fields[j].to || (formatProperty + "Formatted");
                    if (format === priceType) {
                        //TODO should also get the account to handle DMA
                        data[i][formatToProperty] = Iit_OpenApi_Formatting.formatPrice(data[i][formatProperty], data[i][instrumentProperty], fieldInfo.fields[j].options);
                    } else {
                        data[i][formatToProperty] = Iit_OpenApi_Formatting.formatDateTime(data[i][formatProperty], fieldInfo.fields[j].options);
                    }
                }
            }
            return data;
        });
    };


} (jQuery, Iit.OpenApi.createNamespace("Iit.OpenApi.Formatting")));

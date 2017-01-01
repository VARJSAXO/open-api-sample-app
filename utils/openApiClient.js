define(["jquery", "lodash", "../lib/OpenApiClientSide.debug", 'moment'], function($, _, OpenApi, moment) {

    /**
     * Creates and manages OpenApi session
     * @param {type} options, Initial settings
     *               { baseUrl /* OpenAPI uri address  }
     */
    return function OpenApiClient(options) {
        var self = this;

        var _instrumentCache = Iit.OpenApi.DefaultStore.getNew();
        var _session = { Authorization: null };
        var _sessionUrl = '/root/sessions';

        options = options || {};
        this.baseUrl = options.baseUrl || '/openapi';

        /**
         * Gets the current session.
         * @returns {object} Session object .{ Authorization: 'OAPI ' + token }
         */
        this.getSession = function getSession() {
            return _session;
        };

        /**
         * Initialise OpenApi session.
         * Creates a new session with OpenApi and assigns a new token
         */
        this.initialise = function initialise(instrumentUics) {
            return Iit.OpenApi.IO.sendRequest(self.baseUrl + _sessionUrl, 'POST', null, {}, null, 'json')
            .then(function(data) {
                _session.Authorization = 'OAPI ' + data.AuthenticationToken;
                Iit.OpenApi.initialise({
                    baseUrl: self.baseUrl,
                    sessionsUrl:  data.Uri,
                    expiry: (data.ExpiresMinutes - 1) * 60,
                    authenticationToken: data.AuthenticationToken,
                    authenticationStore: Iit.OpenApi.DefaultStore.getNew(),
                    instrumentCacheStore: _instrumentCache,
                    refreshCallback: function() {
                        sessionCallback(/[^\/]+$/.exec(data.Uri)[0], data.AuthenticationToken);
                    }
                });
                Iit.OpenApi.IO.registerProxy(requestProxy);
                return _session;
             })
             .then(function() {
                 return Iit.OpenApi.InstrumentCache.request(instrumentUics);
             });
        };

        var requestProxy = function requestProxy(serviceCall, request) {
            request.requestArgs = request.requestArgs || {};
            request.requestArgs.Authorization = _session.Authorization;
            return serviceCall(request);
        };

        /**
         * Gets OpenApi Formatter Adapter for the chart
         */
        this.getFormatters = function getDateTimeFormatter() {
            var timezone;

            var patternNameMap = {
                iso8601: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
                iso8601Date: 'YYYY-MM-DD',
                fullDateTimeZone: 'DD MMMM YYYY HH:mm:ss z',
                fullDateTime: 'DD MMMM YYYY HH:mm:ss',
                shortDateTime: 'DD/MM/YYYY HH:mm',
                longDate: 'DD MMMM YYYY',
                longTime: 'HH:mm:ss',
                longTimeZone: 'HH:mm:ss z',
                monthDay: 'DD MMMM',
                shortDate: 'DD/MM/YYYY',
                shortTime: 'HH:mm',
                yearMonth: 'MMMM YYYY',
                saxoDate: 'DD-MMM-YYYY',
                saxoDateTime: 'DD-MMM-YYYY HH:mm:ss',
                MMM: 'MMM'
            };

            return {
                datetime: {
                    format: function(date, patternName) {
                        var pattern = patternNameMap[patternName];
                        return moment(date).format(pattern);
                    }
                },
                price: {
                    format: function(price, instrumentModel) {
                        var instrIdentity = instrumentModel.identity();
                        var instrument = instrIdentity ? _instrumentCache.get(instrIdentity.uic) : null;
                        return Iit.OpenApi.Formatting.formatPrice(price, instrument);
                    },
                    formatPips: function(value, instrumentModel) {
                        var instrIdentity = instrumentModel.identity();
                        var instrument = instrIdentity ? _instrumentCache.get(instrIdentity.uic) : null;
                        var result = Iit.OpenApi.Formatting.formatPrice(value, instrument, { returnType: 'Object' });
                        return (result.Pre + result.First + result.Pips).replace(/^[-0.]+/g, '');
                    }
                },
                number: {
                    format: function(number, decimals) {
                        return Iit.OpenApi.Formatting.Base.formatPrice(number, decimals);
                    },
                    shortFormat: function(number, decimals) {
                        // API required to have shortFormat, even though it is the same as format (demo only).
                        return Iit.OpenApi.Formatting.Base.formatPrice(number, decimals);
                    }
                }
            };
        };

        /**
         * Session callback method executed before AuthToken expires
         * @param {type} sessionId, OpenApi session Id
         * @param {type} token, Authentication token
         */
        var sessionCallback = function sessionCallback(sessionId, token) {
            $.ajax({
                url: self.baseUrl + _sessionUrl + '/' + sessionId,
                dataType: 'text',
                type: 'PUT',
                headers: _session
            }).then(function(data, status, xhr) {
                var extendedToken = xhr.getResponseHeader("X-Auth-Token");
                Iit.OpenApi.IO.set_Token(
                    extendedToken,
                    (xhr.getResponseHeader("X-Auth-Token-Expiry-Minutes") - 1) * 60,
                    function() { sessionCallback(sessionId, extendedToken); }
                );
                _session.Authorization = 'OAPI ' + extendedToken;
            });
       };

    };
});

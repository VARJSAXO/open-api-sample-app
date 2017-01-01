define(["jquery", "lodash", "../lib/iit-openapi", "signalR", "../lib/OpenApiClientSide.debug", 'moment'], function($, _, sharedjs, signalR, OpenApi, moment) {

    'use strict';

    return function() {
        var openApi = {
            isInErrorState: false,
            
            /* Deprecated - should be removed at some point */
            promiseToDeferred: function(promise) {
                var deferred = $.Deferred();
                promise.then(
                    function(arg) {
                        deferred.resolve(arg);
                    },
                    function(arg) {
                        deferred.reject(arg);
                    });
                return deferred;
            },

            clearAuthStore: function() {
                sessionStorage.remove('token');
                sessionStorage.remove('expiry');
            }
        };
        
        var _instrumentCache = function() {
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

        openApi.setupPromise = new Promise(function(resolve, reject) {

            var isPromiseCompleted = false;
            function failure() {
                if (!isPromiseCompleted) {
                    isPromiseCompleted = true;
                    reject();
                }
            }
            function streamingSetup() {
                if (!isPromiseCompleted) {
                    isPromiseCompleted = true;
                    resolve();
                }
            }

            //Todo: try to move to webserver.js
            var Token_URL = "http://sandbox0032:50/api/token";
            var baseUrl = "http://blue.openapi.sys.dom/openapi";

            var transportAuth = new sharedjs.openapi.TransportAuth(baseUrl, {
                tokenRefreshMethod : "Get",
                language: 'en-US',
                tokenRefreshUrl: Token_URL,
                tokenRefreshCredentials: "omit"
            });

            var transportCore = transportAuth.transport;
            var instrumentCache = _instrumentCache();
            
                    /**
         * Gets OpenApi Formatter Adapter for the chart
         */
            openApi.getFormatters = function getDateTimeFormatter() {
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
                
                var priceFormattingOptions = Iit.OpenApi.Formatting.getPriceFormattingOptions();
                var numberFormattting = new sharedjs.PriceFormatting(priceFormattingOptions);
                var sharedjsPriceFormatting = new sharedjs.PriceFormatting(numberFormattting);
                
                return {
                    datetime: {
                        format: function(date, patternName) {
                            var pattern = patternNameMap[patternName];
                            return moment(date).format(pattern);
                        }
                    },
                    price: {
                        format: function(price, instrumentModel, formatPriceParts) {
                            var defaultPriceFormat = 5;
                            var instrIdentity = instrumentModel.identity();
                            var instrument = openApi.getInstrument(instrIdentity);

                            var formatPrice = function (price, priceFormat){
                                if (typeof priceFormat !== 'number') {
                                    instrumentModel.priceFormatterReady(true);
                                    sharedjsPriceFormatting.formatPriceMethod = formatPriceParts ? sharedjsPriceFormatting.formatPriceParts : sharedjsPriceFormatting.format;
                                    return sharedjsPriceFormatting.formatPriceMethod(price, priceFormat.Decimals, priceFormat.Format, priceFormat.NumeratorDecimals);
                                }
                                return formatPriceParts ? sharedjsPriceFormatting.formatPriceParts(price, priceFormat) : sharedjsPriceFormatting.format(price, priceFormat);
                            };
                            
                            instrument.done(function(result){
                                defaultPriceFormat = result.response.Format;
                            });
                            return formatPrice(price, defaultPriceFormat);
                        },
                        formatPips: function(price, instrumentModel) {
                            var instrIdentity = instrumentModel.identity();
                            var instrument = openApi.getInstrument(instrIdentity);
                            var defaultPips = 0;
                            var formattingPips = function (price, priceFormat){
                                if (typeof priceFormat !== 'number'){
                                    instrumentModel.priceFormatterReady(true);
                                    return Math.round(Math.abs(price) * Math.pow(10, priceFormat.Decimals));
                                }
                                return 0;
                            };
                            
                            instrument.done(function(result){
                                defaultPips = result.response.Format;
                            });
                            return formattingPips(price, defaultPips);
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
            
            openApi.getInstrument = function(instrIdentity) {
                var instrument = instrIdentity ? instrumentCache.get(instrIdentity.uic) : null;
                var key = instrIdentity.uic;
                var defer;
                if (!instrument) {
                    defer = openApi.promiseToDeferred(openApi.rest.get('ref', 'v1/instruments/details/{uic}/{assetType}', 
                                                { uic: instrIdentity.uic, assetType: instrIdentity.assetType }))
                    .then(function(result) {
                        return result;
                    },
                    function(result) {
                        return result;
                    });
                    instrumentCache.set(key, defer.promise());
                }
                return instrumentCache.get(key);
            };
            
            openApi.getService = function () {
                return {
                    getChart: function (args) {
                        return openApi.rest.get('chart', 'v1/charts', null,
                            { queryParams: _.pick(args, ['Time', 'Horizon', 'Uic', 'AssetType', 'Mode', 'FieldGroups', 'Count']) })
                            .then(function (result) {
                                return {
                                    data: result.response
                                };
                            })
                            .catch(function (result) {
                                var status = result && result.status;
                                return Promise.reject({
                                    jqXHR: {
                                        status: status
                                    }
                                });
                            });
                    }
                };
            };

            var streamingPromise = new Promise(function(resolve, reject) {
                function tokenReceived(token, expiry) {
                    transportAuth.off(transportAuth.EVENT_TOKEN_RECEIVED, tokenReceived);
                    resolve(new sharedjs.openapi.Streaming(queuedTransport, baseUrl, transportAuth.auth));
                }
                transportAuth.on(transportAuth.EVENT_TOKEN_RECEIVED, tokenReceived);
            });

            var transportBatch = new sharedjs.openapi.TransportBatch(transportAuth, baseUrl, transportAuth.auth);

            var chartAlive = transportCore.get('chart', 'isalive');


            var queuedTransport = new sharedjs.openapi.TransportQueue(transportBatch, transportAuth);

            queuedTransport.waitFor(chartAlive);


            var events = {
                EVENT_ERROR: 'error',
                ERROR_TYPE_DISCONNECTED: 'disconnected',
                ERROR_TYPE_ACCESS_TOKEN_FAILED: 'AccessTokenUpdateFailed'
            };

            sharedjs.microEmitter.mixinTo(events);

            openApi.rest = queuedTransport;
            openApi.events = events;

            Promise.all([streamingPromise, chartAlive]).then(function(promises) {
                    var streaming = promises[0];

                    // trigger disconnect event if streaming disconnects and cannot reconnect
                    var disconnects = 0;
                    streaming.on(streaming.EVENT_CONNECTION_STATE_CHANGED, function(newConnectionState) {
                        if (newConnectionState === streaming.CONNECTION_STATE_DISCONNECTED) {
                            sharedjs.log.warn('sharedjs openApi', 'Streaming disconnected, attempt', {disconnects: disconnects, retries: 5});

                            if (disconnects >= 5) {
                                openApi.isInErrorState = true;
                                events.trigger(events.EVENT_ERROR, events.ERROR_TYPE_DISCONNECTED);
                            }
                            disconnects++;
                        } else if (newConnectionState === streaming.CONNECTION_STATE_CONNECTED) {
                            disconnects = 0;
                        }
                    });

                    openApi.streaming = streaming;

                    streamingSetup();
                })
                .catch(failure);

            transportAuth.on(transportAuth.EVENT_TOKEN_REFRESH_FAILED, function() {
                openApi.isInErrorState = true;
                events.trigger(events.EVENT_ERROR, events.ERROR_TYPE_ACCESS_TOKEN_FAILED);
                failure();
            });

        });

        sharedjs.log.on(sharedjs.log.DEBUG, function(area, message, data) {
            console.log(area + ' ' + message, data);
        }, this);
        sharedjs.log.on(sharedjs.log.INFO, function(area, message, data) {
            console.log(area + ' ' + message, data);
        }, this);
        sharedjs.log.on(sharedjs.log.WARN, function(area, message, data) {
            console.log(area + ' ' + message, data);
        }, this);
        sharedjs.log.on(sharedjs.log.ERROR, function(area, message, data) {
            console.log(area + ' ' + message, data);
        }, this);

        return openApi;
    }
});

// This File lists API's from client lib and explains the request parameters.
// For further details please refer reference documentation at https://developer.saxobank.com/sim/openapi/help/refdoc/v1
import DataService from './DataService'

export default {
    // Fetch instruments from client lib based on AssetType. eg.
    // Eg: Query Params : { AssetType: 'FxSpot' }
    getInstruments: (instrumentData, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'ref',
            endPoint: 'v1/instruments',
            queryParams: instrumentData
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    // Fetch Info Prices for a particular instrument based on AssetType and Uic. eg.
    // Eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
    getInfoPrices: (instrumentData, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices',
            queryParams: {
                "AssetType": instrumentData.AssetType,
                "Uic": instrumentData.Uic,
                "FieldGroups": [
                    "DisplayAndFormat",
                    "InstrumentPriceDetails",
                    "MarketDepth",
                    "PriceInfo",
                    "PriceInfoDetails",
                    "Quote"
                ]
            }
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    // Fetch Info Prices for a set of instruments based on AssetType and Uics. eg.
    // Eg: Query Params : { AssetType: 'FxSpot', Uics: 21,2 }
    getInfoPricesList: (instrumentData, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices/list',
            queryParams: {
                "AssetType": instrumentData.AssetType,
                "Uics": instrumentData.Uics,
                "FieldGroups": [
                    "DisplayAndFormat",
                    "InstrumentPriceDetails",
                    "MarketDepth",
                    "PriceInfo",
                    "PriceInfoDetails",
                    "Quote"
                ]
            }
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    /* Subscribe to Info prices for a set of instruments based on AssetType and Uics. eg.
     Eg: Query Params : {
            Arguments: {
                AssetType: 'FxSpot',
                Uics: 21,2
            },
            RefreshRate: 5
        }
    */
    subscribeInfoPrices: (instrumentData, successCallback, errorCallback) => {
        var data = {
            serviceGroup: 'trade',
            endPoint: 'v1/infoPrices/subscriptions',
            queryParams: {
                  "Arguments": {
                    "AssetType": instrumentData.AssetType,
                    "Uics": instrumentData.Uics,
                    "FieldGroups": [
                        "DisplayAndFormat",
                        "InstrumentPriceDetails",
                        "MarketDepth",
                        "PriceInfo",
                        "PriceInfoDetails",
                        "Quote"
                    ]
                  },
                  "RefreshRate": 5
            }
        }
        DataService.subscribe(data, successCallback, errorCallback)
    },
    /* Subscribe to Prices for a single instrument based on AssetType and Uic. eg.
     Eg: Query Params : {
            Arguments: {
                AssetType: 'FxSpot',
                Uic: 21
            },
            RefreshRate: 5
        }
    */
    subscribePrices: (instrumentData, successCallback, errorCallback) => {
        var data = {
            serviceGroup: 'trade',
            endPoint: 'v1/Prices/subscriptions',
            queryParams: {
                  "Arguments": {
                    "AssetType": instrumentData.AssetType,
                    "Uic": instrumentData.uic,
                    "FieldGroups": [
                        "Commissions", 
                        "DisplayAndFormat", 
                        "Greeks", 
                        "InstrumentPriceDetails",
                        "MarginImpact",
                        "MarketDepth",
                        "PriceInfo",
                        "PriceInfoDetails",
                        "Quote"
                    ]
                  },
                  "RefreshRate": 5
            }
        }
        DataService.subscribe(data, successCallback, errorCallback)
    },
    // Delete subscription
    disposeSubscription: (successCallback, errorCallback) => {
        DataService.disposeSubscription(successCallback, errorCallback)
    },
    // Fetch Account details.
    getAccountInfo: (successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'port',
            endPoint: 'v1/accounts/me',
            queryParams: null
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    // Place order
    placeOrder: (order, successCallback, errorCallback) => {
        var data = {
            method: 'post',
            serviceGroup: 'trade',
            endPoint: 'v1/orders',
            queryParams: null,
            body: order
        };
        //Describes how to call OpenApi using open source Iit library.
        DataService.getData(data, successCallback, errorCallback);
    },
    // Create Order Subscription.
    createOrderSubscription: (subscriptionArgs, successCallback, errorCallback) => {
        var data = {
            serviceGroup: 'port',
            endPoint: 'v1/orders/subscriptions',
            queryParams: subscriptionArgs
        };
        DataService.subscribe(data, successCallback, errorCallback);
    },

    // Create Positions Subscription.
    createPositionsSubscription: (subscriptionArgs, successCallback, errorCallback) => {
        var data = {
            serviceGroup: 'port',
            endPoint: 'v1/positions/subscriptions',
            queryParams: subscriptionArgs
        };
        DataService.subscribe(data, successCallback, errorCallback);
    }
}

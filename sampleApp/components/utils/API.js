// This File lists API's from client lib and explains the request parameters.
// For further details please refer erfernce documentation at https://developer.saxobank.com/sim/openapi/help/refdoc/v1
import DataService from './DataService'

export default {
    // Fetch instruments from client lib based on AssetType. eg.
    // Eg: Query Params : { AssetType: 'FxSpot' }
    getInstruments: (queryParams, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'ref',
            endPoint: 'v1/instruments',
            queryParams: queryParams
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    // Fetch Info Prices for a particular instrument based on AssetType and Uic. eg.
    // Eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
    getInfoPrices:  (queryParams, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices',
            queryParams: queryParams
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    // Fetch Info Prices for a set of instruments based on AssetType and Uics. eg.
    // Eg: Query Params : { AssetType: 'FxSpot', Uic: 21,2 }
    getInfoPricesList:  (queryParams, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices/list',
            queryParams: queryParams
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
    subscribeInfoPrices:  (instrumentData, successCallback, errorCallback) => {
        var data = {
            method: 'post',
            serviceGroup: 'trade',
            endPoint: 'v1/infoPrices/subscriptions',
            queryParams: {
                  "Arguments": {
                    "AssetType": instrumentData.AssetType,
                    "Uics": instrumentData.Uics,
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
    subscribePrices:  (instrumentData, successCallback, errorCallback) => {
        var data = {
            method: 'post',
            serviceGroup: 'trade',
            endPoint: 'v1/Prices/subscriptions',
            queryParams: {
                  "Arguments": {
                    "AssetType": instrumentData.AssetType,
                    "Uic": instrumentData.uic,
                  },
                  "RefreshRate": 5
            }
        }
        DataService.subscribe(data, successCallback, errorCallback)
    }
}

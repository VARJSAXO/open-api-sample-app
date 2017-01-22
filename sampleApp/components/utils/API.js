import DataService from './DataService'

export default {   
    getInstruments: (queryParams, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'ref',
            endPoint: 'v1/instruments',
            queryParams: queryParams
        };
        DataService.getData(data, successCallback, errorCallback);
    },
    getInfoPrices:  (queryParams, successCallback, errorCallback) => {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices',
            queryParams: queryParams
        };
        DataService.getData(data, successCallback, errorCallback);
    },
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
                  "RefreshRate": 5,
                  "ReferenceId": "f8fad5b-d9cb-469f-a165-70867728950e",
                  "ContextId": "29931122",
            }
        }
        DataService.subscribe(data, successCallback, errorCallback)
    }
}

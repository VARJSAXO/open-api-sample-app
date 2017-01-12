import DataService from './DataService'

const APIStore = {
    getInstruments (queryParams, successCallback, errorCallback) {
        var data = {
            method: 'get',
            serviceGroup: 'ref',
            endPoint: 'v1/instruments',
            queryParams: queryParams
        };
        DataService.createTransport()
        DataService.getData(data, successCallback, errorCallback);
    },
    getInfoPrices (queryParams, successCallback, errorCallback) {
        var data = {
            method: 'get',
            serviceGroup: 'trade',
            endPoint: 'v1/infoprices',
            queryParams: queryParams
        };
        DataService.createTransport()
        DataService.getData(data, successCallback, errorCallback);
    },
    subscribeInfoPrices (instrumentData, successCallback) {
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
        DataService.createTransport()
        DataService.createStreamingObject();
        DataService.subscribe(data, successCallback, ((data)=>console.log(data)))
    },
    subscribePrices (instrumentData, successCallback) {
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
        DataService.createTransport()
        DataService.createStreamingObject();
        DataService.subscribe(data, successCallback, ((data)=>console.log(data)))
    }
}

export default APIStore;

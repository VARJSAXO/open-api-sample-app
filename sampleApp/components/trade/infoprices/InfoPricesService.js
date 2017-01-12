import DataService from '../../DataService'

export default () => {
	return {
		getInfoPrices : (queryParams, successCallback, errorCallback) => {
	        var data = {
	            method: 'get',
	            serviceGroup: 'trade',
	            endPoint: 'v1/infoprices',
	            queryParams: queryParams
	        };
	        DataService.getData(data, successCallback, errorCallback);
	    },
	    subscribeInfoPrices : (instrumentData, successCallback, errorCallback) => {
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
	    }
	}
}

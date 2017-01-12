import DataService from '../../DataService'

export default () => {
	return {
		getInstruments : (queryParams, successCallback, errorCallback) => {
	        var data = {
	            method: 'get',
	            serviceGroup: 'ref',
	            endPoint: 'v1/instruments',
	            queryParams: queryParams
	        };
	        DataService.getData(data, successCallback, errorCallback);
	    }
	}
}
import $ from '../libs/jquery-3.1.1.js'
import signalR from '../libs/jquery.signalR-2.2.1.js'
import sharedjs from '../libs/iit-openapi'

const DataService = {

    transport: {},
    subscription: {},

    createTransport (authToken) {
        var baseUrl = "https://gateway.saxobank.com/sim/openapi";
        this.transport = new sharedjs.openapi.TransportAuth(baseUrl, {token: authToken});
    },

    getData (params, successCallback, errorCallback) {
        this.transport[params.method](params.serviceGroup, params.endPoint, null, {
            queryParams: params.queryParams
        })
        .then((result) => successCallback(result.response))
        .catch((result) => errorCallback(result));
    },

    createStreamingObject (authToken) {
        var baseUrl = "https://streaming.saxotrader.com/sim/openapi";
        this.subscription = new sharedjs.openapi.Streaming(this.transport, baseUrl, { getToken: () => authToken });
    },

    subscribe (params, successCallback, errorCallback) {
        var subscription = this.subscription.createSubscription(params.serviceGroup, params.endPoint, params.queryParams , successCallback, errorCallback)
        this.subscription.subscribe(subscription);
    }
};

export default DataService;

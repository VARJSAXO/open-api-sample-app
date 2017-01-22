import $ from '../../libs/jquery-3.1.1.js'
import signalR from '../../libs/jquery.signalR-2.2.1.js'
import sharedjs from '../../libs/iit-openapi'

const transportUrl = "https://gateway.saxobank.com/sim/openapi";
const streamingUrl = "https://streaming.saxotrader.com/sim/openapi";

export default {
    transport: {},
    streaming: {},
    subscription: {},

    createTransport (authToken) {
        this.transport = new sharedjs.openapi.TransportAuth(transportUrl, {token: authToken});
    },

    getData (params, successCallback, errorCallback) {
        this.transport[params.method](params.serviceGroup, params.endPoint, null, {
            queryParams: params.queryParams
        })
        .then((result) => successCallback(result.response))
        .catch(errorCallback);
    },

    createStreamingObject (authToken) {
        this.streaming = new sharedjs.openapi.Streaming(this.transport, streamingUrl, { getToken: () => authToken });
    },

    subscribe (params, successCallback, errorCallback) {
        this.subscription = this.streaming.createSubscription(params.serviceGroup, params.endPoint, params.queryParams , successCallback, errorCallback)
        this.streaming.subscribe(this.subscription);
    }
};

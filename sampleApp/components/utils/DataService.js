import $ from '../../libs/jquery-3.1.1.js'
import signalR from '../../libs/jquery.signalR-2.2.1.js'
import sharedjs from '../../libs/iit-openapi'
import { forEach } from 'lodash';

const transportUrl = "https://gateway.saxobank.com/sim/openapi";
const streamingUrl = "https://streaming.saxotrader.com/sim/openapi";

export default {
    transport: {},
    streaming: {},
    subscriptions: [],

    createTransport (authToken) {
        this.transport = new sharedjs.openapi.TransportAuth(transportUrl, {token: authToken});
    },

    getData (params, successCallback, errorCallback) {
        this.transport[params.method](params.serviceGroup, params.endPoint, null, {
            queryParams: params.queryParams,
            body: params.body
        })
        .then((result) => successCallback(result.response))
        .catch(errorCallback);
    },

    createStreamingObject (authToken) {
        this.streaming = new sharedjs.openapi.Streaming(this.transport, streamingUrl, { getToken: () => authToken });
    },

    subscribe (params, successCallback, errorCallback) {
        this.subscriptions.push(this.streaming.createSubscription(params.serviceGroup, params.endPoint, params.queryParams , successCallback, errorCallback));
    },

    disposeSubscription () {
        forEach(this.subscriptions, (subscription) => this.streaming.disposeSubscription(subscription));
    }

};

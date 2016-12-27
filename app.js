define([
	'knockout', 
	'jquery', 
	'models/AuthModel', 
	'utils/bindings'
], function(ko, $, AuthModel, Bindings) {
	var self = this;

	var getAuthToken = function() {
		return localStorage.getItem('authToken');
	}

	var initialize = function() {
		if(!getAuthToken()) {
			ko.applyBindings(new AuthModel(), $('#authContainer').get(0));
		}
	}

	return {
		initialize: initialize
	}
});

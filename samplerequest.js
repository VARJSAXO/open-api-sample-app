$.ajax({
    method: "GET",
    url: "https://blue.openapi.sys.dom/openapi/trade/v1/infoprices?Uic=21&AssetType=FxSpot",
    headers: {
        authorization: 'Bearer '+ authToken,
        accept: 'application/json',
        'content-type': 'application/json'
    },
    xhrFields: {
        withCredentials: true
    }
}).then(function(data) {
    console.log('success');
    console.log(data);
});

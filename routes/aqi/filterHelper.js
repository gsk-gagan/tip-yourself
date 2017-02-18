function getQueryParams(query) {
    var result = {};

    var lat, lng;
    if(query.hasOwnProperty('lat')) {
        lat = parseFloat(query.lat);
    }
    if(query.hasOwnProperty('lng')) {
        lng = parseFloat(query.lng);
    }
    if(lat !== undefined && lng !== undefined) {
        result.lat = lat;
        result.lng = lng;
    }

    if(query.hasOwnProperty('limit')) {
        result.limit = parseInt(query.limit);
    }

    if(query.hasOwnProperty('csv')) {
        result.csv = (query.csv === 'true');
    }

    if(query.hasOwnProperty('download')) {
        result.download = (query.download === 'true');
    }

    return result;
}

function filterResult(allRecords, filter) {
    var tempResult;
    var result = [];
    //filter all based on lat lng and order appropriately
    if(filter.hasOwnProperty('lat')) {
        tempResult = allRecords.sort(function(a, b) {
            var disa = ((a.lat - filter.lat)*(a.lat - filter.lat)) + ((a.lng - filter.lng)*(a.lng - filter.lng));
            var disb = ((b.lat - filter.lat)*(b.lat - filter.lat)) + ((b.lng - filter.lng)*(b.lng - filter.lng));
            return disa-disb;
        });
    } else {
        tempResult = allRecords;
    }
    //limit the number of results
    if(filter.hasOwnProperty('limit')) {
        for(var i=0; i<allRecords.length && i<filter.limit; i++) {
            result.push(tempResult[i]);
        }
    } else {
        result = tempResult;
    }

    return result;
}

module.exports = {
    getQueryParams : getQueryParams,
    filterResult: filterResult
};

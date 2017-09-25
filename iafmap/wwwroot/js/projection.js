

function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

_basejs.Projection = {};

_basejs.Projection.TILE_SIZE = 256;

_basejs.Projection.degreesToRadians = function (deg) {
    return deg * (Math.PI / 180);
}

_basejs.Projection.radiansToDegrees = function (rad) {
    return rad / (Math.PI / 180);
}

/**
*
* Classe base para implementação de novas projeções
*
*/
_basejs.Projection.Base = _basejs.Object.create({

    pixelOrigin: new google.maps.Point(_basejs.Projection.TILE_SIZE / 2, _basejs.Projection.TILE_SIZE / 2),

    pixelsPerLonDegree: _basejs.Projection.TILE_SIZE / 360,

    pixelsPerLonRadian: _basejs.Projection.TILE_SIZE / (2 * Math.PI),

    //virtual

    initialize: function () { },

    fromLatLngToPoint: function () { },

    fromPointToLatLng: function () { },

    setMap: function () { }

});

/**
*
* Projeção Euclideana
*
*/
_basejs.Projection.Euclidean = _basejs.Object.create(_basejs.Projection.Base, {

    fromLatLngToPoint: function (latLng, opt_point) {
        var point = opt_point || new google.maps.Point(0, 0);
        point.x = this.pixelOrigin.x + latLng.lng() * this.pixelsPerLonDegree;
        point.y = this.pixelOrigin.y + (-1 * latLng.lat()) * this.pixelsPerLonDegree;

        return point;
    },

    fromPointToLatLng: function (point) {
        var lng = (point.x - this.pixelOrigin.x) / this.pixelsPerLonDegree,
			lat = -1 * (point.y - this.pixelOrigin.y) / this.pixelsPerLonDegree;

        return new google.maps.LatLng(lat, lng, true);
    }

});

/**
*
* Projeção Mercator
*
*/
_basejs.Projection.Mercator = _basejs.Object.create(_basejs.Projection.Base, {

    fromLatLngToPoint: function (latLng, opt_point) {

        var origin = this.pixelOrigin;

        var point = opt_point || new google.maps.Point(0, 0);
        point.x = origin.x + latLng.lng() * this.pixelsPerLonDegree;

        var siny = bound(Math.sin(_basejs.Projection.degreesToRadians(latLng.lat())), -0.9999, 0.9999);
        point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -this.pixelsPerLonRadian;

        return point;
    },

    fromPointToLatLng: function (point) {

        var origin = this.pixelOrigin;
        var lng = (point.x - origin.x) / this.pixelsPerLonDegree;
        var latRadians = (point.y - origin.y) / -this.pixelsPerLonRadian;
        var lat = _basejs.Projection.radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);

        return new google.maps.LatLng(lat, lng);
    }

});


/**
*
* Projeção Modificada
*
*/
_basejs.Projection.Custom = _basejs.Object.create(_basejs.Projection.Base, {

    pixelOrigin: [],

    pixelsPerLonDegree: [],

    pixelsPerLonRadian: [],

    tileBounds: [],

    imageDimension: 65536,

    isWrapped: true,

    maxZoom: 6,

    _map: null,

    initialize: function () {

        var b = _basejs.Projection.TILE_SIZE;
        var c = 1;

        for (var d = 0; d < this.maxZoom; d++) {
            var e = b / 2;

            this.pixelsPerLonDegree.push(b / 360);
            this.pixelOrigin.push(new google.maps.Point(e, e));
            this.tileBounds.push(c);

            b *= 2;
            c *= 2;
        }
    },

    fromLatLngToPoint: function (latlng) {
        var z = this._map.getZoom();
        var c = Math.round(this.pixelOrigin[z].x + latlng.lng() * this.pixelsPerLonDegree[z]);
        var d = Math.round(this.pixelOrigin[z].y + (-2 * latlng.lat()) * this.pixelsPerLonDegree[z]);
        return new google.maps.Point(c, d);
    },

    fromPixelToLatLng: function (pixel, unbounded) {
        var z = this._map.getZoom();
        var d = (pixel.x - this.pixelOrigin[z].x) / this.pixelsPerLonDegree[z];
        var e = -0.5 * (pixel.y - this.pixelOrigin[z].y) / this.pixelsPerLonDegree[z];
        return new google.maps.LatLng(e, d, unbounded);
    },

    setMap: function (map) {
        this._map = map;
    }

});



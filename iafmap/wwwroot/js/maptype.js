
/**
*
* Classe para o maptype customizado
*
*/
_basejs.MapType = _basejs.Object.create({

    name: "IAF",

    alt: "IAF Map Type",

    tileSize: new google.maps.Size(256, 256),

    maxZoom: 4,

    minZoom: 3,

    //projection: new _basejs.Projection.Mercator(),

    initialize: function () { },

    getTile: function (coord, zoom, ownerDocument) {

        var tile = ownerDocument.createElement('img'),
            f = '',
		    c = 1 << zoom,
		    x = coord.x,
		    y = coord.y;

        if (y < 0 || y >= c || x < 0 || x >= c) {
            tile.src = "http://maps.gstatic.com/mapfiles/transparent.png";
            return tile;
        }

        for (var g = 0, f = "t"; g < zoom; g++) {
            c = c / 2;
            if (y < c) {
                if (x < c) {
                    f += "q"
                } else {
                    f += "r";
                    x -= c
                }
            } else {
                if (x < c) {
                    f += "t";
                    y -= c
                } else {
                    f += "s";
                    x -= c;
                    y -= c
                }
            }
        }

        tile.src = ["images/tiles/", f, ".jpg"].join('');

        return tile;
    },

    tileToQuadKey: function (x, y, level) {
        var quadKey = [];

        for (var i = level; i > 0; i--) {
            var digit = '0';
            var mask = 1 << (i - 1);

            if ((x & mask) != 0) {
                digit++;
            }

            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadKey.push(digit);
        }

        return quadKey.join('');
    }

});

       
          


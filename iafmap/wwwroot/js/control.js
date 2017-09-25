_basejs.Control = {};

/**
*
* Controle que mostra informações do mapa de acordo a posição do mouse
*
*/
_basejs.Control.Info = _basejs.Object.create({

    /**
    *
    * Objeto referencia do mapa
    * {object}
    * 
    */
    _map: null,

    /**
    *
    * Objeto referencia da div que armazena o controle no mapa
    * {DOM}
    * 
    */
    _div: null,

    /**
    *
    * div auxiliar que contem o estilo do controle
    * {DOM}
    * 
    */
    _controlUI: null,

    /**
    *
    * div auxiliar que contem o texto do controle
    * {DOM}
    * 
    */
    _controlText: null,

    /**
    *
    * instancia de overlay para ajudar em calculos de projeção
    * o objeto de projeção desta classe possui métodos para calcular 
    * a posição em pixels dentro da div container. 
    * Transforma uma coordenada geografica (LatLng) em uma posição (Point)
    * {google.maps.OverlayView} 
    *
    */
    _overlayView: null,

    /**
    *
    * Construtor do controle
    * {method} 
    *
    */
    initialize: function (div, map) {

        this._map = map;
        this._div = div;
        this._div.style.padding = '5px';
               

        // adiciona o objeto OverlayView para poder utilizar algums metodos 
        // complementares para calcular a posição dentro da view port (div)
        this._overlayView = new google.maps.OverlayView();
        this._overlayView.setMap(this._map);
        this._overlayView.draw = function () {
            if (!this.ready) {
                this.ready = true;
                google.maps.event.trigger(this, 'ready');
            }
        };

        // evento mouse move
        var handleOnMouseOver = _basejs.Function.bindAsEventListener(
            this.onMouseOver, this
        );
        google.maps.event.addListener(this._map, 'mousemove', handleOnMouseOver);

        this.draw();

    },

    /**
    *
    * Desenha a div do controle e adiciona no mapa
    * {method}
    *
    */
    draw: function () {

        this._controlUI = document.createElement('div');
        this._controlUI.style.backgroundColor = 'white';
        this._controlUI.style.borderStyle = 'solid';
        this._controlUI.style.borderWidth = '2px';
        this._controlUI.style.width = '300px';
        this._controlUI.style.height = '200px';
        this._controlUI.style.textAlign = 'left';
        this._div.appendChild(this._controlUI);

        this._controlText = document.createElement('div');
        this._controlText.style.fontFamily = 'Arial,sans-serif';
        this._controlText.style.fontSize = '12px';
        this._controlText.style.paddingLeft = '4px';
        this._controlText.style.paddingRight = '4px';
        this._controlUI.appendChild(this._controlText);
    },

    /**
    * 
    * Metodo que modifica o conteudo da div com as informações 
    * de posição do mouse
    * {method}
    * 
    */
    setContent: function (content) {
        this._controlText.innerHTML = content;
    },

    /**
    *
    * Código para o evento mouse over
    * Altera o conteudo da div com informações da posição do mouse
    * {Method}
    *
    */
    onMouseOver: function (evt) {

        var ll = evt.latLng;
        var numTiles = 1 << this._map.getZoom();

        var projection = this._map.getProjection();
        var worldCoordinate = projection.fromLatLngToPoint(ll);
        var pixelCoordinateViewPort = this._overlayView.getProjection().fromLatLngToContainerPixel(ll);

        var pixelCoordinate = new google.maps.Point(
        worldCoordinate.x * numTiles,
        worldCoordinate.y * numTiles);

        var tileCoordinate = new google.maps.Point(
        Math.floor(pixelCoordinate.x / _basejs.Projection.TILE_SIZE),
        Math.floor(pixelCoordinate.y / _basejs.Projection.TILE_SIZE));
                
        var content = ['IAF Map',
                        'LatLng: ' + ll.lat() + ' , ' + ll.lng(),
                        'World Coordinate: ' + worldCoordinate.x + ' , ' +
                        worldCoordinate.y,
                        'Pixel Coordinate: ' + Math.floor(pixelCoordinate.x) + ' , ' +
                        Math.floor(pixelCoordinate.y),
                        'Pixel Coordinate ViewPort: ' + pixelCoordinateViewPort.x + ', ' +
                        pixelCoordinateViewPort.y, 
                        'Tile Coordinate: ' + tileCoordinate.x + ' , ' +
                        tileCoordinate.y + ' at Zoom Level: ' + this._map.getZoom()
                        ].join('<br>');

        this.setContent(content);
    }

});


/**
*
* Controle que trava o mapa de acordo com determinadas coordenadas
* 
*
*/
_basejs.Control.StopDrag = _basejs.Object.create({

    /**
    *
    * Armazena um vetor com os tamanhos de mapa permitidos em cada nivel de zoom 
    * {google.maps.Size}
    *
    */
    _sizeMap: [],

    /**
    *
    * Armazena o tamanho da div que contem o mapa
    * {gogle.maps.Size}
    *
    */
    _sizeContainer: null,

    /**
    *
    * Referencia para o mapa 
    * {object}
    *
    */
    _map: null,

    /**
    * 
    * Objeto que armazena a instancia google.maps.LatLngBounds
    * {object}
    * limites para o mapa travar do arraste
    */
    _allowedBounds: null,

    /**
    *
    * Construtor do controle 
    * {method}
    *
    */
    initialize: function (div, map) {

        this._map = map;

        // possiveis tamanhos do mapa permitidos ( pixel ) de acordo com o nivel de zoom
        this._sizeMap.push(new google.maps.Size(2047, 1600)); // 0
        this._sizeMap.push(new google.maps.Size(2047, 1600)); // 1
        this._sizeMap.push(new google.maps.Size(2047, 1600)); // 2
        this._sizeMap.push(new google.maps.Size(2047, 1650)); // 3
        this._sizeMap.push(new google.maps.Size(4095, 3304)); // 4
        

        // center changed
        var handleOnCenterChanged = _basejs.Function.bindAsEventListener(
            this.onCenterChanged, this
        );
        google.maps.event.addListener(this._map, 'center_changed', handleOnCenterChanged);


        // zoom changed
        var handleOnZoomChanged = _basejs.Function.bindAsEventListener(
            this.onZoomChanged, this
        );
        google.maps.event.addListener(this._map, 'zoom_changed', handleOnZoomChanged);


        // load window
        var handleOnIdle = _basejs.Function.bindAsEventListener(
            this.verifyLimitBounds, this
        );
        google.maps.event.addListener(this._map, 'idle', handleOnIdle);

    },

    /**
    *
    * Código para o evento center changed 
    * Verifica se o centro do mapa está dentro da região permitida,
    * caso não esteja, trava o drag do mapa
    * {Method}
    *
    */
    onCenterChanged: function () {

        if (!this._allowedBounds.contains(this._map.getCenter())) {

            var C = this._map.getCenter();
            var X = C.lng();
            var Y = C.lat();

            var AmaxX = this._allowedBounds.getNorthEast().lng();
            var AmaxY = this._allowedBounds.getNorthEast().lat();
            var AminX = this._allowedBounds.getSouthWest().lng();
            var AminY = this._allowedBounds.getSouthWest().lat();

            if (X < AminX) { X = AminX; }
            if (X > AmaxX) { X = AmaxX; }
            if (Y < AminY) { Y = AminY; }
            if (Y > AmaxY) { Y = AmaxY; }

            this._map.setCenter(new google.maps.LatLng(Y, X));

        }

    },

    /**
    *
    * Recalcula os limites do mapa para o novo nivel de zoom ou tamanho da div do mapa
    * {Method}
    *
    */
    verifyLimitBounds: function () {

        if (this._sizeContainer == null) {
            var div = this._map.getDiv();
            this._sizeContainer = new google.maps.Size($(div).width(), $(div).height());
        }

        var projection = this._map.getProjection();
        var z = this._map.getZoom();
        var numTiles = 1 << this._map.getZoom();

        var x = (this._sizeContainer.width / 2) / numTiles;
        var y = (this._sizeMap[z].height - ((this._sizeContainer.height / 2) + 10)) / numTiles;
        var p = new google.maps.Point(x, y);

        var sw = projection.fromPointToLatLng(p);
        var ne = new google.maps.LatLng((sw.lat() * (-1)), sw.lng() * (-1));

        this._allowedBounds = new google.maps.LatLngBounds(sw, ne);

        this.onCenterChanged();

    },

    /**
    *
    * Recalcula os limites do mapa para o novo nivel de zoom ou tamanho da div do mapa
    * {Method}
    *
    */
    onZoomChanged: function () {

        this.verifyLimitBounds();
        
    }

    /*markBounds: function (bounds) {

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        var boundingBoxPoints = [
            ne, new google.maps.LatLng(ne.lat(), sw.lng()),
            sw, new google.maps.LatLng(sw.lat(), ne.lng()), ne
         ];

        if (this._boundingBox != null)
            this._boundingBox.setMap(null);

        this._boundingBox = new google.maps.Polyline({
            path: boundingBoxPoints,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        this._boundingBox.setMap(this._map);
    }*/

});


/**
*
* Classe principal do mapa sprite
*
*/
_basejs.Map = _basejs.Object.create({

    /**
    * Objeto que armazena a instancia de google.maps.Map
    * {google.maps.Map}
    */
    _map: null,

    /**
    * Objeto com a instancia do maptype criado para o projeto 
    * {object}
    */
    _mapType: null,

    /**
    * Div principal utilizada pelo objeto map
    * {DOM}
    */
    _div: null,

    /**
    * Array com todos os markers 
    * {array}
    */
    _markersArray: [],

    /**
    * Construtor
    * {Method}
    *
    * params
    * d = {DOM} - div principal
    * op = {object} - opcoes para a customizacao do mapa
    */
    initialize: function (d, op) {

        this._div = d;
        this._mapType = new _basejs.MapType();

        var options = {
            backgroundColor: "#000",
            zoom: 3,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: 'IAF',
            disableDefaultUI: true,
            navigationControl: true,
            zoomControl: true,

            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT
            }
        };

        if (typeof op != 'undefined')
            _basejs.Object.extend(options, op);

        this.resizeDiv();
        
        this._map = new google.maps.Map(this._div, options);
        this._map.mapTypes.set('IAF', this._mapType);
        this._map.setMapTypeId('IAF');

        google.maps.event.trigger(this._map, 'resize');

        // on mouse click add marker
        var handleOnClick = _basejs.Function.bindAsEventListener(
            function (event) {
                this.addMarker(event.latLng, this._map);
            }, this
        );
        google.maps.event.addListener(this._map, 'click', handleOnClick);

        this.addControls();

    },

    /**
    *
    * Adiciona os controles do mapa
    * {method}
    *
    */
    addControls: function () {

        /////////////////////////////////////////////////////////////
        // Controle Stop Drag
        ////////////////////////////////////////////////////////////

        var controlStopDragDiv = document.createElement('div');
        controlStopDragDiv.index = 1;
        var controlStopDrag = new _basejs.Control.StopDrag(controlStopDragDiv, this._map);

        this._map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlStopDragDiv);


        /////////////////////////////////////////////////////////////
        // Controle Info
        ////////////////////////////////////////////////////////////

        var controlInfoDiv = document.createElement('div');
        controlInfoDiv.index = 1;
        var controlInfo = new _basejs.Control.Info(controlInfoDiv, this._map);

        this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlInfoDiv);

    },

    /**
    *
    * Adiciona um marker no mapa
    * {method}
    *
    */
    addMarker: function (ll, m) {

        var marker = new google.maps.Marker({
            position: ll,
            draggable: false,
            map: m
        });

        this._markersArray.push(marker);

        var coordInfoWindow = new google.maps.InfoWindow();
        coordInfoWindow.setContent(this.createInfoWindowContent(ll));
        coordInfoWindow.setPosition(ll);

        google.maps.event.addListener(marker, 'click', function () {
            coordInfoWindow.open(m, marker);
        });
    },

    /**
    *
    * Cria o conteudo que será paresentado no infoWindow do marker
    * {method}
    *
    */
    createInfoWindowContent: function (ll) {

        return "latitude: " + ll.lat().toString() + "; longitude: " + ll.lng().toString();
    },

    /**
    *
    * Redimensiona o tamanho da div de acordo com a janela
    * {method}
    *
    */
    resizeDiv: function () {

        var offsetTop = 0;

        for (var e = this._div; e != null; e = e.offsetParent) {
            offsetTop += e.offsetTop;
        }

        var h = getWindowHeight() - offsetTop - 16;

        if (h >= 0) {
            this._div.style.height = h + "px";
        }

    }

});
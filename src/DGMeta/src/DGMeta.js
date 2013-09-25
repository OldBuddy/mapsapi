L.DG.Meta = L.Handler.extend({

    _currentPoi: null,
    _currentBuilding: null,
    _currentTile: null,
    _currentTileMetaData: null,

    _listenPoi: false,
    _listenBuildings: false,

    initialize: function (map) { // (Object)
        this._map = map;
        this._mapPanes = map.getPanes();
        this._tileSize = L.DG.TileLayer.prototype.options.tileSize;	// TODO: tileSize getter
        this._metaHost = new L.DG.Meta.Host();
    },

    addHooks: function () {
        this._calcTilesAtZoom();
        this._map.on(this._mapEventsListeners, this);
    },

    removeHooks: function () {
        this._map.off(this._mapEventsListeners, this);
    },

    enablePoiListening: function () {
        this.enable();
        this._listenPoi = true;
        return this;
    },

    enableBuildingsListening: function () {
        this.enable();
        this._listenBuildings = true;
        return this;
    },

    disablePoiListening: function () {
        this._listenPoi = false;
        return this;
    },

    disableBuildingsListening: function () {
        this._listenBuildings = false;
        return this;
    },

    _mapEventsListeners : {
        mousemove : function (e) { // (L.Event)
            if (this._map.getZoom() < __POI_LAYER_MIN_ZOOM__ ||
                !(this._listenPoi || this._listenBuildings) ||
                 (this._map._panTransition && this._map._panTransition._inProgress)) { return; }

            if (!this._isEventTargetAllowed(e.originalEvent.target || e.originalEvent.srcElement)) {
                this._leaveCurrentPoi();
                this._leaveCurrentBuilding();
                return;
            }

            var xyz = this._getTileID(e),
                self = this;

            if (this._isTileChanged(xyz)) {
                this._currentTileMetaData = null;
                this._currentTile = xyz;
                this._metaHost.getTileData(xyz).then(function (tileData) {
                    self._currentTileMetaData = tileData;
                });
            } else {
                if (this._currentTileMetaData) {
                    if (this._listenPoi) { this._checkPoiHover(e.latlng); }
                    if (this._listenBuildings) { this._checkBuildingHover(e.latlng); }
                }
            }
        },

        mouseout: function () {
            this._leaveCurrentPoi();
            this._leaveCurrentBuilding();
        },

        viewreset: function () {
            this._calcTilesAtZoom();
            this._leaveCurrentPoi();
            this._leaveCurrentBuilding();
        },
    },

    _checkPoiHover: function (latLng) { // (L.LatLng)
        var hoveredPoi = this._isMetaHovered(latLng, this._currentTileMetaData.poi);

        if (this._currentPoi && (!hoveredPoi || this._currentPoi.id !== hoveredPoi.id)) {
            this._leaveCurrentPoi();
        }

        if (hoveredPoi && (!this._currentPoi || this._currentPoi.id !== hoveredPoi.id)) {
            this._currentPoi = hoveredPoi;
            this._map.fire('dgPoiHover', {'poi': this._currentPoi, latlng: latLng});
            L.DomEvent.addListener(this._mapPanes.mapPane, 'click', this._onDomMouseClick, this);
        }
    },

    _checkBuildingHover: function (latLng) { // (L.LatLng)
        var hoveredBuilding = this._isMetaHovered(latLng, this._currentTileMetaData.buildings);

        if (this._currentBuilding && (!hoveredBuilding || this._currentBuilding.id !== hoveredBuilding.id)) {
            this._leaveCurrentBuilding();
        }

        if (hoveredBuilding && (!this._currentBuilding || this._currentBuilding.id !== hoveredBuilding.id)) {
            this._currentBuilding = hoveredBuilding;
            this._map.fire('dgBuildingHover', {'building': this._currentBuilding, latlng: latLng});
        }
    },

    _leaveCurrentPoi: function () {
        if (this._currentPoi) {
            this._map
                    .fire('dgPoiLeave', { 'poi': this._currentPoi })
                    .off('click', this._onDomMouseClick, this);
            L.DomEvent.removeListener(this._mapPanes.mapPane, 'click', this._onDomMouseClick);
            this._currentPoi = null;
        }
    },

    _leaveCurrentBuilding: function () {
        if (this._currentBuilding) {
            this._map.fire('dgBuildingLeave', { 'building': this._currentBuilding });
            this._currentBuilding = null;
        }
    },

    _onDomMouseClick: function (event) { // (Object)
        if (this._currentPoi) {
            this._map.fire('dgPoiClick', {
                'poi': this._currentPoi,
                latlng: this._map.containerPointToLatLng(L.DomEvent.getMousePosition(event))
            });
            L.DomEvent.stopPropagation(event);
        }
    },

    _calcTilesAtZoom: function () {
        this._tilesAtZoom = Math.pow(2, this._map.getZoom()); // counts tiles number on current zoom
    },

    _belongsToPane: function (element, pane) { // (HTMLElement, String) -> Boolean
        while (element && element !== this._mapPanes.mapPane) {
            if (element === this._mapPanes[pane]) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    },

    _isEventTargetAllowed: function (target) { // (HTMLElement) -> Boolean
        return this._belongsToPane(target, 'tilePane') || this._belongsToPane(target, 'overlayPane');
    },

    _getTileID: function (e) { // (L.Event) -> String
        var p = this._map.project(e.latlng.wrap()),
            x = Math.floor(p.x / this._tileSize) % this._tilesAtZoom, // prevent leaflet bug with tile number detection on worldwrap
            y = Math.floor(p.y / this._tileSize);

        return x + ',' +  y + ',' + this._map._zoom;
    },

    _isTileChanged: function (xyz) { // (String) -> Boolean
        return this._currentTile !== xyz;
    },

    _isMetaHovered: function (point, data) { // (L.Point, Array) -> Object|false
        for (var i = 0, len = data.length; i < len; i++) {
            if (!data[i].verticesArray) {
                if (L.PolyUtil.contains(point, data[i].vertices)) {
                    return data[i];
                }
            } else {
                for (var j = 0, jlen = data[i].verticesArray.length; j < jlen; j++) {
                    if (L.PolyUtil.contains(point, data[i].verticesArray[j])) {
                        return data[i];
                    }
                }
            }
        }
        return false;
    }

});

L.Map.addInitHook('addHandler', 'dgMeta', L.DG.Meta);

/**
 * Leaflet DG TileLayer
 * Version 1.0.0
 *
 * Copyright (c) 2013, 2GIS, Dima Rudenko
 */

L.DG = L.DG || {};
L.DG.TileLayer = L.TileLayer.extend({
    dgTileLayerUrl: 'http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=4',
    options: {
        subdomains: '0123',
        errorTileUrl: 'http://maps.api.2gis.ru/images/nomap.png'
    },

    initialize: function () {
        var url = this.dgTileLayerUrl,
            options = L.setOptions(this, this.options);
        L.TileLayer.prototype.initialize.call(this, url, options);
    }
});

L.dgTileLayer = function () {
    return new L.DG.TileLayer();
};

L.Map.mergeOptions({
    attributionControl: false,
    layers: [L.dgTileLayer()]
});

L.Map.addInitHook(function () {
    var options = {
        position: 'bottomright',
        prefix: '<div class="dg-mapcopyright dg-mapcopyright_lang_ru">' +
            '<a href="http://2gis.ru/?utm_source=copyright&utm_medium=map&utm_campaign=partners" class="dg-mapcopyright__logolink" target="_blank" alt="ООО  ДубльГИС">' +
            '<span class="dg-mapcopyright__logo"></span>' +
            '</a>' +
            '<a class="dg-link dg-mapcopyright__apilink" href="http://api.2gis.ru/?utm_source=copyright&utm_medium=map&utm_campaign=partners" target="_blank" alt="Работает на API 2ГИС"></a>' +
            '<a class="dg-link dg-mapcopyright__license" href="http://help.2gis.ru/licensing-agreement/" target="_blank" alt="Лицензионное соглашение"></a>' +
            '</div>'
    };

    new L.Control.Attribution(options).addTo(this);
});
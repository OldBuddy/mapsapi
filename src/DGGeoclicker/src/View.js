L.DG.Geoclicker.View = L.Class.extend({

    initialize: function (map, options) { // (Object, Object)
        this._map = map;
        this._popup = L.popup({
            maxHeight: 300,
            minHeight: 50,
            maxWidth: 355,
            minWidth: 355
        });

        this._templates = __DGGeoclicker_TMPL__;
        options && L.Util.setOptions(this, options);
    },

    showLoader: function (loader) {
        if (loader) {
            loader.style.display = 'block';
        }
    },

    hideLoader: function (loader) {
        if (loader) {
            loader.style.display = 'none';
        }
    },

    initLoader: function () {
        var loader = document.createElement('div');
        loader.setAttribute('id', 'dg-popup-firm-loading');

        return loader;
    },

    showPopup: function (latlng) { // (Object)
        this._popup
                .setContent('')
                .setLatLng(latlng)
                .openOn(this._map);
    },

    render: function (options) { // (Object) -> String
        var html,
            data = {};

        options = options || {};
        options.tmpl = options.tmpl || '';

        if (options.data) {
            html = L.DG.template(options.tmpl, options.data);
        } else {
            html = options.tmpl;
        }

        options.beforeRender && options.beforeRender();

        if (options.popup) {
            if (options.header) {
                data.header = options.header;
            }
            if (options.footer) {
                data.footer = options.footer;
            }
            data.body = html;
            this._popup.setContent(data);
        }
        options.afterRender && options.afterRender();

        return html;
    },

    renderPopup: function (options) { // (Object) -> String
        options.popup = true;
        return this.render(options);
    },

    getPopup: function () { // () -> Object
        return this._popup;
    },

    getTemplate: function (tmplFile) {
        var tmpl = this._templates[tmplFile];
        return tmpl ? tmpl : '';
    }
});

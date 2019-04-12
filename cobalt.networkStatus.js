(function (cobalt) {
    var plugin = {
        classes: {
        	ios:'CobaltNetworkStatusPlugin',
			android: 'io.kristal.networkstatusplugin.NetworkStatusPlugin'
        },
        defaultHandlers: {
            onStatusChanged: function (status) {
                cobalt.log('Network status updated: ' + status);
            }
        },

        status: {
            WIFI: 'wifi',
            MOBILE: 'mobile',
            UNKNOWN: 'unknown',
            NONE: 'none'
        },

        init: function () {
            cobalt.networkStatus = {
                getStatus: this.getStatus.bind(this),
                startMonitoring: this.startMonitoring.bind(this),
                stopMonitoring: this.stopMonitoring.bind(this),
                onStatusChanged: this.defaultHandlers.onStatusChanged,
                status: this.status
            };
        },
        startMonitoring: function (callback) {
            if (typeof callback == 'function')
                cobalt.networkStatus.onStatusChanged = callback;

            cobalt.plugins.send(this, 'startStatusMonitoring');
        },

        stopMonitoring: function () {
            cobalt.plugins.send(this, 'stopStatusMonitoring');
        },

        getStatus: function (callback) {
            cobalt.plugins.send(this, 'getStatus', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.status);
                else
                    cobalt.log('Received network status: ', data);
            });
        },

        handleEvent: function (json) {
            switch (json && json.action) {
                case 'onStatusChanged':
                    if (typeof cobalt.networkStatus.onStatusChanged == 'function')
                        cobalt.networkStatus.onStatusChanged(json.data.status);
                    break;

                default:
                    cobalt.log(this.name, ': unknown action ', json.action);
                    break;
            }
        }
    };

    cobalt.plugins.register(plugin);
})(cobalt || {});

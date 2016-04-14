(function (cobalt) {
    var plugin = {
        name: 'networkStatus',

        defaultHandlers: {
            onStatusChanged: function (status) {
                cobalt.log('Network status updated: ' + status);
            }
        },

        status: {
            WIFI: 'wifi',
            MOBILE: 'mobile',
            ETHERNET: 'ethernet',
            VPN: 'vpn',
            BLUETOOTH: 'bluetooth',
            UNKNOWN: 'unknown',
            NONE: 'none'
        },

        init: function (options) {
            cobalt.networkStatus = {
                getStatus: this.getStatus.bind(this),
                startStatusMonitoring: this.startStatusMonitoring.bind(this),
                stopStatusMonitoring: this.stopStatusMonitoring.bind(this),
                onStatusChanged: this.defaultHandlers.onStatusChanged,
                status: this.status
            };

            this.defineCallbacks(options);
        },

        defineCallbacks: function (options) {
            if (options && typeof options.onStatusChanged == 'function')
                cobalt.networkStatus.onStatusChanged = options.onStatusChanged;
        },

        startStatusMonitoring: function (options) {
            this.send('startStatusMonitoring');
        },

        stopStatusMonitoring: function () {
            this.send('stopStatusMonitoring');
        },

        getStatus: function (callback) {
            this.send('getStatus', {}, function (data) {
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
        },

        send: function (action, data, callback) {
            cobalt.send({ type: 'plugin', name: this.name, action: action, data: data }, callback);
        }
    };

    cobalt.plugins.register(plugin);
})(cobalt || {});

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

            this.send('startStatusMonitoring');
        },

        stopMonitoring: function () {
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

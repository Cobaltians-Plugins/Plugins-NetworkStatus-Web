(function (cobalt) {
    var plugin = {
        name: 'networkStatus',

        defaultHandlers: {
            onStatusChanged: function (data) {
                cobalt.log('Network status updated: ' + data);
            }
        },

        init: function (options) {
            cobalt.network = {
                getState: this.getState.bind(this),
                getType: this.getType.bind(this),
                startStatusMonitoring: this.startStatusMonitoring.bind(this),
                stopStatusMonitoring: this.stopStatusMonitoring.bind(this),
                onStatusChanged: this.defaultHandlers.onStatusChanged
            };

            this.defineCallbacks(options);
        },

        defineCallbacks: function (options) {
            if (options && typeof options.onStatusChanged == 'function')
                cobalt.network.onStatusChanged = options.onStatusChanged;
        },

        startStatusMonitoring: function (options) {
            this.send('startStatusMonitoring');
        },

        stopStatusMonitoring: function () {
            this.send('stopStatusMonitoring');
        },

        getState: function (callback) {
            this.send('getState', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.state);
                else
                    cobalt.log('Received network status: ', data);
            });
        },

        getType: function (callback) {
            this.send('getType', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.type);
                else
                    cobalt.log('Received network type: ', data);
            });
        },

        handleEvent: function (json) {
            switch (json && json.action) {
                case 'onStatusChanged':
                    if (typeof cobalt.network.onStatusChanged == 'function')
                        cobalt.network.onStatusChanged(json.data);
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

(function(cobalt) {
  var plugin = {
    name: 'CobaltNetworkStatusPlugin',
    classes: {
      ios: 'CobaltNetworkStatusPlugin',
      android: 'io.kristal.networkstatusplugin.NetworkStatusPlugin'
    },
    defaultHandlers: {
      onStatusChanged: function(status) {
        cobalt.log('Network status updated: ' + status);
      }
    },

    status: {
      WIFI: 'wifi',
      MOBILE: 'mobile',
      UNKNOWN: 'unknown',
      NONE: 'none'
    },

    init: function() {
      cobalt.networkStatus = {
        getStatus: this.getStatus.bind(this),
        startMonitoring: this.startMonitoring.bind(this),
        stopMonitoring: this.stopMonitoring.bind(this),
        onStatusChanged: this.defaultHandlers.onStatusChanged,
        status: this.status
      };
    },
    startMonitoring: function(callback) {
      cobalt.networkStatus.onStatusChanged = callback;
      cobalt.plugins.send(this, 'startStatusMonitoring');
    },

    stopMonitoring: function() {
      cobalt.plugins.send(this, 'stopStatusMonitoring');
    },

    getStatus: function(callback) {
      cobalt.networkStatus.onStatusChanged = callback;
      cobalt.plugins.send(this, 'getStatus', {});
    },

    handleEvent: function(json) {
      switch (json && json.data && json.data.action) {
        case 'onStatusChanged':
          if (typeof cobalt.networkStatus.onStatusChanged === 'function')
            cobalt.networkStatus.onStatusChanged(json.data.status);
          break;
      }
    }
  };
  cobalt.plugins.register(plugin);
})(cobalt || {});

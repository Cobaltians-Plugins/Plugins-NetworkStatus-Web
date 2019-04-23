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
      if (callback){
        cobalt.networkStatus.onStatusChanged = callback;
      }
      cobalt.plugins.send(this, 'startStatusMonitoring', {}, cobalt.networkStatus.onStatusChanged);
    },

    stopMonitoring: function() {
      cobalt.plugins.send(this, 'stopStatusMonitoring');
    },
    getStatus: function(callback) {
      cobalt.plugins.send(this, 'getStatus', {}, callback);
    },
    handleEvent: function(event) {
      switch (event && event.action) {
        case 'onStatusChanged':
          if (typeof cobalt.networkStatus.onStatusChanged === 'function')
            cobalt.networkStatus.onStatusChanged(event.data);
          break;
      }
    }
  };
  cobalt.plugins.register(plugin);
})(cobalt || {});

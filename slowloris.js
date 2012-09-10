window.Loris = (function() {
  var hasWebWorkers = typeof(Worker) !== 'undefined';
  var Loris = function() {
    this.callbacks = {};
    this.errbacks = {}
    this.counts = 0;
    this.worker = null;
    this.useWebWorkers = hasWebWorkers;
    if (hasWebWorkers) {
      try {
        this.worker = new Worker('slowloris-webworker.js');
      } catch (e) {
        hasWebWorkers = false;
        this.useWebWorkers = false;
        return;
      }
      this.worker.onmessage = (function (event) {
        var id = event.data[0];
        var isException = event.data[1];
        var payload = event.data[2];

        if (isException) {
          this.callbacks[id](payload);
        } else {
          this.errbacks[id](payload);
        }
        delete this.callbacks[id];
        delete this.errbacks[id];
      }).bind(this);
      this.worker.onerror = function(event) {
        // This should never actually happen but let's log it anyway
        console.log('Slowloris uncaught exception: ', event.data);
      };
    }
  };

  Loris.prototype.eval = function (expr, callback, errback) {
    if (!this.useWebWorkers) {
      // TODO: explore trampolining this eval with setTimeout().
      try {
        callback(eval(expr));
      } catch (e) {
        errback(e);
      }
      return;
    }
    var id = this.counts++;
    this.callbacks[id] = callback;
    this.errbacks[id] = errback;
    this.worker.postMessage([id, expr]);
  };

  Loris.prototype.disableWebWorkers = function() {
    this.useWebWorkers = false;
  };

  Loris.prototype.enableWebWorkers = function() {
    this.useWebWorkers = hasWebWorkers;
  };

  Loris.prototype.usingWebWorkers = function() {
    return this.useWebWorkers;
  };

  Loris.prototype.hasWebWorkers = function() {
    return hasWebWorkers;
  };

  return new Loris();
})();
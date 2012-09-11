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
        this.worker = new Worker('loris-webworker.js');
      } catch (e) {
        hasWebWorkers = false;
        this.useWebWorkers = false;
        return;
      }
      this.worker.onmessage = (function (event) {
        var id = event.data[0];
        var isException = !event.data[1];
        var payload = event.data[2];

        if (!isException) {
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

  Loris.prototype.postEvalMessage = function (expr, callback, errback, isAsync) {
    var id = this.counts++;
    this.callbacks[id] = callback;
    this.errbacks[id] = errback;
    this.worker.postMessage([id, isAsync, expr]);
  };

  // Use this just like you would use a normal eval. If you need to do any fetching in this
  // function (which would require a callback), use evalAsync()
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
    this.postEvalMessage(expr, callback, errback, false);
  };

  // Just like eval() except you can explicitly call callback and errback in your expression.
  // This is useful if you want to do fetching and return a value when it completes.
  Loris.prototype.evalAsync = function (expr, callback, errback) {
    if (!this.useWebWorkers) {
      try {
        eval(expr);
      } catch (e) {
        errback(e);
      }
      return;
    }
    this.postEvalMessage(expr, callback, errback, true);
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
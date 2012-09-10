self.onmessage = function (event) {
  var id = event.data[0];
  var async = event.data[1];
  var expr = event.data[2];

  function callback(result) {
    self.postMessage([id, true, result]);
  }
  function errback(result) {
    self.postMessage([id, false, result]);
  }

  try {
    var result = eval(expr);

    if (!async) {
      callback(result);
    }
  } catch (e) {
    errback(e.toString());
  }
};
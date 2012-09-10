self.onmessage = function (event) {
  try {
    self.postMessage([event.data[0], true, eval(event.data[1])]);
  } catch (e) {
    self.postMessage([event.data[0], false, e]);
  }
};
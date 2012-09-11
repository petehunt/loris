$(document).ready(function() {
  // Set up event handlers and init the UI
  $('#toggle').click(function() {
    if (Loris.usingWebWorkers()) {
      Loris.disableWebWorkers();
    } else {
      Loris.enableWebWorkers();
    }
    $('#status').text(Loris.usingWebWorkers() ? 'enabled' : 'disabled');
  });
  $('#supported').text(Loris.hasWebWorkers() ? 'are' : 'are not');
  $('#status').text(Loris.usingWebWorkers() ? 'enabled' : 'disabled');
  if (window.location.href.substring(0, 4).toLowerCase() !== 'http') {
    $('body').addClass('runninglocal');
  }

  function tick() {
    // Update the clock and run some asynchronous computation.
    $('#time').text(new Date());
    Loris.eval('var start = new Date().getTime(); while (new Date().getTime() - start < 3000); [new Date().getTime() - start, new Date()];', function (result) {
      // Let's pretend we actually do something with the result here. We'll check its value here to
      // prove that it's working, and update the UI to prove that we can update it.
      var delay = result[0];
      var date = result[1];
      if (delay < 3000) {
        $('#computetime').text('there was an error :(');
      } else {
        $('#computetime').text(date);
      }
    });
  }
  tick();

  // Keep the clock updated
  setInterval(tick, 500);
});
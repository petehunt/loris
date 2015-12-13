Loris
=====

![unmaintained](http://img.shields.io/badge/status-unmaintained-red.png)

Loris is a very simple web worker with the following goals:

  + Get non-UI logic out of the UI thread. This is often one of the main causes of underlying client-side performance problems.
  + Safety and simplicity: Normal use of Loris should not cause any concurrency nightmares (deadlock, race conditions, etc).
  + Legacy compatibility: Older browsers won't break and newer browsers will magically get faster.
  + Ignoring web workers: You shouldn't really need to write a web worker yourself unless you have a special use case.

I've included an example in the repo that has a bit of information about it. I've also made it available live at
http://www.petehunt.net/slowloris/example.html

Basically, you get an asynchronous eval() function. This is a pretty bad way to write real code; instead you should build a
better abstraction on top of Loris to offload as much as you can into the background thread and only do UI updates once
the computation is complete.

HOWTO
-----

See the example. Basically all you need to know is Loris.eval(expr, callback, errback); where expr is a string containing
the expression to evaluate, callback is the function that gets called with the result of the eval, and errback gets called
with any exceptions that may get thrown.

There's also an evalAsync() function if you need to do any fetching. Simply use the callback() and errback() functions to
return a value or throw an exception respectively.

FAQ
---

  + The example isn't working.

Web workers don't work locally; use a web server. Read the paragraph in the example.

  + How should I use this?

First, don't use it. Build your features first. Avoid premature optimization at all costs. Then when it's time to improve
performance look for places where your UI stalls and start modifying your code such that the expensive computation gets
called from Loris and the callback upates the UI.

  + Where'd my global scope go?

Web workers execute in their own scope. So you won't have any functions or variables from the browser, nor will you have
access to the DOM. You can use the importScripts() global in your eval'd code to load .js files similar to how the script
tag would do it in the markup. See https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers

  + Why do I only get eval?

Because it's flexible enough to build a good abstraction on, but doesn't encourage you to actually do "real" parallelism.

  + Why do I only get 1 background thread?

Because the point of this is not to utilize multiple cores or be a great framework for building parallel apps, it's just
designed to get as much crap out of the UI thread as possible so you can build really responsive client-side apps in JS.

  + What browsers does this work in?

Should "work" everywhere, but you'll only see perf improvements on these browsers: http://caniuse.com/webworkers

  + What should I avoid?

Just don't touch the underlying web worker stuff (Loris.worker or call any web worker stuff in the string you eval).

  + What's next?

I'd like to build an AMD module loader on top of this so you can just pass a module name and function name rather than a
string of JS to eval.

  + There isn't a lot of code here, is this even worth putting up on Github?

Yeah. What I think is important is that Loris leaves *out* a lot of features in order to encourage engineers to build
simpler programs using as little parallelism as possible while still solving an important and underserved problem.

Also, writing web workers from scratch is annoying.

  + Why did you build this?

Because it's a shame that the web stack has such a bad reputation on mobile vs. native. Sure, native will probably always
beat web on benchmarks, but it shouldn't beat the web stack by as much as it has been. I think this is mostly due to
the fact that web front-end engineers put too much computation in the UI thread. There's a few other candidates too:
inefficient CSS (and JS that drives the CSS!) and poor network fetching/batching/caching of data and code. Hopefully
Loris solves the first problem, education and something like Zepto solves the second one, and something like Backbone
solves the third problem.

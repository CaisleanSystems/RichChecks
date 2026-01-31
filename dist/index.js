import require$$0 from '@actions/core';
import require$$1 from '@actions/github';
import require$$2 from '@actions/github/lib/utils';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var RichChecksClone = {};

var light$1 = {exports: {}};

/**
  * This file contains the Bottleneck library (MIT), compiled to ES2017, and without Clustering support.
  * https://github.com/SGrondin/bottleneck
  */
var light = light$1.exports;

var hasRequiredLight;

function requireLight () {
	if (hasRequiredLight) return light$1.exports;
	hasRequiredLight = 1;
	(function (module, exports$1) {
		(function (global, factory) {
			module.exports = factory() ;
		}(light, (function () {
			var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

			function getCjsExportFromNamespace (n) {
				return n && n['default'] || n;
			}

			var load = function(received, defaults, onto = {}) {
			  var k, ref, v;
			  for (k in defaults) {
			    v = defaults[k];
			    onto[k] = (ref = received[k]) != null ? ref : v;
			  }
			  return onto;
			};

			var overwrite = function(received, defaults, onto = {}) {
			  var k, v;
			  for (k in received) {
			    v = received[k];
			    if (defaults[k] !== void 0) {
			      onto[k] = v;
			    }
			  }
			  return onto;
			};

			var parser = {
				load: load,
				overwrite: overwrite
			};

			var DLList;

			DLList = class DLList {
			  constructor(incr, decr) {
			    this.incr = incr;
			    this.decr = decr;
			    this._first = null;
			    this._last = null;
			    this.length = 0;
			  }

			  push(value) {
			    var node;
			    this.length++;
			    if (typeof this.incr === "function") {
			      this.incr();
			    }
			    node = {
			      value,
			      prev: this._last,
			      next: null
			    };
			    if (this._last != null) {
			      this._last.next = node;
			      this._last = node;
			    } else {
			      this._first = this._last = node;
			    }
			    return void 0;
			  }

			  shift() {
			    var value;
			    if (this._first == null) {
			      return;
			    } else {
			      this.length--;
			      if (typeof this.decr === "function") {
			        this.decr();
			      }
			    }
			    value = this._first.value;
			    if ((this._first = this._first.next) != null) {
			      this._first.prev = null;
			    } else {
			      this._last = null;
			    }
			    return value;
			  }

			  first() {
			    if (this._first != null) {
			      return this._first.value;
			    }
			  }

			  getArray() {
			    var node, ref, results;
			    node = this._first;
			    results = [];
			    while (node != null) {
			      results.push((ref = node, node = node.next, ref.value));
			    }
			    return results;
			  }

			  forEachShift(cb) {
			    var node;
			    node = this.shift();
			    while (node != null) {
			      (cb(node), node = this.shift());
			    }
			    return void 0;
			  }

			  debug() {
			    var node, ref, ref1, ref2, results;
			    node = this._first;
			    results = [];
			    while (node != null) {
			      results.push((ref = node, node = node.next, {
			        value: ref.value,
			        prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
			        next: (ref2 = ref.next) != null ? ref2.value : void 0
			      }));
			    }
			    return results;
			  }

			};

			var DLList_1 = DLList;

			var Events;

			Events = class Events {
			  constructor(instance) {
			    this.instance = instance;
			    this._events = {};
			    if ((this.instance.on != null) || (this.instance.once != null) || (this.instance.removeAllListeners != null)) {
			      throw new Error("An Emitter already exists for this object");
			    }
			    this.instance.on = (name, cb) => {
			      return this._addListener(name, "many", cb);
			    };
			    this.instance.once = (name, cb) => {
			      return this._addListener(name, "once", cb);
			    };
			    this.instance.removeAllListeners = (name = null) => {
			      if (name != null) {
			        return delete this._events[name];
			      } else {
			        return this._events = {};
			      }
			    };
			  }

			  _addListener(name, status, cb) {
			    var base;
			    if ((base = this._events)[name] == null) {
			      base[name] = [];
			    }
			    this._events[name].push({cb, status});
			    return this.instance;
			  }

			  listenerCount(name) {
			    if (this._events[name] != null) {
			      return this._events[name].length;
			    } else {
			      return 0;
			    }
			  }

			  async trigger(name, ...args) {
			    var e, promises;
			    try {
			      if (name !== "debug") {
			        this.trigger("debug", `Event triggered: ${name}`, args);
			      }
			      if (this._events[name] == null) {
			        return;
			      }
			      this._events[name] = this._events[name].filter(function(listener) {
			        return listener.status !== "none";
			      });
			      promises = this._events[name].map(async(listener) => {
			        var e, returned;
			        if (listener.status === "none") {
			          return;
			        }
			        if (listener.status === "once") {
			          listener.status = "none";
			        }
			        try {
			          returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
			          if (typeof (returned != null ? returned.then : void 0) === "function") {
			            return (await returned);
			          } else {
			            return returned;
			          }
			        } catch (error) {
			          e = error;
			          {
			            this.trigger("error", e);
			          }
			          return null;
			        }
			      });
			      return ((await Promise.all(promises))).find(function(x) {
			        return x != null;
			      });
			    } catch (error) {
			      e = error;
			      {
			        this.trigger("error", e);
			      }
			      return null;
			    }
			  }

			};

			var Events_1 = Events;

			var DLList$1, Events$1, Queues;

			DLList$1 = DLList_1;

			Events$1 = Events_1;

			Queues = class Queues {
			  constructor(num_priorities) {
			    this.Events = new Events$1(this);
			    this._length = 0;
			    this._lists = (function() {
			      var j, ref, results;
			      results = [];
			      for (j = 1, ref = num_priorities; (1 <= ref ? j <= ref : j >= ref); 1 <= ref ? ++j : --j) {
			        results.push(new DLList$1((() => {
			          return this.incr();
			        }), (() => {
			          return this.decr();
			        })));
			      }
			      return results;
			    }).call(this);
			  }

			  incr() {
			    if (this._length++ === 0) {
			      return this.Events.trigger("leftzero");
			    }
			  }

			  decr() {
			    if (--this._length === 0) {
			      return this.Events.trigger("zero");
			    }
			  }

			  push(job) {
			    return this._lists[job.options.priority].push(job);
			  }

			  queued(priority) {
			    if (priority != null) {
			      return this._lists[priority].length;
			    } else {
			      return this._length;
			    }
			  }

			  shiftAll(fn) {
			    return this._lists.forEach(function(list) {
			      return list.forEachShift(fn);
			    });
			  }

			  getFirst(arr = this._lists) {
			    var j, len, list;
			    for (j = 0, len = arr.length; j < len; j++) {
			      list = arr[j];
			      if (list.length > 0) {
			        return list;
			      }
			    }
			    return [];
			  }

			  shiftLastFrom(priority) {
			    return this.getFirst(this._lists.slice(priority).reverse()).shift();
			  }

			};

			var Queues_1 = Queues;

			var BottleneckError;

			BottleneckError = class BottleneckError extends Error {};

			var BottleneckError_1 = BottleneckError;

			var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;

			NUM_PRIORITIES = 10;

			DEFAULT_PRIORITY = 5;

			parser$1 = parser;

			BottleneckError$1 = BottleneckError_1;

			Job = class Job {
			  constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise) {
			    this.task = task;
			    this.args = args;
			    this.rejectOnDrop = rejectOnDrop;
			    this.Events = Events;
			    this._states = _states;
			    this.Promise = Promise;
			    this.options = parser$1.load(options, jobDefaults);
			    this.options.priority = this._sanitizePriority(this.options.priority);
			    if (this.options.id === jobDefaults.id) {
			      this.options.id = `${this.options.id}-${this._randomIndex()}`;
			    }
			    this.promise = new this.Promise((_resolve, _reject) => {
			      this._resolve = _resolve;
			      this._reject = _reject;
			    });
			    this.retryCount = 0;
			  }

			  _sanitizePriority(priority) {
			    var sProperty;
			    sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
			    if (sProperty < 0) {
			      return 0;
			    } else if (sProperty > NUM_PRIORITIES - 1) {
			      return NUM_PRIORITIES - 1;
			    } else {
			      return sProperty;
			    }
			  }

			  _randomIndex() {
			    return Math.random().toString(36).slice(2);
			  }

			  doDrop({error, message = "This job has been dropped by Bottleneck"} = {}) {
			    if (this._states.remove(this.options.id)) {
			      if (this.rejectOnDrop) {
			        this._reject(error != null ? error : new BottleneckError$1(message));
			      }
			      this.Events.trigger("dropped", {args: this.args, options: this.options, task: this.task, promise: this.promise});
			      return true;
			    } else {
			      return false;
			    }
			  }

			  _assertStatus(expected) {
			    var status;
			    status = this._states.jobStatus(this.options.id);
			    if (!(status === expected || (expected === "DONE" && status === null))) {
			      throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
			    }
			  }

			  doReceive() {
			    this._states.start(this.options.id);
			    return this.Events.trigger("received", {args: this.args, options: this.options});
			  }

			  doQueue(reachedHWM, blocked) {
			    this._assertStatus("RECEIVED");
			    this._states.next(this.options.id);
			    return this.Events.trigger("queued", {args: this.args, options: this.options, reachedHWM, blocked});
			  }

			  doRun() {
			    if (this.retryCount === 0) {
			      this._assertStatus("QUEUED");
			      this._states.next(this.options.id);
			    } else {
			      this._assertStatus("EXECUTING");
			    }
			    return this.Events.trigger("scheduled", {args: this.args, options: this.options});
			  }

			  async doExecute(chained, clearGlobalState, run, free) {
			    var error, eventInfo, passed;
			    if (this.retryCount === 0) {
			      this._assertStatus("RUNNING");
			      this._states.next(this.options.id);
			    } else {
			      this._assertStatus("EXECUTING");
			    }
			    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
			    this.Events.trigger("executing", eventInfo);
			    try {
			      passed = (await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args)));
			      if (clearGlobalState()) {
			        this.doDone(eventInfo);
			        await free(this.options, eventInfo);
			        this._assertStatus("DONE");
			        return this._resolve(passed);
			      }
			    } catch (error1) {
			      error = error1;
			      return this._onFailure(error, eventInfo, clearGlobalState, run, free);
			    }
			  }

			  doExpire(clearGlobalState, run, free) {
			    var error, eventInfo;
			    if (this._states.jobStatus(this.options.id === "RUNNING")) {
			      this._states.next(this.options.id);
			    }
			    this._assertStatus("EXECUTING");
			    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
			    error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
			    return this._onFailure(error, eventInfo, clearGlobalState, run, free);
			  }

			  async _onFailure(error, eventInfo, clearGlobalState, run, free) {
			    var retry, retryAfter;
			    if (clearGlobalState()) {
			      retry = (await this.Events.trigger("failed", error, eventInfo));
			      if (retry != null) {
			        retryAfter = ~~retry;
			        this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
			        this.retryCount++;
			        return run(retryAfter);
			      } else {
			        this.doDone(eventInfo);
			        await free(this.options, eventInfo);
			        this._assertStatus("DONE");
			        return this._reject(error);
			      }
			    }
			  }

			  doDone(eventInfo) {
			    this._assertStatus("EXECUTING");
			    this._states.next(this.options.id);
			    return this.Events.trigger("done", eventInfo);
			  }

			};

			var Job_1 = Job;

			var BottleneckError$2, LocalDatastore, parser$2;

			parser$2 = parser;

			BottleneckError$2 = BottleneckError_1;

			LocalDatastore = class LocalDatastore {
			  constructor(instance, storeOptions, storeInstanceOptions) {
			    this.instance = instance;
			    this.storeOptions = storeOptions;
			    this.clientId = this.instance._randomIndex();
			    parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
			    this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
			    this._running = 0;
			    this._done = 0;
			    this._unblockTime = 0;
			    this.ready = this.Promise.resolve();
			    this.clients = {};
			    this._startHeartbeat();
			  }

			  _startHeartbeat() {
			    var base;
			    if ((this.heartbeat == null) && (((this.storeOptions.reservoirRefreshInterval != null) && (this.storeOptions.reservoirRefreshAmount != null)) || ((this.storeOptions.reservoirIncreaseInterval != null) && (this.storeOptions.reservoirIncreaseAmount != null)))) {
			      return typeof (base = (this.heartbeat = setInterval(() => {
			        var amount, incr, maximum, now, reservoir;
			        now = Date.now();
			        if ((this.storeOptions.reservoirRefreshInterval != null) && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
			          this._lastReservoirRefresh = now;
			          this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
			          this.instance._drainAll(this.computeCapacity());
			        }
			        if ((this.storeOptions.reservoirIncreaseInterval != null) && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
			          ({
			            reservoirIncreaseAmount: amount,
			            reservoirIncreaseMaximum: maximum,
			            reservoir
			          } = this.storeOptions);
			          this._lastReservoirIncrease = now;
			          incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
			          if (incr > 0) {
			            this.storeOptions.reservoir += incr;
			            return this.instance._drainAll(this.computeCapacity());
			          }
			        }
			      }, this.heartbeatInterval))).unref === "function" ? base.unref() : void 0;
			    } else {
			      return clearInterval(this.heartbeat);
			    }
			  }

			  async __publish__(message) {
			    await this.yieldLoop();
			    return this.instance.Events.trigger("message", message.toString());
			  }

			  async __disconnect__(flush) {
			    await this.yieldLoop();
			    clearInterval(this.heartbeat);
			    return this.Promise.resolve();
			  }

			  yieldLoop(t = 0) {
			    return new this.Promise(function(resolve, reject) {
			      return setTimeout(resolve, t);
			    });
			  }

			  computePenalty() {
			    var ref;
			    return (ref = this.storeOptions.penalty) != null ? ref : (15 * this.storeOptions.minTime) || 5000;
			  }

			  async __updateSettings__(options) {
			    await this.yieldLoop();
			    parser$2.overwrite(options, options, this.storeOptions);
			    this._startHeartbeat();
			    this.instance._drainAll(this.computeCapacity());
			    return true;
			  }

			  async __running__() {
			    await this.yieldLoop();
			    return this._running;
			  }

			  async __queued__() {
			    await this.yieldLoop();
			    return this.instance.queued();
			  }

			  async __done__() {
			    await this.yieldLoop();
			    return this._done;
			  }

			  async __groupCheck__(time) {
			    await this.yieldLoop();
			    return (this._nextRequest + this.timeout) < time;
			  }

			  computeCapacity() {
			    var maxConcurrent, reservoir;
			    ({maxConcurrent, reservoir} = this.storeOptions);
			    if ((maxConcurrent != null) && (reservoir != null)) {
			      return Math.min(maxConcurrent - this._running, reservoir);
			    } else if (maxConcurrent != null) {
			      return maxConcurrent - this._running;
			    } else if (reservoir != null) {
			      return reservoir;
			    } else {
			      return null;
			    }
			  }

			  conditionsCheck(weight) {
			    var capacity;
			    capacity = this.computeCapacity();
			    return (capacity == null) || weight <= capacity;
			  }

			  async __incrementReservoir__(incr) {
			    var reservoir;
			    await this.yieldLoop();
			    reservoir = this.storeOptions.reservoir += incr;
			    this.instance._drainAll(this.computeCapacity());
			    return reservoir;
			  }

			  async __currentReservoir__() {
			    await this.yieldLoop();
			    return this.storeOptions.reservoir;
			  }

			  isBlocked(now) {
			    return this._unblockTime >= now;
			  }

			  check(weight, now) {
			    return this.conditionsCheck(weight) && (this._nextRequest - now) <= 0;
			  }

			  async __check__(weight) {
			    var now;
			    await this.yieldLoop();
			    now = Date.now();
			    return this.check(weight, now);
			  }

			  async __register__(index, weight, expiration) {
			    var now, wait;
			    await this.yieldLoop();
			    now = Date.now();
			    if (this.conditionsCheck(weight)) {
			      this._running += weight;
			      if (this.storeOptions.reservoir != null) {
			        this.storeOptions.reservoir -= weight;
			      }
			      wait = Math.max(this._nextRequest - now, 0);
			      this._nextRequest = now + wait + this.storeOptions.minTime;
			      return {
			        success: true,
			        wait,
			        reservoir: this.storeOptions.reservoir
			      };
			    } else {
			      return {
			        success: false
			      };
			    }
			  }

			  strategyIsBlock() {
			    return this.storeOptions.strategy === 3;
			  }

			  async __submit__(queueLength, weight) {
			    var blocked, now, reachedHWM;
			    await this.yieldLoop();
			    if ((this.storeOptions.maxConcurrent != null) && weight > this.storeOptions.maxConcurrent) {
			      throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
			    }
			    now = Date.now();
			    reachedHWM = (this.storeOptions.highWater != null) && queueLength === this.storeOptions.highWater && !this.check(weight, now);
			    blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
			    if (blocked) {
			      this._unblockTime = now + this.computePenalty();
			      this._nextRequest = this._unblockTime + this.storeOptions.minTime;
			      this.instance._dropAllQueued();
			    }
			    return {
			      reachedHWM,
			      blocked,
			      strategy: this.storeOptions.strategy
			    };
			  }

			  async __free__(index, weight) {
			    await this.yieldLoop();
			    this._running -= weight;
			    this._done += weight;
			    this.instance._drainAll(this.computeCapacity());
			    return {
			      running: this._running
			    };
			  }

			};

			var LocalDatastore_1 = LocalDatastore;

			var BottleneckError$3, States;

			BottleneckError$3 = BottleneckError_1;

			States = class States {
			  constructor(status1) {
			    this.status = status1;
			    this._jobs = {};
			    this.counts = this.status.map(function() {
			      return 0;
			    });
			  }

			  next(id) {
			    var current, next;
			    current = this._jobs[id];
			    next = current + 1;
			    if ((current != null) && next < this.status.length) {
			      this.counts[current]--;
			      this.counts[next]++;
			      return this._jobs[id]++;
			    } else if (current != null) {
			      this.counts[current]--;
			      return delete this._jobs[id];
			    }
			  }

			  start(id) {
			    var initial;
			    initial = 0;
			    this._jobs[id] = initial;
			    return this.counts[initial]++;
			  }

			  remove(id) {
			    var current;
			    current = this._jobs[id];
			    if (current != null) {
			      this.counts[current]--;
			      delete this._jobs[id];
			    }
			    return current != null;
			  }

			  jobStatus(id) {
			    var ref;
			    return (ref = this.status[this._jobs[id]]) != null ? ref : null;
			  }

			  statusJobs(status) {
			    var k, pos, ref, results, v;
			    if (status != null) {
			      pos = this.status.indexOf(status);
			      if (pos < 0) {
			        throw new BottleneckError$3(`status must be one of ${this.status.join(', ')}`);
			      }
			      ref = this._jobs;
			      results = [];
			      for (k in ref) {
			        v = ref[k];
			        if (v === pos) {
			          results.push(k);
			        }
			      }
			      return results;
			    } else {
			      return Object.keys(this._jobs);
			    }
			  }

			  statusCounts() {
			    return this.counts.reduce(((acc, v, i) => {
			      acc[this.status[i]] = v;
			      return acc;
			    }), {});
			  }

			};

			var States_1 = States;

			var DLList$2, Sync;

			DLList$2 = DLList_1;

			Sync = class Sync {
			  constructor(name, Promise) {
			    this.schedule = this.schedule.bind(this);
			    this.name = name;
			    this.Promise = Promise;
			    this._running = 0;
			    this._queue = new DLList$2();
			  }

			  isEmpty() {
			    return this._queue.length === 0;
			  }

			  async _tryToRun() {
			    var args, cb, error, reject, resolve, returned, task;
			    if ((this._running < 1) && this._queue.length > 0) {
			      this._running++;
			      ({task, args, resolve, reject} = this._queue.shift());
			      cb = (await (async function() {
			        try {
			          returned = (await task(...args));
			          return function() {
			            return resolve(returned);
			          };
			        } catch (error1) {
			          error = error1;
			          return function() {
			            return reject(error);
			          };
			        }
			      })());
			      this._running--;
			      this._tryToRun();
			      return cb();
			    }
			  }

			  schedule(task, ...args) {
			    var promise, reject, resolve;
			    resolve = reject = null;
			    promise = new this.Promise(function(_resolve, _reject) {
			      resolve = _resolve;
			      return reject = _reject;
			    });
			    this._queue.push({task, args, resolve, reject});
			    this._tryToRun();
			    return promise;
			  }

			};

			var Sync_1 = Sync;

			var version = "2.19.5";
			var version$1 = {
				version: version
			};

			var version$2 = /*#__PURE__*/Object.freeze({
				version: version,
				default: version$1
			});

			var require$$2 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

			var require$$3 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

			var require$$4 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

			var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;

			parser$3 = parser;

			Events$2 = Events_1;

			RedisConnection$1 = require$$2;

			IORedisConnection$1 = require$$3;

			Scripts$1 = require$$4;

			Group = (function() {
			  class Group {
			    constructor(limiterOptions = {}) {
			      this.deleteKey = this.deleteKey.bind(this);
			      this.limiterOptions = limiterOptions;
			      parser$3.load(this.limiterOptions, this.defaults, this);
			      this.Events = new Events$2(this);
			      this.instances = {};
			      this.Bottleneck = Bottleneck_1;
			      this._startAutoCleanup();
			      this.sharedConnection = this.connection != null;
			      if (this.connection == null) {
			        if (this.limiterOptions.datastore === "redis") {
			          this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
			        } else if (this.limiterOptions.datastore === "ioredis") {
			          this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
			        }
			      }
			    }

			    key(key = "") {
			      var ref;
			      return (ref = this.instances[key]) != null ? ref : (() => {
			        var limiter;
			        limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
			          id: `${this.id}-${key}`,
			          timeout: this.timeout,
			          connection: this.connection
			        }));
			        this.Events.trigger("created", limiter, key);
			        return limiter;
			      })();
			    }

			    async deleteKey(key = "") {
			      var deleted, instance;
			      instance = this.instances[key];
			      if (this.connection) {
			        deleted = (await this.connection.__runCommand__(['del', ...Scripts$1.allKeys(`${this.id}-${key}`)]));
			      }
			      if (instance != null) {
			        delete this.instances[key];
			        await instance.disconnect();
			      }
			      return (instance != null) || deleted > 0;
			    }

			    limiters() {
			      var k, ref, results, v;
			      ref = this.instances;
			      results = [];
			      for (k in ref) {
			        v = ref[k];
			        results.push({
			          key: k,
			          limiter: v
			        });
			      }
			      return results;
			    }

			    keys() {
			      return Object.keys(this.instances);
			    }

			    async clusterKeys() {
			      var cursor, end, found, i, k, keys, len, next, start;
			      if (this.connection == null) {
			        return this.Promise.resolve(this.keys());
			      }
			      keys = [];
			      cursor = null;
			      start = `b_${this.id}-`.length;
			      end = "_settings".length;
			      while (cursor !== 0) {
			        [next, found] = (await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 10000]));
			        cursor = ~~next;
			        for (i = 0, len = found.length; i < len; i++) {
			          k = found[i];
			          keys.push(k.slice(start, -end));
			        }
			      }
			      return keys;
			    }

			    _startAutoCleanup() {
			      var base;
			      clearInterval(this.interval);
			      return typeof (base = (this.interval = setInterval(async() => {
			        var e, k, ref, results, time, v;
			        time = Date.now();
			        ref = this.instances;
			        results = [];
			        for (k in ref) {
			          v = ref[k];
			          try {
			            if ((await v._store.__groupCheck__(time))) {
			              results.push(this.deleteKey(k));
			            } else {
			              results.push(void 0);
			            }
			          } catch (error) {
			            e = error;
			            results.push(v.Events.trigger("error", e));
			          }
			        }
			        return results;
			      }, this.timeout / 2))).unref === "function" ? base.unref() : void 0;
			    }

			    updateSettings(options = {}) {
			      parser$3.overwrite(options, this.defaults, this);
			      parser$3.overwrite(options, options, this.limiterOptions);
			      if (options.timeout != null) {
			        return this._startAutoCleanup();
			      }
			    }

			    disconnect(flush = true) {
			      var ref;
			      if (!this.sharedConnection) {
			        return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
			      }
			    }

			  }
			  Group.prototype.defaults = {
			    timeout: 1000 * 60 * 5,
			    connection: null,
			    Promise: Promise,
			    id: "group-key"
			  };

			  return Group;

			}).call(commonjsGlobal$1);

			var Group_1 = Group;

			var Batcher, Events$3, parser$4;

			parser$4 = parser;

			Events$3 = Events_1;

			Batcher = (function() {
			  class Batcher {
			    constructor(options = {}) {
			      this.options = options;
			      parser$4.load(this.options, this.defaults, this);
			      this.Events = new Events$3(this);
			      this._arr = [];
			      this._resetPromise();
			      this._lastFlush = Date.now();
			    }

			    _resetPromise() {
			      return this._promise = new this.Promise((res, rej) => {
			        return this._resolve = res;
			      });
			    }

			    _flush() {
			      clearTimeout(this._timeout);
			      this._lastFlush = Date.now();
			      this._resolve();
			      this.Events.trigger("batch", this._arr);
			      this._arr = [];
			      return this._resetPromise();
			    }

			    add(data) {
			      var ret;
			      this._arr.push(data);
			      ret = this._promise;
			      if (this._arr.length === this.maxSize) {
			        this._flush();
			      } else if ((this.maxTime != null) && this._arr.length === 1) {
			        this._timeout = setTimeout(() => {
			          return this._flush();
			        }, this.maxTime);
			      }
			      return ret;
			    }

			  }
			  Batcher.prototype.defaults = {
			    maxTime: null,
			    maxSize: null,
			    Promise: Promise
			  };

			  return Batcher;

			}).call(commonjsGlobal$1);

			var Batcher_1 = Batcher;

			var require$$4$1 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

			var require$$8 = getCjsExportFromNamespace(version$2);

			var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5,
			  splice = [].splice;

			NUM_PRIORITIES$1 = 10;

			DEFAULT_PRIORITY$1 = 5;

			parser$5 = parser;

			Queues$1 = Queues_1;

			Job$1 = Job_1;

			LocalDatastore$1 = LocalDatastore_1;

			RedisDatastore$1 = require$$4$1;

			Events$4 = Events_1;

			States$1 = States_1;

			Sync$1 = Sync_1;

			Bottleneck = (function() {
			  class Bottleneck {
			    constructor(options = {}, ...invalid) {
			      var storeInstanceOptions, storeOptions;
			      this._addToQueue = this._addToQueue.bind(this);
			      this._validateOptions(options, invalid);
			      parser$5.load(options, this.instanceDefaults, this);
			      this._queues = new Queues$1(NUM_PRIORITIES$1);
			      this._scheduled = {};
			      this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
			      this._limiter = null;
			      this.Events = new Events$4(this);
			      this._submitLock = new Sync$1("submit", this.Promise);
			      this._registerLock = new Sync$1("register", this.Promise);
			      storeOptions = parser$5.load(options, this.storeDefaults, {});
			      this._store = (function() {
			        if (this.datastore === "redis" || this.datastore === "ioredis" || (this.connection != null)) {
			          storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
			          return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
			        } else if (this.datastore === "local") {
			          storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
			          return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
			        } else {
			          throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
			        }
			      }).call(this);
			      this._queues.on("leftzero", () => {
			        var ref;
			        return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
			      });
			      this._queues.on("zero", () => {
			        var ref;
			        return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
			      });
			    }

			    _validateOptions(options, invalid) {
			      if (!((options != null) && typeof options === "object" && invalid.length === 0)) {
			        throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
			      }
			    }

			    ready() {
			      return this._store.ready;
			    }

			    clients() {
			      return this._store.clients;
			    }

			    channel() {
			      return `b_${this.id}`;
			    }

			    channel_client() {
			      return `b_${this.id}_${this._store.clientId}`;
			    }

			    publish(message) {
			      return this._store.__publish__(message);
			    }

			    disconnect(flush = true) {
			      return this._store.__disconnect__(flush);
			    }

			    chain(_limiter) {
			      this._limiter = _limiter;
			      return this;
			    }

			    queued(priority) {
			      return this._queues.queued(priority);
			    }

			    clusterQueued() {
			      return this._store.__queued__();
			    }

			    empty() {
			      return this.queued() === 0 && this._submitLock.isEmpty();
			    }

			    running() {
			      return this._store.__running__();
			    }

			    done() {
			      return this._store.__done__();
			    }

			    jobStatus(id) {
			      return this._states.jobStatus(id);
			    }

			    jobs(status) {
			      return this._states.statusJobs(status);
			    }

			    counts() {
			      return this._states.statusCounts();
			    }

			    _randomIndex() {
			      return Math.random().toString(36).slice(2);
			    }

			    check(weight = 1) {
			      return this._store.__check__(weight);
			    }

			    _clearGlobalState(index) {
			      if (this._scheduled[index] != null) {
			        clearTimeout(this._scheduled[index].expiration);
			        delete this._scheduled[index];
			        return true;
			      } else {
			        return false;
			      }
			    }

			    async _free(index, job, options, eventInfo) {
			      var e, running;
			      try {
			        ({running} = (await this._store.__free__(index, options.weight)));
			        this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
			        if (running === 0 && this.empty()) {
			          return this.Events.trigger("idle");
			        }
			      } catch (error1) {
			        e = error1;
			        return this.Events.trigger("error", e);
			      }
			    }

			    _run(index, job, wait) {
			      var clearGlobalState, free, run;
			      job.doRun();
			      clearGlobalState = this._clearGlobalState.bind(this, index);
			      run = this._run.bind(this, index, job);
			      free = this._free.bind(this, index, job);
			      return this._scheduled[index] = {
			        timeout: setTimeout(() => {
			          return job.doExecute(this._limiter, clearGlobalState, run, free);
			        }, wait),
			        expiration: job.options.expiration != null ? setTimeout(function() {
			          return job.doExpire(clearGlobalState, run, free);
			        }, wait + job.options.expiration) : void 0,
			        job: job
			      };
			    }

			    _drainOne(capacity) {
			      return this._registerLock.schedule(() => {
			        var args, index, next, options, queue;
			        if (this.queued() === 0) {
			          return this.Promise.resolve(null);
			        }
			        queue = this._queues.getFirst();
			        ({options, args} = next = queue.first());
			        if ((capacity != null) && options.weight > capacity) {
			          return this.Promise.resolve(null);
			        }
			        this.Events.trigger("debug", `Draining ${options.id}`, {args, options});
			        index = this._randomIndex();
			        return this._store.__register__(index, options.weight, options.expiration).then(({success, wait, reservoir}) => {
			          var empty;
			          this.Events.trigger("debug", `Drained ${options.id}`, {success, args, options});
			          if (success) {
			            queue.shift();
			            empty = this.empty();
			            if (empty) {
			              this.Events.trigger("empty");
			            }
			            if (reservoir === 0) {
			              this.Events.trigger("depleted", empty);
			            }
			            this._run(index, next, wait);
			            return this.Promise.resolve(options.weight);
			          } else {
			            return this.Promise.resolve(null);
			          }
			        });
			      });
			    }

			    _drainAll(capacity, total = 0) {
			      return this._drainOne(capacity).then((drained) => {
			        var newCapacity;
			        if (drained != null) {
			          newCapacity = capacity != null ? capacity - drained : capacity;
			          return this._drainAll(newCapacity, total + drained);
			        } else {
			          return this.Promise.resolve(total);
			        }
			      }).catch((e) => {
			        return this.Events.trigger("error", e);
			      });
			    }

			    _dropAllQueued(message) {
			      return this._queues.shiftAll(function(job) {
			        return job.doDrop({message});
			      });
			    }

			    stop(options = {}) {
			      var done, waitForExecuting;
			      options = parser$5.load(options, this.stopDefaults);
			      waitForExecuting = (at) => {
			        var finished;
			        finished = () => {
			          var counts;
			          counts = this._states.counts;
			          return (counts[0] + counts[1] + counts[2] + counts[3]) === at;
			        };
			        return new this.Promise((resolve, reject) => {
			          if (finished()) {
			            return resolve();
			          } else {
			            return this.on("done", () => {
			              if (finished()) {
			                this.removeAllListeners("done");
			                return resolve();
			              }
			            });
			          }
			        });
			      };
			      done = options.dropWaitingJobs ? (this._run = function(index, next) {
			        return next.doDrop({
			          message: options.dropErrorMessage
			        });
			      }, this._drainOne = () => {
			        return this.Promise.resolve(null);
			      }, this._registerLock.schedule(() => {
			        return this._submitLock.schedule(() => {
			          var k, ref, v;
			          ref = this._scheduled;
			          for (k in ref) {
			            v = ref[k];
			            if (this.jobStatus(v.job.options.id) === "RUNNING") {
			              clearTimeout(v.timeout);
			              clearTimeout(v.expiration);
			              v.job.doDrop({
			                message: options.dropErrorMessage
			              });
			            }
			          }
			          this._dropAllQueued(options.dropErrorMessage);
			          return waitForExecuting(0);
			        });
			      })) : this.schedule({
			        priority: NUM_PRIORITIES$1 - 1,
			        weight: 0
			      }, () => {
			        return waitForExecuting(1);
			      });
			      this._receive = function(job) {
			        return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
			      };
			      this.stop = () => {
			        return this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called"));
			      };
			      return done;
			    }

			    async _addToQueue(job) {
			      var args, blocked, error, options, reachedHWM, shifted, strategy;
			      ({args, options} = job);
			      try {
			        ({reachedHWM, blocked, strategy} = (await this._store.__submit__(this.queued(), options.weight)));
			      } catch (error1) {
			        error = error1;
			        this.Events.trigger("debug", `Could not queue ${options.id}`, {args, options, error});
			        job.doDrop({error});
			        return false;
			      }
			      if (blocked) {
			        job.doDrop();
			        return true;
			      } else if (reachedHWM) {
			        shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0;
			        if (shifted != null) {
			          shifted.doDrop();
			        }
			        if ((shifted == null) || strategy === Bottleneck.prototype.strategy.OVERFLOW) {
			          if (shifted == null) {
			            job.doDrop();
			          }
			          return reachedHWM;
			        }
			      }
			      job.doQueue(reachedHWM, blocked);
			      this._queues.push(job);
			      await this._drainAll();
			      return reachedHWM;
			    }

			    _receive(job) {
			      if (this._states.jobStatus(job.options.id) != null) {
			        job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
			        return false;
			      } else {
			        job.doReceive();
			        return this._submitLock.schedule(this._addToQueue, job);
			      }
			    }

			    submit(...args) {
			      var cb, fn, job, options, ref, ref1, task;
			      if (typeof args[0] === "function") {
			        ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
			        options = parser$5.load({}, this.jobDefaults);
			      } else {
			        ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
			        options = parser$5.load(options, this.jobDefaults);
			      }
			      task = (...args) => {
			        return new this.Promise(function(resolve, reject) {
			          return fn(...args, function(...args) {
			            return (args[0] != null ? reject : resolve)(args);
			          });
			        });
			      };
			      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
			      job.promise.then(function(args) {
			        return typeof cb === "function" ? cb(...args) : void 0;
			      }).catch(function(args) {
			        if (Array.isArray(args)) {
			          return typeof cb === "function" ? cb(...args) : void 0;
			        } else {
			          return typeof cb === "function" ? cb(args) : void 0;
			        }
			      });
			      return this._receive(job);
			    }

			    schedule(...args) {
			      var job, options, task;
			      if (typeof args[0] === "function") {
			        [task, ...args] = args;
			        options = {};
			      } else {
			        [options, task, ...args] = args;
			      }
			      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
			      this._receive(job);
			      return job.promise;
			    }

			    wrap(fn) {
			      var schedule, wrapped;
			      schedule = this.schedule.bind(this);
			      wrapped = function(...args) {
			        return schedule(fn.bind(this), ...args);
			      };
			      wrapped.withOptions = function(options, ...args) {
			        return schedule(options, fn, ...args);
			      };
			      return wrapped;
			    }

			    async updateSettings(options = {}) {
			      await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
			      parser$5.overwrite(options, this.instanceDefaults, this);
			      return this;
			    }

			    currentReservoir() {
			      return this._store.__currentReservoir__();
			    }

			    incrementReservoir(incr = 0) {
			      return this._store.__incrementReservoir__(incr);
			    }

			  }
			  Bottleneck.default = Bottleneck;

			  Bottleneck.Events = Events$4;

			  Bottleneck.version = Bottleneck.prototype.version = require$$8.version;

			  Bottleneck.strategy = Bottleneck.prototype.strategy = {
			    LEAK: 1,
			    OVERFLOW: 2,
			    OVERFLOW_PRIORITY: 4,
			    BLOCK: 3
			  };

			  Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError_1;

			  Bottleneck.Group = Bottleneck.prototype.Group = Group_1;

			  Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2;

			  Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3;

			  Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher_1;

			  Bottleneck.prototype.jobDefaults = {
			    priority: DEFAULT_PRIORITY$1,
			    weight: 1,
			    expiration: null,
			    id: "<no-id>"
			  };

			  Bottleneck.prototype.storeDefaults = {
			    maxConcurrent: null,
			    minTime: 0,
			    highWater: null,
			    strategy: Bottleneck.prototype.strategy.LEAK,
			    penalty: null,
			    reservoir: null,
			    reservoirRefreshInterval: null,
			    reservoirRefreshAmount: null,
			    reservoirIncreaseInterval: null,
			    reservoirIncreaseAmount: null,
			    reservoirIncreaseMaximum: null
			  };

			  Bottleneck.prototype.localStoreDefaults = {
			    Promise: Promise,
			    timeout: null,
			    heartbeatInterval: 250
			  };

			  Bottleneck.prototype.redisStoreDefaults = {
			    Promise: Promise,
			    timeout: null,
			    heartbeatInterval: 5000,
			    clientTimeout: 10000,
			    Redis: null,
			    clientOptions: {},
			    clusterNodes: null,
			    clearDatastore: false,
			    connection: null
			  };

			  Bottleneck.prototype.instanceDefaults = {
			    datastore: "local",
			    connection: null,
			    id: "<no-id>",
			    rejectOnDrop: true,
			    trackDoneStatus: false,
			    Promise: Promise
			  };

			  Bottleneck.prototype.stopDefaults = {
			    enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
			    dropWaitingJobs: true,
			    dropErrorMessage: "This limiter has been stopped."
			  };

			  return Bottleneck;

			}).call(commonjsGlobal$1);

			var Bottleneck_1 = Bottleneck;

			var lib = Bottleneck_1;

			return lib;

		}))); 
	} (light$1));
	return light$1.exports;
}

var lightExports = requireLight();
var BottleneckLight = /*@__PURE__*/getDefaultExportFromCjs(lightExports);

class RequestError extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message, { cause: options.cause });
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    /* v8 ignore else -- @preserve -- Bug with vitest coverage where it sees an else branch that doesn't exist */
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
}

// pkg/dist-src/version.js
var VERSION$1 = "0.0.0-development";

// pkg/dist-src/error-request.js
async function errorRequest(state, octokit, error, options) {
  if (!error.request || !error.request.request) {
    throw error;
  }
  if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
    const retries = options.request.retries != null ? options.request.retries : state.retries;
    const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
    throw octokit.retry.retryRequest(error, retries, retryAfter);
  }
  throw error;
}
async function wrapRequest$1(state, octokit, request, options) {
  const limiter = new BottleneckLight();
  limiter.on("failed", function(error, info) {
    const maxRetries = ~~error.request.request.retries;
    const after = ~~error.request.request.retryAfter;
    options.request.retryCount = info.retryCount + 1;
    if (maxRetries > info.retryCount) {
      return after * state.retryAfterBaseValue;
    }
  });
  return limiter.schedule(
    requestWithGraphqlErrorHandling.bind(null, state, octokit, request),
    options
  );
}
async function requestWithGraphqlErrorHandling(state, octokit, request, options) {
  const response = await request(request, options);
  if (response.data && response.data.errors && response.data.errors.length > 0 && /Something went wrong while executing your query/.test(
    response.data.errors[0].message
  )) {
    const error = new RequestError(response.data.errors[0].message, 500, {
      request: options,
      response
    });
    return errorRequest(state, octokit, error, options);
  }
  return response;
}

// pkg/dist-src/index.js
function retry(octokit, octokitOptions) {
  const state = Object.assign(
    {
      enabled: true,
      retryAfterBaseValue: 1e3,
      doNotRetry: [400, 401, 403, 404, 410, 422, 451],
      retries: 3
    },
    octokitOptions.retry
  );
  if (state.enabled) {
    octokit.hook.error("request", errorRequest.bind(null, state, octokit));
    octokit.hook.wrap("request", wrapRequest$1.bind(null, state, octokit));
  }
  return {
    retry: {
      retryRequest: (error, retries, retryAfter) => {
        error.request.request = Object.assign({}, error.request.request, {
          retries,
          retryAfter
        });
        return error;
      }
    }
  };
}
retry.VERSION = VERSION$1;

var distBundle$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	VERSION: VERSION$1,
	retry: retry
});

var require$$3 = /*@__PURE__*/getAugmentedNamespace(distBundle$1);

// pkg/dist-src/index.js

// pkg/dist-src/version.js
var VERSION = "0.0.0-development";

// pkg/dist-src/wrap-request.js
var noop = () => Promise.resolve();
function wrapRequest(state, request, options) {
  return state.retryLimiter.schedule(doRequest, state, request, options);
}
async function doRequest(state, request, options) {
  const { pathname } = new URL(options.url, "http://github.test");
  const isAuth = isAuthRequest(options.method, pathname);
  const isWrite = !isAuth && options.method !== "GET" && options.method !== "HEAD";
  const isSearch = options.method === "GET" && pathname.startsWith("/search/");
  const isGraphQL = pathname.startsWith("/graphql");
  const retryCount = ~~request.retryCount;
  const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
  if (state.clustering) {
    jobOptions.expiration = 1e3 * 60;
  }
  if (isWrite || isGraphQL) {
    await state.write.key(state.id).schedule(jobOptions, noop);
  }
  if (isWrite && state.triggersNotification(pathname)) {
    await state.notifications.key(state.id).schedule(jobOptions, noop);
  }
  if (isSearch) {
    await state.search.key(state.id).schedule(jobOptions, noop);
  }
  const req = (isAuth ? state.auth : state.global).key(state.id).schedule(jobOptions, request, options);
  if (isGraphQL) {
    const res = await req;
    if (res.data.errors != null && res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
      const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
        response: res,
        data: res.data
      });
      throw error;
    }
  }
  return req;
}
function isAuthRequest(method, pathname) {
  return method === "PATCH" && // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-a-scoped-access-token
  /^\/applications\/[^/]+\/token\/scoped$/.test(pathname) || method === "POST" && // https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28#reset-a-token
  (/^\/applications\/[^/]+\/token$/.test(pathname) || // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-an-installation-access-token-for-an-app
  /^\/app\/installations\/[^/]+\/access_tokens$/.test(pathname) || // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
  pathname === "/login/oauth/access_token");
}

// pkg/dist-src/generated/triggers-notification-paths.js
var triggers_notification_paths_default = [
  "/orgs/{org}/invitations",
  "/orgs/{org}/invitations/{invitation_id}",
  "/orgs/{org}/teams/{team_slug}/discussions",
  "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "/repos/{owner}/{repo}/collaborators/{username}",
  "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "/repos/{owner}/{repo}/issues",
  "/repos/{owner}/{repo}/issues/{issue_number}/comments",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issue",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority",
  "/repos/{owner}/{repo}/pulls",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
  "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
  "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
  "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "/repos/{owner}/{repo}/releases",
  "/teams/{team_id}/discussions",
  "/teams/{team_id}/discussions/{discussion_number}/comments"
];

// pkg/dist-src/route-matcher.js
function routeMatcher(paths) {
  const regexes = paths.map(
    (path) => path.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/")
  );
  const regex2 = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
  return new RegExp(regex2, "i");
}

// pkg/dist-src/index.js
var regex = routeMatcher(triggers_notification_paths_default);
var triggersNotification = regex.test.bind(regex);
var groups = {};
var createGroups = function(Bottleneck, common) {
  groups.global = new Bottleneck.Group({
    id: "octokit-global",
    maxConcurrent: 10,
    ...common
  });
  groups.auth = new Bottleneck.Group({
    id: "octokit-auth",
    maxConcurrent: 1,
    ...common
  });
  groups.search = new Bottleneck.Group({
    id: "octokit-search",
    maxConcurrent: 1,
    minTime: 2e3,
    ...common
  });
  groups.write = new Bottleneck.Group({
    id: "octokit-write",
    maxConcurrent: 1,
    minTime: 1e3,
    ...common
  });
  groups.notifications = new Bottleneck.Group({
    id: "octokit-notifications",
    maxConcurrent: 1,
    minTime: 3e3,
    ...common
  });
};
function throttling(octokit, octokitOptions) {
  const {
    enabled = true,
    Bottleneck = BottleneckLight,
    id = "no-id",
    timeout = 1e3 * 60 * 2,
    // Redis TTL: 2 minutes
    connection
  } = octokitOptions.throttle || {};
  if (!enabled) {
    return {};
  }
  const common = { timeout };
  if (typeof connection !== "undefined") {
    common.connection = connection;
  }
  if (groups.global == null) {
    createGroups(Bottleneck, common);
  }
  const state = Object.assign(
    {
      clustering: connection != null,
      triggersNotification,
      fallbackSecondaryRateRetryAfter: 60,
      retryAfterBaseValue: 1e3,
      retryLimiter: new Bottleneck(),
      id,
      ...groups
    },
    octokitOptions.throttle
  );
  if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
    throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
  }
  const events = {};
  const emitter = new Bottleneck.Events(events);
  events.on("secondary-limit", state.onSecondaryRateLimit);
  events.on("rate-limit", state.onRateLimit);
  events.on(
    "error",
    (e) => octokit.log.warn("Error in throttling-plugin limit handler", e)
  );
  state.retryLimiter.on("failed", async function(error, info) {
    const [state2, request, options] = info.args;
    const { pathname } = new URL(options.url, "http://github.test");
    const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
    if (!(shouldRetryGraphQL || error.status === 403 || error.status === 429)) {
      return;
    }
    const retryCount = ~~request.retryCount;
    request.retryCount = retryCount;
    options.request.retryCount = retryCount;
    const { wantRetry, retryAfter = 0 } = await (async function() {
      if (/\bsecondary rate\b/i.test(error.message)) {
        const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
        const wantRetry2 = await emitter.trigger(
          "secondary-limit",
          retryAfter2,
          options,
          octokit,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0" || (error.response.data?.errors ?? []).some(
        (error2) => error2.type === "RATE_LIMITED"
      )) {
        const rateLimitReset = new Date(
          ~~error.response.headers["x-ratelimit-reset"] * 1e3
        ).getTime();
        const retryAfter2 = Math.max(
          // Add one second so we retry _after_ the reset time
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
          Math.ceil((rateLimitReset - Date.now()) / 1e3) + 1,
          0
        );
        const wantRetry2 = await emitter.trigger(
          "rate-limit",
          retryAfter2,
          options,
          octokit,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      return {};
    })();
    if (wantRetry) {
      request.retryCount++;
      return retryAfter * state2.retryAfterBaseValue;
    }
  });
  octokit.hook.wrap("request", wrapRequest.bind(null, state));
  return {};
}
throttling.VERSION = VERSION;
throttling.triggersNotification = triggersNotification;

var distBundle = /*#__PURE__*/Object.freeze({
	__proto__: null,
	throttling: throttling
});

var require$$4 = /*@__PURE__*/getAugmentedNamespace(distBundle);

var validateAnnotationsArray = {};

var hasRequiredValidateAnnotationsArray;

function requireValidateAnnotationsArray () {
	if (hasRequiredValidateAnnotationsArray) return validateAnnotationsArray;
	hasRequiredValidateAnnotationsArray = 1;
	function validateAnnotationsArray$1(payload) {
	  const errors = [];
	  if (!Array.isArray(payload)) {
	    errors.push("Payload is not an array");
	    return errors;
	  }
	  payload.forEach((item, index) => {
	    // Check path
	    if (typeof item.path !== "string") {
	      errors.push(`Item at index ${index} has an invalid 'path'`);
	    }
	    // Check start_line
	    if (typeof item.start_line !== "number" || item.start_line < 1) {
	      errors.push(`Item at index ${index} has an invalid 'start_line'`);
	    }
	    // Check end_line
	    if (typeof item.end_line !== "number" || item.end_line < item.start_line) {
	      errors.push(`Item at index ${index} has an invalid 'end_line'`);
	    }
	    // Check start_column
	    if (
	      item.start_column !== undefined &&
	      (typeof item.start_column !== "number" || item.start_column < 1)
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'start_column'`);
	    }
	    // Check end_column
	    if (
	      item.end_column !== undefined &&
	      (typeof item.end_column !== "number" || item.end_column < 1)
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'end_column'`);
	    }
	    // Check annotation_level
	    if (
	      ["notice", "warning", "failure"].indexOf(item.annotation_level) === -1
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'annotation_level'`);
	    }
	    // Check message
	    if (typeof item.message !== "string") {
	      errors.push(`Item at index ${index} has an invalid 'message'`);
	    }
	    // Check title
	    if (item.title !== undefined && typeof item.title !== "string") {
	      errors.push(`Item at index ${index} has an invalid 'title'`);
	    }
	    // Check raw_details
	    if (
	      item.raw_details !== undefined &&
	      typeof item.raw_details !== "string"
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'raw_details'`);
	    }
	  });
	  return errors;
	}
	validateAnnotationsArray.validateAnnotationsArray = validateAnnotationsArray$1;
	return validateAnnotationsArray;
}

var validateImagesArray = {};

var hasRequiredValidateImagesArray;

function requireValidateImagesArray () {
	if (hasRequiredValidateImagesArray) return validateImagesArray;
	hasRequiredValidateImagesArray = 1;
	function validateImagesArray$1(payload) {
	  const errors = [];

	  if (!Array.isArray(payload)) {
	    errors.push("Payload is not an array");
	    return errors;
	  }

	  payload.forEach((item, index) => {
	    // Check if item is an object
	    if (typeof item !== "object" || item === null) {
	      errors.push(`Item at index ${index} is not an object`);
	      return; // Skip further checks for this item
	    }

	    // Check alt
	    if (
	      !Object.prototype.hasOwnProperty.call(item, "alt") ||
	      typeof item.alt !== "string"
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'alt'`);
	    }

	    // Check image_url
	    if (
	      !Object.prototype.hasOwnProperty.call(item, "image_url") ||
	      typeof item.image_url !== "string"
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'image_url'`);
	    }

	    // Check caption (optional)
	    if (
	      Object.prototype.hasOwnProperty.call(item, "caption") &&
	      typeof item.caption !== "string"
	    ) {
	      errors.push(`Item at index ${index} has an invalid 'caption'`);
	    }
	  });

	  return errors;
	}
	validateImagesArray.validateImagesArray = validateImagesArray$1;
	return validateImagesArray;
}

var hasRequiredRichChecksClone;

function requireRichChecksClone () {
	if (hasRequiredRichChecksClone) return RichChecksClone;
	hasRequiredRichChecksClone = 1;
	const core = require$$0;
	const { context } = require$$1;
	const { GitHub } = require$$2;
	const { retry } = require$$3;
	const { throttling } = require$$4;
	const { validateAnnotationsArray } = requireValidateAnnotationsArray();
	const { validateImagesArray } = requireValidateImagesArray();

	// Pro-Tip: create a grouping so its easily to manage the output
	core.startGroup("setup variables and client");
	const successStates = ["neutral", "success"];

	const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
	const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

	// When we use getInput, if there is no value, it comes back as an empty string. We must assume that empty strings are null and check/test appropriately
	const status = core.getInput("status");
	const title = core.getInput("title");
	const details = core.getInput("details");
	const summary = core.getInput("summary");
	const conclusion = core.getInput("conclusion");
	const existingCheckRunId = core.getInput("check-run-id");
	const images = core.getInput("images");
	const annotations = core.getInput("annotations");
	const token = core.getInput("github-token");

	// Create a custom Octokit constructor with the retry and throttling plugins installed
	const OctokitWithPlugins = GitHub.plugin(retry, throttling);

	console.log("created kit");

	// initiate the client with the token and plugins
	const octokit = new OctokitWithPlugins({
	    auth: token,
	    // Enable retries and customize strategy
	    retry: {
	        do: true, // enable retries
	        retryAfter: 30, // time to wait between retries in seconds
	        maxRetries: 5, // max number of retries
	    },
	    // Enable throttling/rate-limiting
	    throttle: {
	        onRateLimit: (retryAfter, options) => {
	            octokit.log.warn(
	                `Request quota exhausted for your request ${options.method} ${options.url}`
	            );
	            if (options.request.retryCount === 0) {
	                // only retries once
	                console.log(`Retrying after ${retryAfter} seconds!`);
	                return true;
	            }
	        },
	        onSecondaryRateLimit: (retryAfter, options) => {
	            octokit.log.warn(
	                `Request quota exhausted for your secondary request ${options.method} ${options.url}`
	            );
	            if (options.request.retryCount === 0) {
	                // only retries once
	                console.log(`Secondary retrying after ${retryAfter} seconds!`);
	                return true;
	            }
	        },
	        onAbuseLimit: (retryAfter, options) => {
	            // does not retry, only logs a warning
	            octokit.log.warn(
	                `Abuse detected for your request ${options.method} ${options.url}`
	            );
	        },
	    },
	});

	// Test inputs and if they fall back to defaults, inform the user that we've made an assumption here
	let name = core.getInput("name");
	if (name == "") {
	    // we're creating a warning for the property and advising to the default
	    core.warning("no name set, using repo name");
	    name = context.repo.name;
	}

	const pull_request = context.payload.pull_request;
	let commitSha = "";
	if (pull_request !== undefined) {
	    commitSha = pull_request.head.sha;
	}

	if (commitSha == "" || commitSha === undefined) {
	    // we're creating a warning for the property and advising to the default
	    core.warning("no pull request detected, using head sha");
	    commitSha = context.sha;
	}

	// get the value for the neutral
	let shouldFailForNeutral = core.getInput("fail-on-neutral");
	// does a value exist
	if (shouldFailForNeutral !== "") {
	    // is it true
	    if (shouldFailForNeutral === "true") {
	        shouldFailForNeutral = true;
	        // is it false
	    } else if (shouldFailForNeutral === "false") {
	        shouldFailForNeutral = false;
	    } else {
	        // raise warning if nothing set
	        core.warning(
	            "unknown value set for fail-on-neutral property, defaulting to false"
	        );
	        shouldFailForNeutral = false;
	    }
	} else {
	    core.warning("nothing set for fail-on-neutral property, defaulting to false");
	    shouldFailForNeutral = false;
	}

	let shouldFailForNonSuccess = core.getInput("fail-on-error");
	if (shouldFailForNonSuccess !== "") {
	    if (shouldFailForNonSuccess === "true") {
	        shouldFailForNonSuccess = true;
	    } else if (shouldFailForNonSuccess === "false") {
	        shouldFailForNonSuccess = false;
	    } else {
	        core.warning(
	            "unknown value set for fail-on-error property, defaulting to false"
	        );
	        shouldFailForNonSuccess = false;
	    }
	} else {
	    core.warning("nothing set for fail-on-error property, defaulting to false");
	    shouldFailForNonSuccess = false;
	}

	core.endGroup();

	// run async
	async function run() {
	    core.startGroup("validate failure options");
	    if (conclusion !== "") {
	        if (shouldFailForNonSuccess && !successStates.includes(conclusion)) {
	            core.setFailed("check failed for non successive state");
	        }
	        if (shouldFailForNeutral && conclusion == "neutral") {
	            core.setFailed("check failed for non successive state");
	        }
	    }
	    core.endGroup();

	    try {
	        core.startGroup("construct payload");

	        let checkRunId = 0;

	        let body = {
	            owner,
	            repo,
	            name,
	            head_sha: commitSha,
	            status,
	            output: {
	                title,
	                summary,
	                text: details,
	            },
	        };

	        if (conclusion !== "") {
	            core.info("conclusion detected");
	            core.debug(conclusion);
	            body.conclusion = conclusion;
	        }

	        core.endGroup();

	        core.startGroup("validate annotations and images");

	        if (core.isDebug()) {
	            core.debug(annotations);
	        }

	        if (annotations) {
	            // Parse to JSON to handle safely
	            const annotationsAsJson = JSON.parse(annotations);
	            const annotationValidationErrors =
	                validateAnnotationsArray(annotationsAsJson);

	            if (annotationValidationErrors.length <= 0) {
	                core.info("successfully validated annotations");
	                body.output.annotations = annotationsAsJson;
	            } else {
	                core.error(annotationValidationErrors.join(" \n "));
	                core.debug(annotationsAsJson);
	                core.warning("Annotations parsing error, did not add");
	            }
	        }

	        if (core.isDebug()) {
	            core.debug(images);
	        }

	        if (images) {
	            // Parse to JSON to handle safely
	            const imageAsJson = JSON.parse(images);
	            const imageValidationErrors = validateImagesArray(imageAsJson);

	            if (imageValidationErrors.length <= 0) {
	                core.info("successfully validated images");
	                body.output.images = imageAsJson;
	            } else {
	                core.warning("Images parsing error, did not add");
	            }
	        }

	        core.endGroup();

	        core.startGroup("run command");
	        if (existingCheckRunId === "") {
	            core.info("creating a check run");
	            // Create the check
	            const createCheck = await octokit.rest.checks.create(body);
	            checkRunId = createCheck.data.id;
	            core.info(`created a check run with the id of ${checkRunId}`);
	        } else {
	            core.info("updating a check run");
	            // add the existing check id
	            body.check_run_id = existingCheckRunId;

	            // update the check
	            const updateCheck = await octokit.rest.checks.update(body);
	            checkRunId = updateCheck.data.id;
	            core.info(`updated a check run with the id of ${checkRunId}`);
	        }
	        core.setOutput("check-run-id", checkRunId);

	        core.info("action was successful");

	        core.endGroup();
	    } catch (error) {
	        core.error(`Error ${error}, action did not succeed`);
	        core.endGroup();
	    }
	}

	run();
	return RichChecksClone;
}

var RichChecksCloneExports = requireRichChecksClone();
var index = /*@__PURE__*/getDefaultExportFromCjs(RichChecksCloneExports);

export { index as default };
//# sourceMappingURL=index.js.map

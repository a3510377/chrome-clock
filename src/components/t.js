window.JSCompiler_renameProperty = function (prop, obj) {
  return prop;
};
let microtaskCurrHandle = 0;
let microtaskLastHandle = 0;
let microtaskCallbacks = [];
let microtaskNodeContent = 0;
let microtaskNode = document.createTextNode("");
new window.MutationObserver(microtaskFlush).observe(microtaskNode, {
  characterData: true,
});
function microtaskFlush() {
  const len = microtaskCallbacks.length;
  for (let i = 0; i < len; i++) {
    let cb = microtaskCallbacks[i];
    if (cb) {
      try {
        cb();
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
  }
  microtaskCallbacks.splice(0, len);
  microtaskLastHandle += len;
}
const timeOut = {
  after(delay) {
    return {
      run(fn) {
        return window.setTimeout(fn, delay);
      },
      cancel(handle) {
        window.clearTimeout(handle);
      },
    };
  },
  run(fn, delay) {
    return window.setTimeout(fn, delay);
  },
  cancel(handle) {
    window.clearTimeout(handle);
  },
};
const animationFrame = {
  run(fn) {
    return window.requestAnimationFrame(fn);
  },
  cancel(handle) {
    window.cancelAnimationFrame(handle);
  },
};
const idlePeriod = {
  run(fn) {
    return window.requestIdleCallback
      ? window.requestIdleCallback(fn)
      : window.setTimeout(fn, 16);
  },
  cancel(handle) {
    window.cancelIdleCallback
      ? window.cancelIdleCallback(handle)
      : window.clearTimeout(handle);
  },
};
const microTask = {
  run(callback) {
    microtaskNode.textContent = microtaskNodeContent++;
    microtaskCallbacks.push(callback);
    return microtaskCurrHandle++;
  },
  cancel(handle) {
    const idx = handle - microtaskLastHandle;
    if (idx >= 0) {
      if (!microtaskCallbacks[idx]) {
        throw new Error("invalid async handle: " + handle);
      }
      microtaskCallbacks[idx] = null;
    }
  },
};
let dedupeId$1 = 0;
const dedupingMixin = function (mixin) {
  let mixinApplications = mixin.__mixinApplications;
  if (!mixinApplications) {
    mixinApplications = new WeakMap();
    mixin.__mixinApplications = mixinApplications;
  }
  let mixinDedupeId = dedupeId$1++;
  function dedupingMixin(base) {
    let baseSet = base.__mixinSet;
    if (baseSet && baseSet[mixinDedupeId]) {
      return base;
    }
    let map = mixinApplications;
    let extended = map.get(base);
    if (!extended) {
      extended = mixin(base);
      map.set(base, extended);
    }
    let mixinSet = Object.create(extended.__mixinSet || baseSet || null);
    mixinSet[mixinDedupeId] = true;
    extended.__mixinSet = mixinSet;
    return extended;
  }
  return dedupingMixin;
};
class Debouncer {
  constructor() {
    this._asyncModule = null;
    this._callback = null;
    this._timer = null;
  }
  setConfig(asyncModule, callback) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;
      debouncerQueue.delete(this);
      this._callback();
    });
  }
  cancel() {
    if (this.isActive()) {
      this._cancelAsync();
      debouncerQueue.delete(this);
    }
  }
  _cancelAsync() {
    if (this.isActive()) {
      this._asyncModule.cancel(this._timer);
      this._timer = null;
    }
  }
  flush() {
    if (this.isActive()) {
      this.cancel();
      this._callback();
    }
  }
  isActive() {
    return this._timer != null;
  }
  static debounce(debouncer, asyncModule, callback) {
    if (debouncer instanceof Debouncer) {
      debouncer._cancelAsync();
    } else {
      debouncer = new Debouncer();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }
}
let debouncerQueue = new Set();
const enqueueDebouncer = function (debouncer) {
  debouncerQueue.add(debouncer);
};
const flushDebouncers = function () {
  const didFlush = Boolean(debouncerQueue.size);
  debouncerQueue.forEach((debouncer) => {
    try {
      debouncer.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  });
  return didFlush;
};
let CSS_URL_RX = /(url\()([^)]*)(\))/g;
let ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
let workingURL;
let resolveDoc;
function resolveUrl(url, baseURI) {
  if (url && ABS_URL.test(url)) {
    return url;
  }
  if (workingURL === undefined) {
    workingURL = false;
    try {
      const u = new URL("b", "http://a");
      u.pathname = "c%20d";
      workingURL = u.href === "http://a/c%20d";
    } catch (e) {}
  }
  if (!baseURI) {
    baseURI = document.baseURI || window.location.href;
  }
  if (workingURL) {
    return new URL(url, baseURI).href;
  }
  if (!resolveDoc) {
    resolveDoc = document.implementation.createHTMLDocument("temp");
    resolveDoc.base = resolveDoc.createElement("base");
    resolveDoc.head.appendChild(resolveDoc.base);
    resolveDoc.anchor = resolveDoc.createElement("a");
    resolveDoc.body.appendChild(resolveDoc.anchor);
  }
  resolveDoc.base.href = baseURI;
  resolveDoc.anchor.href = url;
  return resolveDoc.anchor.href || url;
}
function resolveCss(cssText, baseURI) {
  return cssText.replace(CSS_URL_RX, function (m, pre, url, post) {
    return (
      pre + "'" + resolveUrl(url.replace(/["']/g, ""), baseURI) + "'" + post
    );
  });
}
function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf("/") + 1);
}
const useShadow = !window.ShadyDOM;
Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
let rootPath = pathFromUrl(document.baseURI || window.location.href);
let sanitizeDOMValue =
  (window.Polymer && window.Polymer.sanitizeDOMValue) || undefined;
let passiveTouchGestures = false;
let strictTemplatePolicy = false;
const wrap =
  window["ShadyDOM"] &&
  window["ShadyDOM"]["noPatch"] &&
  window["ShadyDOM"]["wrap"]
    ? window["ShadyDOM"]["wrap"]
    : (n) => n;
let HAS_NATIVE_TA = typeof document.head.style.touchAction === "string";
let GESTURE_KEY = "__polymerGestures";
let HANDLED_OBJ = "__polymerGesturesHandled";
let TOUCH_ACTION = "__polymerGesturesTouchAction";
let TAP_DISTANCE = 25;
let TRACK_DISTANCE = 5;
let TRACK_LENGTH = 2;
let MOUSE_TIMEOUT = 2500;
let MOUSE_EVENTS = ["mousedown", "mousemove", "mouseup", "click"];
let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
let MOUSE_HAS_BUTTONS = (function () {
  try {
    return new MouseEvent("test", { buttons: 1 }).buttons === 1;
  } catch (e) {
    return false;
  }
})();
function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
}
let SUPPORTS_PASSIVE = false;
(function () {
  try {
    let opts = Object.defineProperty({}, "passive", {
      get() {
        SUPPORTS_PASSIVE = true;
      },
    });
    window.addEventListener("test", null, opts);
    window.removeEventListener("test", null, opts);
  } catch (e) {}
})();
function PASSIVE_TOUCH(eventName) {
  if (isMouseEvent(eventName) || eventName === "touchend") {
    return;
  }
  if (HAS_NATIVE_TA && SUPPORTS_PASSIVE && passiveTouchGestures) {
    return { passive: true };
  } else {
    return;
  }
}
let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);
const clickedLabels = [];
const labellable = {
  button: true,
  input: true,
  keygen: true,
  meter: true,
  output: true,
  textarea: true,
  progress: true,
  select: true,
};
const canBeDisabled = {
  button: true,
  command: true,
  fieldset: true,
  input: true,
  keygen: true,
  optgroup: true,
  option: true,
  select: true,
  textarea: true,
};
function canBeLabelled(el) {
  return labellable[el.localName] || false;
}
function matchingLabels(el) {
  let labels = Array.prototype.slice.call(el.labels || []);
  if (!labels.length) {
    labels = [];
    let root = el.getRootNode();
    if (el.id) {
      let matching = root.querySelectorAll(`label[for = ${el.id}]`);
      for (let i = 0; i < matching.length; i++) {
        labels.push(matching[i]);
      }
    }
  }
  return labels;
}
let mouseCanceller = function (mouseEvent) {
  let sc = mouseEvent.sourceCapabilities;
  if (sc && !sc.firesTouchEvents) {
    return;
  }
  mouseEvent[HANDLED_OBJ] = { skip: true };
  if (mouseEvent.type === "click") {
    let clickFromLabel = false;
    let path = getComposedPath(mouseEvent);
    for (let i = 0; i < path.length; i++) {
      if (path[i].nodeType === Node.ELEMENT_NODE) {
        if (path[i].localName === "label") {
          clickedLabels.push(path[i]);
        } else if (canBeLabelled(path[i])) {
          let ownerLabels = matchingLabels(path[i]);
          for (let j = 0; j < ownerLabels.length; j++) {
            clickFromLabel =
              clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
          }
        }
      }
      if (path[i] === POINTERSTATE.mouse.target) {
        return;
      }
    }
    if (clickFromLabel) {
      return;
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
  }
};
function setupTeardownMouseCanceller(setup) {
  let events = IS_TOUCH_ONLY ? ["click"] : MOUSE_EVENTS;
  for (let i = 0, en; i < events.length; i++) {
    en = events[i];
    if (setup) {
      clickedLabels.length = 0;
      document.addEventListener(en, mouseCanceller, true);
    } else {
      document.removeEventListener(en, mouseCanceller, true);
    }
  }
}
function ignoreMouse(e) {
  if (!POINTERSTATE.mouse.mouseIgnoreJob) {
    setupTeardownMouseCanceller(true);
  }
  let unset = function () {
    setupTeardownMouseCanceller();
    POINTERSTATE.mouse.target = null;
    POINTERSTATE.mouse.mouseIgnoreJob = null;
  };
  POINTERSTATE.mouse.target = getComposedPath(e)[0];
  POINTERSTATE.mouse.mouseIgnoreJob = Debouncer.debounce(
    POINTERSTATE.mouse.mouseIgnoreJob,
    timeOut.after(MOUSE_TIMEOUT),
    unset
  );
}
function hasLeftMouseButton(ev) {
  let type = ev.type;
  if (!isMouseEvent(type)) {
    return false;
  }
  if (type === "mousemove") {
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;
    if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
      buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
    }
    return Boolean(buttons & 1);
  } else {
    let button = ev.button === undefined ? 0 : ev.button;
    return button === 0;
  }
}
function isSyntheticClick(ev) {
  if (ev.type === "click") {
    if (ev.detail === 0) {
      return true;
    }
    let t = _findOriginalTarget(ev);
    if (!t.nodeType || t.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    let bcr = t.getBoundingClientRect();
    let x = ev.pageX,
      y = ev.pageY;
    return !(
      x >= bcr.left &&
      x <= bcr.right &&
      y >= bcr.top &&
      y <= bcr.bottom
    );
  }
  return false;
}
let POINTERSTATE = {
  mouse: { target: null, mouseIgnoreJob: null },
  touch: { x: 0, y: 0, id: -1, scrollDecided: false },
};
function firstTouchAction(ev) {
  let ta = "auto";
  let path = getComposedPath(ev);
  for (let i = 0, n; i < path.length; i++) {
    n = path[i];
    if (n[TOUCH_ACTION]) {
      ta = n[TOUCH_ACTION];
      break;
    }
  }
  return ta;
}
function trackDocument(stateObj, movefn, upfn) {
  stateObj.movefn = movefn;
  stateObj.upfn = upfn;
  document.addEventListener("mousemove", movefn);
  document.addEventListener("mouseup", upfn);
}
function untrackDocument(stateObj) {
  document.removeEventListener("mousemove", stateObj.movefn);
  document.removeEventListener("mouseup", stateObj.upfn);
  stateObj.movefn = null;
  stateObj.upfn = null;
}
document.addEventListener(
  "touchend",
  ignoreMouse,
  SUPPORTS_PASSIVE ? { passive: true } : false
);
const getComposedPath =
  window.ShadyDOM && window.ShadyDOM.noPatch
    ? window.ShadyDOM.composedPath
    : (event) => (event.composedPath && event.composedPath()) || [];
const gestures = {};
const recognizers = [];
function deepTargetFind(x, y) {
  let node = document.elementFromPoint(x, y);
  let next = node;
  while (next && next.shadowRoot && !window.ShadyDOM) {
    let oldNext = next;
    next = next.shadowRoot.elementFromPoint(x, y);
    if (oldNext === next) {
      break;
    }
    if (next) {
      node = next;
    }
  }
  return node;
}
function _findOriginalTarget(ev) {
  const path = getComposedPath(ev);
  return path.length > 0 ? path[0] : ev.target;
}
function _handleNative(ev) {
  let handled;
  let type = ev.type;
  let node = ev.currentTarget;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    return;
  }
  let gs = gobj[type];
  if (!gs) {
    return;
  }
  if (!ev[HANDLED_OBJ]) {
    ev[HANDLED_OBJ] = {};
    if (type.slice(0, 5) === "touch") {
      ev = ev;
      let t = ev.changedTouches[0];
      if (type === "touchstart") {
        if (ev.touches.length === 1) {
          POINTERSTATE.touch.id = t.identifier;
        }
      }
      if (POINTERSTATE.touch.id !== t.identifier) {
        return;
      }
      if (!HAS_NATIVE_TA) {
        if (type === "touchstart" || type === "touchmove") {
          _handleTouchAction(ev);
        }
      }
    }
  }
  handled = ev[HANDLED_OBJ];
  if (handled.skip) {
    return;
  }
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
        r.reset();
      }
    }
  }
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      handled[r.name] = true;
      r[type](ev);
    }
  }
}
function _handleTouchAction(ev) {
  let t = ev.changedTouches[0];
  let type = ev.type;
  if (type === "touchstart") {
    POINTERSTATE.touch.x = t.clientX;
    POINTERSTATE.touch.y = t.clientY;
    POINTERSTATE.touch.scrollDecided = false;
  } else if (type === "touchmove") {
    if (POINTERSTATE.touch.scrollDecided) {
      return;
    }
    POINTERSTATE.touch.scrollDecided = true;
    let ta = firstTouchAction(ev);
    let shouldPrevent = false;
    let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
    let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
    if (!ev.cancelable);
    else if (ta === "none") {
      shouldPrevent = true;
    } else if (ta === "pan-x") {
      shouldPrevent = dy > dx;
    } else if (ta === "pan-y") {
      shouldPrevent = dx > dy;
    }
    if (shouldPrevent) {
      ev.preventDefault();
    } else {
      prevent("track");
    }
  }
}
function addListener(node, evType, handler) {
  if (gestures[evType]) {
    _add(node, evType, handler);
    return true;
  }
  return false;
}
function removeListener(node, evType, handler) {
  if (gestures[evType]) {
    _remove(node, evType, handler);
    return true;
  }
  return false;
}
function _add(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    node[GESTURE_KEY] = gobj = {};
  }
  for (let i = 0, dep, gd; i < deps.length; i++) {
    dep = deps[i];
    if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== "click") {
      continue;
    }
    gd = gobj[dep];
    if (!gd) {
      gobj[dep] = gd = { _count: 0 };
    }
    if (gd._count === 0) {
      node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
    }
    gd[name] = (gd[name] || 0) + 1;
    gd._count = (gd._count || 0) + 1;
  }
  node.addEventListener(evType, handler);
  if (recognizer.touchAction) {
    setTouchAction(node, recognizer.touchAction);
  }
}
function _remove(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (gobj) {
    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i];
      gd = gobj[dep];
      if (gd && gd[name]) {
        gd[name] = (gd[name] || 1) - 1;
        gd._count = (gd._count || 1) - 1;
        if (gd._count === 0) {
          node.removeEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
        }
      }
    }
  }
  node.removeEventListener(evType, handler);
}
function register$1(recog) {
  recognizers.push(recog);
  for (let i = 0; i < recog.emits.length; i++) {
    gestures[recog.emits[i]] = recog;
  }
}
function _findRecognizerByEvent(evName) {
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    for (let j = 0, n; j < r.emits.length; j++) {
      n = r.emits[j];
      if (n === evName) {
        return r;
      }
    }
  }
  return null;
}
function setTouchAction(node, value) {
  if (HAS_NATIVE_TA && node instanceof HTMLElement) {
    microTask.run(() => {
      node.style.touchAction = value;
    });
  }
  node[TOUCH_ACTION] = value;
}
function _fire(target, type, detail) {
  let ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
  ev.detail = detail;
  wrap(target).dispatchEvent(ev);
  if (ev.defaultPrevented) {
    let preventer = detail.preventer || detail.sourceEvent;
    if (preventer && preventer.preventDefault) {
      preventer.preventDefault();
    }
  }
}
function prevent(evName) {
  let recognizer = _findRecognizerByEvent(evName);
  if (recognizer.info) {
    recognizer.info.prevent = true;
  }
}
function resetMouseCanceller() {
  if (POINTERSTATE.mouse.mouseIgnoreJob) {
    POINTERSTATE.mouse.mouseIgnoreJob.flush();
  }
}
register$1({
  name: "downup",
  deps: ["mousedown", "touchstart", "touchend"],
  flow: { start: ["mousedown", "touchstart"], end: ["mouseup", "touchend"] },
  emits: ["down", "up"],
  info: { movefn: null, upfn: null },
  reset: function () {
    untrackDocument(this.info);
  },
  mousedown: function (e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      if (!hasLeftMouseButton(e)) {
        downupFire("up", t, e);
        untrackDocument(self.info);
      }
    };
    let upfn = function upfn(e) {
      if (hasLeftMouseButton(e)) {
        downupFire("up", t, e);
      }
      untrackDocument(self.info);
    };
    trackDocument(this.info, movefn, upfn);
    downupFire("down", t, e);
  },
  touchstart: function (e) {
    downupFire("down", _findOriginalTarget(e), e.changedTouches[0], e);
  },
  touchend: function (e) {
    downupFire("up", _findOriginalTarget(e), e.changedTouches[0], e);
  },
});
function downupFire(type, target, event, preventer) {
  if (!target) {
    return;
  }
  _fire(target, type, {
    x: event.clientX,
    y: event.clientY,
    sourceEvent: event,
    preventer: preventer,
    prevent: function (e) {
      return prevent(e);
    },
  });
}
register$1({
  name: "track",
  touchAction: "none",
  deps: ["mousedown", "touchstart", "touchmove", "touchend"],
  flow: { start: ["mousedown", "touchstart"], end: ["mouseup", "touchend"] },
  emits: ["track"],
  info: {
    x: 0,
    y: 0,
    state: "start",
    started: false,
    moves: [],
    addMove: function (move) {
      if (this.moves.length > TRACK_LENGTH) {
        this.moves.shift();
      }
      this.moves.push(move);
    },
    movefn: null,
    upfn: null,
    prevent: false,
  },
  reset: function () {
    this.info.state = "start";
    this.info.started = false;
    this.info.moves = [];
    this.info.x = 0;
    this.info.y = 0;
    this.info.prevent = false;
    untrackDocument(this.info);
  },
  mousedown: function (e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      let x = e.clientX,
        y = e.clientY;
      if (trackHasMovedEnough(self.info, x, y)) {
        self.info.state = self.info.started
          ? e.type === "mouseup"
            ? "end"
            : "track"
          : "start";
        if (self.info.state === "start") {
          prevent("tap");
        }
        self.info.addMove({ x: x, y: y });
        if (!hasLeftMouseButton(e)) {
          self.info.state = "end";
          untrackDocument(self.info);
        }
        if (t) {
          trackFire(self.info, t, e);
        }
        self.info.started = true;
      }
    };
    let upfn = function upfn(e) {
      if (self.info.started) {
        movefn(e);
      }
      untrackDocument(self.info);
    };
    trackDocument(this.info, movefn, upfn);
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },
  touchstart: function (e) {
    let ct = e.changedTouches[0];
    this.info.x = ct.clientX;
    this.info.y = ct.clientY;
  },
  touchmove: function (e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    let x = ct.clientX,
      y = ct.clientY;
    if (trackHasMovedEnough(this.info, x, y)) {
      if (this.info.state === "start") {
        prevent("tap");
      }
      this.info.addMove({ x: x, y: y });
      trackFire(this.info, t, ct);
      this.info.state = "track";
      this.info.started = true;
    }
  },
  touchend: function (e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    if (this.info.started) {
      this.info.state = "end";
      this.info.addMove({ x: ct.clientX, y: ct.clientY });
      trackFire(this.info, t, ct);
    }
  },
});
function trackHasMovedEnough(info, x, y) {
  if (info.prevent) {
    return false;
  }
  if (info.started) {
    return true;
  }
  let dx = Math.abs(info.x - x);
  let dy = Math.abs(info.y - y);
  return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
}
function trackFire(info, target, touch) {
  if (!target) {
    return;
  }
  let secondlast = info.moves[info.moves.length - 2];
  let lastmove = info.moves[info.moves.length - 1];
  let dx = lastmove.x - info.x;
  let dy = lastmove.y - info.y;
  let ddx,
    ddy = 0;
  if (secondlast) {
    ddx = lastmove.x - secondlast.x;
    ddy = lastmove.y - secondlast.y;
  }
  _fire(target, "track", {
    state: info.state,
    x: touch.clientX,
    y: touch.clientY,
    dx: dx,
    dy: dy,
    ddx: ddx,
    ddy: ddy,
    sourceEvent: touch,
    hover: function () {
      return deepTargetFind(touch.clientX, touch.clientY);
    },
  });
}
register$1({
  name: "tap",
  deps: ["mousedown", "click", "touchstart", "touchend"],
  flow: { start: ["mousedown", "touchstart"], end: ["click", "touchend"] },
  emits: ["tap"],
  info: { x: NaN, y: NaN, prevent: false },
  reset: function () {
    this.info.x = NaN;
    this.info.y = NaN;
    this.info.prevent = false;
  },
  mousedown: function (e) {
    if (hasLeftMouseButton(e)) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    }
  },
  click: function (e) {
    if (hasLeftMouseButton(e)) {
      trackForward(this.info, e);
    }
  },
  touchstart: function (e) {
    const touch = e.changedTouches[0];
    this.info.x = touch.clientX;
    this.info.y = touch.clientY;
  },
  touchend: function (e) {
    trackForward(this.info, e.changedTouches[0], e);
  },
});
function trackForward(info, e, preventer) {
  let dx = Math.abs(e.clientX - info.x);
  let dy = Math.abs(e.clientY - info.y);
  let t = _findOriginalTarget(preventer || e);
  if (!t || (canBeDisabled[t.localName] && t.hasAttribute("disabled"))) {
    return;
  }
  if (
    isNaN(dx) ||
    isNaN(dy) ||
    (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) ||
    isSyntheticClick(e)
  ) {
    if (!info.prevent) {
      _fire(t, "tap", {
        x: e.clientX,
        y: e.clientY,
        sourceEvent: e,
        preventer: preventer,
      });
    }
  }
}
const findOriginalTarget = _findOriginalTarget;
const add = addListener;
const remove = removeListener;
var gestures$1 = Object.freeze({
  __proto__: null,
  gestures: gestures,
  recognizers: recognizers,
  deepTargetFind: deepTargetFind,
  addListener: addListener,
  removeListener: removeListener,
  register: register$1,
  setTouchAction: setTouchAction,
  prevent: prevent,
  resetMouseCanceller: resetMouseCanceller,
  findOriginalTarget: findOriginalTarget,
  add: add,
  remove: remove,
});
let modules = {};
let lcModules = {};
function setModule(id, module) {
  modules[id] = lcModules[id.toLowerCase()] = module;
}
function findModule(id) {
  return modules[id] || lcModules[id.toLowerCase()];
}
function styleOutsideTemplateCheck(inst) {
  if (inst.querySelector("style")) {
    console.warn("dom-module %s has style outside template", inst.id);
  }
}
class DomModule extends HTMLElement {
  static get observedAttributes() {
    return ["id"];
  }
  static import(id, selector) {
    if (id) {
      let m = findModule(id);
      if (m && selector) {
        return m.querySelector(selector);
      }
      return m;
    }
    return null;
  }
  attributeChangedCallback(name, old, value, namespace) {
    if (old !== value) {
      this.register();
    }
  }
  get assetpath() {
    if (!this.__assetpath) {
      const owner =
        window.HTMLImports && HTMLImports.importForElement
          ? HTMLImports.importForElement(this) || document
          : this.ownerDocument;
      const url = resolveUrl(
        this.getAttribute("assetpath") || "",
        owner.baseURI
      );
      this.__assetpath = pathFromUrl(url);
    }
    return this.__assetpath;
  }
  register(id) {
    id = id || this.id;
    if (id) {
      this.id = id;
      setModule(id, this);
      styleOutsideTemplateCheck(this);
    }
  }
}
DomModule.prototype["modules"] = modules;
customElements.define("dom-module", DomModule);
const MODULE_STYLE_LINK_SELECTOR = "link[rel=import][type~=css]";
const INCLUDE_ATTR = "include";
const SHADY_UNSCOPED_ATTR = "shady-unscoped";
function importModule(moduleId) {
  return DomModule.import(moduleId);
}
function styleForImport(importDoc) {
  let container = importDoc.body ? importDoc.body : importDoc;
  const importCss = resolveCss(container.textContent, importDoc.baseURI);
  const style = document.createElement("style");
  style.textContent = importCss;
  return style;
}
function stylesFromModules(moduleIds) {
  const modules = moduleIds.trim().split(/\s+/);
  const styles = [];
  for (let i = 0; i < modules.length; i++) {
    styles.push(...stylesFromModule(modules[i]));
  }
  return styles;
}
function stylesFromModule(moduleId) {
  const m = importModule(moduleId);
  if (!m) {
    console.warn("Could not find style data in module named", moduleId);
    return [];
  }
  if (m._styles === undefined) {
    const styles = [];
    styles.push(..._stylesFromModuleImports(m));
    const template = m.querySelector("template");
    if (template) {
      styles.push(...stylesFromTemplate(template, m.assetpath));
    }
    m._styles = styles;
  }
  return m._styles;
}
function stylesFromTemplate(template, baseURI) {
  if (!template._styles) {
    const styles = [];
    const e$ = template.content.querySelectorAll("style");
    for (let i = 0; i < e$.length; i++) {
      let e = e$[i];
      let include = e.getAttribute(INCLUDE_ATTR);
      if (include) {
        styles.push(
          ...stylesFromModules(include).filter(function (item, index, self) {
            return self.indexOf(item) === index;
          })
        );
      }
      if (baseURI) {
        e.textContent = resolveCss(e.textContent, baseURI);
      }
      styles.push(e);
    }
    template._styles = styles;
  }
  return template._styles;
}
function stylesFromModuleImports(moduleId) {
  let m = importModule(moduleId);
  return m ? _stylesFromModuleImports(m) : [];
}
function _stylesFromModuleImports(module) {
  const styles = [];
  const p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);
  for (let i = 0; i < p$.length; i++) {
    let p = p$[i];
    if (p.import) {
      const importDoc = p.import;
      const unscoped = p.hasAttribute(SHADY_UNSCOPED_ATTR);
      if (unscoped && !importDoc._unscopedStyle) {
        const style = styleForImport(importDoc);
        style.setAttribute(SHADY_UNSCOPED_ATTR, "");
        importDoc._unscopedStyle = style;
      } else if (!importDoc._style) {
        importDoc._style = styleForImport(importDoc);
      }
      styles.push(unscoped ? importDoc._unscopedStyle : importDoc._style);
    }
  }
  return styles;
}
function cssFromModules(moduleIds) {
  let modules = moduleIds.trim().split(/\s+/);
  let cssText = "";
  for (let i = 0; i < modules.length; i++) {
    cssText += cssFromModule(modules[i]);
  }
  return cssText;
}
function cssFromModule(moduleId) {
  let m = importModule(moduleId);
  if (m && m._cssText === undefined) {
    let cssText = _cssFromModuleImports(m);
    let t = m.querySelector("template");
    if (t) {
      cssText += cssFromTemplate(t, m.assetpath);
    }
    m._cssText = cssText || null;
  }
  if (!m) {
    console.warn("Could not find style data in module named", moduleId);
  }
  return (m && m._cssText) || "";
}
function cssFromTemplate(template, baseURI) {
  let cssText = "";
  const e$ = stylesFromTemplate(template, baseURI);
  for (let i = 0; i < e$.length; i++) {
    let e = e$[i];
    if (e.parentNode) {
      e.parentNode.removeChild(e);
    }
    cssText += e.textContent;
  }
  return cssText;
}
function _cssFromModuleImports(module) {
  let cssText = "";
  let styles = _stylesFromModuleImports(module);
  for (let i = 0; i < styles.length; i++) {
    cssText += styles[i].textContent;
  }
  return cssText;
}
function isPath(path) {
  return path.indexOf(".") >= 0;
}
function root(path) {
  let dotIndex = path.indexOf(".");
  if (dotIndex === -1) {
    return path;
  }
  return path.slice(0, dotIndex);
}
function isAncestor(base, path) {
  return base.indexOf(path + ".") === 0;
}
function isDescendant(base, path) {
  return path.indexOf(base + ".") === 0;
}
function translate(base, newBase, path) {
  return newBase + path.slice(base.length);
}
function matches(base, path) {
  return base === path || isAncestor(base, path) || isDescendant(base, path);
}
function normalize(path) {
  if (Array.isArray(path)) {
    let parts = [];
    for (let i = 0; i < path.length; i++) {
      let args = path[i].toString().split(".");
      for (let j = 0; j < args.length; j++) {
        parts.push(args[j]);
      }
    }
    return parts.join(".");
  } else {
    return path;
  }
}
function split(path) {
  if (Array.isArray(path)) {
    return normalize(path).split(".");
  }
  return path.toString().split(".");
}
function get(root, path, info) {
  let prop = root;
  let parts = split(path);
  for (let i = 0; i < parts.length; i++) {
    if (!prop) {
      return;
    }
    let part = parts[i];
    prop = prop[part];
  }
  if (info) {
    info.path = parts.join(".");
  }
  return prop;
}
function set(root, path, value) {
  let prop = root;
  let parts = split(path);
  let last = parts[parts.length - 1];
  if (parts.length > 1) {
    for (let i = 0; i < parts.length - 1; i++) {
      let part = parts[i];
      prop = prop[part];
      if (!prop) {
        return;
      }
    }
    prop[last] = value;
  } else {
    prop[path] = value;
  }
  return parts.join(".");
}
const caseMap = {};
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;
function dashToCamelCase(dash) {
  return (
    caseMap[dash] ||
    (caseMap[dash] =
      dash.indexOf("-") < 0
        ? dash
        : dash.replace(DASH_TO_CAMEL, (m) => m[1].toUpperCase()))
  );
}
function camelToDashCase(camel) {
  return (
    caseMap[camel] ||
    (caseMap[camel] = camel.replace(CAMEL_TO_DASH, "-$1").toLowerCase())
  );
}
const microtask = microTask;
const PropertiesChanged = dedupingMixin((superClass) => {
  class PropertiesChanged extends superClass {
    static createProperties(props) {
      const proto = this.prototype;
      for (let prop in props) {
        if (!(prop in proto)) {
          proto._createPropertyAccessor(prop);
        }
      }
    }
    static attributeNameForProperty(property) {
      return property.toLowerCase();
    }
    static typeForProperty(name) {}
    _createPropertyAccessor(property, readOnly) {
      this._addPropertyToAttributeMap(property);
      if (!this.hasOwnProperty("__dataHasAccessor")) {
        this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor);
      }
      if (!this.__dataHasAccessor[property]) {
        this.__dataHasAccessor[property] = true;
        this._definePropertyAccessor(property, readOnly);
      }
    }
    _addPropertyToAttributeMap(property) {
      if (!this.hasOwnProperty("__dataAttributes")) {
        this.__dataAttributes = Object.assign({}, this.__dataAttributes);
      }
      if (!this.__dataAttributes[property]) {
        const attr = this.constructor.attributeNameForProperty(property);
        this.__dataAttributes[attr] = property;
      }
    }
    _definePropertyAccessor(property, readOnly) {
      Object.defineProperty(this, property, {
        get() {
          return this._getProperty(property);
        },
        set: readOnly
          ? function () {}
          : function (value) {
              this._setProperty(property, value);
            },
      });
    }
    constructor() {
      super();
      this.__dataEnabled = false;
      this.__dataReady = false;
      this.__dataInvalid = false;
      this.__data = {};
      this.__dataPending = null;
      this.__dataOld = null;
      this.__dataInstanceProps = null;
      this.__serializing = false;
      this._initializeProperties();
    }
    ready() {
      this.__dataReady = true;
      this._flushProperties();
    }
    _initializeProperties() {
      for (let p in this.__dataHasAccessor) {
        if (this.hasOwnProperty(p)) {
          this.__dataInstanceProps = this.__dataInstanceProps || {};
          this.__dataInstanceProps[p] = this[p];
          delete this[p];
        }
      }
    }
    _initializeInstanceProperties(props) {
      Object.assign(this, props);
    }
    _setProperty(property, value) {
      if (this._setPendingProperty(property, value)) {
        this._invalidateProperties();
      }
    }
    _getProperty(property) {
      return this.__data[property];
    }
    _setPendingProperty(property, value, ext) {
      let old = this.__data[property];
      let changed = this._shouldPropertyChange(property, value, old);
      if (changed) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        }
        if (this.__dataOld && !(property in this.__dataOld)) {
          this.__dataOld[property] = old;
        }
        this.__data[property] = value;
        this.__dataPending[property] = value;
      }
      return changed;
    }
    _invalidateProperties() {
      if (!this.__dataInvalid && this.__dataReady) {
        this.__dataInvalid = true;
        microtask.run(() => {
          if (this.__dataInvalid) {
            this.__dataInvalid = false;
            this._flushProperties();
          }
        });
      }
    }
    _enableProperties() {
      if (!this.__dataEnabled) {
        this.__dataEnabled = true;
        if (this.__dataInstanceProps) {
          this._initializeInstanceProperties(this.__dataInstanceProps);
          this.__dataInstanceProps = null;
        }
        this.ready();
      }
    }
    _flushProperties() {
      const props = this.__data;
      const changedProps = this.__dataPending;
      const old = this.__dataOld;
      if (this._shouldPropertiesChange(props, changedProps, old)) {
        this.__dataPending = null;
        this.__dataOld = null;
        this._propertiesChanged(props, changedProps, old);
      }
    }
    _shouldPropertiesChange(currentProps, changedProps, oldProps) {
      return Boolean(changedProps);
    }
    _propertiesChanged(currentProps, changedProps, oldProps) {}
    _shouldPropertyChange(property, value, old) {
      return old !== value && (old === old || value === value);
    }
    attributeChangedCallback(name, old, value, namespace) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, old, value, namespace);
      }
    }
    _attributeToProperty(attribute, value, type) {
      if (!this.__serializing) {
        const map = this.__dataAttributes;
        const property = (map && map[attribute]) || attribute;
        this[property] = this._deserializeValue(
          value,
          type || this.constructor.typeForProperty(property)
        );
      }
    }
    _propertyToAttribute(property, attribute, value) {
      this.__serializing = true;
      value = arguments.length < 3 ? this[property] : value;
      this._valueToNodeAttribute(
        this,
        value,
        attribute || this.constructor.attributeNameForProperty(property)
      );
      this.__serializing = false;
    }
    _valueToNodeAttribute(node, value, attribute) {
      const str = this._serializeValue(value);
      if (str === undefined) {
        node.removeAttribute(attribute);
      } else {
        if (
          attribute === "class" ||
          attribute === "name" ||
          attribute === "slot"
        ) {
          node = wrap(node);
        }
        node.setAttribute(attribute, str);
      }
    }
    _serializeValue(value) {
      switch (typeof value) {
        case "boolean":
          return value ? "" : undefined;
        default:
          return value != null ? value.toString() : undefined;
      }
    }
    _deserializeValue(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;
        case Number:
          return Number(value);
        default:
          return value;
      }
    }
  }
  return PropertiesChanged;
});
const nativeProperties = {};
let proto = HTMLElement.prototype;
while (proto) {
  let props = Object.getOwnPropertyNames(proto);
  for (let i = 0; i < props.length; i++) {
    nativeProperties[props[i]] = true;
  }
  proto = Object.getPrototypeOf(proto);
}
function saveAccessorValue(model, property) {
  if (!nativeProperties[property]) {
    let value = model[property];
    if (value !== undefined) {
      if (model.__data) {
        model._setPendingProperty(property, value);
      } else {
        if (!model.__dataProto) {
          model.__dataProto = {};
        } else if (
          !model.hasOwnProperty(JSCompiler_renameProperty("__dataProto", model))
        ) {
          model.__dataProto = Object.create(model.__dataProto);
        }
        model.__dataProto[property] = value;
      }
    }
  }
}
const PropertyAccessors = dedupingMixin((superClass) => {
  const base = PropertiesChanged(superClass);
  class PropertyAccessors extends base {
    static createPropertiesForAttributes() {
      let a$ = this.observedAttributes;
      for (let i = 0; i < a$.length; i++) {
        this.prototype._createPropertyAccessor(dashToCamelCase(a$[i]));
      }
    }
    static attributeNameForProperty(property) {
      return camelToDashCase(property);
    }
    _initializeProperties() {
      if (this.__dataProto) {
        this._initializeProtoProperties(this.__dataProto);
        this.__dataProto = null;
      }
      super._initializeProperties();
    }
    _initializeProtoProperties(props) {
      for (let p in props) {
        this._setProperty(p, props[p]);
      }
    }
    _ensureAttribute(attribute, value) {
      const el = this;
      if (!el.hasAttribute(attribute)) {
        this._valueToNodeAttribute(el, value, attribute);
      }
    }
    _serializeValue(value) {
      switch (typeof value) {
        case "object":
          if (value instanceof Date) {
            return value.toString();
          } else if (value) {
            try {
              return JSON.stringify(value);
            } catch (x) {
              return "";
            }
          }
        default:
          return super._serializeValue(value);
      }
    }
    _deserializeValue(value, type) {
      let outValue;
      switch (type) {
        case Object:
          try {
            outValue = JSON.parse(value);
          } catch (x) {
            outValue = value;
          }
          break;
        case Array:
          try {
            outValue = JSON.parse(value);
          } catch (x) {
            outValue = null;
            console.warn(
              `Polymer::Attributes: couldn't decode Array as JSON: ${value}`
            );
          }
          break;
        case Date:
          outValue = isNaN(value) ? String(value) : Number(value);
          outValue = new Date(outValue);
          break;
        default:
          outValue = super._deserializeValue(value, type);
          break;
      }
      return outValue;
    }
    _definePropertyAccessor(property, readOnly) {
      saveAccessorValue(this, property);
      super._definePropertyAccessor(property, readOnly);
    }
    _hasAccessor(property) {
      return this.__dataHasAccessor && this.__dataHasAccessor[property];
    }
    _isPropertyPending(prop) {
      return Boolean(this.__dataPending && prop in this.__dataPending);
    }
  }
  return PropertyAccessors;
});
const walker = document.createTreeWalker(
  document,
  NodeFilter.SHOW_ALL,
  null,
  false
);
const templateExtensions = { "dom-if": true, "dom-repeat": true };
function wrapTemplateExtension(node) {
  let is = node.getAttribute("is");
  if (is && templateExtensions[is]) {
    let t = node;
    t.removeAttribute("is");
    node = t.ownerDocument.createElement(is);
    t.parentNode.replaceChild(node, t);
    node.appendChild(t);
    while (t.attributes.length) {
      node.setAttribute(t.attributes[0].name, t.attributes[0].value);
      t.removeAttribute(t.attributes[0].name);
    }
  }
  return node;
}
function findTemplateNode(root, nodeInfo) {
  let parent =
    nodeInfo.parentInfo && findTemplateNode(root, nodeInfo.parentInfo);
  if (parent) {
    walker.currentNode = parent;
    for (let n = walker.firstChild(), i = 0; n; n = walker.nextSibling()) {
      if (nodeInfo.parentIndex === i++) {
        return n;
      }
    }
  } else {
    return root;
  }
}
function applyIdToMap(inst, map, node, nodeInfo) {
  if (nodeInfo.id) {
    map[nodeInfo.id] = node;
  }
}
function applyEventListener(inst, node, nodeInfo) {
  if (nodeInfo.events && nodeInfo.events.length) {
    for (
      let j = 0, e$ = nodeInfo.events, e;
      j < e$.length && (e = e$[j]);
      j++
    ) {
      inst._addMethodEventListenerToNode(node, e.name, e.value, inst);
    }
  }
}
function applyTemplateContent(inst, node, nodeInfo) {
  if (nodeInfo.templateInfo) {
    node._templateInfo = nodeInfo.templateInfo;
  }
}
function createNodeEventHandler(context, eventName, methodName) {
  context = context._methodHost || context;
  let handler = function (e) {
    if (context[methodName]) {
      context[methodName](e, e.detail);
    } else {
      console.warn("listener method `" + methodName + "` not defined");
    }
  };
  return handler;
}
const TemplateStamp = dedupingMixin((superClass) => {
  class TemplateStamp extends superClass {
    static _parseTemplate(template, outerTemplateInfo) {
      if (!template._templateInfo) {
        let templateInfo = (template._templateInfo = {});
        templateInfo.nodeInfoList = [];
        templateInfo.stripWhiteSpace = true;
        this._parseTemplateContent(template, templateInfo, { parent: null });
      }
      return template._templateInfo;
    }
    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      return this._parseTemplateNode(template.content, templateInfo, nodeInfo);
    }
    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      let noted;
      let element = node;
      if (
        element.localName == "template" &&
        !element.hasAttribute("preserve-content")
      ) {
        noted =
          this._parseTemplateNestedTemplate(element, templateInfo, nodeInfo) ||
          noted;
      } else if (element.localName === "slot") {
        templateInfo.hasInsertionPoint = true;
      }
      walker.currentNode = element;
      if (walker.firstChild()) {
        noted =
          this._parseTemplateChildNodes(element, templateInfo, nodeInfo) ||
          noted;
      }
      if (element.hasAttributes && element.hasAttributes()) {
        noted =
          this._parseTemplateNodeAttributes(element, templateInfo, nodeInfo) ||
          noted;
      }
      return noted;
    }
    static _parseTemplateChildNodes(root, templateInfo, nodeInfo) {
      if (root.localName === "script" || root.localName === "style") {
        return;
      }
      walker.currentNode = root;
      for (
        let node = walker.firstChild(), parentIndex = 0, next;
        node;
        node = next
      ) {
        if (node.localName == "template") {
          node = wrapTemplateExtension(node);
        }
        walker.currentNode = node;
        next = walker.nextSibling();
        if (node.nodeType === Node.TEXT_NODE) {
          let n = next;
          while (n && n.nodeType === Node.TEXT_NODE) {
            node.textContent += n.textContent;
            next = walker.nextSibling();
            root.removeChild(n);
            n = next;
          }
          if (templateInfo.stripWhiteSpace && !node.textContent.trim()) {
            root.removeChild(node);
            continue;
          }
        }
        let childInfo = { parentIndex: parentIndex, parentInfo: nodeInfo };
        if (this._parseTemplateNode(node, templateInfo, childInfo)) {
          childInfo.infoIndex = templateInfo.nodeInfoList.push(childInfo) - 1;
        }
        walker.currentNode = node;
        if (walker.parentNode()) {
          parentIndex++;
        }
      }
    }
    static _parseTemplateNestedTemplate(node, outerTemplateInfo, nodeInfo) {
      let templateInfo = this._parseTemplate(node, outerTemplateInfo);
      let content = (templateInfo.content =
        node.content.ownerDocument.createDocumentFragment());
      content.appendChild(node.content);
      nodeInfo.templateInfo = templateInfo;
      return true;
    }
    static _parseTemplateNodeAttributes(node, templateInfo, nodeInfo) {
      let noted = false;
      let attrs = Array.from(node.attributes);
      for (let i = attrs.length - 1, a; (a = attrs[i]); i--) {
        noted =
          this._parseTemplateNodeAttribute(
            node,
            templateInfo,
            nodeInfo,
            a.name,
            a.value
          ) || noted;
      }
      return noted;
    }
    static _parseTemplateNodeAttribute(
      node,
      templateInfo,
      nodeInfo,
      name,
      value
    ) {
      if (name.slice(0, 3) === "on-") {
        node.removeAttribute(name);
        nodeInfo.events = nodeInfo.events || [];
        nodeInfo.events.push({ name: name.slice(3), value: value });
        return true;
      } else if (name === "id") {
        nodeInfo.id = value;
        return true;
      }
      return false;
    }
    static _contentForTemplate(template) {
      let templateInfo = template._templateInfo;
      return (templateInfo && templateInfo.content) || template.content;
    }
    _stampTemplate(template) {
      if (
        template &&
        !template.content &&
        window.HTMLTemplateElement &&
        HTMLTemplateElement.decorate
      ) {
        HTMLTemplateElement.decorate(template);
      }
      let templateInfo = this.constructor._parseTemplate(template);
      let nodeInfo = templateInfo.nodeInfoList;
      let content = templateInfo.content || template.content;
      let dom = document.importNode(content, true);
      dom.__noInsertionPoint = !templateInfo.hasInsertionPoint;
      let nodes = (dom.nodeList = new Array(nodeInfo.length));
      dom.$ = {};
      for (
        let i = 0, l = nodeInfo.length, info;
        i < l && (info = nodeInfo[i]);
        i++
      ) {
        let node = (nodes[i] = findTemplateNode(dom, info));
        applyIdToMap(this, dom.$, node, info);
        applyTemplateContent(this, node, info);
        applyEventListener(this, node, info);
      }
      dom = dom;
      return dom;
    }
    _addMethodEventListenerToNode(node, eventName, methodName, context) {
      context = context || node;
      let handler = createNodeEventHandler(context, eventName, methodName);
      this._addEventListenerToNode(node, eventName, handler);
      return handler;
    }
    _addEventListenerToNode(node, eventName, handler) {
      node.addEventListener(eventName, handler);
    }
    _removeEventListenerFromNode(node, eventName, handler) {
      node.removeEventListener(eventName, handler);
    }
  }
  return TemplateStamp;
});
let dedupeId = 0;
const TYPES = {
  COMPUTE: "__computeEffects",
  REFLECT: "__reflectEffects",
  NOTIFY: "__notifyEffects",
  PROPAGATE: "__propagateEffects",
  OBSERVE: "__observeEffects",
  READ_ONLY: "__readOnly",
};
const capitalAttributeRegex = /[A-Z]/;
function ensureOwnEffectMap(model, type) {
  let effects = model[type];
  if (!effects) {
    effects = model[type] = {};
  } else if (!model.hasOwnProperty(type)) {
    effects = model[type] = Object.create(model[type]);
    for (let p in effects) {
      let protoFx = effects[p];
      let instFx = (effects[p] = Array(protoFx.length));
      for (let i = 0; i < protoFx.length; i++) {
        instFx[i] = protoFx[i];
      }
    }
  }
  return effects;
}
function runEffects(inst, effects, props, oldProps, hasPaths, extraArgs) {
  if (effects) {
    let ran = false;
    let id = dedupeId++;
    for (let prop in props) {
      if (
        runEffectsForProperty(
          inst,
          effects,
          id,
          prop,
          props,
          oldProps,
          hasPaths,
          extraArgs
        )
      ) {
        ran = true;
      }
    }
    return ran;
  }
  return false;
}
function runEffectsForProperty(
  inst,
  effects,
  dedupeId,
  prop,
  props,
  oldProps,
  hasPaths,
  extraArgs
) {
  let ran = false;
  let rootProperty = hasPaths ? root(prop) : prop;
  let fxs = effects[rootProperty];
  if (fxs) {
    for (let i = 0, l = fxs.length, fx; i < l && (fx = fxs[i]); i++) {
      if (
        (!fx.info || fx.info.lastRun !== dedupeId) &&
        (!hasPaths || pathMatchesTrigger(prop, fx.trigger))
      ) {
        if (fx.info) {
          fx.info.lastRun = dedupeId;
        }
        fx.fn(inst, prop, props, oldProps, fx.info, hasPaths, extraArgs);
        ran = true;
      }
    }
  }
  return ran;
}
function pathMatchesTrigger(path, trigger) {
  if (trigger) {
    let triggerPath = trigger.name;
    return (
      triggerPath == path ||
      !!(trigger.structured && isAncestor(triggerPath, path)) ||
      !!(trigger.wildcard && isDescendant(triggerPath, path))
    );
  } else {
    return true;
  }
}
function runObserverEffect(inst, property, props, oldProps, info) {
  let fn = typeof info.method === "string" ? inst[info.method] : info.method;
  let changedProp = info.property;
  if (fn) {
    fn.call(inst, inst.__data[changedProp], oldProps[changedProp]);
  } else if (!info.dynamicFn) {
    console.warn("observer method `" + info.method + "` not defined");
  }
}
function runNotifyEffects(inst, notifyProps, props, oldProps, hasPaths) {
  let fxs = inst[TYPES.NOTIFY];
  let notified;
  let id = dedupeId++;
  for (let prop in notifyProps) {
    if (notifyProps[prop]) {
      if (
        fxs &&
        runEffectsForProperty(inst, fxs, id, prop, props, oldProps, hasPaths)
      ) {
        notified = true;
      } else if (hasPaths && notifyPath(inst, prop, props)) {
        notified = true;
      }
    }
  }
  let host;
  if (notified && (host = inst.__dataHost) && host._invalidateProperties) {
    host._invalidateProperties();
  }
}
function notifyPath(inst, path, props) {
  let rootProperty = root(path);
  if (rootProperty !== path) {
    let eventName = camelToDashCase(rootProperty) + "-changed";
    dispatchNotifyEvent(inst, eventName, props[path], path);
    return true;
  }
  return false;
}
function dispatchNotifyEvent(inst, eventName, value, path) {
  let detail = { value: value, queueProperty: true };
  if (path) {
    detail.path = path;
  }
  wrap(inst).dispatchEvent(new CustomEvent(eventName, { detail: detail }));
}
function runNotifyEffect(inst, property, props, oldProps, info, hasPaths) {
  let rootProperty = hasPaths ? root(property) : property;
  let path = rootProperty != property ? property : null;
  let value = path ? get(inst, path) : inst.__data[property];
  if (path && value === undefined) {
    value = props[property];
  }
  dispatchNotifyEvent(inst, info.eventName, value, path);
}
function handleNotification(event, inst, fromProp, toPath, negate) {
  let value;
  let detail = event.detail;
  let fromPath = detail && detail.path;
  if (fromPath) {
    toPath = translate(fromProp, toPath, fromPath);
    value = detail && detail.value;
  } else {
    value = event.currentTarget[fromProp];
  }
  value = negate ? !value : value;
  if (!inst[TYPES.READ_ONLY] || !inst[TYPES.READ_ONLY][toPath]) {
    if (
      inst._setPendingPropertyOrPath(toPath, value, true, Boolean(fromPath)) &&
      (!detail || !detail.queueProperty)
    ) {
      inst._invalidateProperties();
    }
  }
}
function runReflectEffect(inst, property, props, oldProps, info) {
  let value = inst.__data[property];
  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, info.attrName, "attribute", inst);
  }
  inst._propertyToAttribute(property, info.attrName, value);
}
function runComputedEffects(inst, changedProps, oldProps, hasPaths) {
  let computeEffects = inst[TYPES.COMPUTE];
  if (computeEffects) {
    let inputProps = changedProps;
    while (runEffects(inst, computeEffects, inputProps, oldProps, hasPaths)) {
      Object.assign(oldProps, inst.__dataOld);
      Object.assign(changedProps, inst.__dataPending);
      inputProps = inst.__dataPending;
      inst.__dataPending = null;
    }
  }
}
function runComputedEffect(inst, property, props, oldProps, info) {
  let result = runMethodEffect(inst, property, props, oldProps, info);
  let computedProp = info.methodInfo;
  if (inst.__dataHasAccessor && inst.__dataHasAccessor[computedProp]) {
    inst._setPendingProperty(computedProp, result, true);
  } else {
    inst[computedProp] = result;
  }
}
function computeLinkedPaths(inst, path, value) {
  let links = inst.__dataLinkedPaths;
  if (links) {
    let link;
    for (let a in links) {
      let b = links[a];
      if (isDescendant(a, path)) {
        link = translate(a, b, path);
        inst._setPendingPropertyOrPath(link, value, true, true);
      } else if (isDescendant(b, path)) {
        link = translate(b, a, path);
        inst._setPendingPropertyOrPath(link, value, true, true);
      }
    }
  }
}
function addBinding(
  constructor,
  templateInfo,
  nodeInfo,
  kind,
  target,
  parts,
  literal
) {
  nodeInfo.bindings = nodeInfo.bindings || [];
  let binding = {
    kind: kind,
    target: target,
    parts: parts,
    literal: literal,
    isCompound: parts.length !== 1,
  };
  nodeInfo.bindings.push(binding);
  if (shouldAddListener(binding)) {
    let { event: event, negate: negate } = binding.parts[0];
    binding.listenerEvent = event || camelToDashCase(target) + "-changed";
    binding.listenerNegate = negate;
  }
  let index = templateInfo.nodeInfoList.length;
  for (let i = 0; i < binding.parts.length; i++) {
    let part = binding.parts[i];
    part.compoundIndex = i;
    addEffectForBindingPart(constructor, templateInfo, binding, part, index);
  }
}
function addEffectForBindingPart(
  constructor,
  templateInfo,
  binding,
  part,
  index
) {
  if (!part.literal) {
    if (binding.kind === "attribute" && binding.target[0] === "-") {
      console.warn(
        "Cannot set attribute " +
          binding.target +
          ' because "-" is not a valid attribute starting character'
      );
    } else {
      let dependencies = part.dependencies;
      let info = {
        index: index,
        binding: binding,
        part: part,
        evaluator: constructor,
      };
      for (let j = 0; j < dependencies.length; j++) {
        let trigger = dependencies[j];
        if (typeof trigger == "string") {
          trigger = parseArg(trigger);
          trigger.wildcard = true;
        }
        constructor._addTemplatePropertyEffect(
          templateInfo,
          trigger.rootProperty,
          { fn: runBindingEffect, info: info, trigger: trigger }
        );
      }
    }
  }
}
function runBindingEffect(
  inst,
  path,
  props,
  oldProps,
  info,
  hasPaths,
  nodeList
) {
  let node = nodeList[info.index];
  let binding = info.binding;
  let part = info.part;
  if (
    hasPaths &&
    part.source &&
    path.length > part.source.length &&
    binding.kind == "property" &&
    !binding.isCompound &&
    node.__isPropertyEffectsClient &&
    node.__dataHasAccessor &&
    node.__dataHasAccessor[binding.target]
  ) {
    let value = props[path];
    path = translate(part.source, binding.target, path);
    if (node._setPendingPropertyOrPath(path, value, false, true)) {
      inst._enqueueClient(node);
    }
  } else {
    let value = info.evaluator._evaluateBinding(
      inst,
      part,
      path,
      props,
      oldProps,
      hasPaths
    );
    applyBindingValue(inst, node, binding, part, value);
  }
}
function applyBindingValue(inst, node, binding, part, value) {
  value = computeBindingValue(node, value, binding, part);
  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, binding.target, binding.kind, node);
  }
  if (binding.kind == "attribute") {
    inst._valueToNodeAttribute(node, value, binding.target);
  } else {
    let prop = binding.target;
    if (
      node.__isPropertyEffectsClient &&
      node.__dataHasAccessor &&
      node.__dataHasAccessor[prop]
    ) {
      if (!node[TYPES.READ_ONLY] || !node[TYPES.READ_ONLY][prop]) {
        if (node._setPendingProperty(prop, value)) {
          inst._enqueueClient(node);
        }
      }
    } else {
      inst._setUnmanagedPropertyToNode(node, prop, value);
    }
  }
}
function computeBindingValue(node, value, binding, part) {
  if (binding.isCompound) {
    let storage = node.__dataCompoundStorage[binding.target];
    storage[part.compoundIndex] = value;
    value = storage.join("");
  }
  if (binding.kind !== "attribute") {
    if (
      binding.target === "textContent" ||
      (binding.target === "value" &&
        (node.localName === "input" || node.localName === "textarea"))
    ) {
      value = value == undefined ? "" : value;
    }
  }
  return value;
}
function shouldAddListener(binding) {
  return (
    Boolean(binding.target) &&
    binding.kind != "attribute" &&
    binding.kind != "text" &&
    !binding.isCompound &&
    binding.parts[0].mode === "{"
  );
}
function setupBindings(inst, templateInfo) {
  let { nodeList: nodeList, nodeInfoList: nodeInfoList } = templateInfo;
  if (nodeInfoList.length) {
    for (let i = 0; i < nodeInfoList.length; i++) {
      let info = nodeInfoList[i];
      let node = nodeList[i];
      let bindings = info.bindings;
      if (bindings) {
        for (let i = 0; i < bindings.length; i++) {
          let binding = bindings[i];
          setupCompoundStorage(node, binding);
          addNotifyListener(node, inst, binding);
        }
      }
      node.__dataHost = inst;
    }
  }
}
function setupCompoundStorage(node, binding) {
  if (binding.isCompound) {
    let storage =
      node.__dataCompoundStorage || (node.__dataCompoundStorage = {});
    let parts = binding.parts;
    let literals = new Array(parts.length);
    for (let j = 0; j < parts.length; j++) {
      literals[j] = parts[j].literal;
    }
    let target = binding.target;
    storage[target] = literals;
    if (binding.literal && binding.kind == "property") {
      node[target] = binding.literal;
    }
  }
}
function addNotifyListener(node, inst, binding) {
  if (binding.listenerEvent) {
    let part = binding.parts[0];
    node.addEventListener(binding.listenerEvent, function (e) {
      handleNotification(e, inst, binding.target, part.source, part.negate);
    });
  }
}
function createMethodEffect(model, sig, type, effectFn, methodInfo, dynamicFn) {
  dynamicFn =
    sig.static ||
    (dynamicFn && (typeof dynamicFn !== "object" || dynamicFn[sig.methodName]));
  let info = {
    methodName: sig.methodName,
    args: sig.args,
    methodInfo: methodInfo,
    dynamicFn: dynamicFn,
  };
  for (let i = 0, arg; i < sig.args.length && (arg = sig.args[i]); i++) {
    if (!arg.literal) {
      model._addPropertyEffect(arg.rootProperty, type, {
        fn: effectFn,
        info: info,
        trigger: arg,
      });
    }
  }
  if (dynamicFn) {
    model._addPropertyEffect(sig.methodName, type, {
      fn: effectFn,
      info: info,
    });
  }
}
function runMethodEffect(inst, property, props, oldProps, info) {
  let context = inst._methodHost || inst;
  let fn = context[info.methodName];
  if (fn) {
    let args = inst._marshalArgs(info.args, property, props);
    return fn.apply(context, args);
  } else if (!info.dynamicFn) {
    console.warn("method `" + info.methodName + "` not defined");
  }
}
const emptyArray = [];
const IDENT = "(?:" + "[a-zA-Z_$][\\w.:$\\-*]*" + ")";
const NUMBER = "(?:" + "[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?" + ")";
const SQUOTE_STRING = "(?:" + "'(?:[^'\\\\]|\\\\.)*'" + ")";
const DQUOTE_STRING = "(?:" + '"(?:[^"\\\\]|\\\\.)*"' + ")";
const STRING = "(?:" + SQUOTE_STRING + "|" + DQUOTE_STRING + ")";
const ARGUMENT = "(?:(" + IDENT + "|" + NUMBER + "|" + STRING + ")\\s*" + ")";
const ARGUMENTS = "(?:" + ARGUMENT + "(?:,\\s*" + ARGUMENT + ")*" + ")";
const ARGUMENT_LIST =
  "(?:" + "\\(\\s*" + "(?:" + ARGUMENTS + "?" + ")" + "\\)\\s*" + ")";
const BINDING = "(" + IDENT + "\\s*" + ARGUMENT_LIST + "?" + ")";
const OPEN_BRACKET = "(\\[\\[|{{)" + "\\s*";
const CLOSE_BRACKET = "(?:]]|}})";
const NEGATE = "(?:(!)\\s*)?";
const EXPRESSION = OPEN_BRACKET + NEGATE + BINDING + CLOSE_BRACKET;
const bindingRegex = new RegExp(EXPRESSION, "g");
function literalFromParts(parts) {
  let s = "";
  for (let i = 0; i < parts.length; i++) {
    let literal = parts[i].literal;
    s += literal || "";
  }
  return s;
}
function parseMethod(expression) {
  let m = expression.match(/([^\s]+?)\(([\s\S]*)\)/);
  if (m) {
    let methodName = m[1];
    let sig = { methodName: methodName, static: true, args: emptyArray };
    if (m[2].trim()) {
      let args = m[2].replace(/\\,/g, "&comma;").split(",");
      return parseArgs(args, sig);
    } else {
      return sig;
    }
  }
  return null;
}
function parseArgs(argList, sig) {
  sig.args = argList.map(function (rawArg) {
    let arg = parseArg(rawArg);
    if (!arg.literal) {
      sig.static = false;
    }
    return arg;
  }, this);
  return sig;
}
function parseArg(rawArg) {
  let arg = rawArg
    .trim()
    .replace(/&comma;/g, ",")
    .replace(/\\(.)/g, "$1");
  let a = { name: arg, value: "", literal: false };
  let fc = arg[0];
  if (fc === "-") {
    fc = arg[1];
  }
  if (fc >= "0" && fc <= "9") {
    fc = "#";
  }
  switch (fc) {
    case "'":
    case '"':
      a.value = arg.slice(1, -1);
      a.literal = true;
      break;
    case "#":
      a.value = Number(arg);
      a.literal = true;
      break;
  }
  if (!a.literal) {
    a.rootProperty = root(arg);
    a.structured = isPath(arg);
    if (a.structured) {
      a.wildcard = arg.slice(-2) == ".*";
      if (a.wildcard) {
        a.name = arg.slice(0, -2);
      }
    }
  }
  return a;
}
function getArgValue(data, props, path) {
  let value = get(data, path);
  if (value === undefined) {
    value = props[path];
  }
  return value;
}
function notifySplices(inst, array, path, splices) {
  inst.notifyPath(path + ".splices", { indexSplices: splices });
  inst.notifyPath(path + ".length", array.length);
}
function notifySplice(inst, array, path, index, addedCount, removed) {
  notifySplices(inst, array, path, [
    {
      index: index,
      addedCount: addedCount,
      removed: removed,
      object: array,
      type: "splice",
    },
  ]);
}
function upper(name) {
  return name[0].toUpperCase() + name.substring(1);
}
const PropertyEffects = dedupingMixin((superClass) => {
  const propertyEffectsBase = TemplateStamp(PropertyAccessors(superClass));
  class PropertyEffects extends propertyEffectsBase {
    constructor() {
      super();
      this.__isPropertyEffectsClient = true;
      this.__dataCounter = 0;
      this.__dataClientsReady;
      this.__dataPendingClients;
      this.__dataToNotify;
      this.__dataLinkedPaths;
      this.__dataHasPaths;
      this.__dataCompoundStorage;
      this.__dataHost;
      this.__dataTemp;
      this.__dataClientsInitialized;
      this.__data;
      this.__dataPending;
      this.__dataOld;
      this.__computeEffects;
      this.__reflectEffects;
      this.__notifyEffects;
      this.__propagateEffects;
      this.__observeEffects;
      this.__readOnly;
      this.__templateInfo;
    }
    get PROPERTY_EFFECT_TYPES() {
      return TYPES;
    }
    _initializeProperties() {
      super._initializeProperties();
      hostStack.registerHost(this);
      this.__dataClientsReady = false;
      this.__dataPendingClients = null;
      this.__dataToNotify = null;
      this.__dataLinkedPaths = null;
      this.__dataHasPaths = false;
      this.__dataCompoundStorage = this.__dataCompoundStorage || null;
      this.__dataHost = this.__dataHost || null;
      this.__dataTemp = {};
      this.__dataClientsInitialized = false;
    }
    _initializeProtoProperties(props) {
      this.__data = Object.create(props);
      this.__dataPending = Object.create(props);
      this.__dataOld = {};
    }
    _initializeInstanceProperties(props) {
      let readOnly = this[TYPES.READ_ONLY];
      for (let prop in props) {
        if (!readOnly || !readOnly[prop]) {
          this.__dataPending = this.__dataPending || {};
          this.__dataOld = this.__dataOld || {};
          this.__data[prop] = this.__dataPending[prop] = props[prop];
        }
      }
    }
    _addPropertyEffect(property, type, effect) {
      this._createPropertyAccessor(property, type == TYPES.READ_ONLY);
      let effects = ensureOwnEffectMap(this, type)[property];
      if (!effects) {
        effects = this[type][property] = [];
      }
      effects.push(effect);
    }
    _removePropertyEffect(property, type, effect) {
      let effects = ensureOwnEffectMap(this, type)[property];
      let idx = effects.indexOf(effect);
      if (idx >= 0) {
        effects.splice(idx, 1);
      }
    }
    _hasPropertyEffect(property, type) {
      let effects = this[type];
      return Boolean(effects && effects[property]);
    }
    _hasReadOnlyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.READ_ONLY);
    }
    _hasNotifyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.NOTIFY);
    }
    _hasReflectEffect(property) {
      return this._hasPropertyEffect(property, TYPES.REFLECT);
    }
    _hasComputedEffect(property) {
      return this._hasPropertyEffect(property, TYPES.COMPUTE);
    }
    _setPendingPropertyOrPath(path, value, shouldNotify, isPathNotification) {
      if (
        isPathNotification ||
        root(Array.isArray(path) ? path[0] : path) !== path
      ) {
        if (!isPathNotification) {
          let old = get(this, path);
          path = set(this, path, value);
          if (!path || !super._shouldPropertyChange(path, value, old)) {
            return false;
          }
        }
        this.__dataHasPaths = true;
        if (this._setPendingProperty(path, value, shouldNotify)) {
          computeLinkedPaths(this, path, value);
          return true;
        }
      } else {
        if (this.__dataHasAccessor && this.__dataHasAccessor[path]) {
          return this._setPendingProperty(path, value, shouldNotify);
        } else {
          this[path] = value;
        }
      }
      return false;
    }
    _setUnmanagedPropertyToNode(node, prop, value) {
      if (value !== node[prop] || typeof value == "object") {
        node[prop] = value;
      }
    }
    _setPendingProperty(property, value, shouldNotify) {
      let propIsPath = this.__dataHasPaths && isPath(property);
      let prevProps = propIsPath ? this.__dataTemp : this.__data;
      if (this._shouldPropertyChange(property, value, prevProps[property])) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        }
        if (!(property in this.__dataOld)) {
          this.__dataOld[property] = this.__data[property];
        }
        if (propIsPath) {
          this.__dataTemp[property] = value;
        } else {
          this.__data[property] = value;
        }
        this.__dataPending[property] = value;
        if (
          propIsPath ||
          (this[TYPES.NOTIFY] && this[TYPES.NOTIFY][property])
        ) {
          this.__dataToNotify = this.__dataToNotify || {};
          this.__dataToNotify[property] = shouldNotify;
        }
        return true;
      }
      return false;
    }
    _setProperty(property, value) {
      if (this._setPendingProperty(property, value, true)) {
        this._invalidateProperties();
      }
    }
    _invalidateProperties() {
      if (this.__dataReady) {
        this._flushProperties();
      }
    }
    _enqueueClient(client) {
      this.__dataPendingClients = this.__dataPendingClients || [];
      if (client !== this) {
        this.__dataPendingClients.push(client);
      }
    }
    _flushProperties() {
      this.__dataCounter++;
      super._flushProperties();
      this.__dataCounter--;
    }
    _flushClients() {
      if (!this.__dataClientsReady) {
        this.__dataClientsReady = true;
        this._readyClients();
        this.__dataReady = true;
      } else {
        this.__enableOrFlushClients();
      }
    }
    __enableOrFlushClients() {
      let clients = this.__dataPendingClients;
      if (clients) {
        this.__dataPendingClients = null;
        for (let i = 0; i < clients.length; i++) {
          let client = clients[i];
          if (!client.__dataEnabled) {
            client._enableProperties();
          } else if (client.__dataPending) {
            client._flushProperties();
          }
        }
      }
    }
    _readyClients() {
      this.__enableOrFlushClients();
    }
    setProperties(props, setReadOnly) {
      for (let path in props) {
        if (
          setReadOnly ||
          !this[TYPES.READ_ONLY] ||
          !this[TYPES.READ_ONLY][path]
        ) {
          this._setPendingPropertyOrPath(path, props[path], true);
        }
      }
      this._invalidateProperties();
    }
    ready() {
      this._flushProperties();
      if (!this.__dataClientsReady) {
        this._flushClients();
      }
      if (this.__dataPending) {
        this._flushProperties();
      }
    }
    _propertiesChanged(currentProps, changedProps, oldProps) {
      let hasPaths = this.__dataHasPaths;
      this.__dataHasPaths = false;
      runComputedEffects(this, changedProps, oldProps, hasPaths);
      let notifyProps = this.__dataToNotify;
      this.__dataToNotify = null;
      this._propagatePropertyChanges(changedProps, oldProps, hasPaths);
      this._flushClients();
      runEffects(this, this[TYPES.REFLECT], changedProps, oldProps, hasPaths);
      runEffects(this, this[TYPES.OBSERVE], changedProps, oldProps, hasPaths);
      if (notifyProps) {
        runNotifyEffects(this, notifyProps, changedProps, oldProps, hasPaths);
      }
      if (this.__dataCounter == 1) {
        this.__dataTemp = {};
      }
    }
    _propagatePropertyChanges(changedProps, oldProps, hasPaths) {
      if (this[TYPES.PROPAGATE]) {
        runEffects(
          this,
          this[TYPES.PROPAGATE],
          changedProps,
          oldProps,
          hasPaths
        );
      }
      let templateInfo = this.__templateInfo;
      while (templateInfo) {
        runEffects(
          this,
          templateInfo.propertyEffects,
          changedProps,
          oldProps,
          hasPaths,
          templateInfo.nodeList
        );
        templateInfo = templateInfo.nextTemplateInfo;
      }
    }
    linkPaths(to, from) {
      to = normalize(to);
      from = normalize(from);
      this.__dataLinkedPaths = this.__dataLinkedPaths || {};
      this.__dataLinkedPaths[to] = from;
    }
    unlinkPaths(path) {
      path = normalize(path);
      if (this.__dataLinkedPaths) {
        delete this.__dataLinkedPaths[path];
      }
    }
    notifySplices(path, splices) {
      let info = { path: "" };
      let array = get(this, path, info);
      notifySplices(this, array, info.path, splices);
    }
    get(path, root) {
      return get(root || this, path);
    }
    set(path, value, root) {
      if (root) {
        set(root, path, value);
      } else {
        if (!this[TYPES.READ_ONLY] || !this[TYPES.READ_ONLY][path]) {
          if (this._setPendingPropertyOrPath(path, value, true)) {
            this._invalidateProperties();
          }
        }
      }
    }
    push(path, ...items) {
      let info = { path: "" };
      let array = get(this, path, info);
      let len = array.length;
      let ret = array.push(...items);
      if (items.length) {
        notifySplice(this, array, info.path, len, items.length, []);
      }
      return ret;
    }
    pop(path) {
      let info = { path: "" };
      let array = get(this, path, info);
      let hadLength = Boolean(array.length);
      let ret = array.pop();
      if (hadLength) {
        notifySplice(this, array, info.path, array.length, 0, [ret]);
      }
      return ret;
    }
    splice(path, start, deleteCount, ...items) {
      let info = { path: "" };
      let array = get(this, path, info);
      if (start < 0) {
        start = array.length - Math.floor(-start);
      } else if (start) {
        start = Math.floor(start);
      }
      let ret;
      if (arguments.length === 2) {
        ret = array.splice(start);
      } else {
        ret = array.splice(start, deleteCount, ...items);
      }
      if (items.length || ret.length) {
        notifySplice(this, array, info.path, start, items.length, ret);
      }
      return ret;
    }
    shift(path) {
      let info = { path: "" };
      let array = get(this, path, info);
      let hadLength = Boolean(array.length);
      let ret = array.shift();
      if (hadLength) {
        notifySplice(this, array, info.path, 0, 0, [ret]);
      }
      return ret;
    }
    unshift(path, ...items) {
      let info = { path: "" };
      let array = get(this, path, info);
      let ret = array.unshift(...items);
      if (items.length) {
        notifySplice(this, array, info.path, 0, items.length, []);
      }
      return ret;
    }
    notifyPath(path, value) {
      let propPath;
      if (arguments.length == 1) {
        let info = { path: "" };
        value = get(this, path, info);
        propPath = info.path;
      } else if (Array.isArray(path)) {
        propPath = normalize(path);
      } else {
        propPath = path;
      }
      if (this._setPendingPropertyOrPath(propPath, value, true, true)) {
        this._invalidateProperties();
      }
    }
    _createReadOnlyProperty(property, protectedSetter) {
      this._addPropertyEffect(property, TYPES.READ_ONLY);
      if (protectedSetter) {
        this["_set" + upper(property)] = function (value) {
          this._setProperty(property, value);
        };
      }
    }
    _createPropertyObserver(property, method, dynamicFn) {
      let info = {
        property: property,
        method: method,
        dynamicFn: Boolean(dynamicFn),
      };
      this._addPropertyEffect(property, TYPES.OBSERVE, {
        fn: runObserverEffect,
        info: info,
        trigger: { name: property },
      });
      if (dynamicFn) {
        this._addPropertyEffect(method, TYPES.OBSERVE, {
          fn: runObserverEffect,
          info: info,
          trigger: { name: method },
        });
      }
    }
    _createMethodObserver(expression, dynamicFn) {
      let sig = parseMethod(expression);
      if (!sig) {
        throw new Error("Malformed observer expression '" + expression + "'");
      }
      createMethodEffect(
        this,
        sig,
        TYPES.OBSERVE,
        runMethodEffect,
        null,
        dynamicFn
      );
    }
    _createNotifyingProperty(property) {
      this._addPropertyEffect(property, TYPES.NOTIFY, {
        fn: runNotifyEffect,
        info: {
          eventName: camelToDashCase(property) + "-changed",
          property: property,
        },
      });
    }
    _createReflectedProperty(property) {
      let attr = this.constructor.attributeNameForProperty(property);
      if (attr[0] === "-") {
        console.warn(
          "Property " +
            property +
            " cannot be reflected to attribute " +
            attr +
            ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'
        );
      } else {
        this._addPropertyEffect(property, TYPES.REFLECT, {
          fn: runReflectEffect,
          info: { attrName: attr },
        });
      }
    }
    _createComputedProperty(property, expression, dynamicFn) {
      let sig = parseMethod(expression);
      if (!sig) {
        throw new Error("Malformed computed expression '" + expression + "'");
      }
      createMethodEffect(
        this,
        sig,
        TYPES.COMPUTE,
        runComputedEffect,
        property,
        dynamicFn
      );
    }
    _marshalArgs(args, path, props) {
      const data = this.__data;
      const values = [];
      for (let i = 0, l = args.length; i < l; i++) {
        let {
          name: name,
          structured: structured,
          wildcard: wildcard,
          value: value,
          literal: literal,
        } = args[i];
        if (!literal) {
          if (wildcard) {
            const matches = isDescendant(name, path);
            const pathValue = getArgValue(data, props, matches ? path : name);
            value = {
              path: matches ? path : name,
              value: pathValue,
              base: matches ? get(data, name) : pathValue,
            };
          } else {
            value = structured ? getArgValue(data, props, name) : data[name];
          }
        }
        values[i] = value;
      }
      return values;
    }
    static addPropertyEffect(property, type, effect) {
      this.prototype._addPropertyEffect(property, type, effect);
    }
    static createPropertyObserver(property, method, dynamicFn) {
      this.prototype._createPropertyObserver(property, method, dynamicFn);
    }
    static createMethodObserver(expression, dynamicFn) {
      this.prototype._createMethodObserver(expression, dynamicFn);
    }
    static createNotifyingProperty(property) {
      this.prototype._createNotifyingProperty(property);
    }
    static createReadOnlyProperty(property, protectedSetter) {
      this.prototype._createReadOnlyProperty(property, protectedSetter);
    }
    static createReflectedProperty(property) {
      this.prototype._createReflectedProperty(property);
    }
    static createComputedProperty(property, expression, dynamicFn) {
      this.prototype._createComputedProperty(property, expression, dynamicFn);
    }
    static bindTemplate(template) {
      return this.prototype._bindTemplate(template);
    }
    _bindTemplate(template, instanceBinding) {
      let templateInfo = this.constructor._parseTemplate(template);
      let wasPreBound = this.__templateInfo == templateInfo;
      if (!wasPreBound) {
        for (let prop in templateInfo.propertyEffects) {
          this._createPropertyAccessor(prop);
        }
      }
      if (instanceBinding) {
        templateInfo = Object.create(templateInfo);
        templateInfo.wasPreBound = wasPreBound;
        if (!wasPreBound && this.__templateInfo) {
          let last = this.__templateInfoLast || this.__templateInfo;
          this.__templateInfoLast = last.nextTemplateInfo = templateInfo;
          templateInfo.previousTemplateInfo = last;
          return templateInfo;
        }
      }
      return (this.__templateInfo = templateInfo);
    }
    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      let hostProps = (templateInfo.hostProps = templateInfo.hostProps || {});
      hostProps[prop] = true;
      let effects = (templateInfo.propertyEffects =
        templateInfo.propertyEffects || {});
      let propEffects = (effects[prop] = effects[prop] || []);
      propEffects.push(effect);
    }
    _stampTemplate(template) {
      hostStack.beginHosting(this);
      let dom = super._stampTemplate(template);
      hostStack.endHosting(this);
      let templateInfo = this._bindTemplate(template, true);
      templateInfo.nodeList = dom.nodeList;
      if (!templateInfo.wasPreBound) {
        let nodes = (templateInfo.childNodes = []);
        for (let n = dom.firstChild; n; n = n.nextSibling) {
          nodes.push(n);
        }
      }
      dom.templateInfo = templateInfo;
      setupBindings(this, templateInfo);
      if (this.__dataReady) {
        runEffects(
          this,
          templateInfo.propertyEffects,
          this.__data,
          null,
          false,
          templateInfo.nodeList
        );
      }
      return dom;
    }
    _removeBoundDom(dom) {
      let templateInfo = dom.templateInfo;
      if (templateInfo.previousTemplateInfo) {
        templateInfo.previousTemplateInfo.nextTemplateInfo =
          templateInfo.nextTemplateInfo;
      }
      if (templateInfo.nextTemplateInfo) {
        templateInfo.nextTemplateInfo.previousTemplateInfo =
          templateInfo.previousTemplateInfo;
      }
      if (this.__templateInfoLast == templateInfo) {
        this.__templateInfoLast = templateInfo.previousTemplateInfo;
      }
      templateInfo.previousTemplateInfo = templateInfo.nextTemplateInfo = null;
      let nodes = templateInfo.childNodes;
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.parentNode.removeChild(node);
      }
    }
    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      let noted = super._parseTemplateNode(node, templateInfo, nodeInfo);
      if (node.nodeType === Node.TEXT_NODE) {
        let parts = this._parseBindings(node.textContent, templateInfo);
        if (parts) {
          node.textContent = literalFromParts(parts) || " ";
          addBinding(
            this,
            templateInfo,
            nodeInfo,
            "text",
            "textContent",
            parts
          );
          noted = true;
        }
      }
      return noted;
    }
    static _parseTemplateNodeAttribute(
      node,
      templateInfo,
      nodeInfo,
      name,
      value
    ) {
      let parts = this._parseBindings(value, templateInfo);
      if (parts) {
        let origName = name;
        let kind = "property";
        if (capitalAttributeRegex.test(name)) {
          kind = "attribute";
        } else if (name[name.length - 1] == "$") {
          name = name.slice(0, -1);
          kind = "attribute";
        }
        let literal = literalFromParts(parts);
        if (literal && kind == "attribute") {
          if (name == "class" && node.hasAttribute("class")) {
            literal += " " + node.getAttribute(name);
          }
          node.setAttribute(name, literal);
        }
        if (node.localName === "input" && origName === "value") {
          node.setAttribute(origName, "");
        }
        node.removeAttribute(origName);
        if (kind === "property") {
          name = dashToCamelCase(name);
        }
        addBinding(this, templateInfo, nodeInfo, kind, name, parts, literal);
        return true;
      } else {
        return super._parseTemplateNodeAttribute(
          node,
          templateInfo,
          nodeInfo,
          name,
          value
        );
      }
    }
    static _parseTemplateNestedTemplate(node, templateInfo, nodeInfo) {
      let noted = super._parseTemplateNestedTemplate(
        node,
        templateInfo,
        nodeInfo
      );
      let hostProps = nodeInfo.templateInfo.hostProps;
      let mode = "{";
      for (let source in hostProps) {
        let parts = [{ mode: mode, source: source, dependencies: [source] }];
        addBinding(
          this,
          templateInfo,
          nodeInfo,
          "property",
          "_host_" + source,
          parts
        );
      }
      return noted;
    }
    static _parseBindings(text, templateInfo) {
      let parts = [];
      let lastIndex = 0;
      let m;
      while ((m = bindingRegex.exec(text)) !== null) {
        if (m.index > lastIndex) {
          parts.push({ literal: text.slice(lastIndex, m.index) });
        }
        let mode = m[1][0];
        let negate = Boolean(m[2]);
        let source = m[3].trim();
        let customEvent = false,
          notifyEvent = "",
          colon = -1;
        if (mode == "{" && (colon = source.indexOf("::")) > 0) {
          notifyEvent = source.substring(colon + 2);
          source = source.substring(0, colon);
          customEvent = true;
        }
        let signature = parseMethod(source);
        let dependencies = [];
        if (signature) {
          let { args: args, methodName: methodName } = signature;
          for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (!arg.literal) {
              dependencies.push(arg);
            }
          }
          let dynamicFns = templateInfo.dynamicFns;
          if ((dynamicFns && dynamicFns[methodName]) || signature.static) {
            dependencies.push(methodName);
            signature.dynamicFn = true;
          }
        } else {
          dependencies.push(source);
        }
        parts.push({
          source: source,
          mode: mode,
          negate: negate,
          customEvent: customEvent,
          signature: signature,
          dependencies: dependencies,
          event: notifyEvent,
        });
        lastIndex = bindingRegex.lastIndex;
      }
      if (lastIndex && lastIndex < text.length) {
        let literal = text.substring(lastIndex);
        if (literal) {
          parts.push({ literal: literal });
        }
      }
      if (parts.length) {
        return parts;
      } else {
        return null;
      }
    }
    static _evaluateBinding(inst, part, path, props, oldProps, hasPaths) {
      let value;
      if (part.signature) {
        value = runMethodEffect(inst, path, props, oldProps, part.signature);
      } else if (path != part.source) {
        value = get(inst, part.source);
      } else {
        if (hasPaths && isPath(path)) {
          value = get(inst, path);
        } else {
          value = inst.__data[path];
        }
      }
      if (part.negate) {
        value = !value;
      }
      return value;
    }
  }
  return PropertyEffects;
});
class HostStack {
  constructor() {
    this.stack = [];
  }
  registerHost(inst) {
    if (this.stack.length) {
      let host = this.stack[this.stack.length - 1];
      host._enqueueClient(inst);
    }
  }
  beginHosting(inst) {
    this.stack.push(inst);
  }
  endHosting(inst) {
    let stackLen = this.stack.length;
    if (stackLen && this.stack[stackLen - 1] == inst) {
      this.stack.pop();
    }
  }
}
const hostStack = new HostStack();
function register(prototype) {}
function normalizeProperties(props) {
  const output = {};
  for (let p in props) {
    const o = props[p];
    output[p] = typeof o === "function" ? { type: o } : o;
  }
  return output;
}
const PropertiesMixin = dedupingMixin((superClass) => {
  const base = PropertiesChanged(superClass);
  function superPropertiesClass(constructor) {
    const superCtor = Object.getPrototypeOf(constructor);
    return superCtor.prototype instanceof PropertiesMixin ? superCtor : null;
  }
  function ownProperties(constructor) {
    if (
      !constructor.hasOwnProperty(
        JSCompiler_renameProperty("__ownProperties", constructor)
      )
    ) {
      let props = null;
      if (
        constructor.hasOwnProperty(
          JSCompiler_renameProperty("properties", constructor)
        )
      ) {
        const properties = constructor.properties;
        if (properties) {
          props = normalizeProperties(properties);
        }
      }
      constructor.__ownProperties = props;
    }
    return constructor.__ownProperties;
  }
  class PropertiesMixin extends base {
    static get observedAttributes() {
      if (!this.hasOwnProperty("__observedAttributes")) {
        register(this.prototype);
        const props = this._properties;
        this.__observedAttributes = props
          ? Object.keys(props).map((p) => this.attributeNameForProperty(p))
          : [];
      }
      return this.__observedAttributes;
    }
    static finalize() {
      if (
        !this.hasOwnProperty(JSCompiler_renameProperty("__finalized", this))
      ) {
        const superCtor = superPropertiesClass(this);
        if (superCtor) {
          superCtor.finalize();
        }
        this.__finalized = true;
        this._finalizeClass();
      }
    }
    static _finalizeClass() {
      const props = ownProperties(this);
      if (props) {
        this.createProperties(props);
      }
    }
    static get _properties() {
      if (
        !this.hasOwnProperty(JSCompiler_renameProperty("__properties", this))
      ) {
        const superCtor = superPropertiesClass(this);
        this.__properties = Object.assign(
          {},
          superCtor && superCtor._properties,
          ownProperties(this)
        );
      }
      return this.__properties;
    }
    static typeForProperty(name) {
      const info = this._properties[name];
      return info && info.type;
    }
    _initializeProperties() {
      this.constructor.finalize();
      super._initializeProperties();
    }
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._enableProperties();
    }
    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  }
  return PropertiesMixin;
});
const version = "3.2.0";
const builtCSS = window.ShadyCSS && window.ShadyCSS["cssBuild"];
const ElementMixin = dedupingMixin((base) => {
  const polymerElementBase = PropertiesMixin(PropertyEffects(base));
  function propertyDefaults(constructor) {
    if (
      !constructor.hasOwnProperty(
        JSCompiler_renameProperty("__propertyDefaults", constructor)
      )
    ) {
      constructor.__propertyDefaults = null;
      let props = constructor._properties;
      for (let p in props) {
        let info = props[p];
        if ("value" in info) {
          constructor.__propertyDefaults = constructor.__propertyDefaults || {};
          constructor.__propertyDefaults[p] = info;
        }
      }
    }
    return constructor.__propertyDefaults;
  }
  function ownObservers(constructor) {
    if (
      !constructor.hasOwnProperty(
        JSCompiler_renameProperty("__ownObservers", constructor)
      )
    ) {
      constructor.__ownObservers = constructor.hasOwnProperty(
        JSCompiler_renameProperty("observers", constructor)
      )
        ? constructor.observers
        : null;
    }
    return constructor.__ownObservers;
  }
  function createPropertyFromConfig(proto, name, info, allProps) {
    if (info.computed) {
      info.readOnly = true;
    }
    if (info.computed) {
      if (proto._hasReadOnlyEffect(name)) {
        console.warn(`Cannot redefine computed property '${name}'.`);
      } else {
        proto._createComputedProperty(name, info.computed, allProps);
      }
    }
    if (info.readOnly && !proto._hasReadOnlyEffect(name)) {
      proto._createReadOnlyProperty(name, !info.computed);
    } else if (info.readOnly === false && proto._hasReadOnlyEffect(name)) {
      console.warn(`Cannot make readOnly property '${name}' non-readOnly.`);
    }
    if (info.reflectToAttribute && !proto._hasReflectEffect(name)) {
      proto._createReflectedProperty(name);
    } else if (
      info.reflectToAttribute === false &&
      proto._hasReflectEffect(name)
    ) {
      console.warn(`Cannot make reflected property '${name}' non-reflected.`);
    }
    if (info.notify && !proto._hasNotifyEffect(name)) {
      proto._createNotifyingProperty(name);
    } else if (info.notify === false && proto._hasNotifyEffect(name)) {
      console.warn(`Cannot make notify property '${name}' non-notify.`);
    }
    if (info.observer) {
      proto._createPropertyObserver(
        name,
        info.observer,
        allProps[info.observer]
      );
    }
    proto._addPropertyToAttributeMap(name);
  }
  function processElementStyles(klass, template, is, baseURI) {
    if (!builtCSS) {
      const templateStyles = template.content.querySelectorAll("style");
      const stylesWithImports = stylesFromTemplate(template);
      const linkedStyles = stylesFromModuleImports(is);
      const firstTemplateChild = template.content.firstElementChild;
      for (let idx = 0; idx < linkedStyles.length; idx++) {
        let s = linkedStyles[idx];
        s.textContent = klass._processStyleText(s.textContent, baseURI);
        template.content.insertBefore(s, firstTemplateChild);
      }
      let templateStyleIndex = 0;
      for (let i = 0; i < stylesWithImports.length; i++) {
        let s = stylesWithImports[i];
        let templateStyle = templateStyles[templateStyleIndex];
        if (templateStyle !== s) {
          s = s.cloneNode(true);
          templateStyle.parentNode.insertBefore(s, templateStyle);
        } else {
          templateStyleIndex++;
        }
        s.textContent = klass._processStyleText(s.textContent, baseURI);
      }
    }
    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(template, is);
    }
  }
  function getTemplateFromDomModule(is) {
    let template = null;
    if (is && !strictTemplatePolicy) {
      template = DomModule.import(is, "template");
    }
    return template;
  }
  class PolymerElement extends polymerElementBase {
    static get polymerElementVersion() {
      return version;
    }
    static _finalizeClass() {
      super._finalizeClass();
      const observers = ownObservers(this);
      if (observers) {
        this.createObservers(observers, this._properties);
      }
      this._prepareTemplate();
    }
    static _prepareTemplate() {
      let template = this.template;
      if (template) {
        if (typeof template === "string") {
          console.error("template getter must return HTMLTemplateElement");
          template = null;
        } else {
          template = template.cloneNode(true);
        }
      }
      this.prototype._template = template;
    }
    static createProperties(props) {
      for (let p in props) {
        createPropertyFromConfig(this.prototype, p, props[p], props);
      }
    }
    static createObservers(observers, dynamicFns) {
      const proto = this.prototype;
      for (let i = 0; i < observers.length; i++) {
        proto._createMethodObserver(observers[i], dynamicFns);
      }
    }
    static get template() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("_template", this))) {
        this._template = this.prototype.hasOwnProperty(
          JSCompiler_renameProperty("_template", this.prototype)
        )
          ? this.prototype._template
          : getTemplateFromDomModule(this.is) ||
            Object.getPrototypeOf(this.prototype).constructor.template;
      }
      return this._template;
    }
    static set template(value) {
      this._template = value;
    }
    static get importPath() {
      if (
        !this.hasOwnProperty(JSCompiler_renameProperty("_importPath", this))
      ) {
        const meta = this.importMeta;
        if (meta) {
          this._importPath = pathFromUrl(meta.url);
        } else {
          const module = DomModule.import(this.is);
          this._importPath =
            (module && module.assetpath) ||
            Object.getPrototypeOf(this.prototype).constructor.importPath;
        }
      }
      return this._importPath;
    }
    constructor() {
      super();
      this._template;
      this._importPath;
      this.rootPath;
      this.importPath;
      this.root;
      this.$;
    }
    _initializeProperties() {
      this.constructor.finalize();
      this.constructor._finalizeTemplate(this.localName);
      super._initializeProperties();
      this.rootPath = rootPath;
      this.importPath = this.constructor.importPath;
      let p$ = propertyDefaults(this.constructor);
      if (!p$) {
        return;
      }
      for (let p in p$) {
        let info = p$[p];
        if (!this.hasOwnProperty(p)) {
          let value =
            typeof info.value == "function"
              ? info.value.call(this)
              : info.value;
          if (this._hasAccessor(p)) {
            this._setPendingProperty(p, value, true);
          } else {
            this[p] = value;
          }
        }
      }
    }
    static _processStyleText(cssText, baseURI) {
      return resolveCss(cssText, baseURI);
    }
    static _finalizeTemplate(is) {
      const template = this.prototype._template;
      if (template && !template.__polymerFinalized) {
        template.__polymerFinalized = true;
        const importPath = this.importPath;
        const baseURI = importPath ? resolveUrl(importPath) : "";
        processElementStyles(this, template, is, baseURI);
        this.prototype._bindTemplate(template);
      }
    }
    connectedCallback() {
      if (window.ShadyCSS && this._template) {
        window.ShadyCSS.styleElement(this);
      }
      super.connectedCallback();
    }
    ready() {
      if (this._template) {
        this.root = this._stampTemplate(this._template);
        this.$ = this.root.$;
      }
      super.ready();
    }
    _readyClients() {
      if (this._template) {
        this.root = this._attachDom(this.root);
      }
      super._readyClients();
    }
    _attachDom(dom) {
      const n = wrap(this);
      if (n.attachShadow) {
        if (dom) {
          if (!n.shadowRoot) {
            n.attachShadow({ mode: "open" });
          }
          n.shadowRoot.appendChild(dom);
          return n.shadowRoot;
        }
        return null;
      } else {
        throw new Error(
          "ShadowDOM not available. " +
            "PolymerElement can create dom as children instead of in " +
            "ShadowDOM by setting `this.root = this;` before `ready`."
        );
      }
    }
    updateStyles(properties) {
      if (window.ShadyCSS) {
        window.ShadyCSS.styleSubtree(this, properties);
      }
    }
    resolveUrl(url, base) {
      if (!base && this.importPath) {
        base = resolveUrl(this.importPath);
      }
      return resolveUrl(url, base);
    }
    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      templateInfo.dynamicFns = templateInfo.dynamicFns || this._properties;
      return super._parseTemplateContent(template, templateInfo, nodeInfo);
    }
    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      return super._addTemplatePropertyEffect(templateInfo, prop, effect);
    }
  }
  return PolymerElement;
});
class LiteralString {
  constructor(string) {
    this.value = string.toString();
  }
  toString() {
    return this.value;
  }
}
function literalValue(value) {
  if (value instanceof LiteralString) {
    return value.value;
  } else {
    throw new Error(
      `non-literal value passed to Polymer's htmlLiteral function: ${value}`
    );
  }
}
function htmlValue(value) {
  if (value instanceof HTMLTemplateElement) {
    return value.innerHTML;
  } else if (value instanceof LiteralString) {
    return literalValue(value);
  } else {
    throw new Error(
      `non-template value passed to Polymer's html function: ${value}`
    );
  }
}
const html = function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = values.reduce(
    (acc, v, idx) => acc + htmlValue(v) + strings[idx + 1],
    strings[0]
  );
  return template;
};
const PolymerElement = ElementMixin(HTMLElement);
function mutablePropertyChange$1(inst, property, value, old, mutableData) {
  let isObject;
  if (mutableData) {
    isObject = typeof value === "object" && value !== null;
    if (isObject) {
      old = inst.__dataTemp[property];
    }
  }
  let shouldChange = old !== value && (old === old || value === value);
  if (isObject && shouldChange) {
    inst.__dataTemp[property] = value;
  }
  return shouldChange;
}
const MutableData = dedupingMixin((superClass) => {
  class MutableData extends superClass {
    _shouldPropertyChange(property, value, old) {
      return mutablePropertyChange$1(this, property, value, old, true);
    }
  }
  return MutableData;
});
const OptionalMutableData = dedupingMixin((superClass) => {
  class OptionalMutableData extends superClass {
    static get properties() {
      return { mutableData: Boolean };
    }
    _shouldPropertyChange(property, value, old) {
      return mutablePropertyChange$1(
        this,
        property,
        value,
        old,
        this.mutableData
      );
    }
  }
  return OptionalMutableData;
});
MutableData._mutablePropertyChange = mutablePropertyChange$1;
let newInstance = null;
function HTMLTemplateElementExtension() {
  return newInstance;
}
HTMLTemplateElementExtension.prototype = Object.create(
  HTMLTemplateElement.prototype,
  { constructor: { value: HTMLTemplateElementExtension, writable: true } }
);
const DataTemplate = PropertyEffects(HTMLTemplateElementExtension);
const MutableDataTemplate = MutableData(DataTemplate);
function upgradeTemplate(template, constructor) {
  newInstance = template;
  Object.setPrototypeOf(template, constructor.prototype);
  new constructor();
  newInstance = null;
}
const templateInstanceBase = PropertyEffects(class {});
class TemplateInstanceBase extends templateInstanceBase {
  constructor(props) {
    super();
    this._configureProperties(props);
    this.root = this._stampTemplate(this.__dataHost);
    let children = (this.children = []);
    for (let n = this.root.firstChild; n; n = n.nextSibling) {
      children.push(n);
      n.__templatizeInstance = this;
    }
    if (
      this.__templatizeOwner &&
      this.__templatizeOwner.__hideTemplateChildren__
    ) {
      this._showHideChildren(true);
    }
    let options = this.__templatizeOptions;
    if ((props && options.instanceProps) || !options.instanceProps) {
      this._enableProperties();
    }
  }
  _configureProperties(props) {
    let options = this.__templatizeOptions;
    if (options.forwardHostProp) {
      for (let hprop in this.__hostProps) {
        this._setPendingProperty(hprop, this.__dataHost["_host_" + hprop]);
      }
    }
    for (let iprop in props) {
      this._setPendingProperty(iprop, props[iprop]);
    }
  }
  forwardHostProp(prop, value) {
    if (this._setPendingPropertyOrPath(prop, value, false, true)) {
      this.__dataHost._enqueueClient(this);
    }
  }
  _addEventListenerToNode(node, eventName, handler) {
    if (this._methodHost && this.__templatizeOptions.parentModel) {
      this._methodHost._addEventListenerToNode(node, eventName, (e) => {
        e.model = this;
        handler(e);
      });
    } else {
      let templateHost = this.__dataHost.__dataHost;
      if (templateHost) {
        templateHost._addEventListenerToNode(node, eventName, handler);
      }
    }
  }
  _showHideChildren(hide) {
    let c = this.children;
    for (let i = 0; i < c.length; i++) {
      let n = c[i];
      if (Boolean(hide) != Boolean(n.__hideTemplateChildren__)) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hide) {
            n.__polymerTextContent__ = n.textContent;
            n.textContent = "";
          } else {
            n.textContent = n.__polymerTextContent__;
          }
        } else if (n.localName === "slot") {
          if (hide) {
            n.__polymerReplaced__ = document.createComment("hidden-slot");
            wrap(wrap(n).parentNode).replaceChild(n.__polymerReplaced__, n);
          } else {
            const replace = n.__polymerReplaced__;
            if (replace) {
              wrap(wrap(replace).parentNode).replaceChild(n, replace);
            }
          }
        } else if (n.style) {
          if (hide) {
            n.__polymerDisplay__ = n.style.display;
            n.style.display = "none";
          } else {
            n.style.display = n.__polymerDisplay__;
          }
        }
      }
      n.__hideTemplateChildren__ = hide;
      if (n._showHideChildren) {
        n._showHideChildren(hide);
      }
    }
  }
  _setUnmanagedPropertyToNode(node, prop, value) {
    if (
      node.__hideTemplateChildren__ &&
      node.nodeType == Node.TEXT_NODE &&
      prop == "textContent"
    ) {
      node.__polymerTextContent__ = value;
    } else {
      super._setUnmanagedPropertyToNode(node, prop, value);
    }
  }
  get parentModel() {
    let model = this.__parentModel;
    if (!model) {
      let options;
      model = this;
      do {
        model = model.__dataHost.__dataHost;
      } while ((options = model.__templatizeOptions) && !options.parentModel);
      this.__parentModel = model;
    }
    return model;
  }
  dispatchEvent(event) {
    return true;
  }
}
TemplateInstanceBase.prototype.__dataHost;
TemplateInstanceBase.prototype.__templatizeOptions;
TemplateInstanceBase.prototype._methodHost;
TemplateInstanceBase.prototype.__templatizeOwner;
TemplateInstanceBase.prototype.__hostProps;
const MutableTemplateInstanceBase = MutableData(TemplateInstanceBase);
function findMethodHost(template) {
  let templateHost = template.__dataHost;
  return (templateHost && templateHost._methodHost) || templateHost;
}
function createTemplatizerClass(template, templateInfo, options) {
  let templatizerBase = options.mutableData
    ? MutableTemplateInstanceBase
    : TemplateInstanceBase;
  if (templatize.mixin) {
    templatizerBase = templatize.mixin(templatizerBase);
  }
  let klass = class extends templatizerBase {};
  klass.prototype.__templatizeOptions = options;
  klass.prototype._bindTemplate(template);
  addNotifyEffects(klass, template, templateInfo, options);
  return klass;
}
function addPropagateEffects(template, templateInfo, options) {
  let userForwardHostProp = options.forwardHostProp;
  if (userForwardHostProp) {
    let klass = templateInfo.templatizeTemplateClass;
    if (!klass) {
      let templatizedBase = options.mutableData
        ? MutableDataTemplate
        : DataTemplate;
      klass =
        templateInfo.templatizeTemplateClass = class TemplatizedTemplate extends (
          templatizedBase
        ) {};
      let hostProps = templateInfo.hostProps;
      for (let prop in hostProps) {
        klass.prototype._addPropertyEffect(
          "_host_" + prop,
          klass.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,
          { fn: createForwardHostPropEffect(prop, userForwardHostProp) }
        );
        klass.prototype._createNotifyingProperty("_host_" + prop);
      }
    }
    upgradeTemplate(template, klass);
    if (template.__dataProto) {
      Object.assign(template.__data, template.__dataProto);
    }
    template.__dataTemp = {};
    template.__dataPending = null;
    template.__dataOld = null;
    template._enableProperties();
  }
}
function createForwardHostPropEffect(hostProp, userForwardHostProp) {
  return function forwardHostProp(template, prop, props) {
    userForwardHostProp.call(
      template.__templatizeOwner,
      prop.substring("_host_".length),
      props[prop]
    );
  };
}
function addNotifyEffects(klass, template, templateInfo, options) {
  let hostProps = templateInfo.hostProps || {};
  for (let iprop in options.instanceProps) {
    delete hostProps[iprop];
    let userNotifyInstanceProp = options.notifyInstanceProp;
    if (userNotifyInstanceProp) {
      klass.prototype._addPropertyEffect(
        iprop,
        klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        { fn: createNotifyInstancePropEffect(iprop, userNotifyInstanceProp) }
      );
    }
  }
  if (options.forwardHostProp && template.__dataHost) {
    for (let hprop in hostProps) {
      klass.prototype._addPropertyEffect(
        hprop,
        klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        { fn: createNotifyHostPropEffect() }
      );
    }
  }
}
function createNotifyInstancePropEffect(instProp, userNotifyInstanceProp) {
  return function notifyInstanceProp(inst, prop, props) {
    userNotifyInstanceProp.call(
      inst.__templatizeOwner,
      inst,
      prop,
      props[prop]
    );
  };
}
function createNotifyHostPropEffect() {
  return function notifyHostProp(inst, prop, props) {
    inst.__dataHost._setPendingPropertyOrPath(
      "_host_" + prop,
      props[prop],
      true,
      true
    );
  };
}
function templatize(template, owner, options) {
  options = options || {};
  if (template.__templatizeOwner) {
    throw new Error("A <template> can only be templatized once");
  }
  template.__templatizeOwner = owner;
  const ctor = owner ? owner.constructor : TemplateInstanceBase;
  let templateInfo = ctor._parseTemplate(template);
  let baseClass = templateInfo.templatizeInstanceClass;
  if (!baseClass) {
    baseClass = createTemplatizerClass(template, templateInfo, options);
    templateInfo.templatizeInstanceClass = baseClass;
  }
  addPropagateEffects(template, templateInfo, options);
  let klass = class TemplateInstance extends baseClass {};
  klass.prototype._methodHost = findMethodHost(template);
  klass.prototype.__dataHost = template;
  klass.prototype.__templatizeOwner = owner;
  klass.prototype.__hostProps = templateInfo.hostProps;
  klass = klass;
  return klass;
}
function modelForElement(template, node) {
  let model;
  while (node) {
    if ((model = node.__templatizeInstance)) {
      if (model.__dataHost != template) {
        node = model.__dataHost;
      } else {
        return model;
      }
    } else {
      node = wrap(node).parentNode;
    }
  }
  return null;
}
const flush = function () {
  let shadyDOM, debouncers;
  do {
    shadyDOM = window.ShadyDOM && ShadyDOM.flush();
    if (window.ShadyCSS && window.ShadyCSS.ScopingShim) {
      window.ShadyCSS.ScopingShim.flush();
    }
    debouncers = flushDebouncers();
  } while (shadyDOM || debouncers);
};
class DomIf extends PolymerElement {
  static get is() {
    return "dom-if";
  }
  static get template() {
    return null;
  }
  static get properties() {
    return {
      if: { type: Boolean, observer: "__debounceRender" },
      restamp: { type: Boolean, observer: "__debounceRender" },
    };
  }
  constructor() {
    super();
    this.__renderDebouncer = null;
    this.__invalidProps = null;
    this.__instance = null;
    this._lastIf = false;
    this.__ctor = null;
    this.__hideTemplateChildren__ = false;
  }
  __debounceRender() {
    this.__renderDebouncer = Debouncer.debounce(
      this.__renderDebouncer,
      microTask,
      () => this.__render()
    );
    enqueueDebouncer(this.__renderDebouncer);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const parent = wrap(this).parentNode;
    if (
      !parent ||
      (parent.nodeType == Node.DOCUMENT_FRAGMENT_NODE && !wrap(parent).host)
    ) {
      this.__teardownInstance();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";
    if (this.if) {
      this.__debounceRender();
    }
  }
  render() {
    flush();
  }
  __render() {
    if (this.if) {
      if (!this.__ensureInstance()) {
        return;
      }
      this._showHideChildren();
    } else if (this.restamp) {
      this.__teardownInstance();
    }
    if (!this.restamp && this.__instance) {
      this._showHideChildren();
    }
    if (this.if != this._lastIf) {
      this.dispatchEvent(
        new CustomEvent("dom-change", { bubbles: true, composed: true })
      );
      this._lastIf = this.if;
    }
  }
  __ensureInstance() {
    let parentNode = wrap(this).parentNode;
    if (parentNode) {
      if (!this.__ctor) {
        let template = wrap(this).querySelector("template");
        if (!template) {
          let observer = new MutationObserver(() => {
            if (wrap(this).querySelector("template")) {
              observer.disconnect();
              this.__render();
            } else {
              throw new Error("dom-if requires a <template> child");
            }
          });
          observer.observe(this, { childList: true });
          return false;
        }
        this.__ctor = templatize(template, this, {
          mutableData: true,
          forwardHostProp: function (prop, value) {
            if (this.__instance) {
              if (this.if) {
                this.__instance.forwardHostProp(prop, value);
              } else {
                this.__invalidProps =
                  this.__invalidProps || Object.create(null);
                this.__invalidProps[root(prop)] = true;
              }
            }
          },
        });
      }
      if (!this.__instance) {
        this.__instance = new this.__ctor();
        wrap(parentNode).insertBefore(this.__instance.root, this);
      } else {
        this.__syncHostProperties();
        let c$ = this.__instance.children;
        if (c$ && c$.length) {
          let lastChild = wrap(this).previousSibling;
          if (lastChild !== c$[c$.length - 1]) {
            for (let i = 0, n; i < c$.length && (n = c$[i]); i++) {
              wrap(parentNode).insertBefore(n, this);
            }
          }
        }
      }
    }
    return true;
  }
  __syncHostProperties() {
    let props = this.__invalidProps;
    if (props) {
      for (let prop in props) {
        this.__instance._setPendingProperty(prop, this.__dataHost[prop]);
      }
      this.__invalidProps = null;
      this.__instance._flushProperties();
    }
  }
  __teardownInstance() {
    if (this.__instance) {
      let c$ = this.__instance.children;
      if (c$ && c$.length) {
        let parent = wrap(c$[0]).parentNode;
        if (parent) {
          parent = wrap(parent);
          for (let i = 0, n; i < c$.length && (n = c$[i]); i++) {
            parent.removeChild(n);
          }
        }
      }
      this.__instance = null;
      this.__invalidProps = null;
    }
  }
  _showHideChildren() {
    let hidden = this.__hideTemplateChildren__ || !this.if;
    if (this.__instance) {
      this.__instance._showHideChildren(hidden);
    }
  }
}
customElements.define(DomIf.is, DomIf);
const domRepeatBase = OptionalMutableData(PolymerElement);
class DomRepeat extends domRepeatBase {
  static get is() {
    return "dom-repeat";
  }
  static get template() {
    return null;
  }
  static get properties() {
    return {
      items: { type: Array },
      as: { type: String, value: "item" },
      indexAs: { type: String, value: "index" },
      itemsIndexAs: { type: String, value: "itemsIndex" },
      sort: { type: Function, observer: "__sortChanged" },
      filter: { type: Function, observer: "__filterChanged" },
      observe: { type: String, observer: "__observeChanged" },
      delay: Number,
      renderedItemCount: { type: Number, notify: true, readOnly: true },
      initialCount: { type: Number, observer: "__initializeChunking" },
      targetFramerate: { type: Number, value: 20 },
      _targetFrameTime: {
        type: Number,
        computed: "__computeFrameTime(targetFramerate)",
      },
    };
  }
  static get observers() {
    return ["__itemsChanged(items.*)"];
  }
  constructor() {
    super();
    this.__instances = [];
    this.__limit = Infinity;
    this.__pool = [];
    this.__renderDebouncer = null;
    this.__itemsIdxToInstIdx = {};
    this.__chunkCount = null;
    this.__lastChunkTime = null;
    this.__sortFn = null;
    this.__filterFn = null;
    this.__observePaths = null;
    this.__ctor = null;
    this.__isDetached = true;
    this.template = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__isDetached = true;
    for (let i = 0; i < this.__instances.length; i++) {
      this.__detachInstance(i);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";
    if (this.__isDetached) {
      this.__isDetached = false;
      let wrappedParent = wrap(wrap(this).parentNode);
      for (let i = 0; i < this.__instances.length; i++) {
        this.__attachInstance(i, wrappedParent);
      }
    }
  }
  __ensureTemplatized() {
    if (!this.__ctor) {
      let template = (this.template = this.querySelector("template"));
      if (!template) {
        let observer = new MutationObserver(() => {
          if (this.querySelector("template")) {
            observer.disconnect();
            this.__render();
          } else {
            throw new Error("dom-repeat requires a <template> child");
          }
        });
        observer.observe(this, { childList: true });
        return false;
      }
      let instanceProps = {};
      instanceProps[this.as] = true;
      instanceProps[this.indexAs] = true;
      instanceProps[this.itemsIndexAs] = true;
      this.__ctor = templatize(template, this, {
        mutableData: this.mutableData,
        parentModel: true,
        instanceProps: instanceProps,
        forwardHostProp: function (prop, value) {
          let i$ = this.__instances;
          for (let i = 0, inst; i < i$.length && (inst = i$[i]); i++) {
            inst.forwardHostProp(prop, value);
          }
        },
        notifyInstanceProp: function (inst, prop, value) {
          if (matches(this.as, prop)) {
            let idx = inst[this.itemsIndexAs];
            if (prop == this.as) {
              this.items[idx] = value;
            }
            let path = translate(
              this.as,
              `${JSCompiler_renameProperty("items", this)}.${idx}`,
              prop
            );
            this.notifyPath(path, value);
          }
        },
      });
    }
    return true;
  }
  __getMethodHost() {
    return this.__dataHost._methodHost || this.__dataHost;
  }
  __functionFromPropertyValue(functionOrMethodName) {
    if (typeof functionOrMethodName === "string") {
      let methodName = functionOrMethodName;
      let obj = this.__getMethodHost();
      return function () {
        return obj[methodName].apply(obj, arguments);
      };
    }
    return functionOrMethodName;
  }
  __sortChanged(sort) {
    this.__sortFn = this.__functionFromPropertyValue(sort);
    if (this.items) {
      this.__debounceRender(this.__render);
    }
  }
  __filterChanged(filter) {
    this.__filterFn = this.__functionFromPropertyValue(filter);
    if (this.items) {
      this.__debounceRender(this.__render);
    }
  }
  __computeFrameTime(rate) {
    return Math.ceil(1e3 / rate);
  }
  __initializeChunking() {
    if (this.initialCount) {
      this.__limit = this.initialCount;
      this.__chunkCount = this.initialCount;
      this.__lastChunkTime = performance.now();
    }
  }
  __tryRenderChunk() {
    if (this.items && this.__limit < this.items.length) {
      this.__debounceRender(this.__requestRenderChunk);
    }
  }
  __requestRenderChunk() {
    requestAnimationFrame(() => this.__renderChunk());
  }
  __renderChunk() {
    let currChunkTime = performance.now();
    let ratio = this._targetFrameTime / (currChunkTime - this.__lastChunkTime);
    this.__chunkCount = Math.round(this.__chunkCount * ratio) || 1;
    this.__limit += this.__chunkCount;
    this.__lastChunkTime = currChunkTime;
    this.__debounceRender(this.__render);
  }
  __observeChanged() {
    this.__observePaths =
      this.observe && this.observe.replace(".*", ".").split(" ");
  }
  __itemsChanged(change) {
    if (this.items && !Array.isArray(this.items)) {
      console.warn("dom-repeat expected array for `items`, found", this.items);
    }
    if (!this.__handleItemPath(change.path, change.value)) {
      this.__initializeChunking();
      this.__debounceRender(this.__render);
    }
  }
  __handleObservedPaths(path) {
    if (this.__sortFn || this.__filterFn) {
      if (!path) {
        this.__debounceRender(this.__render, this.delay);
      } else if (this.__observePaths) {
        let paths = this.__observePaths;
        for (let i = 0; i < paths.length; i++) {
          if (path.indexOf(paths[i]) === 0) {
            this.__debounceRender(this.__render, this.delay);
          }
        }
      }
    }
  }
  __debounceRender(fn, delay = 0) {
    this.__renderDebouncer = Debouncer.debounce(
      this.__renderDebouncer,
      delay > 0 ? timeOut.after(delay) : microTask,
      fn.bind(this)
    );
    enqueueDebouncer(this.__renderDebouncer);
  }
  render() {
    this.__debounceRender(this.__render);
    flush();
  }
  __render() {
    if (!this.__ensureTemplatized()) {
      return;
    }
    this.__applyFullRefresh();
    this.__pool.length = 0;
    this._setRenderedItemCount(this.__instances.length);
    this.dispatchEvent(
      new CustomEvent("dom-change", { bubbles: true, composed: true })
    );
    this.__tryRenderChunk();
  }
  __applyFullRefresh() {
    let items = this.items || [];
    let isntIdxToItemsIdx = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      isntIdxToItemsIdx[i] = i;
    }
    if (this.__filterFn) {
      isntIdxToItemsIdx = isntIdxToItemsIdx.filter((i, idx, array) =>
        this.__filterFn(items[i], idx, array)
      );
    }
    if (this.__sortFn) {
      isntIdxToItemsIdx.sort((a, b) => this.__sortFn(items[a], items[b]));
    }
    const itemsIdxToInstIdx = (this.__itemsIdxToInstIdx = {});
    let instIdx = 0;
    const limit = Math.min(isntIdxToItemsIdx.length, this.__limit);
    for (; instIdx < limit; instIdx++) {
      let inst = this.__instances[instIdx];
      let itemIdx = isntIdxToItemsIdx[instIdx];
      let item = items[itemIdx];
      itemsIdxToInstIdx[itemIdx] = instIdx;
      if (inst) {
        inst._setPendingProperty(this.as, item);
        inst._setPendingProperty(this.indexAs, instIdx);
        inst._setPendingProperty(this.itemsIndexAs, itemIdx);
        inst._flushProperties();
      } else {
        this.__insertInstance(item, instIdx, itemIdx);
      }
    }
    for (let i = this.__instances.length - 1; i >= instIdx; i--) {
      this.__detachAndRemoveInstance(i);
    }
  }
  __detachInstance(idx) {
    let inst = this.__instances[idx];
    const wrappedRoot = wrap(inst.root);
    for (let i = 0; i < inst.children.length; i++) {
      let el = inst.children[i];
      wrappedRoot.appendChild(el);
    }
    return inst;
  }
  __attachInstance(idx, parent) {
    let inst = this.__instances[idx];
    parent.insertBefore(inst.root, this);
  }
  __detachAndRemoveInstance(idx) {
    let inst = this.__detachInstance(idx);
    if (inst) {
      this.__pool.push(inst);
    }
    this.__instances.splice(idx, 1);
  }
  __stampInstance(item, instIdx, itemIdx) {
    let model = {};
    model[this.as] = item;
    model[this.indexAs] = instIdx;
    model[this.itemsIndexAs] = itemIdx;
    return new this.__ctor(model);
  }
  __insertInstance(item, instIdx, itemIdx) {
    let inst = this.__pool.pop();
    if (inst) {
      inst._setPendingProperty(this.as, item);
      inst._setPendingProperty(this.indexAs, instIdx);
      inst._setPendingProperty(this.itemsIndexAs, itemIdx);
      inst._flushProperties();
    } else {
      inst = this.__stampInstance(item, instIdx, itemIdx);
    }
    let beforeRow = this.__instances[instIdx + 1];
    let beforeNode = beforeRow ? beforeRow.children[0] : this;
    wrap(wrap(this).parentNode).insertBefore(inst.root, beforeNode);
    this.__instances[instIdx] = inst;
    return inst;
  }
  _showHideChildren(hidden) {
    for (let i = 0; i < this.__instances.length; i++) {
      this.__instances[i]._showHideChildren(hidden);
    }
  }
  __handleItemPath(path, value) {
    let itemsPath = path.slice(6);
    let dot = itemsPath.indexOf(".");
    let itemsIdx = dot < 0 ? itemsPath : itemsPath.substring(0, dot);
    if (itemsIdx == parseInt(itemsIdx, 10)) {
      let itemSubPath = dot < 0 ? "" : itemsPath.substring(dot + 1);
      this.__handleObservedPaths(itemSubPath);
      let instIdx = this.__itemsIdxToInstIdx[itemsIdx];
      let inst = this.__instances[instIdx];
      if (inst) {
        let itemPath = this.as + (itemSubPath ? "." + itemSubPath : "");
        inst._setPendingPropertyOrPath(itemPath, value, false, true);
        inst._flushProperties();
      }
      return true;
    }
  }
  itemForElement(el) {
    let instance = this.modelForElement(el);
    return instance && instance[this.as];
  }
  indexForElement(el) {
    let instance = this.modelForElement(el);
    return instance && instance[this.indexAs];
  }
  modelForElement(el) {
    return modelForElement(this.template, el);
  }
}
customElements.define(DomRepeat.is, DomRepeat);
const nativeShadow = !(window["ShadyDOM"] && window["ShadyDOM"]["inUse"]);
let nativeCssVariables_;
function calcCssVariables(settings) {
  if (settings && settings["shimcssproperties"]) {
    nativeCssVariables_ = false;
  } else {
    nativeCssVariables_ =
      nativeShadow ||
      Boolean(
        !navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) &&
          window.CSS &&
          CSS.supports &&
          CSS.supports("box-shadow", "0 0 0 var(--foo)")
      );
  }
}
let cssBuild;
if (window.ShadyCSS && window.ShadyCSS.cssBuild !== undefined) {
  cssBuild = window.ShadyCSS.cssBuild;
}
const disableRuntime = Boolean(
  window.ShadyCSS && window.ShadyCSS.disableRuntime
);
if (window.ShadyCSS && window.ShadyCSS.nativeCss !== undefined) {
  nativeCssVariables_ = window.ShadyCSS.nativeCss;
} else if (window.ShadyCSS) {
  calcCssVariables(window.ShadyCSS);
  window.ShadyCSS = undefined;
} else {
  calcCssVariables(window["WebComponents"] && window["WebComponents"]["flags"]);
}
const nativeCssVariables = nativeCssVariables_;
class StyleNode {
  constructor() {
    this["start"] = 0;
    this["end"] = 0;
    this["previous"] = null;
    this["parent"] = null;
    this["rules"] = null;
    this["parsedCssText"] = "";
    this["cssText"] = "";
    this["atRule"] = false;
    this["type"] = 0;
    this["keyframesName"] = "";
    this["selector"] = "";
    this["parsedSelector"] = "";
  }
}
function parse(text) {
  text = clean(text);
  return parseCss(lex(text), text);
}
function clean(cssText) {
  return cssText.replace(RX.comments, "").replace(RX.port, "");
}
function lex(text) {
  let root = new StyleNode();
  root["start"] = 0;
  root["end"] = text.length;
  let n = root;
  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n["rules"]) {
        n["rules"] = [];
      }
      let p = n;
      let previous = p["rules"][p["rules"].length - 1] || null;
      n = new StyleNode();
      n["start"] = i + 1;
      n["parent"] = p;
      n["previous"] = previous;
      p["rules"].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n["end"] = i + 1;
      n = n["parent"] || root;
    }
  }
  return root;
}
function parseCss(node, text) {
  let t = text.substring(node["start"], node["end"] - 1);
  node["parsedCssText"] = node["cssText"] = t.trim();
  if (node["parent"]) {
    let ss = node["previous"]
      ? node["previous"]["end"]
      : node["parent"]["start"];
    t = text.substring(ss, node["start"] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, " ");
    t = t.substring(t.lastIndexOf(";") + 1);
    let s = (node["parsedSelector"] = node["selector"] = t.trim());
    node["atRule"] = s.indexOf(AT_START) === 0;
    if (node["atRule"]) {
      if (s.indexOf(MEDIA_START) === 0) {
        node["type"] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node["type"] = types.KEYFRAMES_RULE;
        node["keyframesName"] = node["selector"].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node["type"] = types.MIXIN_RULE;
      } else {
        node["type"] = types.STYLE_RULE;
      }
    }
  }
  let r$ = node["rules"];
  if (r$) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }
  return node;
}
function _expandUnicodeEscapes(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
    let code = arguments[1],
      repeat = 6 - code.length;
    while (repeat--) {
      code = "0" + code;
    }
    return "\\" + code;
  });
}
function stringify(node, preserveProperties, text = "") {
  let cssText = "";
  if (node["cssText"] || node["rules"]) {
    let r$ = node["rules"];
    if (r$ && !_hasMixinRules(r$)) {
      for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties
        ? node["cssText"]
        : removeCustomProps(node["cssText"]);
      cssText = cssText.trim();
      if (cssText) {
        cssText = "  " + cssText + "\n";
      }
    }
  }
  if (cssText) {
    if (node["selector"]) {
      text += node["selector"] + " " + OPEN_BRACE + "\n";
    }
    text += cssText;
    if (node["selector"]) {
      text += CLOSE_BRACE + "\n\n";
    }
  }
  return text;
}
function _hasMixinRules(rules) {
  let r = rules[0];
  return (
    Boolean(r) &&
    Boolean(r["selector"]) &&
    r["selector"].indexOf(VAR_START) === 0
  );
}
function removeCustomProps(cssText) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}
function removeCustomPropAssignment(cssText) {
  return cssText.replace(RX.customProp, "").replace(RX.mixinProp, "");
}
function removeCustomPropApply(cssText) {
  return cssText.replace(RX.mixinApply, "").replace(RX.varApply, "");
}
const types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1e3,
};
const OPEN_BRACE = "{";
const CLOSE_BRACE = "}";
const RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g,
};
const VAR_START = "--";
const MEDIA_START = "@media";
const AT_START = "@";
const VAR_ASSIGN =
  /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
const MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
const MEDIA_MATCH = /@media\s(.*)/;
const styleTextSet = new Set();
const scopingAttribute = "shady-unscoped";
function processUnscopedStyle(style) {
  const text = style.textContent;
  if (!styleTextSet.has(text)) {
    styleTextSet.add(text);
    const newStyle = style.cloneNode(true);
    document.head.appendChild(newStyle);
  }
}
function isUnscopedStyle(style) {
  return style.hasAttribute(scopingAttribute);
}
function toCssText(rules, callback) {
  if (!rules) {
    return "";
  }
  if (typeof rules === "string") {
    rules = parse(rules);
  }
  if (callback) {
    forEachRule(rules, callback);
  }
  return stringify(rules, nativeCssVariables);
}
function rulesForStyle(style) {
  if (!style["__cssRules"] && style.textContent) {
    style["__cssRules"] = parse(style.textContent);
  }
  return style["__cssRules"] || null;
}
function forEachRule(
  node,
  styleRuleCallback,
  keyframesRuleCallback,
  onlyActiveRules
) {
  if (!node) {
    return;
  }
  let skipRules = false;
  let type = node["type"];
  if (onlyActiveRules) {
    if (type === types.MEDIA_RULE) {
      let matchMedia = node["selector"].match(MEDIA_MATCH);
      if (matchMedia) {
        if (!window.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }
  if (type === types.STYLE_RULE) {
    styleRuleCallback(node);
  } else if (keyframesRuleCallback && type === types.KEYFRAMES_RULE) {
    keyframesRuleCallback(node);
  } else if (type === types.MIXIN_RULE) {
    skipRules = true;
  }
  let r$ = node["rules"];
  if (r$ && !skipRules) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
}
function findMatchingParen(text, start) {
  let level = 0;
  for (let i = start, l = text.length; i < l; i++) {
    if (text[i] === "(") {
      level++;
    } else if (text[i] === ")") {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}
function processVariableAndFallback(str, callback) {
  let start = str.indexOf("var(");
  if (start === -1) {
    return callback(str, "", "", "");
  }
  let end = findMatchingParen(str, start + 3);
  let inner = str.substring(start + 4, end);
  let prefix = str.substring(0, start);
  let suffix = processVariableAndFallback(str.substring(end + 1), callback);
  let comma = inner.indexOf(",");
  if (comma === -1) {
    return callback(prefix, inner.trim(), "", suffix);
  }
  let value = inner.substring(0, comma).trim();
  let fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
}
(window["ShadyDOM"] && window["ShadyDOM"]["wrap"]) || ((node) => node);
function getIsExtends(element) {
  let localName = element["localName"];
  let is = "",
    typeExtension = "";
  if (localName) {
    if (localName.indexOf("-") > -1) {
      is = localName;
    } else {
      typeExtension = localName;
      is = (element.getAttribute && element.getAttribute("is")) || "";
    }
  } else {
    is = element.is;
    typeExtension = element.extends;
  }
  return { is: is, typeExtension: typeExtension };
}
function gatherStyleText(element) {
  const styleTextParts = [];
  const styles = element.querySelectorAll("style");
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    if (isUnscopedStyle(style)) {
      if (!nativeShadow) {
        processUnscopedStyle(style);
        style.parentNode.removeChild(style);
      }
    } else {
      styleTextParts.push(style.textContent);
      style.parentNode.removeChild(style);
    }
  }
  return styleTextParts.join("").trim();
}
const CSS_BUILD_ATTR = "css-build";
function getCssBuild(element) {
  if (cssBuild !== undefined) {
    return cssBuild;
  }
  if (element.__cssBuild === undefined) {
    const attrValue = element.getAttribute(CSS_BUILD_ATTR);
    if (attrValue) {
      element.__cssBuild = attrValue;
    } else {
      const buildComment = getBuildComment(element);
      if (buildComment !== "") {
        removeBuildComment(element);
      }
      element.__cssBuild = buildComment;
    }
  }
  return element.__cssBuild || "";
}
function elementHasBuiltCss(element) {
  return getCssBuild(element) !== "";
}
function getBuildComment(element) {
  const buildComment =
    element.localName === "template"
      ? element.content.firstChild
      : element.firstChild;
  if (buildComment instanceof Comment) {
    const commentParts = buildComment.textContent.trim().split(":");
    if (commentParts[0] === CSS_BUILD_ATTR) {
      return commentParts[1];
    }
  }
  return "";
}
function removeBuildComment(element) {
  const buildComment =
    element.localName === "template"
      ? element.content.firstChild
      : element.firstChild;
  buildComment.parentNode.removeChild(buildComment);
}
function updateNativeProperties(element, properties) {
  for (let p in properties) {
    if (p === null) {
      element.style.removeProperty(p);
    } else {
      element.style.setProperty(p, properties[p]);
    }
  }
}
function getComputedStyleValue(element, property) {
  const value = window.getComputedStyle(element).getPropertyValue(property);
  if (!value) {
    return "";
  } else {
    return value.trim();
  }
}
function detectMixin(cssText) {
  const has = MIXIN_MATCH.test(cssText) || VAR_ASSIGN.test(cssText);
  MIXIN_MATCH.lastIndex = 0;
  VAR_ASSIGN.lastIndex = 0;
  return has;
}
const APPLY_NAME_CLEAN = /;\s*/m;
const INITIAL_INHERIT = /^\s*(initial)|(inherit)\s*$/;
const IMPORTANT = /\s*!important/;
const MIXIN_VAR_SEP = "_-_";
class MixinMap {
  constructor() {
    this._map = {};
  }
  set(name, props) {
    name = name.trim();
    this._map[name] = { properties: props, dependants: {} };
  }
  get(name) {
    name = name.trim();
    return this._map[name] || null;
  }
}
let invalidCallback = null;
class ApplyShim {
  constructor() {
    this._currentElement = null;
    this._measureElement = null;
    this._map = new MixinMap();
  }
  detectMixin(cssText) {
    return detectMixin(cssText);
  }
  gatherStyles(template) {
    const styleText = gatherStyleText(template.content);
    if (styleText) {
      const style = document.createElement("style");
      style.textContent = styleText;
      template.content.insertBefore(style, template.content.firstChild);
      return style;
    }
    return null;
  }
  transformTemplate(template, elementName) {
    if (template._gatheredStyle === undefined) {
      template._gatheredStyle = this.gatherStyles(template);
    }
    const style = template._gatheredStyle;
    return style ? this.transformStyle(style, elementName) : null;
  }
  transformStyle(style, elementName = "") {
    let ast = rulesForStyle(style);
    this.transformRules(ast, elementName);
    style.textContent = toCssText(ast);
    return ast;
  }
  transformCustomStyle(style) {
    let ast = rulesForStyle(style);
    forEachRule(ast, (rule) => {
      if (rule["selector"] === ":root") {
        rule["selector"] = "html";
      }
      this.transformRule(rule);
    });
    style.textContent = toCssText(ast);
    return ast;
  }
  transformRules(rules, elementName) {
    this._currentElement = elementName;
    forEachRule(rules, (r) => {
      this.transformRule(r);
    });
    this._currentElement = null;
  }
  transformRule(rule) {
    rule["cssText"] = this.transformCssText(rule["parsedCssText"], rule);
    if (rule["selector"] === ":root") {
      rule["selector"] = ":host > *";
    }
  }
  transformCssText(cssText, rule) {
    cssText = cssText.replace(
      VAR_ASSIGN,
      (matchText, propertyName, valueProperty, valueMixin) =>
        this._produceCssProperties(
          matchText,
          propertyName,
          valueProperty,
          valueMixin,
          rule
        )
    );
    return this._consumeCssProperties(cssText, rule);
  }
  _getInitialValueForProperty(property) {
    if (!this._measureElement) {
      this._measureElement = document.createElement("meta");
      this._measureElement.setAttribute("apply-shim-measure", "");
      this._measureElement.style.all = "initial";
      document.head.appendChild(this._measureElement);
    }
    return window
      .getComputedStyle(this._measureElement)
      .getPropertyValue(property);
  }
  _fallbacksFromPreviousRules(startRule) {
    let topRule = startRule;
    while (topRule["parent"]) {
      topRule = topRule["parent"];
    }
    const fallbacks = {};
    let seenStartRule = false;
    forEachRule(topRule, (r) => {
      seenStartRule = seenStartRule || r === startRule;
      if (seenStartRule) {
        return;
      }
      if (r["selector"] === startRule["selector"]) {
        Object.assign(fallbacks, this._cssTextToMap(r["parsedCssText"]));
      }
    });
    return fallbacks;
  }
  _consumeCssProperties(text, rule) {
    let m = null;
    while ((m = MIXIN_MATCH.exec(text))) {
      let matchText = m[0];
      let mixinName = m[1];
      let idx = m.index;
      let applyPos = idx + matchText.indexOf("@apply");
      let afterApplyPos = idx + matchText.length;
      let textBeforeApply = text.slice(0, applyPos);
      let textAfterApply = text.slice(afterApplyPos);
      let defaults = rule ? this._fallbacksFromPreviousRules(rule) : {};
      Object.assign(defaults, this._cssTextToMap(textBeforeApply));
      let replacement = this._atApplyToCssProperties(mixinName, defaults);
      text = `${textBeforeApply}${replacement}${textAfterApply}`;
      MIXIN_MATCH.lastIndex = idx + replacement.length;
    }
    return text;
  }
  _atApplyToCssProperties(mixinName, fallbacks) {
    mixinName = mixinName.replace(APPLY_NAME_CLEAN, "");
    let vars = [];
    let mixinEntry = this._map.get(mixinName);
    if (!mixinEntry) {
      this._map.set(mixinName, {});
      mixinEntry = this._map.get(mixinName);
    }
    if (mixinEntry) {
      if (this._currentElement) {
        mixinEntry.dependants[this._currentElement] = true;
      }
      let p, parts, f;
      const properties = mixinEntry.properties;
      for (p in properties) {
        f = fallbacks && fallbacks[p];
        parts = [p, ": var(", mixinName, MIXIN_VAR_SEP, p];
        if (f) {
          parts.push(",", f.replace(IMPORTANT, ""));
        }
        parts.push(")");
        if (IMPORTANT.test(properties[p])) {
          parts.push(" !important");
        }
        vars.push(parts.join(""));
      }
    }
    return vars.join("; ");
  }
  _replaceInitialOrInherit(property, value) {
    let match = INITIAL_INHERIT.exec(value);
    if (match) {
      if (match[1]) {
        value = this._getInitialValueForProperty(property);
      } else {
        value = "apply-shim-inherit";
      }
    }
    return value;
  }
  _cssTextToMap(text, replaceInitialOrInherit = false) {
    let props = text.split(";");
    let property, value;
    let out = {};
    for (let i = 0, p, sp; i < props.length; i++) {
      p = props[i];
      if (p) {
        sp = p.split(":");
        if (sp.length > 1) {
          property = sp[0].trim();
          value = sp.slice(1).join(":");
          if (replaceInitialOrInherit) {
            value = this._replaceInitialOrInherit(property, value);
          }
          out[property] = value;
        }
      }
    }
    return out;
  }
  _invalidateMixinEntry(mixinEntry) {
    if (!invalidCallback) {
      return;
    }
    for (let elementName in mixinEntry.dependants) {
      if (elementName !== this._currentElement) {
        invalidCallback(elementName);
      }
    }
  }
  _produceCssProperties(
    matchText,
    propertyName,
    valueProperty,
    valueMixin,
    rule
  ) {
    if (valueProperty) {
      processVariableAndFallback(valueProperty, (prefix, value) => {
        if (value && this._map.get(value)) {
          valueMixin = `@apply ${value};`;
        }
      });
    }
    if (!valueMixin) {
      return matchText;
    }
    let mixinAsProperties = this._consumeCssProperties("" + valueMixin, rule);
    let prefix = matchText.slice(0, matchText.indexOf("--"));
    let mixinValues = this._cssTextToMap(mixinAsProperties, true);
    let combinedProps = mixinValues;
    let mixinEntry = this._map.get(propertyName);
    let oldProps = mixinEntry && mixinEntry.properties;
    if (oldProps) {
      combinedProps = Object.assign(Object.create(oldProps), mixinValues);
    } else {
      this._map.set(propertyName, combinedProps);
    }
    let out = [];
    let p, v;
    let needToInvalidate = false;
    for (p in combinedProps) {
      v = mixinValues[p];
      if (v === undefined) {
        v = "initial";
      }
      if (oldProps && !(p in oldProps)) {
        needToInvalidate = true;
      }
      out.push(`${propertyName}${MIXIN_VAR_SEP}${p}: ${v}`);
    }
    if (needToInvalidate) {
      this._invalidateMixinEntry(mixinEntry);
    }
    if (mixinEntry) {
      mixinEntry.properties = combinedProps;
    }
    if (valueProperty) {
      prefix = `${matchText};${prefix}`;
    }
    return `${prefix}${out.join("; ")};`;
  }
}
ApplyShim.prototype["detectMixin"] = ApplyShim.prototype.detectMixin;
ApplyShim.prototype["transformStyle"] = ApplyShim.prototype.transformStyle;
ApplyShim.prototype["transformCustomStyle"] =
  ApplyShim.prototype.transformCustomStyle;
ApplyShim.prototype["transformRules"] = ApplyShim.prototype.transformRules;
ApplyShim.prototype["transformRule"] = ApplyShim.prototype.transformRule;
ApplyShim.prototype["transformTemplate"] =
  ApplyShim.prototype.transformTemplate;
ApplyShim.prototype["_separator"] = MIXIN_VAR_SEP;
Object.defineProperty(ApplyShim.prototype, "invalidCallback", {
  get() {
    return invalidCallback;
  },
  set(cb) {
    invalidCallback = cb;
  },
});
const templateMap = {};
const CURRENT_VERSION = "_applyShimCurrentVersion";
const NEXT_VERSION = "_applyShimNextVersion";
const VALIDATING_VERSION = "_applyShimValidatingVersion";
const promise = Promise.resolve();
function invalidate(elementName) {
  let template = templateMap[elementName];
  if (template) {
    invalidateTemplate(template);
  }
}
function invalidateTemplate(template) {
  template[CURRENT_VERSION] = template[CURRENT_VERSION] || 0;
  template[VALIDATING_VERSION] = template[VALIDATING_VERSION] || 0;
  template[NEXT_VERSION] = (template[NEXT_VERSION] || 0) + 1;
}
function templateIsValid(template) {
  return template[CURRENT_VERSION] === template[NEXT_VERSION];
}
function templateIsValidating(template) {
  return (
    !templateIsValid(template) &&
    template[VALIDATING_VERSION] === template[NEXT_VERSION]
  );
}
function startValidatingTemplate(template) {
  template[VALIDATING_VERSION] = template[NEXT_VERSION];
  if (!template._validating) {
    template._validating = true;
    promise.then(function () {
      template[CURRENT_VERSION] = template[NEXT_VERSION];
      template._validating = false;
    });
  }
}
let readyPromise = null;
let whenReady =
  (window["HTMLImports"] && window["HTMLImports"]["whenReady"]) || null;
let resolveFn;
function documentWait(callback) {
  requestAnimationFrame(function () {
    if (whenReady) {
      whenReady(callback);
    } else {
      if (!readyPromise) {
        readyPromise = new Promise((resolve) => {
          resolveFn = resolve;
        });
        if (document.readyState === "complete") {
          resolveFn();
        } else {
          document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
              resolveFn();
            }
          });
        }
      }
      readyPromise.then(function () {
        callback && callback();
      });
    }
  });
}
const SEEN_MARKER = "__seenByShadyCSS";
const CACHED_STYLE = "__shadyCSSCachedStyle";
let transformFn = null;
let validateFn = null;
class CustomStyleInterface$1 {
  constructor() {
    this["customStyles"] = [];
    this["enqueued"] = false;
    documentWait(() => {
      if (window["ShadyCSS"]["flushCustomStyles"]) {
        window["ShadyCSS"]["flushCustomStyles"]();
      }
    });
  }
  enqueueDocumentValidation() {
    if (this["enqueued"] || !validateFn) {
      return;
    }
    this["enqueued"] = true;
    documentWait(validateFn);
  }
  addCustomStyle(style) {
    if (!style[SEEN_MARKER]) {
      style[SEEN_MARKER] = true;
      this["customStyles"].push(style);
      this.enqueueDocumentValidation();
    }
  }
  getStyleForCustomStyle(customStyle) {
    if (customStyle[CACHED_STYLE]) {
      return customStyle[CACHED_STYLE];
    }
    let style;
    if (customStyle["getStyle"]) {
      style = customStyle["getStyle"]();
    } else {
      style = customStyle;
    }
    return style;
  }
  processStyles() {
    const cs = this["customStyles"];
    for (let i = 0; i < cs.length; i++) {
      const customStyle = cs[i];
      if (customStyle[CACHED_STYLE]) {
        continue;
      }
      const style = this.getStyleForCustomStyle(customStyle);
      if (style) {
        const styleToTransform = style["__appliedElement"] || style;
        if (transformFn) {
          transformFn(styleToTransform);
        }
        customStyle[CACHED_STYLE] = styleToTransform;
      }
    }
    return cs;
  }
}
CustomStyleInterface$1.prototype["addCustomStyle"] =
  CustomStyleInterface$1.prototype.addCustomStyle;
CustomStyleInterface$1.prototype["getStyleForCustomStyle"] =
  CustomStyleInterface$1.prototype.getStyleForCustomStyle;
CustomStyleInterface$1.prototype["processStyles"] =
  CustomStyleInterface$1.prototype.processStyles;
Object.defineProperties(CustomStyleInterface$1.prototype, {
  transformCallback: {
    get() {
      return transformFn;
    },
    set(fn) {
      transformFn = fn;
    },
  },
  validateCallback: {
    get() {
      return validateFn;
    },
    set(fn) {
      let needsEnqueue = false;
      if (!validateFn) {
        needsEnqueue = true;
      }
      validateFn = fn;
      if (needsEnqueue) {
        this.enqueueDocumentValidation();
      }
    },
  },
});
const applyShim = new ApplyShim();
class ApplyShimInterface {
  constructor() {
    this.customStyleInterface = null;
    applyShim["invalidCallback"] = invalidate;
  }
  ensure() {
    if (this.customStyleInterface) {
      return;
    }
    if (window.ShadyCSS.CustomStyleInterface) {
      this.customStyleInterface = window.ShadyCSS.CustomStyleInterface;
      this.customStyleInterface["transformCallback"] = (style) => {
        applyShim.transformCustomStyle(style);
      };
      this.customStyleInterface["validateCallback"] = () => {
        requestAnimationFrame(() => {
          if (this.customStyleInterface["enqueued"]) {
            this.flushCustomStyles();
          }
        });
      };
    }
  }
  prepareTemplate(template, elementName) {
    this.ensure();
    if (elementHasBuiltCss(template)) {
      return;
    }
    templateMap[elementName] = template;
    let ast = applyShim.transformTemplate(template, elementName);
    template["_styleAst"] = ast;
  }
  flushCustomStyles() {
    this.ensure();
    if (!this.customStyleInterface) {
      return;
    }
    let styles = this.customStyleInterface["processStyles"]();
    if (!this.customStyleInterface["enqueued"]) {
      return;
    }
    for (let i = 0; i < styles.length; i++) {
      let cs = styles[i];
      let style = this.customStyleInterface["getStyleForCustomStyle"](cs);
      if (style) {
        applyShim.transformCustomStyle(style);
      }
    }
    this.customStyleInterface["enqueued"] = false;
  }
  styleSubtree(element, properties) {
    this.ensure();
    if (properties) {
      updateNativeProperties(element, properties);
    }
    if (element.shadowRoot) {
      this.styleElement(element);
      let shadowChildren =
        element.shadowRoot.children || element.shadowRoot.childNodes;
      for (let i = 0; i < shadowChildren.length; i++) {
        this.styleSubtree(shadowChildren[i]);
      }
    } else {
      let children = element.children || element.childNodes;
      for (let i = 0; i < children.length; i++) {
        this.styleSubtree(children[i]);
      }
    }
  }
  styleElement(element) {
    this.ensure();
    let { is: is } = getIsExtends(element);
    let template = templateMap[is];
    if (template && elementHasBuiltCss(template)) {
      return;
    }
    if (template && !templateIsValid(template)) {
      if (!templateIsValidating(template)) {
        this.prepareTemplate(template, is);
        startValidatingTemplate(template);
      }
      let root = element.shadowRoot;
      if (root) {
        let style = root.querySelector("style");
        if (style) {
          style["__cssRules"] = template["_styleAst"];
          style.textContent = toCssText(template["_styleAst"]);
        }
      }
    }
  }
  styleDocument(properties) {
    this.ensure();
    this.styleSubtree(document.body, properties);
  }
}
if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
  const applyShimInterface = new ApplyShimInterface();
  let CustomStyleInterface =
    window.ShadyCSS && window.ShadyCSS.CustomStyleInterface;
  window.ShadyCSS = {
    prepareTemplate(template, elementName, elementExtends) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.prepareTemplate(template, elementName);
    },
    prepareTemplateStyles(template, elementName, elementExtends) {
      window.ShadyCSS.prepareTemplate(template, elementName, elementExtends);
    },
    prepareTemplateDom(template, elementName) {},
    styleSubtree(element, properties) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleSubtree(element, properties);
    },
    styleElement(element) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleElement(element);
    },
    styleDocument(properties) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleDocument(properties);
    },
    getComputedStyleValue(element, property) {
      return getComputedStyleValue(element, property);
    },
    flushCustomStyles() {
      applyShimInterface.flushCustomStyles();
    },
    nativeCss: nativeCssVariables,
    nativeShadow: nativeShadow,
    cssBuild: cssBuild,
    disableRuntime: disableRuntime,
  };
  if (CustomStyleInterface) {
    window.ShadyCSS.CustomStyleInterface = CustomStyleInterface;
  }
}
window.ShadyCSS.ApplyShim = applyShim;
const GestureEventListeners = dedupingMixin((superClass) => {
  class GestureEventListeners extends superClass {
    _addEventListenerToNode(node, eventName, handler) {
      if (!addListener(node, eventName, handler)) {
        super._addEventListenerToNode(node, eventName, handler);
      }
    }
    _removeEventListenerFromNode(node, eventName, handler) {
      if (!removeListener(node, eventName, handler)) {
        super._removeEventListenerFromNode(node, eventName, handler);
      }
    }
  }
  return GestureEventListeners;
});
let scheduled = false;
let beforeRenderQueue = [];
let afterRenderQueue = [];
function schedule() {
  scheduled = true;
  requestAnimationFrame(function () {
    scheduled = false;
    flushQueue(beforeRenderQueue);
    setTimeout(function () {
      runQueue(afterRenderQueue);
    });
  });
}
function flushQueue(queue) {
  while (queue.length) {
    callMethod(queue.shift());
  }
}
function runQueue(queue) {
  for (let i = 0, l = queue.length; i < l; i++) {
    callMethod(queue.shift());
  }
}
function callMethod(info) {
  const context = info[0];
  const callback = info[1];
  const args = info[2];
  try {
    callback.apply(context, args);
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}
function beforeNextRender(context, callback, args) {
  if (!scheduled) {
    schedule();
  }
  beforeRenderQueue.push([context, callback, args]);
}
function afterNextRender(context, callback, args) {
  if (!scheduled) {
    schedule();
  }
  afterRenderQueue.push([context, callback, args]);
}
function resolve() {
  document.body.removeAttribute("unresolved");
}
if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  resolve();
} else {
  window.addEventListener("DOMContentLoaded", resolve);
}
function newSplice(index, removed, addedCount) {
  return { index: index, removed: removed, addedCount: addedCount };
}
const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;
function calcEditDistances(
  current,
  currentStart,
  currentEnd,
  old,
  oldStart,
  oldEnd
) {
  let rowCount = oldEnd - oldStart + 1;
  let columnCount = currentEnd - currentStart + 1;
  let distances = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  }
  for (let j = 0; j < columnCount; j++) distances[0][j] = j;
  for (let i = 1; i < rowCount; i++) {
    for (let j = 1; j < columnCount; j++) {
      if (equals(current[currentStart + j - 1], old[oldStart + i - 1]))
        distances[i][j] = distances[i - 1][j - 1];
      else {
        let north = distances[i - 1][j] + 1;
        let west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }
  return distances;
}
function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  let edits = [];
  while (i > 0 || j > 0) {
    if (i == 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }
    if (j == 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }
    let northWest = distances[i - 1][j - 1];
    let west = distances[i - 1][j];
    let north = distances[i][j - 1];
    let min;
    if (west < north) min = west < northWest ? west : northWest;
    else min = north < northWest ? north : northWest;
    if (min == northWest) {
      if (northWest == current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }
      i--;
      j--;
    } else if (min == west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }
  edits.reverse();
  return edits;
}
function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  let prefixCount = 0;
  let suffixCount = 0;
  let splice;
  let minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
  if (currentStart == 0 && oldStart == 0)
    prefixCount = sharedPrefix(current, old, minLength);
  if (currentEnd == current.length && oldEnd == old.length)
    suffixCount = sharedSuffix(current, old, minLength - prefixCount);
  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;
  if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];
  if (currentStart == currentEnd) {
    splice = newSplice(currentStart, [], 0);
    while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);
    return [splice];
  } else if (oldStart == oldEnd)
    return [newSplice(currentStart, [], currentEnd - currentStart)];
  let ops = spliceOperationsFromEditDistances(
    calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd)
  );
  splice = undefined;
  let splices = [];
  let index = currentStart;
  let oldIndex = oldStart;
  for (let i = 0; i < ops.length; i++) {
    switch (ops[i]) {
      case EDIT_LEAVE:
        if (splice) {
          splices.push(splice);
          splice = undefined;
        }
        index++;
        oldIndex++;
        break;
      case EDIT_UPDATE:
        if (!splice) splice = newSplice(index, [], 0);
        splice.addedCount++;
        index++;
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
      case EDIT_ADD:
        if (!splice) splice = newSplice(index, [], 0);
        splice.addedCount++;
        index++;
        break;
      case EDIT_DELETE:
        if (!splice) splice = newSplice(index, [], 0);
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
    }
  }
  if (splice) {
    splices.push(splice);
  }
  return splices;
}
function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; i++)
    if (!equals(current[i], old[i])) return i;
  return searchLength;
}
function sharedSuffix(current, old, searchLength) {
  let index1 = current.length;
  let index2 = old.length;
  let count = 0;
  while (count < searchLength && equals(current[--index1], old[--index2]))
    count++;
  return count;
}
function calculateSplices(current, previous) {
  return calcSplices(current, 0, current.length, previous, 0, previous.length);
}
function equals(currentValue, previousValue) {
  return currentValue === previousValue;
}
function isSlot(node) {
  return node.localName === "slot";
}
let FlattenedNodesObserver = class {
  static getFlattenedNodes(node) {
    const wrapped = wrap(node);
    if (isSlot(node)) {
      node = node;
      return wrapped.assignedNodes({ flatten: true });
    } else {
      return Array.from(wrapped.childNodes)
        .map((node) => {
          if (isSlot(node)) {
            node = node;
            return wrap(node).assignedNodes({ flatten: true });
          } else {
            return [node];
          }
        })
        .reduce((a, b) => a.concat(b), []);
    }
  }
  constructor(target, callback) {
    this._shadyChildrenObserver = null;
    this._nativeChildrenObserver = null;
    this._connected = false;
    this._target = target;
    this.callback = callback;
    this._effectiveNodes = [];
    this._observer = null;
    this._scheduled = false;
    this._boundSchedule = () => {
      this._schedule();
    };
    this.connect();
    this._schedule();
  }
  connect() {
    if (isSlot(this._target)) {
      this._listenSlots([this._target]);
    } else if (wrap(this._target).children) {
      this._listenSlots(wrap(this._target).children);
      if (window.ShadyDOM) {
        this._shadyChildrenObserver = ShadyDOM.observeChildren(
          this._target,
          (mutations) => {
            this._processMutations(mutations);
          }
        );
      } else {
        this._nativeChildrenObserver = new MutationObserver((mutations) => {
          this._processMutations(mutations);
        });
        this._nativeChildrenObserver.observe(this._target, { childList: true });
      }
    }
    this._connected = true;
  }
  disconnect() {
    if (isSlot(this._target)) {
      this._unlistenSlots([this._target]);
    } else if (wrap(this._target).children) {
      this._unlistenSlots(wrap(this._target).children);
      if (window.ShadyDOM && this._shadyChildrenObserver) {
        ShadyDOM.unobserveChildren(this._shadyChildrenObserver);
        this._shadyChildrenObserver = null;
      } else if (this._nativeChildrenObserver) {
        this._nativeChildrenObserver.disconnect();
        this._nativeChildrenObserver = null;
      }
    }
    this._connected = false;
  }
  _schedule() {
    if (!this._scheduled) {
      this._scheduled = true;
      microTask.run(() => this.flush());
    }
  }
  _processMutations(mutations) {
    this._processSlotMutations(mutations);
    this.flush();
  }
  _processSlotMutations(mutations) {
    if (mutations) {
      for (let i = 0; i < mutations.length; i++) {
        let mutation = mutations[i];
        if (mutation.addedNodes) {
          this._listenSlots(mutation.addedNodes);
        }
        if (mutation.removedNodes) {
          this._unlistenSlots(mutation.removedNodes);
        }
      }
    }
  }
  flush() {
    if (!this._connected) {
      return false;
    }
    if (window.ShadyDOM) {
      ShadyDOM.flush();
    }
    if (this._nativeChildrenObserver) {
      this._processSlotMutations(this._nativeChildrenObserver.takeRecords());
    } else if (this._shadyChildrenObserver) {
      this._processSlotMutations(this._shadyChildrenObserver.takeRecords());
    }
    this._scheduled = false;
    let info = { target: this._target, addedNodes: [], removedNodes: [] };
    let newNodes = this.constructor.getFlattenedNodes(this._target);
    let splices = calculateSplices(newNodes, this._effectiveNodes);
    for (let i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (let j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
        info.removedNodes.push(n);
      }
    }
    for (let i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (let j = s.index; j < s.index + s.addedCount; j++) {
        info.addedNodes.push(newNodes[j]);
      }
    }
    this._effectiveNodes = newNodes;
    let didFlush = false;
    if (info.addedNodes.length || info.removedNodes.length) {
      didFlush = true;
      this.callback.call(this._target, info);
    }
    return didFlush;
  }
  _listenSlots(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      let n = nodeList[i];
      if (isSlot(n)) {
        n.addEventListener("slotchange", this._boundSchedule);
      }
    }
  }
  _unlistenSlots(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      let n = nodeList[i];
      if (isSlot(n)) {
        n.removeEventListener("slotchange", this._boundSchedule);
      }
    }
  }
};
const p = Element.prototype;
const normalizedMatchesSelector =
  p.matches ||
  p.matchesSelector ||
  p.mozMatchesSelector ||
  p.msMatchesSelector ||
  p.oMatchesSelector ||
  p.webkitMatchesSelector;
const matchesSelector = function (node, selector) {
  return normalizedMatchesSelector.call(node, selector);
};
class DomApiNative {
  constructor(node) {
    this.node = node;
  }
  observeNodes(callback) {
    return new FlattenedNodesObserver(this.node, callback);
  }
  unobserveNodes(observerHandle) {
    observerHandle.disconnect();
  }
  notifyObserver() {}
  deepContains(node) {
    if (wrap(this.node).contains(node)) {
      return true;
    }
    let n = node;
    let doc = node.ownerDocument;
    while (n && n !== doc && n !== this.node) {
      n = wrap(n).parentNode || wrap(n).host;
    }
    return n === this.node;
  }
  getOwnerRoot() {
    return wrap(this.node).getRootNode();
  }
  getDistributedNodes() {
    return this.node.localName === "slot"
      ? wrap(this.node).assignedNodes({ flatten: true })
      : [];
  }
  getDestinationInsertionPoints() {
    let ip$ = [];
    let n = wrap(this.node).assignedSlot;
    while (n) {
      ip$.push(n);
      n = wrap(n).assignedSlot;
    }
    return ip$;
  }
  importNode(node, deep) {
    let doc =
      this.node instanceof Document ? this.node : this.node.ownerDocument;
    return wrap(doc).importNode(node, deep);
  }
  getEffectiveChildNodes() {
    return FlattenedNodesObserver.getFlattenedNodes(this.node);
  }
  queryDistributedElements(selector) {
    let c$ = this.getEffectiveChildNodes();
    let list = [];
    for (let i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
      if (c.nodeType === Node.ELEMENT_NODE && matchesSelector(c, selector)) {
        list.push(c);
      }
    }
    return list;
  }
  get activeElement() {
    let node = this.node;
    return node._activeElement !== undefined
      ? node._activeElement
      : node.activeElement;
  }
}
function forwardMethods(proto, methods) {
  for (let i = 0; i < methods.length; i++) {
    let method = methods[i];
    proto[method] = function () {
      return this.node[method].apply(this.node, arguments);
    };
  }
}
function forwardReadOnlyProperties(proto, properties) {
  for (let i = 0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      get: function () {
        const domApi = this;
        return domApi.node[name];
      },
      configurable: true,
    });
  }
}
function forwardProperties(proto, properties) {
  for (let i = 0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      get: function () {
        return this.node[name];
      },
      set: function (value) {
        this.node[name] = value;
      },
      configurable: true,
    });
  }
}
class EventApi {
  constructor(event) {
    this.event = event;
  }
  get rootTarget() {
    return this.path[0];
  }
  get localTarget() {
    return this.event.target;
  }
  get path() {
    return this.event.composedPath();
  }
}
DomApiNative.prototype.cloneNode;
DomApiNative.prototype.appendChild;
DomApiNative.prototype.insertBefore;
DomApiNative.prototype.removeChild;
DomApiNative.prototype.replaceChild;
DomApiNative.prototype.setAttribute;
DomApiNative.prototype.removeAttribute;
DomApiNative.prototype.querySelector;
DomApiNative.prototype.querySelectorAll;
DomApiNative.prototype.parentNode;
DomApiNative.prototype.firstChild;
DomApiNative.prototype.lastChild;
DomApiNative.prototype.nextSibling;
DomApiNative.prototype.previousSibling;
DomApiNative.prototype.firstElementChild;
DomApiNative.prototype.lastElementChild;
DomApiNative.prototype.nextElementSibling;
DomApiNative.prototype.previousElementSibling;
DomApiNative.prototype.childNodes;
DomApiNative.prototype.children;
DomApiNative.prototype.classList;
DomApiNative.prototype.textContent;
DomApiNative.prototype.innerHTML;
let DomApiImpl = DomApiNative;
if (
  window["ShadyDOM"] &&
  window["ShadyDOM"]["inUse"] &&
  window["ShadyDOM"]["noPatch"] &&
  window["ShadyDOM"]["Wrapper"]
) {
  class Wrapper extends window["ShadyDOM"]["Wrapper"] {}
  Object.getOwnPropertyNames(DomApiNative.prototype).forEach((prop) => {
    if (prop != "activeElement") {
      Wrapper.prototype[prop] = DomApiNative.prototype[prop];
    }
  });
  forwardReadOnlyProperties(Wrapper.prototype, ["classList"]);
  DomApiImpl = Wrapper;
  Object.defineProperties(EventApi.prototype, {
    localTarget: {
      get() {
        return this.event.currentTarget;
      },
      configurable: true,
    },
    path: {
      get() {
        return window["ShadyDOM"]["composedPath"](this.event);
      },
      configurable: true,
    },
  });
} else {
  forwardMethods(DomApiNative.prototype, [
    "cloneNode",
    "appendChild",
    "insertBefore",
    "removeChild",
    "replaceChild",
    "setAttribute",
    "removeAttribute",
    "querySelector",
    "querySelectorAll",
  ]);
  forwardReadOnlyProperties(DomApiNative.prototype, [
    "parentNode",
    "firstChild",
    "lastChild",
    "nextSibling",
    "previousSibling",
    "firstElementChild",
    "lastElementChild",
    "nextElementSibling",
    "previousElementSibling",
    "childNodes",
    "children",
    "classList",
  ]);
  forwardProperties(DomApiNative.prototype, ["textContent", "innerHTML"]);
}
const dom = function (obj) {
  obj = obj || document;
  if (obj instanceof DomApiImpl) {
    return obj;
  }
  if (obj instanceof EventApi) {
    return obj;
  }
  let helper = obj["__domApi"];
  if (!helper) {
    if (obj instanceof Event) {
      helper = new EventApi(obj);
    } else {
      helper = new DomApiImpl(obj);
    }
    obj["__domApi"] = helper;
  }
  return helper;
};
let styleInterface = window.ShadyCSS;
const LegacyElementMixin = dedupingMixin((base) => {
  const legacyElementBase = GestureEventListeners(ElementMixin(base));
  const DIRECTION_MAP = { x: "pan-x", y: "pan-y", none: "none", all: "auto" };
  class LegacyElement extends legacyElementBase {
    constructor() {
      super();
      this.isAttached;
      this.__boundListeners;
      this._debouncers;
    }
    static get importMeta() {
      return this.prototype.importMeta;
    }
    created() {}
    connectedCallback() {
      super.connectedCallback();
      this.isAttached = true;
      this.attached();
    }
    attached() {}
    disconnectedCallback() {
      super.disconnectedCallback();
      this.isAttached = false;
      this.detached();
    }
    detached() {}
    attributeChangedCallback(name, old, value, namespace) {
      if (old !== value) {
        super.attributeChangedCallback(name, old, value, namespace);
        this.attributeChanged(name, old, value);
      }
    }
    attributeChanged(name, old, value) {}
    _initializeProperties() {
      let proto = Object.getPrototypeOf(this);
      if (!proto.hasOwnProperty("__hasRegisterFinished")) {
        this._registered();
        proto.__hasRegisterFinished = true;
      }
      super._initializeProperties();
      this.root = this;
      this.created();
      this._applyListeners();
    }
    _registered() {}
    ready() {
      this._ensureAttributes();
      super.ready();
    }
    _ensureAttributes() {}
    _applyListeners() {}
    serialize(value) {
      return this._serializeValue(value);
    }
    deserialize(value, type) {
      return this._deserializeValue(value, type);
    }
    reflectPropertyToAttribute(property, attribute, value) {
      this._propertyToAttribute(property, attribute, value);
    }
    serializeValueToAttribute(value, attribute, node) {
      this._valueToNodeAttribute(node || this, value, attribute);
    }
    extend(prototype, api) {
      if (!(prototype && api)) {
        return prototype || api;
      }
      let n$ = Object.getOwnPropertyNames(api);
      for (let i = 0, n; i < n$.length && (n = n$[i]); i++) {
        let pd = Object.getOwnPropertyDescriptor(api, n);
        if (pd) {
          Object.defineProperty(prototype, n, pd);
        }
      }
      return prototype;
    }
    mixin(target, source) {
      for (let i in source) {
        target[i] = source[i];
      }
      return target;
    }
    chainObject(object, prototype) {
      if (object && prototype && object !== prototype) {
        object.__proto__ = prototype;
      }
      return object;
    }
    instanceTemplate(template) {
      let content = this.constructor._contentForTemplate(template);
      let dom = document.importNode(content, true);
      return dom;
    }
    fire(type, detail, options) {
      options = options || {};
      detail = detail === null || detail === undefined ? {} : detail;
      let event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed,
      });
      event.detail = detail;
      let node = options.node || this;
      wrap(node).dispatchEvent(event);
      return event;
    }
    listen(node, eventName, methodName) {
      node = node || this;
      let hbl =
        this.__boundListeners || (this.__boundListeners = new WeakMap());
      let bl = hbl.get(node);
      if (!bl) {
        bl = {};
        hbl.set(node, bl);
      }
      let key = eventName + methodName;
      if (!bl[key]) {
        bl[key] = this._addMethodEventListenerToNode(
          node,
          eventName,
          methodName,
          this
        );
      }
    }
    unlisten(node, eventName, methodName) {
      node = node || this;
      let bl = this.__boundListeners && this.__boundListeners.get(node);
      let key = eventName + methodName;
      let handler = bl && bl[key];
      if (handler) {
        this._removeEventListenerFromNode(node, eventName, handler);
        bl[key] = null;
      }
    }
    setScrollDirection(direction, node) {
      setTouchAction(node || this, DIRECTION_MAP[direction] || "auto");
    }
    $$(slctr) {
      return this.root.querySelector(slctr);
    }
    get domHost() {
      let root = wrap(this).getRootNode();
      return root instanceof DocumentFragment ? root.host : root;
    }
    distributeContent() {
      const thisEl = this;
      const domApi = dom(thisEl);
      if (window.ShadyDOM && domApi.shadowRoot) {
        ShadyDOM.flush();
      }
    }
    getEffectiveChildNodes() {
      const thisEl = this;
      const domApi = dom(thisEl);
      return domApi.getEffectiveChildNodes();
    }
    queryDistributedElements(selector) {
      const thisEl = this;
      const domApi = dom(thisEl);
      return domApi.queryDistributedElements(selector);
    }
    getEffectiveChildren() {
      let list = this.getEffectiveChildNodes();
      return list.filter(function (n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
    }
    getEffectiveTextContent() {
      let cn = this.getEffectiveChildNodes();
      let tc = [];
      for (let i = 0, c; (c = cn[i]); i++) {
        if (c.nodeType !== Node.COMMENT_NODE) {
          tc.push(c.textContent);
        }
      }
      return tc.join("");
    }
    queryEffectiveChildren(selector) {
      let e$ = this.queryDistributedElements(selector);
      return e$ && e$[0];
    }
    queryAllEffectiveChildren(selector) {
      return this.queryDistributedElements(selector);
    }
    getContentChildNodes(slctr) {
      let content = this.root.querySelector(slctr || "slot");
      return content ? dom(content).getDistributedNodes() : [];
    }
    getContentChildren(slctr) {
      let children = this.getContentChildNodes(slctr).filter(function (n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
      return children;
    }
    isLightDescendant(node) {
      const thisNode = this;
      return (
        thisNode !== node &&
        wrap(thisNode).contains(node) &&
        wrap(thisNode).getRootNode() === wrap(node).getRootNode()
      );
    }
    isLocalDescendant(node) {
      return this.root === wrap(node).getRootNode();
    }
    scopeSubtree(container, shouldObserve) {}
    getComputedStyleValue(property) {
      return styleInterface.getComputedStyleValue(this, property);
    }
    debounce(jobName, callback, wait) {
      this._debouncers = this._debouncers || {};
      return (this._debouncers[jobName] = Debouncer.debounce(
        this._debouncers[jobName],
        wait > 0 ? timeOut.after(wait) : microTask,
        callback.bind(this)
      ));
    }
    isDebouncerActive(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];
      return !!(debouncer && debouncer.isActive());
    }
    flushDebouncer(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];
      if (debouncer) {
        debouncer.flush();
      }
    }
    cancelDebouncer(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];
      if (debouncer) {
        debouncer.cancel();
      }
    }
    async(callback, waitTime) {
      return waitTime > 0
        ? timeOut.run(callback.bind(this), waitTime)
        : ~microTask.run(callback.bind(this));
    }
    cancelAsync(handle) {
      handle < 0 ? microTask.cancel(~handle) : timeOut.cancel(handle);
    }
    create(tag, props) {
      let elt = document.createElement(tag);
      if (props) {
        if (elt.setProperties) {
          elt.setProperties(props);
        } else {
          for (let n in props) {
            elt[n] = props[n];
          }
        }
      }
      return elt;
    }
    elementMatches(selector, node) {
      return matchesSelector(node || this, selector);
    }
    toggleAttribute(name, bool) {
      let node = this;
      if (arguments.length === 3) {
        node = arguments[2];
      }
      if (arguments.length == 1) {
        bool = !node.hasAttribute(name);
      }
      if (bool) {
        wrap(node).setAttribute(name, "");
        return true;
      } else {
        wrap(node).removeAttribute(name);
        return false;
      }
    }
    toggleClass(name, bool, node) {
      node = node || this;
      if (arguments.length == 1) {
        bool = !node.classList.contains(name);
      }
      if (bool) {
        node.classList.add(name);
      } else {
        node.classList.remove(name);
      }
    }
    transform(transformText, node) {
      node = node || this;
      node.style.webkitTransform = transformText;
      node.style.transform = transformText;
    }
    translate3d(x, y, z, node) {
      node = node || this;
      this.transform("translate3d(" + x + "," + y + "," + z + ")", node);
    }
    arrayDelete(arrayOrPath, item) {
      let index;
      if (Array.isArray(arrayOrPath)) {
        index = arrayOrPath.indexOf(item);
        if (index >= 0) {
          return arrayOrPath.splice(index, 1);
        }
      } else {
        let arr = get(this, arrayOrPath);
        index = arr.indexOf(item);
        if (index >= 0) {
          return this.splice(arrayOrPath, index, 1);
        }
      }
      return null;
    }
    _logger(level, args) {
      if (Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
        args = args[0];
      }
      switch (level) {
        case "log":
        case "warn":
        case "error":
          console[level](...args);
      }
    }
    _log(...args) {
      this._logger("log", args);
    }
    _warn(...args) {
      this._logger("warn", args);
    }
    _error(...args) {
      this._logger("error", args);
    }
    _logf(methodName, ...args) {
      return ["[%s::%s]", this.is, methodName, ...args];
    }
  }
  LegacyElement.prototype.is = "";
  return LegacyElement;
});
const lifecycleProps = {
  attached: true,
  detached: true,
  ready: true,
  created: true,
  beforeRegister: true,
  registered: true,
  attributeChanged: true,
  listeners: true,
  hostAttributes: true,
};
const excludeOnInfo = {
  attached: true,
  detached: true,
  ready: true,
  created: true,
  beforeRegister: true,
  registered: true,
  attributeChanged: true,
  behaviors: true,
  _noAccessors: true,
};
const excludeOnBehaviors = Object.assign(
  { listeners: true, hostAttributes: true, properties: true, observers: true },
  excludeOnInfo
);
function copyProperties(source, target, excludeProps) {
  const noAccessors = source._noAccessors;
  const propertyNames = Object.getOwnPropertyNames(source);
  for (let i = 0; i < propertyNames.length; i++) {
    let p = propertyNames[i];
    if (p in excludeProps) {
      continue;
    }
    if (noAccessors) {
      target[p] = source[p];
    } else {
      let pd = Object.getOwnPropertyDescriptor(source, p);
      if (pd) {
        pd.configurable = true;
        Object.defineProperty(target, p, pd);
      }
    }
  }
}
function mixinBehaviors(behaviors, klass) {
  return GenerateClassFromInfo({}, LegacyElementMixin(klass), behaviors);
}
function applyBehaviors(proto, behaviors, lifecycle) {
  for (let i = 0; i < behaviors.length; i++) {
    applyInfo(proto, behaviors[i], lifecycle, excludeOnBehaviors);
  }
}
function applyInfo(proto, info, lifecycle, excludeProps) {
  copyProperties(info, proto, excludeProps);
  for (let p in lifecycleProps) {
    if (info[p]) {
      lifecycle[p] = lifecycle[p] || [];
      lifecycle[p].push(info[p]);
    }
  }
}
function flattenBehaviors(behaviors, list, exclude) {
  list = list || [];
  for (let i = behaviors.length - 1; i >= 0; i--) {
    let b = behaviors[i];
    if (b) {
      if (Array.isArray(b)) {
        flattenBehaviors(b, list);
      } else {
        if (list.indexOf(b) < 0 && (!exclude || exclude.indexOf(b) < 0)) {
          list.unshift(b);
        }
      }
    } else {
      console.warn("behavior is null, check for missing or 404 import");
    }
  }
  return list;
}
function mergeProperties(target, source) {
  for (const p in source) {
    const targetInfo = target[p];
    const sourceInfo = source[p];
    if (!("value" in sourceInfo) && targetInfo && "value" in targetInfo) {
      target[p] = Object.assign({ value: targetInfo.value }, sourceInfo);
    } else {
      target[p] = sourceInfo;
    }
  }
}
function GenerateClassFromInfo(info, Base, behaviors) {
  let behaviorList;
  const lifecycle = {};
  class PolymerGenerated extends Base {
    static _finalizeClass() {
      if (
        !this.hasOwnProperty(JSCompiler_renameProperty("generatedFrom", this))
      ) {
        super._finalizeClass();
      } else {
        if (behaviorList) {
          for (let i = 0, b; i < behaviorList.length; i++) {
            b = behaviorList[i];
            if (b.properties) {
              this.createProperties(b.properties);
            }
            if (b.observers) {
              this.createObservers(b.observers, b.properties);
            }
          }
        }
        if (info.properties) {
          this.createProperties(info.properties);
        }
        if (info.observers) {
          this.createObservers(info.observers, info.properties);
        }
        this._prepareTemplate();
      }
    }
    static get properties() {
      const properties = {};
      if (behaviorList) {
        for (let i = 0; i < behaviorList.length; i++) {
          mergeProperties(properties, behaviorList[i].properties);
        }
      }
      mergeProperties(properties, info.properties);
      return properties;
    }
    static get observers() {
      let observers = [];
      if (behaviorList) {
        for (let i = 0, b; i < behaviorList.length; i++) {
          b = behaviorList[i];
          if (b.observers) {
            observers = observers.concat(b.observers);
          }
        }
      }
      if (info.observers) {
        observers = observers.concat(info.observers);
      }
      return observers;
    }
    created() {
      super.created();
      const list = lifecycle.created;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].call(this);
        }
      }
    }
    _registered() {
      const generatedProto = PolymerGenerated.prototype;
      if (!generatedProto.hasOwnProperty("__hasRegisterFinished")) {
        generatedProto.__hasRegisterFinished = true;
        super._registered();
        const proto = Object.getPrototypeOf(this);
        let list = lifecycle.beforeRegister;
        if (list) {
          for (let i = 0; i < list.length; i++) {
            list[i].call(proto);
          }
        }
        list = lifecycle.registered;
        if (list) {
          for (let i = 0; i < list.length; i++) {
            list[i].call(proto);
          }
        }
      }
    }
    _applyListeners() {
      super._applyListeners();
      const list = lifecycle.listeners;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          const listeners = list[i];
          if (listeners) {
            for (let l in listeners) {
              this._addMethodEventListenerToNode(this, l, listeners[l]);
            }
          }
        }
      }
    }
    _ensureAttributes() {
      const list = lifecycle.hostAttributes;
      if (list) {
        for (let i = list.length - 1; i >= 0; i--) {
          const hostAttributes = list[i];
          for (let a in hostAttributes) {
            this._ensureAttribute(a, hostAttributes[a]);
          }
        }
      }
      super._ensureAttributes();
    }
    ready() {
      super.ready();
      let list = lifecycle.ready;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].call(this);
        }
      }
    }
    attached() {
      super.attached();
      let list = lifecycle.attached;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].call(this);
        }
      }
    }
    detached() {
      super.detached();
      let list = lifecycle.detached;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].call(this);
        }
      }
    }
    attributeChanged(name, old, value) {
      super.attributeChanged();
      let list = lifecycle.attributeChanged;
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].call(this, name, old, value);
        }
      }
    }
  }
  if (behaviors) {
    if (!Array.isArray(behaviors)) {
      behaviors = [behaviors];
    }
    let superBehaviors = Base.prototype.behaviors;
    behaviorList = flattenBehaviors(behaviors, null, superBehaviors);
    PolymerGenerated.prototype.behaviors = superBehaviors
      ? superBehaviors.concat(behaviors)
      : behaviorList;
  }
  const copyPropertiesToProto = (proto) => {
    if (behaviorList) {
      applyBehaviors(proto, behaviorList, lifecycle);
    }
    applyInfo(proto, info, lifecycle, excludeOnInfo);
  };
  {
    copyPropertiesToProto(PolymerGenerated.prototype);
  }
  PolymerGenerated.generatedFrom = info;
  return PolymerGenerated;
}
const Class = function (info, mixin) {
  if (!info) {
    console.warn("Polymer.Class requires `info` argument");
  }
  let klass = mixin
    ? mixin(LegacyElementMixin(HTMLElement))
    : LegacyElementMixin(HTMLElement);
  klass = GenerateClassFromInfo(info, klass, info.behaviors);
  klass.is = klass.prototype.is = info.is;
  return klass;
};
let mutablePropertyChange;
(() => {
  mutablePropertyChange = MutableData._mutablePropertyChange;
})();
const OptionalMutableDataBehavior = {
  properties: { mutableData: Boolean },
  _shouldPropertyChange(property, value, old) {
    return mutablePropertyChange(this, property, value, old, this.mutableData);
  },
};
const Polymer = function (info) {
  let klass;
  if (typeof info === "function") {
    klass = info;
  } else {
    klass = Polymer.Class(info);
  }
  customElements.define(klass.is, klass);
  return klass;
};
Polymer.Class = Class;
const Templatizer = {
  templatize(template, mutableData) {
    this._templatizerTemplate = template;
    this.ctor = templatize(template, this, {
      mutableData: Boolean(mutableData),
      parentModel: this._parentModel,
      instanceProps: this._instanceProps,
      forwardHostProp: this._forwardHostPropV2,
      notifyInstanceProp: this._notifyInstancePropV2,
    });
  },
  stamp(model) {
    return new this.ctor(model);
  },
  modelForElement(el) {
    return modelForElement(this._templatizerTemplate, el);
  },
};
const domBindBase = GestureEventListeners(
  OptionalMutableData(PropertyEffects(HTMLElement))
);
class DomBind extends domBindBase {
  static get observedAttributes() {
    return ["mutable-data"];
  }
  constructor() {
    super();
    this.root = null;
    this.$ = null;
    this.__children = null;
  }
  attributeChangedCallback() {
    this.mutableData = true;
  }
  connectedCallback() {
    this.style.display = "none";
    this.render();
  }
  disconnectedCallback() {
    this.__removeChildren();
  }
  __insertChildren() {
    wrap(wrap(this).parentNode).insertBefore(this.root, this);
  }
  __removeChildren() {
    if (this.__children) {
      for (let i = 0; i < this.__children.length; i++) {
        this.root.appendChild(this.__children[i]);
      }
    }
  }
  render() {
    let template;
    if (!this.__children) {
      template = template || this.querySelector("template");
      if (!template) {
        let observer = new MutationObserver(() => {
          template = this.querySelector("template");
          if (template) {
            observer.disconnect();
            this.render();
          } else {
            throw new Error("dom-bind requires a <template> child");
          }
        });
        observer.observe(this, { childList: true });
        return;
      }
      this.root = this._stampTemplate(template);
      this.$ = this.root.$;
      this.__children = [];
      for (let n = this.root.firstChild; n; n = n.nextSibling) {
        this.__children[this.__children.length] = n;
      }
      this._enableProperties();
    }
    this.__insertChildren();
    this.dispatchEvent(
      new CustomEvent("dom-change", { bubbles: true, composed: true })
    );
  }
}
customElements.define("dom-bind", DomBind);
let ArraySelectorMixin = dedupingMixin((superClass) => {
  let elementBase = ElementMixin(superClass);
  class ArraySelectorMixin extends elementBase {
    static get properties() {
      return {
        items: { type: Array },
        multi: { type: Boolean, value: false },
        selected: { type: Object, notify: true },
        selectedItem: { type: Object, notify: true },
        toggle: { type: Boolean, value: false },
      };
    }
    static get observers() {
      return ["__updateSelection(multi, items.*)"];
    }
    constructor() {
      super();
      this.__lastItems = null;
      this.__lastMulti = null;
      this.__selectedMap = null;
    }
    __updateSelection(multi, itemsInfo) {
      let path = itemsInfo.path;
      if (path == JSCompiler_renameProperty("items", this)) {
        let newItems = itemsInfo.base || [];
        let lastItems = this.__lastItems;
        let lastMulti = this.__lastMulti;
        if (multi !== lastMulti) {
          this.clearSelection();
        }
        if (lastItems) {
          let splices = calculateSplices(newItems, lastItems);
          this.__applySplices(splices);
        }
        this.__lastItems = newItems;
        this.__lastMulti = multi;
      } else if (
        itemsInfo.path == `${JSCompiler_renameProperty("items", this)}.splices`
      ) {
        this.__applySplices(itemsInfo.value.indexSplices);
      } else {
        let part = path.slice(
          `${JSCompiler_renameProperty("items", this)}.`.length
        );
        let idx = parseInt(part, 10);
        if (part.indexOf(".") < 0 && part == idx) {
          this.__deselectChangedIdx(idx);
        }
      }
    }
    __applySplices(splices) {
      let selected = this.__selectedMap;
      for (let i = 0; i < splices.length; i++) {
        let s = splices[i];
        selected.forEach((idx, item) => {
          if (idx < s.index);
          else if (idx >= s.index + s.removed.length) {
            selected.set(item, idx + s.addedCount - s.removed.length);
          } else {
            selected.set(item, -1);
          }
        });
        for (let j = 0; j < s.addedCount; j++) {
          let idx = s.index + j;
          if (selected.has(this.items[idx])) {
            selected.set(this.items[idx], idx);
          }
        }
      }
      this.__updateLinks();
      let sidx = 0;
      selected.forEach((idx, item) => {
        if (idx < 0) {
          if (this.multi) {
            this.splice(JSCompiler_renameProperty("selected", this), sidx, 1);
          } else {
            this.selected = this.selectedItem = null;
          }
          selected.delete(item);
        } else {
          sidx++;
        }
      });
    }
    __updateLinks() {
      this.__dataLinkedPaths = {};
      if (this.multi) {
        let sidx = 0;
        this.__selectedMap.forEach((idx) => {
          if (idx >= 0) {
            this.linkPaths(
              `${JSCompiler_renameProperty("items", this)}.${idx}`,
              `${JSCompiler_renameProperty("selected", this)}.${sidx++}`
            );
          }
        });
      } else {
        this.__selectedMap.forEach((idx) => {
          this.linkPaths(
            JSCompiler_renameProperty("selected", this),
            `${JSCompiler_renameProperty("items", this)}.${idx}`
          );
          this.linkPaths(
            JSCompiler_renameProperty("selectedItem", this),
            `${JSCompiler_renameProperty("items", this)}.${idx}`
          );
        });
      }
    }
    clearSelection() {
      this.__dataLinkedPaths = {};
      this.__selectedMap = new Map();
      this.selected = this.multi ? [] : null;
      this.selectedItem = null;
    }
    isSelected(item) {
      return this.__selectedMap.has(item);
    }
    isIndexSelected(idx) {
      return this.isSelected(this.items[idx]);
    }
    __deselectChangedIdx(idx) {
      let sidx = this.__selectedIndexForItemIndex(idx);
      if (sidx >= 0) {
        let i = 0;
        this.__selectedMap.forEach((idx, item) => {
          if (sidx == i++) {
            this.deselect(item);
          }
        });
      }
    }
    __selectedIndexForItemIndex(idx) {
      let selected =
        this.__dataLinkedPaths[
          `${JSCompiler_renameProperty("items", this)}.${idx}`
        ];
      if (selected) {
        return parseInt(
          selected.slice(
            `${JSCompiler_renameProperty("selected", this)}.`.length
          ),
          10
        );
      }
    }
    deselect(item) {
      let idx = this.__selectedMap.get(item);
      if (idx >= 0) {
        this.__selectedMap.delete(item);
        let sidx;
        if (this.multi) {
          sidx = this.__selectedIndexForItemIndex(idx);
        }
        this.__updateLinks();
        if (this.multi) {
          this.splice(JSCompiler_renameProperty("selected", this), sidx, 1);
        } else {
          this.selected = this.selectedItem = null;
        }
      }
    }
    deselectIndex(idx) {
      this.deselect(this.items[idx]);
    }
    select(item) {
      this.selectIndex(this.items.indexOf(item));
    }
    selectIndex(idx) {
      let item = this.items[idx];
      if (!this.isSelected(item)) {
        if (!this.multi) {
          this.__selectedMap.clear();
        }
        this.__selectedMap.set(item, idx);
        this.__updateLinks();
        if (this.multi) {
          this.push(JSCompiler_renameProperty("selected", this), item);
        } else {
          this.selected = this.selectedItem = item;
        }
      } else if (this.toggle) {
        this.deselectIndex(idx);
      }
    }
  }
  return ArraySelectorMixin;
});
let baseArraySelector = ArraySelectorMixin(PolymerElement);
class ArraySelector extends baseArraySelector {
  static get is() {
    return "array-selector";
  }
  static get template() {
    return null;
  }
}
customElements.define(ArraySelector.is, ArraySelector);
const customStyleInterface = new CustomStyleInterface$1();
if (!window.ShadyCSS) {
  window.ShadyCSS = {
    prepareTemplate(template, elementName, elementExtends) {},
    prepareTemplateDom(template, elementName) {},
    prepareTemplateStyles(template, elementName, elementExtends) {},
    styleSubtree(element, properties) {
      customStyleInterface.processStyles();
      updateNativeProperties(element, properties);
    },
    styleElement(element) {
      customStyleInterface.processStyles();
    },
    styleDocument(properties) {
      customStyleInterface.processStyles();
      updateNativeProperties(document.body, properties);
    },
    getComputedStyleValue(element, property) {
      return getComputedStyleValue(element, property);
    },
    flushCustomStyles() {},
    nativeCss: nativeCssVariables,
    nativeShadow: nativeShadow,
    cssBuild: cssBuild,
    disableRuntime: disableRuntime,
  };
}
window.ShadyCSS.CustomStyleInterface = customStyleInterface;
const attr = "include";
const CustomStyleInterface = window.ShadyCSS.CustomStyleInterface;
class CustomStyle extends HTMLElement {
  constructor() {
    super();
    this._style = null;
    CustomStyleInterface.addCustomStyle(this);
  }
  getStyle() {
    if (this._style) {
      return this._style;
    }
    const style = this.querySelector("style");
    if (!style) {
      return null;
    }
    this._style = style;
    const include = style.getAttribute(attr);
    if (include) {
      style.removeAttribute(attr);
      style.textContent = cssFromModules(include) + style.textContent;
    }
    if (this.ownerDocument !== window.document) {
      window.document.head.appendChild(this);
    }
    return this._style;
  }
}
window.customElements.define("custom-style", CustomStyle);
const Base = LegacyElementMixin(HTMLElement).prototype;
export {
  Base,
  Debouncer,
  DomIf,
  DomRepeat,
  FlattenedNodesObserver,
  OptionalMutableDataBehavior,
  Polymer,
  PolymerElement,
  TemplateInstanceBase,
  Templatizer,
  afterNextRender,
  animationFrame,
  beforeNextRender,
  calculateSplices,
  dashToCamelCase,
  dedupingMixin,
  dom,
  enqueueDebouncer,
  flush,
  gestures$1 as gestures,
  get,
  html,
  idlePeriod,
  matches,
  microTask,
  mixinBehaviors,
  templatize,
  timeOut,
  translate,
  useShadow,
};

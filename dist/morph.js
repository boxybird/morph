/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@alpinejs/morph/dist/module.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/@alpinejs/morph/dist/module.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default),
/* harmony export */   "morph": () => (/* binding */ morph)
/* harmony export */ });
// packages/morph/src/dom.js
var DomManager = class {
  el = void 0;
  constructor(el) {
    this.el = el;
  }
  traversals = {
    first: "firstElementChild",
    next: "nextElementSibling",
    parent: "parentElement"
  };
  nodes() {
    this.traversals = {
      first: "firstChild",
      next: "nextSibling",
      parent: "parentNode"
    };
    return this;
  }
  first() {
    return this.teleportTo(this.el[this.traversals["first"]]);
  }
  next() {
    return this.teleportTo(this.teleportBack(this.el[this.traversals["next"]]));
  }
  before(insertee) {
    this.el[this.traversals["parent"]].insertBefore(insertee, this.el);
    return insertee;
  }
  replace(replacement) {
    this.el[this.traversals["parent"]].replaceChild(replacement, this.el);
    return replacement;
  }
  append(appendee) {
    this.el.appendChild(appendee);
    return appendee;
  }
  teleportTo(el) {
    if (!el)
      return el;
    if (el._x_teleport)
      return el._x_teleport;
    return el;
  }
  teleportBack(el) {
    if (!el)
      return el;
    if (el._x_teleportBack)
      return el._x_teleportBack;
    return el;
  }
};
function dom(el) {
  return new DomManager(el);
}
function createElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}
function textOrComment(el) {
  return el.nodeType === 3 || el.nodeType === 8;
}

// packages/morph/src/morph.js
var resolveStep = () => {
};
var logger = () => {
};
async function morph(from, toHtml, options) {
  let fromEl;
  let toEl;
  let key, lookahead, updating, updated, removing, removed, adding, added, debug;
  function breakpoint(message) {
    if (!debug)
      return;
    logger((message || "").replace("\n", "\\n"), fromEl, toEl);
    return new Promise((resolve) => resolveStep = () => resolve());
  }
  function assignOptions(options2 = {}) {
    let defaultGetKey = (el) => el.getAttribute("key");
    let noop = () => {
    };
    updating = options2.updating || noop;
    updated = options2.updated || noop;
    removing = options2.removing || noop;
    removed = options2.removed || noop;
    adding = options2.adding || noop;
    added = options2.added || noop;
    key = options2.key || defaultGetKey;
    lookahead = options2.lookahead || false;
    debug = options2.debug || false;
  }
  async function patch(from2, to) {
    if (differentElementNamesTypesOrKeys(from2, to)) {
      let result = patchElement(from2, to);
      await breakpoint("Swap elements");
      return result;
    }
    let updateChildrenOnly = false;
    if (shouldSkip(updating, from2, to, () => updateChildrenOnly = true))
      return;
    window.Alpine && initializeAlpineOnTo(from2, to, () => updateChildrenOnly = true);
    if (textOrComment(to)) {
      await patchNodeValue(from2, to);
      updated(from2, to);
      return;
    }
    if (!updateChildrenOnly) {
      await patchAttributes(from2, to);
    }
    updated(from2, to);
    await patchChildren(from2, to);
  }
  function differentElementNamesTypesOrKeys(from2, to) {
    return from2.nodeType != to.nodeType || from2.nodeName != to.nodeName || getKey(from2) != getKey(to);
  }
  function patchElement(from2, to) {
    if (shouldSkip(removing, from2))
      return;
    let toCloned = to.cloneNode(true);
    if (shouldSkip(adding, toCloned))
      return;
    dom(from2).replace(toCloned);
    removed(from2);
    added(toCloned);
  }
  async function patchNodeValue(from2, to) {
    let value = to.nodeValue;
    if (from2.nodeValue !== value) {
      from2.nodeValue = value;
      await breakpoint("Change text node to: " + value);
    }
  }
  async function patchAttributes(from2, to) {
    if (from2._x_isShown && !to._x_isShown) {
      return;
    }
    if (!from2._x_isShown && to._x_isShown) {
      return;
    }
    let domAttributes = Array.from(from2.attributes);
    let toAttributes = Array.from(to.attributes);
    for (let i = domAttributes.length - 1; i >= 0; i--) {
      let name = domAttributes[i].name;
      if (!to.hasAttribute(name)) {
        from2.removeAttribute(name);
        await breakpoint("Remove attribute");
      }
    }
    for (let i = toAttributes.length - 1; i >= 0; i--) {
      let name = toAttributes[i].name;
      let value = toAttributes[i].value;
      if (from2.getAttribute(name) !== value) {
        from2.setAttribute(name, value);
        await breakpoint(`Set [${name}] attribute to: "${value}"`);
      }
    }
  }
  async function patchChildren(from2, to) {
    let domChildren = from2.childNodes;
    let toChildren = to.childNodes;
    let toKeyToNodeMap = keyToMap(toChildren);
    let domKeyDomNodeMap = keyToMap(domChildren);
    let currentTo = dom(to).nodes().first();
    let currentFrom = dom(from2).nodes().first();
    let domKeyHoldovers = {};
    while (currentTo) {
      let toKey = getKey(currentTo);
      let domKey = getKey(currentFrom);
      if (!currentFrom) {
        if (toKey && domKeyHoldovers[toKey]) {
          let holdover = domKeyHoldovers[toKey];
          dom(from2).append(holdover);
          currentFrom = holdover;
          await breakpoint("Add element (from key)");
        } else {
          let added2 = addNodeTo(currentTo, from2) || {};
          await breakpoint("Add element: " + (added2.outerHTML || added2.nodeValue));
          currentTo = dom(currentTo).nodes().next();
          continue;
        }
      }
      if (lookahead) {
        let nextToElementSibling = dom(currentTo).next();
        let found = false;
        while (!found && nextToElementSibling) {
          if (currentFrom.isEqualNode(nextToElementSibling)) {
            found = true;
            currentFrom = addNodeBefore(currentTo, currentFrom);
            domKey = getKey(currentFrom);
            await breakpoint("Move element (lookahead)");
          }
          nextToElementSibling = dom(nextToElementSibling).next();
        }
      }
      if (toKey !== domKey) {
        if (!toKey && domKey) {
          domKeyHoldovers[domKey] = currentFrom;
          currentFrom = addNodeBefore(currentTo, currentFrom);
          domKeyHoldovers[domKey].remove();
          currentFrom = dom(currentFrom).nodes().next();
          currentTo = dom(currentTo).nodes().next();
          await breakpoint('No "to" key');
          continue;
        }
        if (toKey && !domKey) {
          if (domKeyDomNodeMap[toKey]) {
            currentFrom = dom(currentFrom).replace(domKeyDomNodeMap[toKey]);
            await breakpoint('No "from" key');
          }
        }
        if (toKey && domKey) {
          domKeyHoldovers[domKey] = currentFrom;
          let domKeyNode = domKeyDomNodeMap[toKey];
          if (domKeyNode) {
            currentFrom = dom(currentFrom).replace(domKeyNode);
            await breakpoint('Move "from" key');
          } else {
            domKeyHoldovers[domKey] = currentFrom;
            currentFrom = addNodeBefore(currentTo, currentFrom);
            domKeyHoldovers[domKey].remove();
            currentFrom = dom(currentFrom).next();
            currentTo = dom(currentTo).next();
            await breakpoint("Swap elements with keys");
            continue;
          }
        }
      }
      let currentFromNext = currentFrom && dom(currentFrom).nodes().next();
      await patch(currentFrom, currentTo);
      currentTo = currentTo && dom(currentTo).nodes().next();
      currentFrom = currentFromNext;
    }
    let removals = [];
    while (currentFrom) {
      if (!shouldSkip(removing, currentFrom))
        removals.push(currentFrom);
      currentFrom = dom(currentFrom).nodes().next();
    }
    while (removals.length) {
      let domForRemoval = removals.shift();
      domForRemoval.remove();
      await breakpoint("remove el");
      removed(domForRemoval);
    }
  }
  function getKey(el) {
    return el && el.nodeType === 1 && key(el);
  }
  function keyToMap(els) {
    let map = {};
    els.forEach((el) => {
      let theKey = getKey(el);
      if (theKey) {
        map[theKey] = el;
      }
    });
    return map;
  }
  function addNodeTo(node, parent) {
    if (!shouldSkip(adding, node)) {
      let clone = node.cloneNode(true);
      dom(parent).append(clone);
      added(clone);
      return clone;
    }
    return null;
  }
  function addNodeBefore(node, beforeMe) {
    if (!shouldSkip(adding, node)) {
      let clone = node.cloneNode(true);
      dom(beforeMe).before(clone);
      added(clone);
      return clone;
    }
    return beforeMe;
  }
  assignOptions(options);
  fromEl = from;
  toEl = createElement(toHtml);
  if (window.Alpine && window.Alpine.closestDataStack && !from._x_dataStack) {
    toEl._x_dataStack = window.Alpine.closestDataStack(from);
    toEl._x_dataStack && window.Alpine.clone(from, toEl);
  }
  await breakpoint();
  await patch(from, toEl);
  fromEl = void 0;
  toEl = void 0;
  return from;
}
morph.step = () => resolveStep();
morph.log = (theLogger) => {
  logger = theLogger;
};
function shouldSkip(hook, ...args) {
  let skip = false;
  hook(...args, () => skip = true);
  return skip;
}
function initializeAlpineOnTo(from, to, childrenOnly) {
  if (from.nodeType !== 1)
    return;
  if (from._x_dataStack) {
    window.Alpine.clone(from, to);
  }
}

// packages/morph/src/index.js
function src_default(Alpine) {
  Alpine.morph = morph;
}

// packages/morph/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./node_modules/object-to-formdata/src/index.js":
/*!******************************************************!*\
  !*** ./node_modules/object-to-formdata/src/index.js ***!
  \******************************************************/
/***/ ((module) => {

function isUndefined(value) {
  return value === undefined;
}

function isNull(value) {
  return value === null;
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isObject(value) {
  return value === Object(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isDate(value) {
  return value instanceof Date;
}

function isBlob(value, isReactNative) {
  return isReactNative
    ? isObject(value) && !isUndefined(value.uri)
    : isObject(value) &&
        typeof value.size === 'number' &&
        typeof value.type === 'string' &&
        typeof value.slice === 'function';
}

function isFile(value, isReactNative) {
  return (
    isBlob(value, isReactNative) &&
    typeof value.name === 'string' &&
    (isObject(value.lastModifiedDate) || typeof value.lastModified === 'number')
  );
}

function initCfg(value) {
  return isUndefined(value) ? false : value;
}

function serialize(obj, cfg, fd, pre) {
  cfg = cfg || {};
  fd = fd || new FormData();

  cfg.indices = initCfg(cfg.indices);
  cfg.nullsAsUndefineds = initCfg(cfg.nullsAsUndefineds);
  cfg.booleansAsIntegers = initCfg(cfg.booleansAsIntegers);
  cfg.allowEmptyArrays = initCfg(cfg.allowEmptyArrays);
  cfg.noFilesWithArrayNotation = initCfg(cfg.noFilesWithArrayNotation);
  cfg.dotsForObjectNotation = initCfg(cfg.dotsForObjectNotation);

  const isReactNative = typeof fd.getParts === 'function';

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        let key = pre + '[' + (cfg.indices ? index : '') + ']';

        if (cfg.noFilesWithArrayNotation && isFile(value, isReactNative)) {
          key = pre;
        }

        serialize(value, cfg, fd, key);
      });
    } else if (cfg.allowEmptyArrays) {
      fd.append(pre + '[]', '');
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }

      const key = pre
        ? cfg.dotsForObjectNotation
          ? pre + '.' + prop
          : pre + '[' + prop + ']'
        : prop;

      serialize(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
}

module.exports = {
  serialize,
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./resources/js/morph.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alpinejs_morph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @alpinejs/morph */ "./node_modules/@alpinejs/morph/dist/module.esm.js");
/* harmony import */ var object_to_formdata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! object-to-formdata */ "./node_modules/object-to-formdata/src/index.js");
/* harmony import */ var object_to_formdata__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(object_to_formdata__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


 // BBTODO - refactor this monster when you know if this Morph thing is going to work

document.addEventListener('alpine:init', function (Alpine) {
  window.Alpine.plugin(_alpinejs_morph__WEBPACK_IMPORTED_MODULE_0__["default"]);
  window.Alpine.magic('wpMorph', function (e) {
    return function (data) {
      var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rootEl = e.closest('[data-wpmorph-component-name]');
      var componentName = rootEl.dataset.wpmorphComponentName; // Lifecycle hook

      if (hooks.onStart && typeof hooks.onStart === 'function') {
        hooks.onStart();
      }

      var payload = {}; // Check if the incoming data is from a 'wpmorph' CustomEvent()

      if (_typeof(data) === 'object' && (data === null || data === void 0 ? void 0 : data.type) === 'wpmorph') {
        Object.assign(payload, data.detail);
      } else {
        // If not, handle data as a string or an object
        if (typeof data === 'string') {
          payload[data] = data;
        } else {
          Object.assign(payload, data);
        }
      }

      fetch("".concat(BB_MORPH.base_url).concat(componentName, "/"), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-Morph-Request': true,
          'X-Morph-Hash': window.BB_MORPH.hash
        },
        body: (0,object_to_formdata__WEBPACK_IMPORTED_MODULE_1__.serialize)(payload)
      }).then(function (response) {
        // Lifecycle hook
        if (hooks.onResponse && typeof hooks.onResponse === 'function') {
          hooks.onResponse(response);
        }

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.text();
      }).then(function (res) {
        window.Alpine.morph(rootEl, res); // Emit events

        if (hooks.emit && typeof hooks.emit === 'boolean') {
          var eventPayload = {
            bubbles: true,
            detail: {
              wpMorphEvent: true,
              componentName: componentName,
              data: _objectSpread({}, payload)
            }
          };
          document.dispatchEvent(new CustomEvent('wpmorph', eventPayload));
          document.dispatchEvent(new CustomEvent('wpMorph', eventPayload));
        } // Lifecycle hook


        if (hooks.onSuccess && typeof hooks.onSuccess === 'function') {
          hooks.onSuccess(data);
        }
      })["catch"](function (error) {
        // Lifecycle hook
        if (hooks.onError && typeof hooks.onError === 'function') {
          hooks.onError(error);
        }
      })["finally"](function () {
        // Lifecycle hook
        if (hooks.onFinish && typeof hooks.onFinish === 'function') {
          hooks.onFinish();
        }
      });
    };
  });
});
})();

/******/ })()
;
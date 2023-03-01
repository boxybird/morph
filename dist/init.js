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
function createElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}
function textOrComment(el) {
  return el.nodeType === 3 || el.nodeType === 8;
}
var dom = {
  replace(children, old, replacement) {
    let index = children.indexOf(old);
    if (index === -1)
      throw "Cant find element in children";
    old.replaceWith(replacement);
    children[index] = replacement;
    return children;
  },
  before(children, reference, subject) {
    let index = children.indexOf(reference);
    if (index === -1)
      throw "Cant find element in children";
    reference.before(subject);
    children.splice(index, 0, subject);
    return children;
  },
  append(children, subject, appendFn) {
    let last = children[children.length - 1];
    appendFn(subject);
    children.push(subject);
    return children;
  },
  remove(children, subject) {
    let index = children.indexOf(subject);
    if (index === -1)
      throw "Cant find element in children";
    subject.remove();
    return children.filter((i) => i !== subject);
  },
  first(children) {
    return this.teleportTo(children[0]);
  },
  next(children, reference) {
    let index = children.indexOf(reference);
    if (index === -1)
      return;
    return this.teleportTo(this.teleportBack(children[index + 1]));
  },
  teleportTo(el) {
    if (!el)
      return el;
    if (el._x_teleport)
      return el._x_teleport;
    return el;
  },
  teleportBack(el) {
    if (!el)
      return el;
    if (el._x_teleportBack)
      return el._x_teleportBack;
    return el;
  }
};

// packages/morph/src/morph.js
var resolveStep = () => {
};
var logger = () => {
};
function morph(from, toHtml, options) {
  let fromEl;
  let toEl;
  let key, lookahead, updating, updated, removing, removed, adding, added;
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
  }
  function patch(from2, to) {
    if (differentElementNamesTypesOrKeys(from2, to)) {
      return patchElement(from2, to);
    }
    let updateChildrenOnly = false;
    if (shouldSkip(updating, from2, to, () => updateChildrenOnly = true))
      return;
    window.Alpine && initializeAlpineOnTo(from2, to, () => updateChildrenOnly = true);
    if (textOrComment(to)) {
      patchNodeValue(from2, to);
      updated(from2, to);
      return;
    }
    if (!updateChildrenOnly) {
      patchAttributes(from2, to);
    }
    updated(from2, to);
    patchChildren(Array.from(from2.childNodes), Array.from(to.childNodes), (toAppend) => {
      from2.appendChild(toAppend);
    });
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
    dom.replace([from2], from2, toCloned);
    removed(from2);
    added(toCloned);
  }
  function patchNodeValue(from2, to) {
    let value = to.nodeValue;
    if (from2.nodeValue !== value) {
      from2.nodeValue = value;
    }
  }
  function patchAttributes(from2, to) {
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
      }
    }
    for (let i = toAttributes.length - 1; i >= 0; i--) {
      let name = toAttributes[i].name;
      let value = toAttributes[i].value;
      if (from2.getAttribute(name) !== value) {
        from2.setAttribute(name, value);
      }
    }
  }
  function patchChildren(fromChildren, toChildren, appendFn) {
    let fromKeyDomNodeMap = {};
    let fromKeyHoldovers = {};
    let currentTo = dom.first(toChildren);
    let currentFrom = dom.first(fromChildren);
    while (currentTo) {
      let toKey = getKey(currentTo);
      let fromKey = getKey(currentFrom);
      if (!currentFrom) {
        if (toKey && fromKeyHoldovers[toKey]) {
          let holdover = fromKeyHoldovers[toKey];
          fromChildren = dom.append(fromChildren, holdover, appendFn);
          currentFrom = holdover;
        } else {
          if (!shouldSkip(adding, currentTo)) {
            let clone = currentTo.cloneNode(true);
            fromChildren = dom.append(fromChildren, clone, appendFn);
            added(clone);
          }
          currentTo = dom.next(toChildren, currentTo);
          continue;
        }
      }
      let isIf = (node) => node.nodeType === 8 && node.textContent === " __BLOCK__ ";
      let isEnd = (node) => node.nodeType === 8 && node.textContent === " __ENDBLOCK__ ";
      if (isIf(currentTo) && isIf(currentFrom)) {
        let newFromChildren = [];
        let appendPoint;
        let nestedIfCount = 0;
        while (currentFrom) {
          let next = dom.next(fromChildren, currentFrom);
          if (isIf(next)) {
            nestedIfCount++;
          } else if (isEnd(next) && nestedIfCount > 0) {
            nestedIfCount--;
          } else if (isEnd(next) && nestedIfCount === 0) {
            currentFrom = dom.next(fromChildren, next);
            appendPoint = next;
            break;
          }
          newFromChildren.push(next);
          currentFrom = next;
        }
        let newToChildren = [];
        nestedIfCount = 0;
        while (currentTo) {
          let next = dom.next(toChildren, currentTo);
          if (isIf(next)) {
            nestedIfCount++;
          } else if (isEnd(next) && nestedIfCount > 0) {
            nestedIfCount--;
          } else if (isEnd(next) && nestedIfCount === 0) {
            currentTo = dom.next(toChildren, next);
            break;
          }
          newToChildren.push(next);
          currentTo = next;
        }
        patchChildren(newFromChildren, newToChildren, (node) => appendPoint.before(node));
        continue;
      }
      if (currentFrom.nodeType === 1 && lookahead) {
        let nextToElementSibling = dom.next(toChildren, currentTo);
        let found = false;
        while (!found && nextToElementSibling) {
          if (currentFrom.isEqualNode(nextToElementSibling)) {
            found = true;
            [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom);
            fromKey = getKey(currentFrom);
          }
          nextToElementSibling = dom.next(toChildren, nextToElementSibling);
        }
      }
      if (toKey !== fromKey) {
        if (!toKey && fromKey) {
          fromKeyHoldovers[fromKey] = currentFrom;
          [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom);
          fromChildren = dom.remove(fromChildren, fromKeyHoldovers[fromKey]);
          currentFrom = dom.next(fromChildren, currentFrom);
          currentTo = dom.next(toChildren, currentTo);
          continue;
        }
        if (toKey && !fromKey) {
          if (fromKeyDomNodeMap[toKey]) {
            fromChildren = dom.replace(fromChildren, currentFrom, fromKeyDomNodeMap[toKey]);
            currentFrom = fromKeyDomNodeMap[toKey];
          }
        }
        if (toKey && fromKey) {
          let fromKeyNode = fromKeyDomNodeMap[toKey];
          if (fromKeyNode) {
            fromKeyHoldovers[fromKey] = currentFrom;
            fromChildren = dom.replace(fromChildren, currentFrom, fromKeyNode);
            currentFrom = fromKeyNode;
          } else {
            fromKeyHoldovers[fromKey] = currentFrom;
            [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom);
            fromChildren = dom.remove(fromChildren, fromKeyHoldovers[fromKey]);
            currentFrom = dom.next(fromChildren, currentFrom);
            currentTo = dom.next(toChildren, currentTo);
            continue;
          }
        }
      }
      let currentFromNext = currentFrom && dom.next(fromChildren, currentFrom);
      patch(currentFrom, currentTo);
      currentTo = currentTo && dom.next(toChildren, currentTo);
      currentFrom = currentFromNext;
    }
    let removals = [];
    while (currentFrom) {
      if (!shouldSkip(removing, currentFrom))
        removals.push(currentFrom);
      currentFrom = dom.next(fromChildren, currentFrom);
    }
    while (removals.length) {
      let domForRemoval = removals.shift();
      domForRemoval.remove();
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
  function addNodeBefore(children, node, beforeMe) {
    if (!shouldSkip(adding, node)) {
      let clone = node.cloneNode(true);
      children = dom.before(children, beforeMe, clone);
      added(clone);
      return [children, clone];
    }
    return [children, node];
  }
  assignOptions(options);
  fromEl = from;
  toEl = typeof toHtml === "string" ? createElement(toHtml) : toHtml;
  if (window.Alpine && window.Alpine.closestDataStack && !from._x_dataStack) {
    toEl._x_dataStack = window.Alpine.closestDataStack(from);
    toEl._x_dataStack && window.Alpine.clone(from, toEl);
  }
  patch(from, toEl);
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

/***/ "./resources/js/invoke.js":
/*!********************************!*\
  !*** ./resources/js/invoke.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _morph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./morph */ "./resources/js/morph.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (componentName, data) {
  var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Convert dot notation to path.
  componentName = componentName.replace(/\./g, '/');
  var componentsToMorph = document.querySelectorAll("[data-wpmorph-component-name=\"".concat(componentName, "\"]")) || null;
  if (!componentsToMorph.length === 0) {
    throw new Error("Component(s) not found: \"".concat(componentName, "\""));
  }
  componentsToMorph.forEach(function (component) {
    (0,_morph__WEBPACK_IMPORTED_MODULE_0__["default"])(component, data, hooks);
  });
});

/***/ }),

/***/ "./resources/js/morph.js":
/*!*******************************!*\
  !*** ./resources/js/morph.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var object_to_formdata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! object-to-formdata */ "./node_modules/object-to-formdata/src/index.js");
/* harmony import */ var object_to_formdata__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(object_to_formdata__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (el, data) {
  var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var rootEl = el.closest('[data-wpmorph-component-hash]');
  var componentHash = rootEl.dataset.wpmorphComponentHash;
  var payload = {};
  if (typeof data === 'string') {
    payload[data] = data;
  } else {
    Object.assign(payload, data);
  }

  // Lifecycle hook
  if (hooks.onStart && typeof hooks.onStart === 'function') {
    hooks.onStart();
  }
  fetch('/morph/api/v1/morph', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Morph-Request': true,
      'X-Morph-Hash': componentHash
    },
    body: (0,object_to_formdata__WEBPACK_IMPORTED_MODULE_0__.serialize)(payload)
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
    var keys = [];
    window.Alpine.morph(rootEl, res, {
      adding: function adding(el) {
        if (el.nodeType === 1 && el.hasAttribute('wp-morph-transition') && el.hasAttribute('key')) {
          var key = el.getAttribute('key');
          keys.push(key);
          if (keys[0] === key) {
            var customCssClass = el.getAttribute('wp-morph-transition');
            el.classList.add(customCssClass || 'wp-morph-transition');
          }
        }
      },
      added: function added(el) {
        if (el.nodeType === 1 && el.hasAttribute('wp-morph-transition')) {
          var customInCssClass = el.getAttribute('wp-morph-transition-in');
          setTimeout(function () {
            el.classList.add(customInCssClass || 'wp-morph-transition-in');
          }, 170);
        }
      }
    });

    // Lifecycle hook
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
});

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
/*!******************************!*\
  !*** ./resources/js/init.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alpinejs_morph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @alpinejs/morph */ "./node_modules/@alpinejs/morph/dist/module.esm.js");
/* harmony import */ var _morph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./morph */ "./resources/js/morph.js");
/* harmony import */ var _invoke__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./invoke */ "./resources/js/invoke.js");



document.addEventListener('alpine:init', function () {
  Alpine.plugin(_alpinejs_morph__WEBPACK_IMPORTED_MODULE_0__["default"]);
  window.Alpine.magic('wpMorph', function (el) {
    return function (data) {
      var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0,_morph__WEBPACK_IMPORTED_MODULE_1__["default"])(el, data, hooks);
    };
  });
  window.Alpine.magic('wpMorphInvoke', function () {
    return function (componentName, data) {
      var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return (0,_invoke__WEBPACK_IMPORTED_MODULE_2__["default"])(componentName, data, hooks);
    };
  });
});
})();

/******/ })()
;
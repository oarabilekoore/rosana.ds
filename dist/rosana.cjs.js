"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var idCount = 0, classnameCount = 0;
const generateId = function() {
  return `rosana-id-${idCount++}`;
};
const generateClassName = function() {
  return `rosana-class-${classnameCount++}`;
};
const cssParser = (styles, ...values) => {
  const className = generateClassName();
  const styleSheet = document.styleSheets[0];
  let cssString = "";
  let nestedCssRules = [];
  let mediaQueryRules = [];
  const parseStyles = (styles2, selector) => {
    let baseStyles = "";
    Object.entries(styles2).forEach(([key, value]) => {
      if (typeof value === "object") {
        if (key.startsWith("@")) {
          mediaQueryRules.push({
            media: key,
            selector,
            styles: value
          });
        } else if (key.startsWith("&:")) {
          const pseudoClass = key.replace("&", selector);
          nestedCssRules.push({
            selector: pseudoClass,
            styles: value
          });
        } else {
          nestedCssRules.push({
            selector: `${selector} ${key}`,
            styles: value
          });
        }
      } else {
        baseStyles += `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}; `;
      }
    });
    return baseStyles;
  };
  if (typeof styles === "object" && !Array.isArray(styles)) {
    cssString = parseStyles(styles, `.${className}`);
  } else if (Array.isArray(styles)) {
    cssString = styles.reduce((result, str, i) => {
      return result + str + (values[i] || "");
    }, "");
  }
  if (cssString) {
    styleSheet.insertRule(`.${className} { ${cssString} }`, styleSheet.cssRules.length);
  }
  nestedCssRules.forEach(({ selector, styles: styles2 }) => {
    const nestedCssString = parseStyles(styles2, selector);
    if (nestedCssString) {
      styleSheet.insertRule(
        `${selector} { ${nestedCssString} }`,
        styleSheet.cssRules.length
      );
    }
  });
  mediaQueryRules.forEach(({ media, selector, styles: styles2 }) => {
    const nestedCssString = parseStyles(styles2, selector);
    if (nestedCssString) {
      styleSheet.insertRule(
        `${media} { ${selector} { ${nestedCssString} } }`,
        styleSheet.cssRules.length
      );
    }
  });
  return className;
};
class componentController {
  constructor() {
    this.element = null;
    this.elementClasses = [];
    this.eventListeners = [];
  }
  /**
   * Add a child element to this element.
   * @param {componentController} child - The child component to add.
   * @returns {this} - Returns the instance of the class for chaining.
   */
  addChild(child) {
    if (child instanceof componentController && this.element) {
      this.element.appendChild(child.element);
    } else {
      console.error("Mounted Child Is Not A Rosana Component");
    }
    return this;
  }
  /**
   * Set the alignment of child elements in the control.
   * @param {string} options - Alignment options.
   */
  alignment(options) {
    if (options) {
      optionsApi(this.element, options);
    } else {
      console.log("Alignment Options Undefined");
    }
  }
  /**
   * batch dom api setters and getters effeciently
   * @param {object} props
   * @returns this
   */
  batch(props) {
    Object.entries(props).forEach(([key, value]) => {
      requestAnimationFrame(() => {
        if (this.element) {
          this.element[key] = value;
        }
      });
    });
    return this;
  }
  /**
   * Add an event listener to the element.
   * @param {string} event - The event type.
   * @param {Function} handler - The event handler function.
   * @returns {this} - Returns the instance of the class for chaining.
   */
  on(event, handler) {
    var _a;
    (_a = this.element) == null ? void 0 : _a.addEventListener(event, handler);
    this.eventListeners.push([event, handler]);
    return this;
  }
  css(styles) {
    var _a;
    const className = cssParser(styles);
    (_a = this.element) == null ? void 0 : _a.classList.add(className);
    this.elementClasses.push(className);
    return this;
  }
  /**
   * Remove a child element from this element.
   * @param {instanceOf<componentController>} child - The child component to remove.
   * @returns {this} - Returns the instance of the class for chaining.
   */
  destroyChild(child) {
    var _a;
    if (child instanceof componentController) {
      child.eventListeners.forEach(([event, Fn]) => {
        var _a2;
        (_a2 = child.element) == null ? void 0 : _a2.removeEventListener(event, Fn);
      });
      (_a = child.element) == null ? void 0 : _a.remove();
    } else {
      console.error("Child Is Not A Rosana Component");
    }
    return this;
  }
  /**
   * Sets the visibility of the element.
   */
  show() {
    this.css({ visibility: "visible" });
  }
  /**
   * Hide the element
   */
  hide() {
    this.css({ visibility: "hidden" });
  }
  /**
   * Sets the display and visibility of the element.
   */
  gone() {
    this.css({
      display: "none !important",
      visibility: "hidden"
    });
  }
}
let viewOptions = [
  "noscrollbar",
  "scrollxy",
  "scrollx",
  "scrolly",
  "top",
  "bottom",
  "left",
  "right",
  "horizontal",
  "vertical",
  "vcenter",
  "center",
  "fillxy",
  "fillx",
  "filly"
];
const optionsApi = (element, options) => {
  const functions = {
    noscrollbar: () => {
      element.classList.add("noscrollbar");
    },
    fillxy: () => {
      let className = cssParser({
        width: "100%",
        height: window.innerHeight + "px"
      });
      element.classList.add(className);
    },
    fillx: () => {
      let className = cssParser({
        width: "100%"
      });
      element.classList.add(className);
    },
    filly: () => {
      let className = cssParser({
        height: window.innerHeight + "px"
      });
      element.classList.add(className);
    },
    scrollxy: () => {
      let className = cssParser({
        overflow: "auto"
      });
      element.classList.add(className);
    },
    scrollx: () => {
      let className = cssParser({
        overflowX: "auto"
      });
      element.classList.add(className);
    },
    scrolly: () => {
      let className = cssParser({
        overflowY: "auto"
      });
      element.classList.add(className);
    },
    left: () => {
      let className = cssParser({
        display: "flex",
        justifyContent: "flex-start"
      });
      element.classList.add(className);
    },
    right: () => {
      let className = cssParser({
        display: "flex",
        justifyContent: "flex-end"
      });
      element.classList.add(className);
    },
    center: () => {
      let className = cssParser({
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      });
      element.classList.add(className);
    },
    vcenter: () => {
      let className = cssParser({
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      });
      element.classList.add(className);
    },
    bottom: () => {
      let className = cssParser({
        display: "flex",
        alignItems: "flex-end"
      });
      element.classList.add(className);
    },
    top: () => {
      let className = cssParser({
        display: "flex",
        alignItems: "flex-start"
      });
      element.classList.add(className);
    },
    horizontal: () => {
      let className = cssParser({
        display: "flex",
        flexDirection: "row !important"
      });
      element.classList.add(className);
    },
    vertical: () => {
      let className = cssParser({
        display: "flex",
        flexDirection: "column"
      });
      element.classList.add(className);
    }
  };
  options.toLowerCase().replace(/\s/g, "").split(",").forEach((el) => {
    if (viewOptions.includes(el)) {
      functions[el]();
    } else {
      console.error(`Unknown option: ${el}`);
    }
  });
};
function layoutFitApi(layout, type, options) {
  options ? optionsApi(layout, options) : null;
  let layoutTYPE = type.toLowerCase();
  if (layoutTYPE == "linear") {
    let className = cssParser({
      display: "inline-flex",
      position: "relative !important",
      flexDirection: "column !important"
    });
    layout.classList.add(className);
  } else if (layoutTYPE == "absolute") {
    let className = cssParser({
      display: "flex"
    });
    layout.classList.add(className);
  } else if (layoutTYPE === "frame") {
    layout.style.position = "relative";
  } else if (layoutTYPE === "stack") {
    let className = cssParser({
      display: "flex",
      // @ts-ignore
      flexDirection: options.includes("vertical") ? "column" : "row"
    });
    layout.classList.add(className);
  } else {
    console.error("Unknown Layout ", layout);
  }
}
const $LayoutInitializer = class extends componentController {
  /**
   * Creates a new layout element with the specified type and options.
   * @param {string} type - The layout type (e.g., "linear", "absolute", "frame", "stack").
   * @param {string} [options] - Optional string representing layout options (e.g., "horizontal", "vertical").
   */
  constructor(type, options) {
    super();
    this.element = document.createElement("div");
    this.element.id = generateId();
    this.element.type = "Layout";
    type ? layoutFitApi(this.element, type, options) : null;
  }
};
const $LinearLayout = function(childAlignmentProperties) {
  return new $LayoutInitializer("linear", childAlignmentProperties);
};
const $AbsoluteLayout = function(childAlignmentProperties) {
  return new $LayoutInitializer("absolute", childAlignmentProperties);
};
const $FrameLayout = function(childAlignmentProperties) {
  return new $LayoutInitializer("frame", childAlignmentProperties);
};
const $StackedLayout = function(stackOrientation = "horizontal") {
  return new $LayoutInitializer("stack", stackOrientation);
};
const $createApp = function(mainComponent) {
  const app = {
    _rootComponent: mainComponent,
    _plugins: [],
    /**
     * Mounts the main component to a DOM element identified by the selector.
     * @param {string} selector - A CSS selector for the container to mount the component.
     * @returns {Object} - The app instance for method chaining.
     */
    mount: function(selector) {
      const container = document.querySelector(selector);
      if (!container) {
        console.error(`No element found for selector "${selector}"`);
        return this;
      }
      document.body.style.margin = "0";
      document.body.style.width = "100%";
      container.innerHTML = "";
      const instance = this._rootComponent;
      if (instance && instance.element) {
        container.appendChild(instance.element);
      } else {
        console.error("Main component does not have an element property.");
      }
      return this;
    },
    /**
     * Adds a plugin to the application.
     * @param {Object} plugin - The plugin object to add, expected to have an _install function.
     * @returns {Object} - The app instance for method chaining.
     */
    use: function(plugin) {
      if (plugin && typeof plugin._install === "function") {
        plugin._install(this);
        this._plugins.push(plugin);
      } else {
        console.warn("Plugin is missing _install method:", plugin);
      }
      return this;
    }
  };
  return app;
};
const $signal = function(defaultValue = null) {
  let internal_variable = defaultValue;
  let subscriptions = [];
  const notify = function(fn) {
    for (let subscriber of subscriptions) {
      subscriber(internal_variable);
    }
  };
  return {
    /**
     * set the signal's value
     * @param {any} val
     */
    set value(val) {
      internal_variable = val;
      notify();
    },
    /**
     * returns the signals value
     * @returns internal_variable
     */
    get value() {
      return internal_variable;
    },
    /**
     * subscribe to the signal
     * @param {Function} fn
     */
    subscribe: (fn) => {
      subscriptions.push(fn);
    }
  };
};
const $store = function(initialValue = {}) {
  let state = { ...initialValue };
  const listeners = /* @__PURE__ */ new Set();
  return {
    /**
     * set the signal's value
     * @param {any} val
     */
    set(key, value) {
      state[key] = value;
      listeners.forEach((listener) => listener(state));
    },
    /**
     * returns the signals value
     * @returns internal_variable
     */
    get(key) {
      return state[key];
    },
    /**
     * subscribe to the signal
     * @param {Function} fn
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};
const defaultLanguage = navigator.language;
const defaultLangCode = defaultLanguage.split("-")[0];
let translations = {};
let currentLang;
const $localize = async function(defaultLang = defaultLangCode, jsonSource) {
  currentLang = $signal(defaultLang);
  const response = await fetch(jsonSource);
  if (!response.ok) {
    console.log("Translation File Not Loaded");
    return;
  }
  const loadedTranslations = await response.json();
  translations = { ...translations, ...loadedTranslations };
};
const $setLanguage = function(langCode) {
  currentLang.value = langCode;
};
let $localizedText = function(key, placeholders) {
  if (!currentLang || !currentLang.value) {
    return key;
  }
  const langData = translations[currentLang.value] || translations[defaultLangCode] || {};
  let translation = langData[key] || key;
  if (placeholders) {
    Object.keys(placeholders).forEach((placeholder) => {
      translation = translation.replace(`{${placeholder}}`, placeholders[placeholder]);
    });
  }
  return translation;
};
componentController.prototype.localizedText = async function(key, placeholders) {
  if (!currentLang || !currentLang.value) {
    return key;
  }
  const localizedText = await $localizedText(key, placeholders);
  this.element.textContent = localizedText;
  currentLang.subscribe(async () => {
    const localizedText2 = await $localizedText(key, placeholders);
    this.element.textContent = localizedText2;
  });
};
const $showIF = function(restingParameter, onTruthyElement, onFalseyElement) {
  if (onTruthyElement === void 0 || onFalseyElement === void 0) {
    console.error(`showIF not called, one of the elements is undefined`);
    return;
  }
  restingParameter ? onTruthyElement.show() : onTruthyElement.hide();
  !restingParameter ? onFalseyElement.show() : onFalseyElement.hide();
};
const $suspense = (resource, fallback, controlInSuspension) => {
  const subscriptions = [];
  const notify = () => subscriptions.forEach((subscriber) => subscriber());
  if (fallback.type === "Layout" && controlInSuspension.type === "Layout") {
    if (!controlInSuspension.hasChild(fallback)) {
      console.error(`FallBack is not a child of ${controlInSuspension}`);
      return;
    }
    ap.mount(fallback);
    const showFallback = () => {
      fallback.show();
      controlInSuspension.hide();
    };
    const showSuspended = () => {
      controlInSuspension.show();
      fallback.hide();
    };
    showFallback();
    Promise.resolve(resource()).then(() => {
      showSuspended();
      notify();
    }).catch(() => showFallback());
  } else {
    console.error("suspense must be used with both containers as a layout");
  }
  return {
    /**
     * call a function after the new view is added
     * @param {Function} fn
     */
    effects: (fn) => subscriptions.push(fn)
  };
};
const $hashRouter = function(hashParam) {
  const plugin = {
    routes: hashParam,
    currentRoute: null,
    params: {},
    _init: function() {
      console.table(this.routes);
      window.addEventListener("hashchange", this._handleHashChange.bind(this));
      if (window.location.hash) {
        this._handleHashChange();
      } else {
        window.location.hash = "#/";
      }
      return this;
    },
    /**
     * @param {any} app
     */
    _install: function(app) {
      this._init();
      app.router = this;
    },
    _render: function() {
      const appContainer = document.querySelector("#app");
      if (!appContainer) {
        console.error("App container not found.");
        return;
      }
      appContainer.innerHTML = "";
      if (this.currentRoute && this.currentRoute.component) {
        const component = this.currentRoute.component;
        appContainer.appendChild(component.element);
        if (typeof component.updateParams === "function") {
          component.updateParams(this.params);
        }
      } else {
        console.error("No valid component found for route.");
      }
    },
    _handleHashChange: function() {
      const hash = window.location.hash.slice(1) || "/";
      const matchedRoute = this._matchRoute(hash);
      if (matchedRoute) {
        this.currentRoute = matchedRoute.route;
        this.params = matchedRoute.params;
        this._render();
      } else {
        console.error(`Route not found: ${hash}`);
      }
    },
    _matchRoute(path) {
      for (const route of this.routes) {
        const { regex, keys } = this._pathToRegex(route.path);
        const match = path.match(regex);
        if (match) {
          const params = keys.reduce((acc, key, index) => {
            acc[key] = match[index + 1];
            return acc;
          }, {});
          return { route, params };
        }
      }
      return null;
    },
    _pathToRegex(path) {
      const keys = [];
      const regexString = path.replace(/:([\w]+)/g, (_, key) => {
        keys.push(key);
        return "([^\\/]+)";
      }).replace(/\//g, "\\/");
      return { regex: new RegExp(`^${regexString}$`), keys };
    },
    /**
     * Navigate to a specified path with parameters
     * @param {string} path
     * @param {object} params
     */
    navigate(path, params = {}) {
      const fullPath = path.replace(/:([\w]+)/g, (_, key) => {
        if (params[key] === void 0) {
          console.error(`Parameter "${key}" not provided for path: ${path}`);
          return `:${key}`;
        }
        return params[key];
      });
      window.location.hash = fullPath;
    },
    back: function() {
      history.back();
    },
    forward: function() {
      history.forward();
    }
  };
  return plugin;
};
let $ElementInitializer = class extends componentController {
  /**
   * Creates an HTML element.
   * @param {HtmlTag} tag - The HTML tag name to create (e.g., 'div', 'span').
   * @param {componentController} parent - The parent component to attach to.
   * @param {Object<string, any>} props - An object containing properties to set on the element.
   */
  constructor(tag, parent, props) {
    super();
    this.element = document.createElement(tag);
    this.element.id = generateId();
    Object.entries(props).forEach(([key, value]) => {
      requestAnimationFrame(() => {
        if (key in this.element) {
          this.element[key] = value;
        } else {
          console.warn(`Property ${key} does not exist on element.`);
        }
      });
    });
    if (parent instanceof componentController) {
      parent.addChild(this);
    } else {
      console.error("No Parent For Component To Attach To.");
      return;
    }
  }
};
const $Element = function(tag, parent, props = {}) {
  return new $ElementInitializer(tag, parent, props);
};
exports.$AbsoluteLayout = $AbsoluteLayout;
exports.$Element = $Element;
exports.$FrameLayout = $FrameLayout;
exports.$LinearLayout = $LinearLayout;
exports.$StackedLayout = $StackedLayout;
exports.$createApp = $createApp;
exports.$hashRouter = $hashRouter;
exports.$localize = $localize;
exports.$setLanguage = $setLanguage;
exports.$showIF = $showIF;
exports.$signal = $signal;
exports.$store = $store;
exports.$suspense = $suspense;
//# sourceMappingURL=rosana.cjs.js.map

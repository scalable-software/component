/**
 * @module Core
 */
import { Template } from "./Template.js";
/**
 * Component class for creating custom elements.
 * Extends HTMLElement and provides lifecycle methods and attribute handling.
 * Lifecycle methods points to functions which enable the use of function expressions.
 * @category Component
 */
export class Component extends HTMLElement {
    /**
     * `Template.load(filename)` is used to load an HTML template packaged with the component.
     * @category Template
     * @hidden
     */
    static Template = Template;
    /**
     * When extending `Component`, override attributes.
     * Only attributes defined the Attributes object will be observed in DOM
     * @category Attributes
     * @hidden
     */
    /* istanbul ignore next */
    static get Attributes() {
        return [];
    }
    /**
     * List of attributes in DOM to observe.
     * This list is generated from the Attributes object's values.
     * @category Hooks
     * @hidden
     */
    static get observedAttributes() {
        return Object.values(this.Attributes);
    }
    /**
     * The shadow root of the component if it exists.
     * @hidden
     */
    _root;
    /**
     * @hidden
     */
    constructor() {
        super();
        this.template && this._addTemplate();
    }
    /**
     * The shadow root of the component exposed as a readonly accessor.
     * @category Configuration
     * @hidden
     */
    get root() {
        return this._root;
    }
    /**
     * Optional readonly accessor with HTML Template id to use if template is required
     * @category Configuration
     */
    /* istanbul ignore next */
    get template() {
        return undefined;
    }
    /**
     * Optional readonly access with CSS style to use if style is required
     * @category Configuration
     */
    /* istanbul ignore next */
    get css() {
        return undefined;
    }
    /**
     * The connected callback is called when the element is added to the DOM.
     * It is used for initial setup tasks like loading templates, caching elements, and adding event listeners.
     * @category Hooks
     * @hidden
     */
    connectedCallback() {
        this._initialize();
        this._cacheElements();
        this._addEventListeners();
        this._dispatchEvent("connected");
    }
    /**
     * The disconnected callback is called when the element is removed from the DOM.
     * It is used for cleanup tasks like removing event listeners or resetting state.
     * @category Hooks
     * @hidden
     */
    disconnectedCallback() {
        this._removeEventListeners();
        this._dispatchEvent("disconnected");
    }
    /**
     * The attributeChangedCallback is called when one of the observed attributes is added, removed, or changed.
     * It is used to react to attribute changes and update the element accordingly.
     * @category Hooks
     * @hidden
     */
    attributeChangedCallback(name, oldValue, newValue) {
        const handler = this._attributeHandlers[name];
        handler && handler(newValue);
    }
    /**
     * Dispatches a CustomEvent from the component
     * @hidden
     */
    _dispatchEvent = (event, eventInitDict) => this.dispatchEvent(new CustomEvent(event, eventInitDict));
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @category Hooks
     * @hidden
     */
    _attributeHandlers = {};
    /**
     * Not required by all components.
     * Used for initializing component state or attributes.
     * @category Hooks
     * @hidden
     **/
    _initialize = () => { };
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout with elements which component logic has to interact with.
     * @category Hooks
     * @hidden
     */
    _cacheElements = () => { };
    /**
     * Not required by all components.
     * Only needed if the component uses event binding to interact with the DOM.
     * @category Hooks
     * @hidden
     */
    _addEventListeners = () => { };
    /**
     * Not required by all components.
     * Only needed if the component uses event binding to interact with the DOM.
     * @category Hooks
     * @hidden
     */
    _removeEventListeners = () => { };
    /**
     * Not required by all components.
     * Only needed if the component needs its own HTML template.
     * @hidden
     */
    _addShadowRoot = () => (this._root = this.attachShadow({ mode: "closed" }));
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     */
    _loadTemplate = () => this.template && this._root.appendChild(this._cloneTemplate());
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     * @returns {Node} - A cloned node from the template content.
     **/
    _cloneTemplate = () => this._getTemplate().content.cloneNode(true);
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     * @returns {HTMLTemplateElement} - The template element from the DOM.
     **/
    _getTemplate = () => document.getElementById(this.template);
    /**
     * Not required by all components.
     * Only needed if the component has its own Style.
     * @hidden
     **/
    /* istanbul ignore next */
    _loadStyle = () => this.css && this._root.appendChild(this._createStylesheet());
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @category Hooks
     * @hidden
     */
    _addTemplate = () => {
        this._addShadowRoot();
        this._loadStyle();
        this._loadTemplate();
    };
    /**
     * Not required by all components.
     * Only needed if the component has its own Style.
     * @hidden
     **/
    /* istanbul ignore next */
    _createStylesheet = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL(this.css, import.meta.url).href;
        return link;
    };
}

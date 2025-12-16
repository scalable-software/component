/**
 * @module Core
 */
import { Event } from "./component.meta.js";
/**
 * Component class for creating custom elements.
 * Extends HTMLElement and provides lifecycle methods and attribute handling.
 * Lifecycle methods points to functions which enable the use of function expressions.
 * @category Component
 */
export class Component extends HTMLElement {
    static get Tag() {
        return "app-component";
    }
    /**
     * `Template.load(filename)` is used to load an HTML template packaged with the component.
     * @category Template
     * @hidden
     */
    static Template = null;
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
     * Utility to get first reference to the component
     * Optionally provide a value for the id attribute
     * @category Utility
     */
    static async get(options) {
        const { root = document, id } = options ?? {};
        await customElements.whenDefined(this.Tag);
        return id
            ? root.querySelector(`${this.Tag}#${id}`)
            : root.querySelector(this.Tag);
    }
    /**
     * Utility to get all references to the component
     * @category Utility
     */
    static async all(options) {
        const { root = document } = options ?? {};
        await customElements.whenDefined(this.Tag);
        return Array.from(root.querySelectorAll(this.Tag));
    }
    /**
     * The configuration object for the component.
     * @category Configuration
     * @hidden
     */
    _configuration;
    /**
     * The shadow root of the component if it exists.
     * @hidden
     */
    _root;
    /**
     * @hidden
     */
    constructor(configuration) {
        super();
        configuration && (this._configuration = configuration);
        this.configuration?.template?.id && this._addTemplate();
    }
    /**
     * The configuration object of the component exposed as a readonly accessor.
     * @category Configuration
     * @hidden
     */
    get configuration() {
        return this._configuration;
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
     * The connected callback is called when the element is added to the DOM.
     * It is used for initial setup tasks like loading templates, caching elements, and adding event listeners.
     * @category Hooks
     * @hidden
     */
    connectedCallback() {
        this._cache();
        this._initialize();
        this._addEventListeners();
        this._dispatchEvent(Event.CONNECTED);
    }
    /**
     * The disconnected callback is called when the element is removed from the DOM.
     * It is used for cleanup tasks like removing event listeners or resetting state.
     * @category Hooks
     * @hidden
     */
    disconnectedCallback() {
        this._removeEventListeners();
        this._dispatchEvent(Event.DISCONNECTED);
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
     * Only needed if the component has its own Layout with elements which component logic has to interact with.
     * @category Hooks
     * @hidden
     */
    _cache = () => { };
    /**
     * Not required by all components.
     * Used for initializing component state or attributes.
     * @category Hooks
     * @hidden
     **/
    _initialize = () => { };
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
    _loadTemplate = () => this.configuration?.template?.id &&
        this._root.appendChild(this._cloneTemplate());
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
    _getTemplate = () => document.getElementById(this.configuration?.template?.id);
    /**
     * Not required by all components.
     * Only needed if the component has its own Style.
     * @hidden
     **/
    /* istanbul ignore next */
    _loadStyle = () => this.configuration?.css?.name &&
        this._root.appendChild(this._createStylesheet());
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
        link.href = new URL(this.configuration?.css?.name, this.configuration.url).href;
        return link;
    };
}

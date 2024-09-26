/**
 * @module Core
 */
export type Configuration = {
    url: string;
    template?: {
        id: string;
    };
    css?: {
        name: string;
    };
};
/**
 * Component class for creating custom elements.
 * Extends HTMLElement and provides lifecycle methods and attribute handling.
 * Lifecycle methods points to functions which enable the use of function expressions.
 * @category Component
 */
export declare class Component extends HTMLElement {
    /**
     * `Template.load(filename)` is used to load an HTML template packaged with the component.
     * @category Template
     * @hidden
     */
    static Template: any;
    /**
     * When extending `Component`, override attributes.
     * Only attributes defined the Attributes object will be observed in DOM
     * @category Attributes
     * @hidden
     */
    static get Attributes(): any;
    /**
     * List of attributes in DOM to observe.
     * This list is generated from the Attributes object's values.
     * @category Hooks
     * @hidden
     */
    static get observedAttributes(): string[];
    /**
     * The configuration object for the component.
     * @category Configuration
     * @hidden
     */
    private _configuration;
    /**
     * The shadow root of the component if it exists.
     * @hidden
     */
    private _root;
    /**
     * @hidden
     */
    constructor(configuration?: Configuration);
    /**
     * The configuration object of the component exposed as a readonly accessor.
     * @category Configuration
     * @hidden
     */
    get configuration(): Configuration;
    /**
     * The shadow root of the component exposed as a readonly accessor.
     * @category Configuration
     * @hidden
     */
    get root(): ShadowRoot;
    /**
     * The connected callback is called when the element is added to the DOM.
     * It is used for initial setup tasks like loading templates, caching elements, and adding event listeners.
     * @category Hooks
     * @hidden
     */
    connectedCallback(): void;
    /**
     * The disconnected callback is called when the element is removed from the DOM.
     * It is used for cleanup tasks like removing event listeners or resetting state.
     * @category Hooks
     * @hidden
     */
    disconnectedCallback(): void;
    /**
     * The attributeChangedCallback is called when one of the observed attributes is added, removed, or changed.
     * It is used to react to attribute changes and update the element accordingly.
     * @category Hooks
     * @hidden
     */
    attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
    /**
     * Dispatches a CustomEvent from the component
     * @hidden
     */
    protected _dispatchEvent: (event: string, eventInitDict?: CustomEventInit<unknown>) => boolean;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @category Hooks
     * @hidden
     */
    protected _attributeHandlers: {};
    /**
     * Not required by all components.
     * Used for initializing component state or attributes.
     * @category Hooks
     * @hidden
     **/
    protected _initialize: () => void;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout with elements which component logic has to interact with.
     * @category Hooks
     * @hidden
     */
    protected _cacheElements: () => void;
    /**
     * Not required by all components.
     * Only needed if the component uses event binding to interact with the DOM.
     * @category Hooks
     * @hidden
     */
    protected _addEventListeners: () => void;
    /**
     * Not required by all components.
     * Only needed if the component uses event binding to interact with the DOM.
     * @category Hooks
     * @hidden
     */
    protected _removeEventListeners: () => void;
    /**
     * Not required by all components.
     * Only needed if the component needs its own HTML template.
     * @hidden
     */
    private _addShadowRoot;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     */
    private _loadTemplate;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     * @returns {Node} - A cloned node from the template content.
     **/
    private _cloneTemplate;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @hidden
     * @returns {HTMLTemplateElement} - The template element from the DOM.
     **/
    private _getTemplate;
    /**
     * Not required by all components.
     * Only needed if the component has its own Style.
     * @hidden
     **/
    private _loadStyle;
    /**
     * Not required by all components.
     * Only needed if the component has its own Layout.
     * @category Hooks
     * @hidden
     */
    private _addTemplate;
    /**
     * Not required by all components.
     * Only needed if the component has its own Style.
     * @hidden
     **/
    private _createStylesheet;
}

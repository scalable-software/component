/**
 * @module Core
 */

import { Event } from "./component.meta.js";

import { type Configuration } from "./component.meta.js";
import { type Template } from "./template.js";

/**
 * Component class for creating custom elements.
 * Extends HTMLElement and provides lifecycle methods and attribute handling.
 * Lifecycle methods points to functions which enable the use of function expressions.
 * @category Component
 */
export class Component extends HTMLElement {
  public static get Tag() {
    return "app-component";
  }

  /**
   * `Template.load(filename)` is used to load an HTML template packaged with the component.
   * @category Template
   * @hidden
   */
  public static Template: Template | null = null;

  /**
   * When extending `Component`, override attributes.
   * Only attributes defined the Attributes object will be observed in DOM
   * @category Attributes
   * @hidden
   */
  /* istanbul ignore next */
  public static get Attributes(): any {
    return [];
  }

  /**
   * List of attributes in DOM to observe.
   * This list is generated from the Attributes object's values.
   * @category Hooks
   * @hidden
   */
  public static get observedAttributes(): string[] {
    return Object.values(this.Attributes);
  }

  /**
   * Utility to get first reference to the component
   * Optionally provide a value for the id attribute
   * @category Utility
   */
  public static async get<T extends Component>(
    this: { new (): T; Tag: string },
    options?: { root?: ParentNode; id?: string },
  ): Promise<T | null> {
    const { root = document, id } = options ?? {};

    await customElements.whenDefined(this.Tag);

    return id
      ? (root.querySelector(`${this.Tag}#${id}`) as T | null)
      : (root.querySelector(this.Tag) as T | null);
  }

  /**
   * Utility to get all references to the component
   * @category Utility
   */
  public static async all<T extends Component>(
    this: { new (): T; Tag: string },
    options?: { root?: ParentNode },
  ): Promise<T[]> {
    const { root = document } = options ?? {};

    await customElements.whenDefined(this.Tag);

    return Array.from(root.querySelectorAll(this.Tag)) as T[];
  }

  /**
   * The configuration object for the component.
   * @category Configuration
   * @hidden
   */
  private _configuration: Configuration | null = null;

  /**
   * The shadow root of the component if it exists.
   * @hidden
   */
  private _root: ShadowRoot | null = null;

  /**
   * @hidden
   */
  constructor(configuration?: Configuration) {
    super();
    configuration && (this._configuration = configuration);
    this.configuration?.template?.id && this._addTemplate();
  }

  /**
   * The configuration object of the component exposed as a readonly accessor.
   * @category Configuration
   * @hidden
   */
  public get configuration() {
    return this._configuration;
  }

  /**
   * The shadow root of the component exposed as a readonly accessor.
   * @category Configuration
   * @hidden
   */
  public get root(): ShadowRoot {
    return this._root as ShadowRoot;
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
    this._dispose();
    this._dispatchEvent(Event.DISCONNECTED);
  }

  /**
   * The attributeChangedCallback is called when one of the observed attributes is added, removed, or changed.
   * It is used to react to attribute changes and update the element accordingly.
   * @category Hooks
   * @hidden
   */
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    const handler = this._attributeHandlers[name] as
      | ((newValue: any) => void)
      | undefined;
    handler && handler(newValue);
  }

  /**
   * Dispatches a CustomEvent from the component
   * @hidden
   */
  protected _dispatchEvent = (
    event: string,
    eventInitDict?: CustomEventInit<unknown>,
  ) => this.dispatchEvent(new CustomEvent(event, eventInitDict));

  protected _dispatch = (event: string, detail?: unknown) =>
    this._dispatchEvent(event, detail === undefined ? undefined : { detail });


  /**
   * Not required by all components.
   * Only needed if the component has its own Layout.
   * @category Hooks
   * @hidden
   */
  protected _attributeHandlers = {} as {
    [key: string]: ((newValue: any) => void) | undefined;
  };

  /**
   * Not required by all components.
   * Only needed if the component has its own Layout with elements which component logic has to interact with.
   * @category Hooks
   * @hidden
   */
  protected _cache = () => {};

  /**
   * Not required by all components.
   * Used for initializing component state or attributes.
   * @category Hooks
   * @hidden
   **/
  protected _initialize = () => {};

  /**
   * Not required by all components.
   * Only needed if the component uses event binding to interact with the DOM.
   * @category Hooks
   * @hidden
   */
  protected _addEventListeners = () => {};

  /**
   * Not required by all components.
   * Only needed if the component uses event binding to interact with the DOM.
   * @category Hooks
   * @hidden
   */
  protected _removeEventListeners = () => {};

  protected _dispose = () => {};

  /**
   * Not required by all components.
   * Only needed if the component needs its own HTML template.
   * @hidden
   */
  private _addShadowRoot = (): ShadowRoot =>
    (this._root = this.attachShadow({ mode: "closed" }));

  /**
   * Not required by all components.
   * Only needed if the component has its own Layout.
   * @hidden
   */
  private _loadTemplate = () =>
    this.configuration?.template?.id &&
    (this._root as ShadowRoot).appendChild(this._cloneTemplate());

  /**
   * Not required by all components.
   * Only needed if the component has its own Layout.
   * @hidden
   * @returns {Node} - A cloned node from the template content.
   **/
  private _cloneTemplate = () => this._getTemplate().content.cloneNode(true);

  /**
   * Not required by all components.
   * Only needed if the component has its own Layout.
   * @hidden
   * @returns {HTMLTemplateElement} - The template element from the DOM.
   **/
  private _getTemplate = () =>
    document.getElementById(
      (this.configuration?.template?.id as string) || "",
    ) as HTMLTemplateElement;

  /**
   * Not required by all components.
   * Only needed if the component has its own Style.
   * @hidden
   **/
  /* istanbul ignore next */
  private _loadStyle = () =>
    this.configuration?.css?.name &&
    (this._root as ShadowRoot).appendChild(this._createStylesheet());

  /**
   * Not required by all components.
   * Only needed if the component has its own Layout.
   * @category Hooks
   * @hidden
   */
  private _addTemplate = () => {
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
  private _createStylesheet = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL(
      this.configuration?.css?.name as string,
      this.configuration?.url as string,
    ).href;
    return link;
  };
}

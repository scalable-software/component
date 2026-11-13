![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Component

The base class for Scalable Software web components. Extend `Component` instead of `HTMLElement` to get lifecycle hooks, observed attributes, event dispatch with a single `onevent` handler, and optional HTML templates and styles in a closed Shadow DOM.

## Installation

```bash
npm install @scalable.software/component
```

The package exports `Component`, `Template`, `Event` and the `Configuration` type.

## Usage

### Defining a component

The `Test` component from this package's own tests shows the full pattern: a tag, an observed `state` attribute, an `onsave` handler and a `save()` operation.

```ts
import { Component } from "@scalable.software/component";

const Attribute = { STATE: "state" } as const;
const State = { DEFAULT: "default", UPDATE: "update" } as const;
const Events = { ON_SAVE: "onsave" } as const;

class Test extends Component {
  public static get Tag() {
    return "test-component";
  }

  // Attributes: observed in the DOM and routed to a handler
  public static get Attributes(): typeof Attribute {
    return Attribute;
  }
  protected _attributeHandlers = {
    [Attribute.STATE]: (value: any) => (this.state = value),
  };

  // State: reflected to the optional `state` attribute
  private _state: string = State.DEFAULT;
  public get state(): string {
    return this._state;
  }
  public set state(value: string | null) {
    try {
      value = value ?? State.DEFAULT;
      if (this._state === value) return;
      this._state = value;
    } finally {
      this._reflect(Attribute.STATE, this._state, State.DEFAULT);
    }
  }

  // Events
  public set onsave(handler: EventListener) {
    this.addEventListener(Events.ON_SAVE, handler);
  }

  // Operations
  public save = (detail?: unknown) => this._dispatch(Events.ON_SAVE, detail);

  // Lifecycle hooks: override only the ones you need
  protected _initialize = () => {};
  protected _addEventListeners = () => {};
  protected _removeEventListeners = () => {};
  protected _dispose = () => {};
}

customElements.define(Test.Tag, Test);
```

### Using it from a host page

```js
const test = await Test.get(); // first <test-component>, once defined
const all = await Test.all(); // every <test-component>

test.setAttribute("state", "update");
test.state; // "update"

test.state = "default"; // removes the state attribute

test.onsave = (event) => console.log("saved", event.detail);
test.save({ node: { id: "1" } }); // logs: saved { node: { id: "1" } }

// One handler for every event the component dispatches
test.onevent = (event) => machine.send(event);
```

`get()` and `all()` take `{ root }` to search inside another node, and `get()` also takes `{ id }`.

## What the base class provides

### Lifecycle hooks

Hooks are protected arrow-function properties. Override them as class fields.

| When | Order of calls |
| --- | --- |
| Added to the DOM | `_cache` → `_initialize` → `_addEventListeners` → dispatches `connected` |
| Removed from the DOM | `_removeEventListeners` → `_dispose` → dispatches `disconnected` |
| Observed attribute changes | the matching handler in `_attributeHandlers` |

`static get Attributes()` returns an object whose values become `observedAttributes`.

### Attribute reflection

`_reflect(name, state, initial?)` makes an attribute show a state. It writes only when the attribute differs, so a setter called from an attribute handler does not loop.

| Kind of attribute | Call | The attribute |
| --- | --- | --- |
| Compulsory | `_reflect(name, state)` | always holds the state |
| Optional | `_reflect(name, state, initial)` | holds the state, and is absent while the state is `initial` |

Call it in a `finally` block of the state setter, as `Test.state` does above. It then also runs when validation throws or the value is unchanged, which puts back an attribute that was removed or set to an invalid value. Do not call it from the constructor: browsers do not allow a new element to add attributes there. Write a compulsory attribute's first value from `_initialize` instead.

### Events

- `_dispatch(event, detail?)`: dispatches a `CustomEvent` with that detail.
- `_dispatchEvent(event, eventInitDict?)`: the same, for events that need options such as `cancelable`. It returns `false` when a listener cancelled the event.
- `onevent`: one `EventListener` that receives every event sent through either method, after the event's own handlers and listeners. An error it throws is reported with `reportError`, not thrown into the component. Assigning replaces it; `null` removes it.

Events a component sends with `this.dispatchEvent(...)` directly do not reach `onevent`. A handler set after the component is in the DOM receives `disconnected` but has already missed `connected`.

### Templates and styles

Pass a `Configuration` to `super()` to render an HTML template, and optionally a stylesheet, into a closed shadow root. The root is available to the subclass as `this.root`.

```ts
import { Component, Configuration, Template } from "@scalable.software/component";

const configuration: Configuration = {
  url: import.meta.url, // the CSS path resolves against this
  template: { id: "template" }, // id of a <template> in the document
  css: { name: "./style/test.style.css" },
};

class TestStyled extends Component {
  public static get Tag() {
    return "test-style";
  }
  public static Template = new Template(import.meta.url);

  constructor() {
    super(configuration);
  }
}

await TestStyled.Template.load("./templates/test.template.html");
customElements.define(TestStyled.Tag, TestStyled);
```

The template is cloned in the constructor, so `Template.load()` must finish before the element is created. That means before `customElements.define()` when elements are already in the page.

## Import maps

In the browser, map the package name to its build output:

```html
<script type="importmap">
  {
    "imports": {
      "@scalable.software/component": "/node_modules/@scalable.software/component/dist/index.js"
    }
  }
</script>
```

## Development

| Command | What it does |
| --- | --- |
| `npm test` | Compiles the tests and runs them in headless Chrome (Karma + Jasmine) |
| `npm run build` | Compiles `src/` to `dist/` |
| `npm run serve` | Builds and serves `demo/index.html` |
| `npm run document` | Generates the API docs in `docs/` with TypeDoc |

Releases: `npm version [major|minor|patch]`, push with `--follow-tags`, then create the GitHub release. The release workflow tests and publishes to npm.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): free to share and adapt with attribution, for non-commercial use, under the same license.

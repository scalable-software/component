import { Component, Template } from "../../src/index.js";

import { Event } from "../../src/index.js";

/**
 * Test Component
 */
const Attribute = {
  STATE: "state",
} as const;

const State = {
  DEFAULT: "default",
  UPDATE: "update",
} as const;

const Hook = {
  CACHE: "_cache",
  INITIALIZE: "_initialize",
  ADD_EVENT_LISTENERS: "_addEventListeners",
  REMOVE_EVENT_LISTENERS: "_removeEventListeners",
} as const;

/**
 * Test Component with Attribute, State and Life-Cycle Hooks
 */
class Test extends Component {
  public static get Tag() {
    return "test-component";
  }

  /**
   * `Template.load(filename)` is used to load an HTML template packaged with the component.
   * @category Template
   * @hidden
   */
  public static Template = new Template(import.meta.url);

  /**
   * Component Attributes
   */
  public static get Attributes(): typeof Attribute {
    return Attribute;
  }
  protected _attributeHandlers = {
    [Attribute.STATE]: (value) => (this.state = value),
  };

  /**
   * Component State
   */
  private _state = State.DEFAULT;
  public get state() {
    return this._state;
  }
  public set state(value) {
    this._state = value;
  }

  /**
   * Component Life-Cycle Hooks
   */
  protected _cache = jasmine.createSpy(Hook.CACHE);
  protected _initialize = jasmine.createSpy(Hook.INITIALIZE);
  protected _addEventListeners = jasmine.createSpy(Hook.ADD_EVENT_LISTENERS);
  protected _removeEventListeners = jasmine.createSpy(
    Hook.REMOVE_EVENT_LISTENERS
  );
}

/**
 * Component Existence
 */
given("Component imported", () => {
  then("Component is defined", () => {
    expect(Component).toBeDefined();
  });
});

/**
 * Static Properties Existence
 */
given("Component is defined", () => {
  then("Component.Template is defined", () => {
    expect(Component.Template).toBeDefined();
  });
  then("Component.Attributes is defined", () => {
    expect(Component.Attributes).toBeDefined();
  });
  then("Component.observedAttributes is defined", () => {
    expect(Component.observedAttributes).toBeDefined();
  });
});

/**
 * Static Properties Behavior
 */
given("Component is defined", () => {
  when("accessing Component.Attributes", () => {
    then("an empty array is returned", () => {
      expect(Component.Attributes).toEqual([]);
    });
  });
  when("accessing Component.observedAttributes", () => {
    then("an empty array is returned", () => {
      expect(Component.observedAttributes).toEqual([]);
    });
  });
});

/**
 * Instance Properties Existence
 */
given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    when("a new Component instance is added to DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag);
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      then("component.root is undefined", () => {
        expect(component.root).toBeUndefined();
      });
      then("component.configuration is undefined", () => {
        expect(component.configuration).toBeUndefined();
      });
    });
  });
});

/**
 * Instance Method Existence
 */
given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    when("a new Component instance is added to DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag);
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      then("component.connectedCallback method is defined", () => {
        expect(component.connectedCallback).toBeInstanceOf(Function);
      });
      then("component.disconnectedCallback method is defined", () => {
        expect(component.disconnectedCallback).toBeInstanceOf(Function);
      });
      then("component.attributeChangedCallback method is defined", () => {
        expect(component.attributeChangedCallback).toBeInstanceOf(Function);
      });
    });
  });
});

/**
 * Component Events
 */
given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    and("a new Component instance is created", () => {
      let component: Test;
      beforeEach(() => {
        component = new Test();
      });
      and("a listener for each event is registered", () => {
        let connected: jasmine.Spy;
        let disconnected: jasmine.Spy;
        beforeEach(async () => {
          connected = jasmine.createSpy(Event.CONNECTED);
          disconnected = jasmine.createSpy(Event.DISCONNECTED);
          component.addEventListener(Event.CONNECTED, connected);
          component.addEventListener(Event.DISCONNECTED, disconnected);
        });
        when("the component appended to the DOM", () => {
          beforeEach(() => {
            append(component);
          });
          afterEach(() => {
            component.remove();
          });
          then("the connected listeners is invoked", () => {
            requestAnimationFrame(() => {
              expect(connected).toHaveBeenCalled();
            });
          });
          when("the component is removed from the DOM", () => {
            beforeEach(() => {
              component.remove();
            });
            then("the disconnected listeners is invoked", () => {
              requestAnimationFrame(() => {
                expect(disconnected).toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });
});

/**
 * Component Life-Cycle Hooks
 */
given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    and("a new component instance is added to the DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      and("the component is defined in custom element registry", () => {
        beforeEach(async () => {
          await whenDefined(Test.Tag);
        });
        then("component._initialize method was invoked", () => {
          expect(component[Hook.INITIALIZE]).toHaveBeenCalled();
        });
        then("component._cache method was invoked", () => {
          expect(component[Hook.CACHE]).toHaveBeenCalled();
        });
        then("component._addEventListeners method invoked", () => {
          expect(component[Hook.ADD_EVENT_LISTENERS]).toHaveBeenCalled();
        });
        when("component is removed from the DOM", () => {
          beforeEach(() => {
            component.remove();
          });
          then("component._removeEventListeners method was invoked", () => {
            expect(component[Hook.REMOVE_EVENT_LISTENERS]).toHaveBeenCalled();
          });
        });
      });
    });
  });
});

/**
 * Component Attributes
 */
given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    and("a new component instance is added to the DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      and("the component is defined in custom element registry", () => {
        beforeEach(async () => {
          await whenDefined(Test.Tag);
        });
        then("component.state is State.DEFAULT", () => {
          expect(component.state).toBe(State.DEFAULT);
        });
        when("the component state attribute is set to State.UPDATE", () => {
          beforeEach(() => {
            component.setAttribute(Attribute.STATE, State.UPDATE);
          });
          then("component.state is State.UPDATE", () => {
            expect(component.state).toBe(State.UPDATE);
          });
        });
      });
    });
  });
});

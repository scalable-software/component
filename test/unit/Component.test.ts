import * as help from "./helper.js";

import { Component } from "../../src/Component.js";

/**
 * Test Component
 */
const Attribute = {
  STATE: "state",
};
const State = {
  DEFAULT: "default",
  UPDATE: "update",
};

const Event = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
};

const Hook = {
  INITIALIZE: "_initialize",
  CACHE_ELEMENTS: "_cacheElements",
  ADD_EVENT_LISTENERS: "_addEventListeners",
  REMOVE_EVENT_LISTENERS: "_removeEventListeners",
};

/**
 * Test Component with Attribute, State and Life-Cycle Hooks
 */
class Test extends Component {
  public static get Tag() {
    return "test-component";
  }

  /**
   * Component Attributes
   */
  public static get Attributes(): typeof Attribute {
    return Attribute;
  }
  protected _attributeHandlers = {
    [Attribute.STATE]: (value: string) => (this.state = value),
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
  protected _initialize = jasmine.createSpy(Hook.INITIALIZE);
  protected _cacheElements = jasmine.createSpy(Hook.CACHE_ELEMENTS);
  protected _addEventListeners = jasmine.createSpy(Hook.ADD_EVENT_LISTENERS);
  protected _removeEventListeners = jasmine.createSpy(
    Hook.REMOVE_EVENT_LISTENERS
  );
}

/**
 * Component Existence
 */
describe("Given Component imported", () => {
  it("then Component is defined", () => {
    expect(Component).toBeDefined();
  });
});

/**
 * Static Properties Existence
 */
describe("Given Component is defined", () => {
  it("then Component.Template is defined", () => {
    expect(Component.Template).toBeDefined();
  });
  it("then Component.Attributes is defined", () => {
    expect(Component.Attributes).toBeDefined();
  });
  it("then Component.observedAttributes is defined", () => {
    expect(Component.observedAttributes).toBeDefined();
  });
});

/**
 * Static Properties Behavior
 */
describe("Given Component is defined", () => {
  describe("when accessing Component.Attributes", () => {
    it("then an empty array is returned", () => {
      expect(Component.Attributes).toEqual([]);
    });
  });
  describe("when accessing Component.observedAttributes", () => {
    it("then an empty array is returned", () => {
      expect(Component.observedAttributes).toEqual([]);
    });
  });
});

/**
 * Instance Properties Existence
 */
describe("Given Component is defined", () => {
  describe("and the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      help.define(Test.Tag, Test);
    });
    describe("when a new Component instance is added to DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = help.add<Test>(Test.Tag);
        await help.whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      it("then component.root is undefined", () => {
        expect(component.root).toBeUndefined();
      });
      it("then component.template is undefined", () => {
        expect(component.template).toBeUndefined();
      });
      it("then component.css is undefined", () => {
        expect(component.css).toBeUndefined();
      });
    });
  });
});

/**
 * Instance Method Existence
 */
describe("Given Component is defined", () => {
  describe("and the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      help.define(Test.Tag, Test);
    });
    describe("when a new Component instance is added to DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = help.add<Test>(Test.Tag);
        await help.whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      it("then component.connectedCallback method is defined", () => {
        expect(component.connectedCallback).toBeInstanceOf(Function);
      });
      it("then component.disconnectedCallback method is defined", () => {
        expect(component.disconnectedCallback).toBeInstanceOf(Function);
      });
      it("then component.attributeChangedCallback method is defined", () => {
        expect(component.attributeChangedCallback).toBeInstanceOf(Function);
      });
    });
  });
});

/**
 * Component Events
 */
describe("Given Component is defined", () => {
  describe("and the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      help.define(Test.Tag, Test);
    });
    describe("and a new Component instance is created", () => {
      let component: Test;
      beforeEach(() => {
        component = new Test();
      });
      describe("and a listener for each event is registered", () => {
        let connected: jasmine.Spy;
        let disconnected: jasmine.Spy;
        beforeEach(async () => {
          connected = jasmine.createSpy(Event.CONNECTED);
          disconnected = jasmine.createSpy(Event.DISCONNECTED);
          component.addEventListener(Event.CONNECTED, connected);
          component.addEventListener(Event.DISCONNECTED, disconnected);
        });
        describe("when the component appended to the DOM", () => {
          beforeEach(() => {
            help.append(component);
          });
          afterEach(() => {
            component.remove();
          });
          it("then the connected listeners is invoked", () => {
            requestAnimationFrame(() => {
              expect(connected).toHaveBeenCalled();
            });
          });
          describe("when the component is removed from the DOM", () => {
            beforeEach(() => {
              component.remove();
            });
            it("then the disconnected listeners is invoked", () => {
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
describe("Given Component is defined", () => {
  describe("and the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      help.define(Test.Tag, Test);
    });
    describe("and a new component instance is added to the DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = help.add<Test>(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      describe("and the component is defined in custom element registry", () => {
        beforeEach(async () => {
          await help.whenDefined(Test.Tag);
        });
        it("then component._initialize method was invoked", () => {
          expect(component[Hook.INITIALIZE]).toHaveBeenCalled();
        });
        it("then component._cacheElements method was invoked", () => {
          expect(component[Hook.CACHE_ELEMENTS]).toHaveBeenCalled();
        });
        it("then then component._addEventListeners method invoked", () => {
          expect(component[Hook.ADD_EVENT_LISTENERS]).toHaveBeenCalled();
        });
        describe("when the component is removed from the DOM", () => {
          beforeEach(() => {
            component.remove();
          });
          it("then then component._removeEventListeners method was invoked", () => {
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
describe("Given Component is defined", () => {
  describe("and the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      help.define(Test.Tag, Test);
    });
    describe("and a new component instance is added to the DOM", () => {
      let component: Test;
      beforeEach(async () => {
        component = help.add<Test>(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      describe("and the component is defined in custom element registry", () => {
        beforeEach(async () => {
          await help.whenDefined(Test.Tag);
        });
        it("then component.state is State.DEFAULT", () => {
          expect(component.state).toBe(State.DEFAULT);
        });
        describe("when the component state attribute is set to State.UPDATE", () => {
          beforeEach(() => {
            component.setAttribute(Attribute.STATE, State.UPDATE);
          });
          it("then component.state is State.UPDATE", () => {
            expect(component.state).toBe(State.UPDATE);
          });
        });
      });
    });
  });
});

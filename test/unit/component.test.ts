import { Component, Template, Event } from "@scalable.software/component";

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
  DISPOSE: "_dispose",
} as const;

const Events = {
  ON_SAVE: "onsave",
  ON_CLOSE: "onclose",
} as const;

/** Test-only: an attribute that is reflected but not observed */
const Reflected = {
  MODE: "mode",
} as const;

const Mode = {
  ON: "on",
  OFF: "off",
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
    [Attribute.STATE]: (value: any) => (this.state = value),
  };

  /**
   * Component State
   */
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

  /** Test-only: makes an attribute show a state through _reflect */
  public reflect = (name: string, state: string, initial?: string) =>
    this._reflect(name, state, initial);

  /**
   * Component Life-Cycle Hooks
   */
  protected _cache = jasmine.createSpy(Hook.CACHE);
  protected _initialize = jasmine.createSpy(Hook.INITIALIZE);
  protected _addEventListeners = jasmine.createSpy(Hook.ADD_EVENT_LISTENERS);
  protected _removeEventListeners = jasmine.createSpy(
    Hook.REMOVE_EVENT_LISTENERS,
  );
  protected _dispose = jasmine.createSpy(Hook.DISPOSE);

  /**
   * Component Events
   */
  public set onsave(handler: EventListener) {
    this.addEventListener(Events.ON_SAVE, handler);
  }

  /** Test-only: true once the code after the last save's dispatch has run */
  public saved = false;

  /** Test-only: sends an event through _dispatch */
  public save = (detail?: unknown) => {
    this.saved = false;
    const result = this._dispatch(Events.ON_SAVE, detail);
    this.saved = true;
    return result;
  };

  /** Test-only: sends an event through _dispatchEvent */
  public send = (event: string, eventInitDict?: CustomEventInit<unknown>) =>
    this._dispatchEvent(event, eventInitDict);
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

given("Component is defined", () => {
  and("the Component is defined in the custom element registry", () => {
    beforeEach(() => {
      define(Test.Tag, Test);
    });
    when("a new Component instance is added to DOM with no id", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag);
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      when("await Test.get() static method invoked", () => {
        let reference: Test | null;
        beforeEach(async () => {
          reference = await Test.get();
        });
        then("returned reference equal component", () => {
          expect(reference).toEqual(component);
        });
      });
      when("await Test.all() static method invoked", () => {
        let reference: Test[];
        beforeEach(async () => {
          reference = await Test.all();
        });
        then("first returned reference equal component", () => {
          expect(reference[0]).toEqual(component);
        });
      });
    });
    when("a new Component instance is added to DOM with id", () => {
      let component: Test;
      beforeEach(async () => {
        component = add<Test>(Test.Tag, { id: "header" });
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      when("await Test.get({ id: 'header'}) static method invoked", () => {
        let reference: Test | null;
        beforeEach(async () => {
          reference = await Test.get({ id: "header" });
        });
        then("returned reference euqal component", () => {
          expect(reference).toEqual(component);
        });
      });
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
      then("component.root is null", () => {
        expect(component.root).toBeNull();
      });
      then("component.configuration is null", () => {
        expect(component.configuration).toBeNull();
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
          then("component._dispose method was invoked", () => {
            expect(component[Hook.DISPOSE]).toHaveBeenCalled();
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

/**
 * Component General Event Handler
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
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });

      then("component.onevent is null", () => {
        expect(component.onevent).toBeNull();
      });

      and("component.onevent is set", () => {
        let handler: jasmine.Spy;
        beforeEach(() => {
          handler = jasmine.createSpy("onevent");
          component.onevent = handler;
        });

        then("reading component.onevent returns the same handler", () => {
          expect(component.onevent).toBe(handler);
        });

        when("the component dispatches onsave with a detail", () => {
          const detail = { node: { id: "1" } };
          let listened: globalThis.Event | undefined;
          beforeEach(() => {
            component.addEventListener(
              Events.ON_SAVE,
              (event) => (listened = event),
            );
            component.save(detail);
          });
          then("onevent is called once with the dispatched event", () => {
            expect(handler).toHaveBeenCalledOnceWith(listened);
          });
          then("the event's type is onsave and its detail is the detail", () => {
            const [event] = handler.calls.mostRecent().args;
            expect(event.type).toBe(Events.ON_SAVE);
            expect(event.detail).toBe(detail);
          });
        });

        when("the component dispatches through _dispatch and _dispatchEvent", () => {
          beforeEach(() => {
            component.save();
            component.send(Events.ON_CLOSE);
          });
          then("onevent is called for each, in that order", () => {
            const types = handler.calls.allArgs().map(([event]) => event.type);
            expect(types).toEqual([Events.ON_SAVE, Events.ON_CLOSE]);
          });
        });

        when("onevent is set to another handler", () => {
          let other: jasmine.Spy;
          beforeEach(() => {
            other = jasmine.createSpy("other");
            component.onevent = other;
            component.save();
          });
          then("only the other handler is called", () => {
            expect(handler).not.toHaveBeenCalled();
            expect(other).toHaveBeenCalledTimes(1);
          });
        });

        when("onevent is set to null", () => {
          beforeEach(() => {
            component.onevent = null;
          });
          then("reading component.onevent returns null", () => {
            expect(component.onevent).toBeNull();
          });
          then("dispatching onsave calls no handler and nothing fails", () => {
            expect(() => component.save()).not.toThrow();
            expect(handler).not.toHaveBeenCalled();
            expect(component.saved).toBeTrue();
          });
        });
      });

      and("an onsave handler, an onsave listener and onevent are set", () => {
        let calls: string[];
        beforeEach(() => {
          calls = [];
          component.onsave = () => calls.push("onsave");
          component.addEventListener(Events.ON_SAVE, () =>
            calls.push("listener"),
          );
          component.onevent = () => calls.push("onevent");
        });
        when("the component dispatches onsave", () => {
          beforeEach(() => {
            component.save();
          });
          then("the onsave handler and the listener run before onevent", () => {
            expect(calls).toEqual(["onsave", "listener", "onevent"]);
          });
        });
      });

      and("component.onevent throws", () => {
        const error = new Error("onevent failed");
        let reportError: jasmine.Spy;
        beforeEach(() => {
          reportError = spyOn(window, "reportError");
          component.onevent = () => {
            throw error;
          };
        });
        when("the component dispatches onsave", () => {
          beforeEach(() => {
            component.save();
          });
          then("the error is reported", () => {
            expect(reportError).toHaveBeenCalledOnceWith(error);
          });
          then("the component's code after the dispatch still runs", () => {
            expect(component.saved).toBeTrue();
          });
        });
      });

      and("a listener cancels a cancelable onsave", () => {
        beforeEach(() => {
          component.onevent = jasmine.createSpy("onevent");
          component.addEventListener(Events.ON_SAVE, (event) =>
            event.preventDefault(),
          );
        });
        when("the component dispatches that event", () => {
          let result: boolean;
          beforeEach(() => {
            result = component.send(Events.ON_SAVE, { cancelable: true });
          });
          then("_dispatchEvent returns false, as dispatchEvent does", () => {
            expect(result).toBeFalse();
          });
        });
      });
    });
  });
});

/**
 * Component Attribute Reflection
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
        await whenDefined(Test.Tag);
      });
      afterEach(() => {
        component.remove();
      });

      and("a compulsory attribute", () => {
        when("the attribute is absent and a state is reflected", () => {
          beforeEach(() => {
            component.reflect(Reflected.MODE, Mode.ON);
          });
          then("the attribute's value is that state", () => {
            expect(component.getAttribute(Reflected.MODE)).toBe(Mode.ON);
          });
        });
        and("the attribute holds another value", () => {
          beforeEach(() => {
            component.setAttribute(Reflected.MODE, Mode.OFF);
          });
          when("a state is reflected", () => {
            beforeEach(() => {
              component.reflect(Reflected.MODE, Mode.ON);
            });
            then("the attribute's value is that state", () => {
              expect(component.getAttribute(Reflected.MODE)).toBe(Mode.ON);
            });
          });
        });
        and("the attribute already holds the state", () => {
          let setAttribute: jasmine.Spy;
          let removeAttribute: jasmine.Spy;
          beforeEach(() => {
            component.setAttribute(Reflected.MODE, Mode.ON);
            setAttribute = spyOn(component, "setAttribute").and.callThrough();
            removeAttribute = spyOn(component, "removeAttribute").and.callThrough();
          });
          when("the same state is reflected", () => {
            beforeEach(() => {
              component.reflect(Reflected.MODE, Mode.ON);
            });
            then("the attribute is not written", () => {
              expect(setAttribute).not.toHaveBeenCalled();
              expect(removeAttribute).not.toHaveBeenCalled();
              expect(component.getAttribute(Reflected.MODE)).toBe(Mode.ON);
            });
          });
        });
      });

      and("an optional attribute whose initial value is off", () => {
        when("the attribute is absent and a state other than off is reflected", () => {
          beforeEach(() => {
            component.reflect(Reflected.MODE, Mode.ON, Mode.OFF);
          });
          then("the attribute's value is that state", () => {
            expect(component.getAttribute(Reflected.MODE)).toBe(Mode.ON);
          });
        });
        when("the attribute is absent and off is reflected", () => {
          then("the attribute stays absent, and nothing fails", () => {
            expect(() =>
              component.reflect(Reflected.MODE, Mode.OFF, Mode.OFF),
            ).not.toThrow();
            expect(component.hasAttribute(Reflected.MODE)).toBeFalse();
          });
        });
        and("the attribute holds on", () => {
          beforeEach(() => {
            component.setAttribute(Reflected.MODE, Mode.ON);
          });
          when("off is reflected", () => {
            beforeEach(() => {
              component.reflect(Reflected.MODE, Mode.OFF, Mode.OFF);
            });
            then("the attribute is removed", () => {
              expect(component.hasAttribute(Reflected.MODE)).toBeFalse();
            });
          });
          when("on is reflected again", () => {
            let setAttribute: jasmine.Spy;
            beforeEach(() => {
              setAttribute = spyOn(component, "setAttribute").and.callThrough();
              component.reflect(Reflected.MODE, Mode.ON, Mode.OFF);
            });
            then("the attribute is not written", () => {
              expect(setAttribute).not.toHaveBeenCalled();
              expect(component.getAttribute(Reflected.MODE)).toBe(Mode.ON);
            });
          });
        });
      });

      and("a state setter that reflects an optional attribute", () => {
        when("component.state is set to State.UPDATE", () => {
          beforeEach(() => {
            component.state = State.UPDATE;
          });
          then("the state attribute is State.UPDATE", () => {
            expect(component.getAttribute(Attribute.STATE)).toBe(State.UPDATE);
          });
          when("component.state is set back to State.DEFAULT", () => {
            beforeEach(() => {
              component.state = State.DEFAULT;
            });
            then("the state attribute is removed", () => {
              expect(component.hasAttribute(Attribute.STATE)).toBeFalse();
            });
          });
        });
      });
    });
  });
});

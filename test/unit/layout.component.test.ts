import { Component, Configuration, Template } from "../../src/index.js";

const configuration: Configuration = {
  url: import.meta.url,
  template: {
    id: "template",
  },
};

class TestLayout extends Component {
  public static get Tag() {
    return "test-layout";
  }

  /**
   * `Template.load(filename)` is used to load an HTML template packaged with the component.
   * @category Template
   * @hidden
   */
  public static Template = new Template(import.meta.url);

  constructor() {
    super(configuration);
  }
}

given("Component is defined in component registry", () => {
  beforeEach(() => {
    define(TestLayout.Tag, TestLayout);
  });
  then("custom element registry contain Component", () => {
    expect(customElements.get(TestLayout.Tag)).toBeDefined();
  });
  and("an HTML Template added to DOM", () => {
    beforeEach(async () => {
      await TestLayout.Template.load("./templates/test.template.html");
    });
    afterEach(() => {
      remove("template");
    });
    it("then the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
  });
});

given("Component is defined in component registry", () => {
  beforeEach(() => {
    define(TestLayout.Tag, TestLayout);
  });
  and("an HTML Template added to DOM", () => {
    let template;
    beforeEach(async () => {
      template = await TestLayout.Template.load(
        "./templates/test.template.html"
      );
    });
    afterEach(() => {
      remove("template");
    });
    then("the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
    when("a new Component is added to DOM", () => {
      let component: TestLayout;
      beforeEach(async () => {
        component = add<TestLayout>(TestLayout.Tag);
        await whenDefined(TestLayout.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      then("component.configuration is defined", () => {
        expect(component.configuration).toBeDefined();
      });
      and("component.configuration is defined", () => {
        then("component.configuration.template is defined", () => {
          expect(component.configuration.template).toBeDefined();
        });
        then("component.configuration.template.id is defined", () => {
          expect(component.configuration.template.id).toBeDefined();
        });
        then("component.configuration.css is undefined", () => {
          expect(component.configuration.css).toBeUndefined();
        });
      });
      then("component.root is defined", () => {
        expect(component.root).toBeDefined();
      });
      and("component.root is defined", () => {
        then("component.root is a clone of the template in DOM", () => {
          expect(component.root.innerHTML).toEqual(template.innerHTML);
        });
      });
    });
  });
});

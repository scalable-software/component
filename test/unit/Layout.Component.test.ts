import * as help from "./helper.js";

import { Component, Configuration, Template } from "../../src/Index.js";

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

describe("Given Component is defined in component registry", () => {
  beforeEach(() => {
    help.define(TestLayout.Tag, TestLayout);
  });
  it("then custom element registry contain Component", () => {
    expect(customElements.get(TestLayout.Tag)).toBeDefined();
  });
  describe("and an HTML Template added to DOM", () => {
    beforeEach(async () => {
      await TestLayout.Template.load("./templates/Test.template.html");
    });
    afterEach(() => {
      help.remove("template");
    });
    it("then the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
  });
});

describe("Given Component is defined in component registry", () => {
  beforeEach(() => {
    help.define(TestLayout.Tag, TestLayout);
  });
  describe("and an HTML Template added to DOM", () => {
    let template;
    beforeEach(async () => {
      template = await TestLayout.Template.load(
        "./templates/Test.template.html"
      );
    });
    afterEach(() => {
      help.remove("template");
    });
    it("then the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
    describe("when a new Component is added to DOM", () => {
      let component: TestLayout;
      beforeEach(async () => {
        component = help.add<TestLayout>(TestLayout.Tag);
        await help.whenDefined(TestLayout.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      it("then component.configuration is defined", () => {
        expect(component.configuration).toBeDefined();
      });
      describe("and component.configuration is defined", () => {
        it("then component.configuration.template is defined", () => {
          expect(component.configuration.template).toBeDefined();
        });
        it("then component.configuration.template.id is defined", () => {
          expect(component.configuration.template.id).toBeDefined();
        });
        it("then component.configuration.css is undefined", () => {
          expect(component.configuration.css).toBeUndefined();
        });
      });
      it("then component.root is defined", () => {
        expect(component.root).toBeDefined();
      });
      describe("and component.root is defined", () => {
        it("then component.root is a clone of the template in DOM", () => {
          expect(component.root.innerHTML).toEqual(template.innerHTML);
        });
      });
    });
  });
});

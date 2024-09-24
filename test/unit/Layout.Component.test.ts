import * as help from "./helper.js";

import { Component } from "../../src/Component.js";

class TestLayout extends Component {
  public static get Tag() {
    return "test-layout";
  }

  public get template() {
    return "template";
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
      await TestLayout.Template.load(
        "../test/unit/templates/Test.template.html"
      );
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
        "../test/unit/templates/Test.template.html"
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
      it("then component.root is defined", () => {
        expect(component.root).toBeDefined();
      });
      it("then component.template is defined", () => {
        expect(component.template).toBeDefined();
      });
      it("then component.root is a clone of the template in DOM", () => {
        expect(component.root.innerHTML).toEqual(template.innerHTML);
      });
      it("then component.css is undefined", () => {
        expect(component.css).toBeUndefined();
      });
    });
  });
});

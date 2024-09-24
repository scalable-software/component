import * as help from "./helper.js";

import { Component } from "../../src/Component.js";

class TestStyled extends Component {
  public static get Tag() {
    return "test-style";
  }

  public get template() {
    return "template";
  }

  public get css() {
    return "../test/unit/style/Test.style.css";
  }
}

describe("Given Component is defined in component registry", () => {
  beforeEach(() => {
    help.define(TestStyled.Tag, TestStyled);
  });
  it("then the custom element registry contain Component", () => {
    expect(customElements.get(TestStyled.Tag)).toBeDefined();
  });
  describe("and an HTML Template added to DOM", () => {
    beforeEach(async () => {
      await TestStyled.Template.load(
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
    help.define(TestStyled.Tag, TestStyled);
  });
  describe("an HTML Template added to DOM", () => {
    beforeEach(async () => {
      await TestStyled.Template.load(
        "../test/unit/templates/Test.template.html"
      );
    });
    afterEach(() => {
      help.remove("template");
    });
    it("then the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
    describe("and a new Component is added to DOM", () => {
      let component: TestStyled;
      beforeEach(async () => {
        component = help.add<TestStyled>(TestStyled.Tag);
        await help.whenDefined(TestStyled.Tag);
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
      it("then component.css is defined", () => {
        expect(component.css).toBeDefined();
      });
      it("then component.root contain stylesheet", () => {
        expect(component.root.innerHTML).toContain("stylesheet");
      });
    });
  });
});

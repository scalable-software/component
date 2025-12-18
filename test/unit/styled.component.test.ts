import {
  Component,
  Configuration,
  Template,
} from "@scalable.software/component";

const configuration: Configuration = {
  url: import.meta.url,
  template: {
    id: "template",
  },
  css: {
    name: "./style/test.style.css",
  },
};

class TestStyled extends Component {
  public static get Tag() {
    return "test-style";
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
    define(TestStyled.Tag, TestStyled);
  });
  then("the custom element registry contain Component", () => {
    expect(customElements.get(TestStyled.Tag)).toBeDefined();
  });
  and("an HTML Template added to DOM", () => {
    beforeEach(async () => {
      await TestStyled.Template.load("./templates/test.template.html");
    });
    afterEach(() => {
      remove("template");
    });
    then("the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
  });
});

given("Component is defined in component registry", () => {
  beforeEach(() => {
    define(TestStyled.Tag, TestStyled);
  });
  and("an HTML Template added to DOM", () => {
    let template;
    beforeEach(async () => {
      template = await TestStyled.Template.load(
        "./templates/test.template.html"
      );
    });
    afterEach(() => {
      remove("template");
    });
    then("the HTML Template exist in DOM", () => {
      expect(document.querySelector("template")).toBeDefined();
    });
    and("a new Component is added to DOM", () => {
      let component: TestStyled;
      beforeEach(async () => {
        component = add<TestStyled>(TestStyled.Tag);
        await whenDefined(TestStyled.Tag);
      });
      afterEach(() => {
        component.remove();
      });
      then("component.configuration is defined", () => {
        expect(component.configuration).toBeDefined();
        const test = new URL(
          component.configuration?.css?.name,
          component.configuration.url
        ).href;
      });
      and("component.configuration is defined", () => {
        then("component.configuration.template is defined", () => {
          expect(component.configuration.template).toBeDefined();
        });
        then("component.configuration.template.id is defined", () => {
          expect(component.configuration.template.id).toBeDefined();
        });
        then("component.configuration.css is defined", () => {
          expect(component.configuration.css).toBeDefined();
        });
        then("component.configuration.css.name is defined", () => {
          expect(component.configuration.css.name).toBeDefined();
        });
      });
      then("component.root is defined", () => {
        expect(component.root).toBeDefined();
      });
      and("component.root is defined", () => {
        then("component.root is a clone of the template in DOM", () => {
          expect(component.root.innerHTML).toContain(template.innerHTML);
        });
        then("component.root contain stylesheet", () => {
          expect(component.root.innerHTML).toContain("stylesheet");
        });
      });
    });
  });
});

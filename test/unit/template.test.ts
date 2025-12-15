import { Template } from "../../src/template.js";

given("Template imported", () => {
  then("Template is defined", () => {
    expect(Template).toBeDefined();
  });
});

/**
 * Instance Methods Existence
 */
given("Template is defined", () => {
  and("new instance is created", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template();
    });
    then("Template.load is defined", () => {
      expect(template.load).toBeDefined();
    });
  });
});

/**
 * Instance Methods Behavior
 */
given("Template is defined", () => {
  and("new instance is created without url parameter", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template();
    });
    when(
      "template.load() is invoked with valid filename and valid HTML Template",
      () => {
        let filename: string;
        beforeEach(async () => {
          filename = "./test/unit/templates/test.template.html";
          await template.load(filename);
        });
        afterEach(() => {
          document.body.innerHTML = "";
        });
        then("the document.body contain a template", async () => {
          expect(document.body.querySelector("template")).toBeDefined();
        });
      }
    );
    when("template.load() is invoked with invalid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/unit/templates/invalid.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      then("an error: 'Error extracting template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error extracting template"
        );
      });
    });
    when("template.load() is invoked with invalid filename", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/template/invalid.html";
      });
      then("an error: 'Error fetching template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error fetching template"
        );
      });
    });
  });
  and("new instance is created with `import.meta.url` parameter", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template(import.meta.url);
    });
    when(
      "template.load() is invoked with valid filename and valid HTML Template",
      () => {
        let filename: string;
        beforeEach(async () => {
          filename = "./templates/test.template.html";
          await template.load(filename);
        });
        afterEach(() => {
          document.body.innerHTML = "";
        });
        then("the document.body contain a template", async () => {
          expect(document.body.querySelector("template")).toBeDefined();
        });
      }
    );
    when("template.load() is invoked with invalid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./templates/invalid.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      then("an error: 'Error extracting template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error extracting template"
        );
      });
    });
    when("template.load() is invoked with invalid filename", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/template/invalid.html";
      });
      then("an error: 'Error fetching template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error fetching template"
        );
      });
    });
  });
});

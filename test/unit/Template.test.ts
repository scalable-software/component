import { Template } from "@scalable.software/component";

describe("Given Template imported", () => {
  it("then Template is defined", () => {
    expect(Template).toBeDefined();
  });
});

/**
 * Instance Methods Existence
 */
describe("Given Template is defined", () => {
  describe("and new instance is created", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template();
    });
    it("then Template.load is defined", () => {
      expect(template.load).toBeDefined();
    });
  });
});

/**
 * Instance Methods Behavior
 */
describe("Given Template is defined", () => {
  describe("and new instance is created without url parameter", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template();
    });
    describe("when template.load() is invoked with valid filename and valid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/unit/templates/Test.template.html";
        await template.load(filename);
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then the document.body contain a template", async () => {
        expect(document.body.querySelector("template")).toBeDefined();
      });
    });
    describe("when template.load() is invoked with invalid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/unit/templates/Invalid.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then an error: 'Error extracting template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error extracting template"
        );
      });
    });
    describe("when template.load() is invoked with invalid filename", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/template/Invalid.html";
      });
      it("then an error: 'Error fetching template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error fetching template"
        );
      });
    });
  });
  describe("and new instance is created with `import.meta.url` parameter", () => {
    let template: Template;
    beforeEach(() => {
      template = new Template(import.meta.url);
    });
    describe("when template.load() is invoked with valid filename and valid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./templates/Test.template.html";
        await template.load(filename);
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then the document.body contain a template", async () => {
        expect(document.body.querySelector("template")).toBeDefined();
      });
    });
    describe("when template.load() is invoked with invalid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./templates/Invalid.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then an error: 'Error extracting template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error extracting template"
        );
      });
    });
    describe("when template.load() is invoked with invalid filename", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "./test/template/Invalid.html";
      });
      it("then an error: 'Error fetching template' is thrown", async () => {
        await expectAsync(template.load(filename)).toBeRejectedWithError(
          Error,
          "Error fetching template"
        );
      });
    });
  });
});

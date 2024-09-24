import { Template } from "@scalable.software/component";

describe("Given Template imported", () => {
  it("then Template is defined", () => {
    expect(Template).toBeDefined();
  });
});

/**
 * Static Methods Existence
 */
describe("Given Template is defined", () => {
  it("then Template.load is defined", () => {
    expect(Template.load).toBeDefined();
  });
});

/**
 * Static Methods Behavior
 */
describe("Given Template is defined", () => {
  describe("when invoking Template.load(filename)", () => {
    describe("and the filename points to valid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "../test/unit/templates/Test.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then the document.body contain a template", async () => {
        await Template.load(filename);
        expect(document.body.querySelector("template")).toBeDefined();
      });
    });
    describe("and the filename points to invalid HTML Template", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "../test/unit/templates/Invalid.template.html";
      });
      afterEach(() => {
        document.body.innerHTML = "";
      });
      it("then an error: 'Error extracting template' is thrown", async () => {
        await expectAsync(Template.load(filename)).toBeRejectedWithError(
          Error,
          "Error extracting template"
        );
      });
    });
    describe("and the filename points to invalid filename", () => {
      let filename: string;
      beforeEach(async () => {
        filename = "../test/unit/Invalid.html";
      });
      it("then an error: 'Error fetching template' is thrown", async () => {
        await expectAsync(Template.load(filename)).toBeRejectedWithError(
          Error,
          "Error fetching template"
        );
      });
    });
  });
});

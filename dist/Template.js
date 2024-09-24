/**
 * @module Core
 */
export class Template {
    /**
     * Loads the HTML template from a file, extracts the template element, and appends it to the document body.
     */
    static load = async (filename) => await Template.fetch(filename)
        .then(Template.extract)
        .then(Template.append)
        .catch(Template.throwLoadingError);
    /**
     * Fetches the HTML content from the provided file URL.
     * @param {string} filename - The filename or URL of the HTML file to fetch.
     * @returns {Promise<string>} - A promise that resolves to the HTML content as a string.
     * @throws Will throw an error if the fetch operation fails.
     */
    static fetch = (filename) => fetch(Template.url(filename)).then((response) => response.ok ? response.text() : Promise.reject(Template.fetchingError));
    /**
     * Extracts the <template> element from an HTML string.
     * @param {string} html - The HTML content as a string.
     * @returns {Promise<HTMLTemplateElement>} - A promise that resolves to the extracted HTMLTemplateElement.
     * @throws Will throw an error if no <template> element is found in the HTML string.
     */
    static extract = (html) => new Promise((resolve, reject) => {
        const template = Template.parse(html);
        template ? resolve(template) : reject(Template.extractionError);
    });
    /**
     * Parses the provided HTML string and returns the <template> element.
     * @param {string} html - The HTML content as a string.
     * @returns {HTMLTemplateElement | null} - The <template> element or null if not found.
     **/
    static parse = (html) => new DOMParser()
        .parseFromString(html, "text/html")
        .querySelector("template");
    /**
     * Appends the provided template element to the document body.
     * @param {HTMLTemplateElement} template - The HTMLTemplateElement to append to the document body.
     * @returns {HTMLTemplateElement} - The appended HTMLTemplateElement.
     */
    static append = (template) => document.body.appendChild(template);
    /**
     * Constructs the full URL of the provided filename.
     * @param {string} filename - The filename or URL fragment to resolve.
     * @returns {string} - The fully resolved URL.
     */
    static url = (filename) => new URL(filename, import.meta.url).href;
    /**
     * Logs and throws an error when fetching the template fails.
     * @param {Error} error - The error object representing the fetch failure.
     * @throws Always throws the provided error after logging it to the console.
     */
    static fetchingError = new Error("Error fetching template");
    /**
     * Logs and throws an error when extracting the template fails.
     * @throws Always throws an error after logging it to the console when no template is found.
     */
    static extractionError = new Error("Error extracting template");
    /**
     * Logs and throws an error when loading the template fails.
     * @param {Error} error - The error object representing the load failure.
     * @throws Always throws the provided error after logging it to the console.
     */
    static throwLoadingError = (error) => {
        console.error(error.message);
        throw error;
    };
}

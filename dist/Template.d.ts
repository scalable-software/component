/**
 * @module Core
 */
export declare class Template {
    /**
     * Loads the HTML template from a file, extracts the template element, and appends it to the document body.
     */
    static load: (filename: string) => Promise<HTMLTemplateElement | void>;
    /**
     * Fetches the HTML content from the provided file URL.
     * @param {string} filename - The filename or URL of the HTML file to fetch.
     * @returns {Promise<string>} - A promise that resolves to the HTML content as a string.
     * @throws Will throw an error if the fetch operation fails.
     */
    private static fetch;
    /**
     * Extracts the <template> element from an HTML string.
     * @param {string} html - The HTML content as a string.
     * @returns {Promise<HTMLTemplateElement>} - A promise that resolves to the extracted HTMLTemplateElement.
     * @throws Will throw an error if no <template> element is found in the HTML string.
     */
    private static extract;
    /**
     * Parses the provided HTML string and returns the <template> element.
     * @param {string} html - The HTML content as a string.
     * @returns {HTMLTemplateElement | null} - The <template> element or null if not found.
     **/
    private static parse;
    /**
     * Appends the provided template element to the document body.
     * @param {HTMLTemplateElement} template - The HTMLTemplateElement to append to the document body.
     * @returns {HTMLTemplateElement} - The appended HTMLTemplateElement.
     */
    private static append;
    /**
     * Constructs the full URL of the provided filename.
     * @param {string} filename - The filename or URL fragment to resolve.
     * @returns {string} - The fully resolved URL.
     */
    private static url;
    /**
     * Logs and throws an error when fetching the template fails.
     * @param {Error} error - The error object representing the fetch failure.
     * @throws Always throws the provided error after logging it to the console.
     */
    private static fetchingError;
    /**
     * Logs and throws an error when extracting the template fails.
     * @throws Always throws an error after logging it to the console when no template is found.
     */
    private static extractionError;
    /**
     * Logs and throws an error when loading the template fails.
     * @param {Error} error - The error object representing the load failure.
     * @throws Always throws the provided error after logging it to the console.
     */
    private static throwLoadingError;
}

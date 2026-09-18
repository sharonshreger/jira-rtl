/**
 * Enum representing strategies for determining the text content for which to check for RTL characters
 * 
 * @readonly
 * @enum {(el: HTMLElement) => string | null}
 */
export const TextResolvingStrategy = {
	/**
	 * Text content is determined by the element "textContent" property - which includes hidden text nodes as well
	 * @param {HTMLElement} el
	 * @returns {string}
	 */
	TEXT_CONTENT: el => el.textContent,

	/**
	 * Text content is the element value
	 * @param {HTMLElement} el
	 * @returns {string}
	 */
	VALUE: el => el.value,

	/**
	 * Text content is calculated dynamically by iterating over all child elements with a TreeWalker.
	 * Excludes text inside certain elements (like "pre" or "code") based on a CSS selector.
	 *
	 * @param {HTMLElement} el - The root element to scan for text nodes.
	 * @param {Object} [options] - Optional settings.
	 * @param {string} [options.elementsToExclude="pre, code"] - A CSS selector of elements to ignore when concatenating text.
	 * @returns {string} Concatenated text of all included text nodes.
	 *
	 * @example
	 * // Default behavior, skips <pre> and <code>
	 * const text = TextResolvingStrategy.TREE_WALKER(el);
	 *
	 * @example
	 * // Custom excluded elements
	 * const text = TextResolvingStrategy.TREE_WALKER(el, { elementsToExclude: "pre, code, blockquote" });
	 */
	TREE_WALKER: (el, { elementsToExclude = "pre, code" } = {}) => {
		// Pre-calculate and store all excluded inner elements of the given root element, for performance
		const excludedElements = new Set(el.querySelectorAll(elementsToExclude));

		const walker = document.createTreeWalker(
			el,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: node => {
					let parent = node.parentElement;

					while (parent) {
						if (excludedElements.has(parent)) 
							return NodeFilter.FILTER_REJECT;

						// stop at root
						if (parent === el) break;

						parent = parent.parentElement;
					}

					return NodeFilter.FILTER_ACCEPT;
				}
			},
			false
		);


		// For performance - it's faster to build a string from an array of strings, than doing string concatenation
		const textChunks = [];
		let node = walker.nextNode();
		while (node) {
			textChunks.push(node.nodeValue || '');
			node = walker.nextNode();
		}

		return textChunks.join('');
	}
};
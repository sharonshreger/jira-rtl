/**
 * Enum representing strategies for determining the target on which RTL should be applied
 * 
 * @readonly
 * @enum {(el: HTMLElement) => HTMLElement | null}
 */
export const TargetResolvingStrategy = {
	/**
	 * Apply RTL directly to the matched element.
	 * @param {HTMLElement} el
	 * @returns {HTMLElement}
	 */
	SELF: el => el,

	/**
	 * Apply RTL to the parent of the matched element.
	 * @param {HTMLElement} el
	 * @returns {HTMLElement}
	 */
	PARENT: el => el.parentElement,
};
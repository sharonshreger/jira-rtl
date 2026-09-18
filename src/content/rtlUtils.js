import { RTL_REGEX } from "./rtlRegex";

/**
 * Check if the given text contains any RTL characters
 * @param {string} text 
 * @returns {boolean}
 */
function isRTL(text) {
	return RTL_REGEX.test(text);
}

const JIRA_RTL_APPLIED_ATTRIBUTE = 'data-jira-rtl-applied';
export const JIRA_RTL_APPLIED_SELECTOR = '[data-jira-rtl-applied="true"]';

/**
 * Apply RTL on the given element
 * @param {HTMLElement} el 
 */
function applyRTL(el) {
	el.setAttribute(JIRA_RTL_APPLIED_ATTRIBUTE, "true");
}

/**
 * Remove RTL from the given element
 * @param {HTMLElement} el 
 */
export function removeRTL(el) {
	el.removeAttribute(JIRA_RTL_APPLIED_ATTRIBUTE);
}

/**
 * Check if RTL was applied on the given element
 * @param {HTMLElement} el 
 * @returns {boolean}
 */
function rtlAppliedOn(el) {
	return el.getAttribute(JIRA_RTL_APPLIED_ATTRIBUTE) === "true";
}

/**
 * Set the desired text direction on the given element, based on a text that is attached to it.
 * @param {HTMLElement} el - the element to process
 * @param {string} text - the text to evaluate
 */
export function setDirection(el, text) {
	const rtlApplied = rtlAppliedOn(el);

	if (el && !rtlApplied && isRTL(text)) {
		applyRTL(el);
	}
	else if (el && rtlApplied && !isRTL(text)) {
		removeRTL(el)
	}
}
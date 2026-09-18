import { setDirection, removeRTL, JIRA_RTL_APPLIED_SELECTOR } from "./rtlUtils";
import { observerRules, combinedSelector } from './observerRules';
import { ElementType } from "./enums/ElementType.js";

let observer = null;
const activeInputListeners = new Map();

/**
 * Processes a single element against all observer rules.
 * If it matches a rule, the element is handled according to that rule.
 *
 * @param {HTMLElement} el - The DOM element to process.
 */
function processMatchingElement(el) {
	for (const observerRule of observerRules) {
		if (el.matches(observerRule.compiledSelector)) {
			processElement(el, observerRule);
			break;
		}
	}
}

/**
 * Handles a newly created DOM node by checking if it matches
 * or contains elements that match observer rules.
 *
 * @param {HTMLElement} node - The newly added DOM node.
 */
function processCreatedNode(node) {
	if (node.matches(combinedSelector)) {
		processMatchingElement(node);
		return;
	}

	node.querySelectorAll(combinedSelector).forEach(processMatchingElement);
}

/**
 * Handles a text mutation by walking up the DOM tree until it
 * finds a matching content-editable rule. Text mutation is any change inside
 * a text node.
 *
 * @param {Text} el - The text node that was changed.
 */
function processTextMutation(el) {
	if (!el) return;

	let parentEl = el.parentElement;

	while (parentEl) {
		if (parentEl.matches(combinedSelector)) {
			for (const observerRule of observerRules) {
				if (observerRule.elementType === ElementType.CONTENT_EDITABLE
					&&
					parentEl.matches(observerRule.compiledSelector)
				) {
					processElement(parentEl, observerRule);
					return;
				}
			}
		}

		parentEl = parentEl.parentElement;
	}
}

/**
 * Handles all mutation records observed by the MutationObserver.
 *
 * @param {MutationRecord[]} mutations - List of DOM mutations.
 */
function handleMutations(mutations) {
	for (const mutation of mutations) {
		//console.log(mutation);

		if (mutation.type === 'childList') {
			// Process newly added nodes
			mutation.addedNodes.forEach(node => {
				if (node instanceof HTMLElement) {
					processCreatedNode(node);
				}
				else if (node instanceof Text) {
					processTextMutation(node);
				}
			});
		}

		else if (mutation.type === 'characterData') {
			// Process updated text nodes
			processTextMutation(mutation.target);
		}
	}
}

/**
 * Processes an HTML element according to the specified observer rule.
 * For input elements, add an input event listener to detect changes in the element text.
 *
 * @param {HTMLElement} el - The element to process.
 * @param {import("./observerRules.js").ObserverRule} observerRule - The rule describing how to handle the element.
 */
function processElement(el, observerRule) {
	let text;
	let target;

	switch (observerRule.elementType) {
		case ElementType.TEXT:
		case ElementType.CONTENT_EDITABLE:
			target = observerRule.resolveTarget(el);
			text = observerRule.resolveText(el);
			setDirection(target, text);

			break;

		case ElementType.INPUT:

			if (activeInputListeners.has(el)) return; // Input listener already attached to the current element


			const inputHandler = (event) => {
				setDirection(
					observerRule.resolveTarget(event.target),
					observerRule.resolveText(event.target)
				);
			};

			el.addEventListener('input', inputHandler);
			activeInputListeners.set(el, inputHandler);

			target = observerRule.resolveTarget(el);
			text = observerRule.resolveText(el);
			setDirection(target, text);

			break;

		default:
			break;
	}
}

/**
 * Performs a one-time scan of the DOM to process
 * all existing matching elements.
 */
function runScan() {
	setTimeout(() => {
		document.querySelectorAll(combinedSelector).forEach(el => {
			for (const observerRule of observerRules) {
				if (el.matches(observerRule.compiledSelector)) {
					processElement(el, observerRule);
					break;
				}
			}
		});
	}, 0);
}

/**
 * Initializes the RTL observer. Starts listening to DOM mutations
 * and runs an initial scan for existing elements.
 */
function initialize() {
	if (observer) return; // already initialized

	observer = new MutationObserver((mutations) => {
		setTimeout(() => handleMutations(mutations), 0);
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	});

	runScan();
}

/**
 * Cleans up the observer by disconnecting it, removing
 * all event listeners, and clearing applied RTL styles.
 */
function cleanup() {
	if (observer) {
		observer.disconnect();
		observer = null;
	}

	// Detach input handlers
	for (const [el, handler] of activeInputListeners.entries()) {
		el.removeEventListener('input', handler);
	}
	activeInputListeners.clear();

	document.querySelectorAll(JIRA_RTL_APPLIED_SELECTOR).forEach(removeRTL);
}

/**
 * Public API for the RTL observer.
 */
export const rtlObserver = {
	initialize,
	cleanup,
	runScan,
};

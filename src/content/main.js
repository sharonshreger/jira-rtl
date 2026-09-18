import { loadSettings } from "../utils/settings";
import { rtlObserver } from "./rtlObserver"
import { UrlChangeObserver } from "./urlChangeObserver";
import "../styles/rtl.css"

/** @type {import("../utils/settings").ExtensionSettings | null} */
let currentSettings = null;

const urlChangeObserver = new UrlChangeObserver(onUrlChanged);

/**
 * Injects the extension stylesheet into the document head, 
 * to apply custom styles on elements with RTL applied.
 */
function injectRTLStylesheet() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = browser.runtime.getURL('assets/jira-rtl.css');
	document.head.appendChild(link);
}

/**
 * Runs a callback when the DOM is ready.
 * If the document is already loaded, the callback runs immediately.
 *
 * @param {() => void} callback - Function to run once DOM is ready.
 */
function runWhenReady(callback) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback);
	} else {
		// DOM already loaded, run immediately
		callback();
	}
}

/**
 * A map of setting keys to their change-handlers.
 * Each handler is called when its respective setting changes.
 *
 * @type {Record<string, (newValue: any, oldValue: any) => void>}
 */
const settingHandlers = {
	enabled: (newValue, oldValue) => {
		if (newValue === oldValue) return;

		if (newValue) {
			console.log("Jira_RTL enabled, starting a new scan");
			rtlObserver.initialize();
			urlChangeObserver.start();
		}
		else {
			console.log("Jira_RTL disabled, starting cleanup");
			urlChangeObserver.stop();
			rtlObserver.cleanup();
		}
	},
};

/**
 * Applies settings by running change-handlers
 * for any modified setting value, and update current settings.
 *
 * @param {import("../utils/settings").ExtensionSettings} settings - The new settings object.
 */
async function applySettings(settings) {
	for (const key of Object.keys(settings)) {
		if (settingHandlers[key]) {
			settingHandlers[key](settings[key], currentSettings[key]);
		}
	}

	currentSettings = structuredClone(settings);
}

/**
 * Initializes the extension:
 * - Injects stylesheet
 * - Loads settings
 * - Starts observer if the extension is enabled
 */
async function initialize() {
	injectRTLStylesheet();
	const settings = await loadSettings();

	currentSettings = structuredClone(settings);

	if (settings.enabled) {
		console.log("Jira_RTL - running initial scan");
		rtlObserver.initialize();
		urlChangeObserver.start();
	}
}

runWhenReady(initialize);

async function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function runPostScans(iterations) {
	let enabled = true;
	for (let i = 1; i <= iterations; i++) {
		await sleep(1000);

		// Load fresh settings each time
		const settings = await loadSettings();

		if (!settings.enabled) {
			enabled = false;
			break;
		}

		console.log(`Jira_RTL - running post-load scan ${i}/${iterations}`);
		rtlObserver.runScan();
	}

	if (enabled) {
		console.log("Jira_RTL - post-load scans finished");
	}
}

// Run 4 delayed scans after the page is fully loaded, in case the first initial scan missed something
window.addEventListener("load", async () => {
	await runPostScans(4);
});

async function onUrlChanged() {
	const settings = await loadSettings();
	if (!settings.enabled) return;

	console.log("Jira_RTL - URL change detected - running new scan");
	rtlObserver.runScan();

	await runPostScans(4);
}

/**
 * Listen for storage changes and re-apply settings
 * if the Jira-RTL sync storage key was updated.
 */
browser.storage.onChanged.addListener(async (changes, area) => {
	// Ensure the storage changes came from the Jira-RTL extension only
	if (area !== "sync") return;
	if (!changes.Jira_RTL_settings) return;

	const settings = await loadSettings();

	applySettings(settings);
});

console.log("Jira_RTL extension loaded");
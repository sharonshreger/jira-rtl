import merge from "deepmerge";

/**
 * @typedef {Object} ExtensionSettings
 * @property {boolean} enabled - Whether the Jira RTL extension is enabled.
 */

/** @type {ExtensionSettings} */
const DEFAULT_SETTINGS = {
	enabled: true
};

/**
 * Load settings from browser storage.
 * 
 * @returns {Promise<ExtensionSettings>}
 */
export async function loadSettings() {
	const result = await browser.storage.sync.get("Jira_RTL_settings");
	const storedSettings = result.Jira_RTL_settings || {};
	
	return merge(DEFAULT_SETTINGS, storedSettings);
}

/**
 * Save settings to browser storage.
 *
 * @param {ExtensionSettings} settings
 * @returns {Promise<void>}
 */
export async function saveSettings(settings) {
	await browser.storage.sync.set({ Jira_RTL_settings: settings });
}
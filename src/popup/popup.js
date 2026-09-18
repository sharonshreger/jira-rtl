import { loadSettings, saveSettings } from "../utils/settings";

// Loading settings

document.addEventListener("DOMContentLoaded", async () => {
	const settings = await loadSettings();

	document.getElementById("enabledToggle").checked = settings.enabled;
});

// On changing a setting

document.getElementById("enabledToggle").addEventListener("change", async (e) => {
	const settings = await loadSettings();
	settings.enabled = e.target.checked;
	await saveSettings(settings);
});
export class UrlChangeObserver {
	// --- Private fields ---
	#callback;
	#debounceMs;
	#started = false;
	#debounceTimer = null;
	#navigationPending = false;
	#lastUrl;
	#mutationObserver;
	#originalPushState;
	#originalReplaceState;

	// Bound handlers (private)
	#onPopState;
	#onPushState;
	#onReplaceState;

	constructor(callback, debounceMs = 200) {
		this.#callback = callback;
		this.#debounceMs = debounceMs;

		// bind handlers once
		this.#onPopState = this.#handlePopState.bind(this);
		this.#onPushState = this.#handlePushState.bind(this);
		this.#onReplaceState = this.#handleReplaceState.bind(this);

		this.#mutationObserver = new MutationObserver(() => this.#queueNavigationCallbackFromMutation());
	}

	start() {
		if (this.#started) return;
		this.#started = true;

		this.#lastUrl = location.href;

		// Save originals
		this.#originalPushState = history.pushState;
		this.#originalReplaceState = history.replaceState;

		history.pushState = this.#onPushState;
		history.replaceState = this.#onReplaceState;

		window.addEventListener("popstate", this.#onPopState);

		// Observe the whole body for silent changes
		this.#mutationObserver.observe(document.body, { childList: true, subtree: true });
	}

	stop() {
		if (!this.#started) return;
		this.#started = false;

		// Restore originals
		history.pushState = this.#originalPushState;
		history.replaceState = this.#originalReplaceState;

		window.removeEventListener("popstate", this.#onPopState);

		this.#mutationObserver.disconnect();

		if (this.#debounceTimer) clearTimeout(this.#debounceTimer);
		this.#debounceTimer = null;

		this.#navigationPending = false;
	}

	// --- Private handlers ---
	#handlePushState(...args) {
		this.#originalPushState.apply(history, args);
		this.#queueNavigationCallbackFromHistory();
	}

	#handleReplaceState(...args) {
		this.#originalReplaceState.apply(history, args);
		this.#queueNavigationCallbackFromHistory();
	}

	#handlePopState() {
		this.#queueNavigationCallbackFromHistory();
	}

	#queueNavigationCallbackFromHistory() {
		if (!this.#started) return;

		this.#navigationPending = true;

		clearTimeout(this.#debounceTimer);
		this.#debounceTimer = setTimeout(() => this.#executeNavigationCallback(), this.#debounceMs);
	}

	#queueNavigationCallbackFromMutation() {
		if (!this.#started) return;

		if (location.href === this.#lastUrl) return; // skip if URL is unchanged

		this.#navigationPending = true;

		clearTimeout(this.#debounceTimer);
		this.#debounceTimer = setTimeout(() => this.#executeNavigationCallback(), this.#debounceMs);
	}

	async #executeNavigationCallback() {
		if (!this.#started) return;
		if (!this.#navigationPending) return;

		this.#navigationPending = false;

		this.#lastUrl = location.href;

		// Callback can be sync or async - it's safe to use "await" anyway
		await this.#callback(location.href);
	}
}
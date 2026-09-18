import { ElementType } from "./enums/ElementType";
import { TargetResolvingStrategy } from "./enums/TargetResolvingStrategy";
import { TextResolvingStrategy } from "./enums/TextResolvingStrategy";

/**
 * @typedef {Object} ObserverRule
 * @property {string} selectors - CSS selectors to match an element
 * @property {ElementType} elementType - Type of the element to match (TEXT, INPUT, CONTENT_EDITABLE)
 * @property {(el: HTMLElement) => HTMLElement} resolveTarget - Function to find the target element for applying RTL
 * @property {(el: HTMLElement) => string} resolveText - Function to extract text for direction detection
 * @property {string} compiledSelector - Precompiled CSS selector which combines all defined selectors
 */

/**
 * Configuration of rules for matching elements to apply RTL on, and their associated behavior strategies.
 * 
 * @type {Array<ObserverRule>}
 */
export const observerRules = [
	/* Simple elements where RTL is applied directly */
	{
		selectors: [
			// Issues summary in issue view
			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',

			// Elements which on click turn to editable with the Jira text editor.
			// This includes jira issue description, comments in the issue activity section, and more
			'.ak-renderer-document p',
			'.ak-renderer-document li',
			'.ak-renderer-document h1',
			'.ak-renderer-document h2',
			'.ak-renderer-document h3',
			'.ak-renderer-document h4',
			'.ak-renderer-document h5',
			'.ak-renderer-document h6',

			// Action items inside an editable element (in view mode)
			'.ak-renderer-document [data-task-list-local-id]',

			// Cards content in Sprint or Kanban board view
			'[data-component-selector="platform-card.ui.card.card-content.content-section"]',

			// Cards group headers in Sprint or Kanban board view
			'[data-testid="software-board.board-container.board.card-group.card-group-header"] :nth-child(2)',

			// Versions/releases table view
			'[data-testid="project-directories.versions.main.table.table-container"] table > tbody > tr > td',

			// Work items table view for a specific version/release
			'[data-testid="software-releases-version-detail-issue-list.ui.issues.issue-card"] div:first-child > div[role="presentation"]',

			// Issue description inside an issue-relationship table
			'[data-testid="issue-field-summary.ui.inline-read.link-item--primitive--container"]',

			// Recent work items in a user profile view
			'[data-testid="profile-work-list"] li[data-testid="work-item"]',

			// Items in the "your-work" page (accessible by clicking on the "For you" option in the main menu)
			'[id^="your-work-page-tabs"] [data-test-id^="global-pages.home.ui.tab-container.tab.item-list.item-link"]',

			// Issues table inside dashboard gadgets
			'.search-results-dashboard-item-issue-table table.issue-table td.summary',

			// Items in sidebar modal dialogs
			'.atlaskit-portal-container [id^="_r"][data-ds--level="1"] span',

			// Epics names inside "lozenge components"
			'[data-testid="issue-field-parent-switcher.common.ui.epic-lozenge.lozenge--text"]',

			// Filter names in "all filters" page
			'[data-test-id="global-pages.directories.directory-base.content.table.container"] table[aria-label="Filters details"] td:has(a[href^="/issues/?filter="])',

			// Dashboard names in "all dashboards" page
			'[data-test-id="global-pages.directories.directory-base.content.table.container"] table[aria-label="Dashboards details"] td:has(a[href^="/jira/dashboards/"])',

			// Attachments headers
			'[data-testid="issue-view-base.content.attachment.grid-view.ui.components.media-card.title-box-header"]',

			// Options list of a "search issue" link section
			'[data-testid="issue-link-search-select--listbox"] [data-testid^="issue-link-search-select--option"]',

			// General tooltips
			'.atlaskit-portal-container [role="tooltip"]',

			// Tooltips in filter view
			'.atlaskit-portal-container [data-testid="hover-popover.ui.popup-content.hover-popover-content"]',

			// Titles of Confluence pages
			'[data-testid="title-text"]',

			// Titles of Confluence pages in editor mode
			'[data-test-id="editor-title"]',
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.SELF,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Issues filter view - issues summary */
	{
		selectors: [
			'table[data-vc="issue-table"] [data-testid="native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: el => el.closest('[data-testid="issue-field-inline-edit-read-view-container.ui.container"]'),
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* List view - issues summary */
	{
		selectors: [
			'[data-testid="business-list.ui.list-view.base-table.base-table-with-analytics"] [data-testid="business-list.ui.list-view.summary-cell"]',
			'[data-testid="business-list.ui.list-view.base-table.base-table-with-analytics"] [data-testid="smart-element-link"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: el => el.closest('[data-testid="business-list.ui.list-view.text-cell.text-cell-wrapper"]'),
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Backlog view - issues summary */
	{
		selectors: [
			'[data-testid^="software-backlog.card-list.id"] [data-testid="software-backlog.card-list.card.card-contents.summary"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Timeline view - epics titles */
	{
		selectors: [
			'[data-testid="sr-timeline"] [data-testid="roadmap.timeline-table-kit.ui.list-item-content.summary.title"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Header of an issue-relationship table */
	{
		selectors: [
			'[data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Title of issues in the modal dialog of search results */
	{
		selectors: [
			'[data-test-id="search-dialog-dialog-wrapper"] [data-vc="search-result-section"] .SearchDialogResultTitle'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Title of issue in a hover-card */
	{
		selectors: [
			'[data-testid="hover-card"] [data-smart-element="Title"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: el => el.closest('[data-testid="smart-element-group"]'),
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Description of issue in a hover-card */
	{
		selectors: [
			'[data-testid="hover-card"] [data-testid="smart-element-text"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Issues in the "Work" page of a user */
	{
		selectors: [
			'[data-testid="recent-work-component"] [data-testid="objectName"]'
		],
		elementType: ElementType.TEXT,
		resolveTarget: TargetResolvingStrategy.PARENT,
		resolveText: TextResolvingStrategy.TEXT_CONTENT
	},

	/* Editable Fields with content editor */
	{
		selectors: [
			'[id="ak-editor-textarea"][contenteditable="true"]',
		],
		elementType: ElementType.CONTENT_EDITABLE,
		resolveTarget: TargetResolvingStrategy.SELF,
		resolveText: el => TextResolvingStrategy.TREE_WALKER(el)
	},

	/* Input fields */
	{
		selectors: [
			// A generic search field
			'input[data-testid="searchfield"]',

			// The "summary" field in the modal for creating new issues
			'input#summary-field',

			// Issue view - the issue summary (in editable state)
			'[data-testid="issue.views.issue-base.foundation.summary.heading.writeable"] textarea',

			// The main search input at the top of the page
			'input[data-test-id="search-dialog-input"]',

			// Filter field in the "Work" page of a user
			'[data-testid="recent-work-component"] [data-testid="recent-work_search-input"]',

			// Filter fields in sidebar modal dialogs
			'.atlaskit-portal-container [id^="_r"][data-ds--level="1"] input[data-ds--text-field--input="true"]',

			// Summary field in "Clone issue" modal dialog
			'[data-testid="clone-issue-dialog.ui.modal-dialog--body"] input[data-ds--text-field--input="true"]',

			// Filter field of a "search issue" link section
			'[data-testid="issue-link-search-select--input"]',
		],
		elementType: ElementType.INPUT,
		resolveTarget: TargetResolvingStrategy.SELF,
		resolveText: TextResolvingStrategy.VALUE
	},

	/* Issue names in editable state inside issues tables */
	{
		selectors: [
			'tr[data-testid="native-issue-table.ui.issue-row"] input[data-ds--text-field--input="true"]',
		],
		elementType: ElementType.INPUT,
		resolveTarget: el => el.closest('form[role="presentation"]'),
		resolveText: TextResolvingStrategy.VALUE
	}
];

// Build a combined css selector for each individual observer rule
observerRules.forEach(rule => {
	rule.compiledSelector = rule.selectors.join(',');
});

/**
 * Combined css selector for all the observer rules items.
 * Used as fast check to decide if an element matches any of the rules, before processing it.
 */
export const combinedSelector = observerRules
	.flatMap(target => target.selectors)
	.join(', ');
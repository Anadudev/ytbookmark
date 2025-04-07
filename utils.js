/**
 * @returns {Promise<chrome.tabs.Tab>} The currently active tab in the
 * currently focused window.
 */
export async function getCurrentTabUrl() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

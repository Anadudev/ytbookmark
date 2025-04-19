import { getCurrentTabUrl } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement = [], bookmark) => {
	const bookmarkTitleElement = document.createElement("div");
	const newBookmarkElement = document.createElement("div");

	bookmarkTitleElement.textContent = bookmark.desc;
	bookmarkTitleElement.className = "bookmark-title";

	newBookmarkElement.id = "bookmark-" + bookmark.time;
	newBookmarkElement.className = "bookmark";

	newBookmarkElement.setAttribute("timestamp", bookmark.time);
	newBookmarkElement.appendChild(bookmarkTitleElement);

	bookmarksElement.appendChild(newBookmarkElement);
	console.log(bookmarksElement);
};

const viewBookmarks = (currentBookmarks = []) => {
	const bookmarksElement = document.getElementById("bookmarks");
	bookmarksElement.innerHTML = "";

	if (currentBookmarks[0]) {
		for (let i = 0; i < currentBookmarks.length; i++) {
			const element = currentBookmarks[i];
			addNewBookmark(bookmarksElement, element);
		}
	} else {
		bookmarksElement.innerHTML = "<i class='title'>No bookmarks yet</i>";
	}
};

const onPlay = e => { };

const onDelete = e => { };

const setBookmarkAttributes = () => { };

document.addEventListener("DOMContentLoaded", async () => {
	const activeTab = await getCurrentTabUrl();
	const queryParameters = activeTab.url.split("?")[1];
	const urlParameters = new URLSearchParams(queryParameters);

	const currentVideo = urlParameters.get("v");

	if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
		chrome.storage.sync.get([currentVideo], (data) => {
			const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
			viewBookmarks(currentVideoBookmarks);
		})
	} else {
		const bookmarksContainer = document.getElementsByClassName("container")[0];
		bookmarksContainer.innerHTML = "<div class='title'>This is not a Youtube video page</div>";
	}
});

/**
 * Returns a string representing the given time in seconds in the ISO time format: HH:mm:ss
 * @param {number} t - time in seconds
 * @returns {string} - time in ISO time format
 */
const getTime = (t = 1) => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 0);
}

(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    /**
     * Handler for when the user clicks the bookmark button.
     * Adds a new bookmark to the current video's bookmarks, which are stored in chrome.storage.sync.
     * The new bookmark is given a description that includes the current time.
     * The list of bookmarks for the current video is then sorted by time.
     */
    const addNewBookmarkEventHandler = () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };

        // currentVideoBookmarks = await fetchBookmarks();
        fetchBookmarks().then((data) => {
            currentVideoBookmarks = data;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            console.log("currentVideoBookmarks", currentVideoBookmarks);
        })
        console.log("currentVideoBookmarks", currentVideoBookmarks);

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    /**
     * Initializes a bookmark button on the YouTube player if it doesn't already exist.
     * The button is appended to the YouTube player's left controls and listens for click events.
     * On click, it triggers the addNewBookmarkEventHandler to add a bookmark at the current video timestamp.
     */
    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        console.log("Checking if the bookmark button exists:", bookmarkBtnExists);
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    newVideoLoaded();
})();

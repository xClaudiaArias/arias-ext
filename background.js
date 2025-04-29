
chrome.runtime.onInstalled.addListener(() => {
    chrome.notifications.create("welcome", {
        type: "basic",
        iconUrl: "icon48.png", 
        title: "ARIA Accessibility Helper",
        message: "Thanks for installing! Ready to make the web more accessible 🚀",
        priority: 2
    });
});

    chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['libs/axe.min.js']
        }, () => {

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
        });
    });

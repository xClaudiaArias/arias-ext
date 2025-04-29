// post-MVP ARIA Helper

console.log("ARIAS Helper Content Script Loaded");
// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getAccessibilityReport") {
        if (window.axe) {
            axe.run(document, {}, (err, results) => {
                if (err) throw err;
                sendResponse({ issues: results.violations }); // <-- ONLY violations
            });
        } else {
            sendResponse({ issues: [] });
        }
        return true; // Important to allow async sendResponse
    }
});



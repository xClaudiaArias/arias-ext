// post-MVP ARIA Helper
const highlightClass = "a11y-outline";


console.log("ARIAS Helper Content Script Loaded");
// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getAccessibilityReport") {
        if (window.axe) {
            axe.run(document, {}, (err, results) => {
                if (err) throw err;

                // clear outlines from previous runs
                document.querySelectorAll(`.${highlightClass}`).forEach(el => {
                    el.classList.remove(highlightClass);
                    el.style.outline = "";
                });

                const colorMap = {
                    critical: "4px solid #e53935",  
                    serious: "4px solid #fb8c00",  
                    moderate: "4px solid #fdd835",  
                    minor: "4px solid #43a047"     
                };

                results.violations.forEach((violation) => {
                    violation.nodes.forEach((node) => {
                        try {
                            const el = document.querySelector(node.target[0]);
                            if (el) {
                                el.classList.add(highlightClass);
                                el.style.outline = colorMap[violation.impact] || "2px dashed #000";
                            }
                        } catch (e) {
                            console.warn("Could not highlight element:", node.target[0]);
                        }
                    });
                });

            sendResponse({ issues: results.violations });
        });

        return true;
    } else if (request.action === "clearHighlights") {
        const highlighted = document.querySelectorAll(`.${highlightClass}`);
        highlighted.forEach(el => {
            el.style.outline = "";
            el.classList.remove(highlightClass);
        });
    } else {
        alert("axe-core not loaded.");
    }
}
});

document.addEventListener('DOMContentLoaded', function() {
    const scanButton = document.getElementById('scan');

    if (scanButton) {
        scanButton.addEventListener('click', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const issuesContainer = document.getElementById('issues');
                const issueCount = document.getElementById('issue-count');
                    
                issuesContainer.innerHTML = ""; 
                issueCount.textContent = "Scanning...";
                document.getElementById("loading-spinner").style.display = "inline-block";


                chrome.tabs.sendMessage(tabs[0].id, { action: "getAccessibilityReport" }, (response) => {      
                    issuesContainer.innerHTML = ""; 
                    issueCount.textContent = ""; 

                    if (!response) {
                        issueCount.textContent = "Error: Could not retrieve accessibility report. Is this a supported page?";
                        document.getElementById("loading-spinner").style.display = "none";
                        return;
                    }

                    if (response && response.issues && response.issues.length > 0) {
                        sessionStorage.setItem("a11yScanResults", JSON.stringify(response.issues));
                        const impactOrder = { critical: 1, serious: 2, moderate: 3, minor: 4 };
                        response.issues.sort((a, b) => {
                            return (impactOrder[a.impact] || 5) - (impactOrder[b.impact] || 5);
                        });

                        issueCount.textContent = `${response.issues.length} issues found`;
                    
                        response.issues.forEach(issue => {
                            const div = document.createElement('div');
                            div.className = 'issue';
                            div.setAttribute('data-impact', issue.impact);
                    
                            div.innerHTML = `
                                <strong>${issue.impact.toUpperCase()}</strong>: ${issue.help}<br/>
                                <small>${issue.description}</small>
                            `;
                            issuesContainer.appendChild(div);
                        });
                    } else {
                        issueCount.textContent = "No accessibility issues found! 🎉";
                        document.getElementById("loading-spinner").style.display = "none"; 
                        issuesContainer.textContent = "";
                        sessionStorage.setItem("a11yScanResults", "none");
                    }
                    
                });
            });
        });
    }

    document.getElementById("clear").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "clearHighlights" });
        });
    });

    renderStoredResults();

});


function renderStoredResults() {
    const stored = sessionStorage.getItem("a11yScanResults");
    const issuesContainer = document.getElementById('issues');
    const issueCount = document.getElementById('issue-count');

    if (stored) {
        issuesContainer.innerHTML = "";
        if (stored === "none") {
            issueCount.textContent = "No accessibility issues found! 🎉";
            return;
        }

        const issues = JSON.parse(stored);
        issueCount.textContent = `${issues.length} issues found`;

        const impactOrder = { critical: 1, serious: 2, moderate: 3, minor: 4 };
        issues.sort((a, b) => (impactOrder[a.impact] || 5) - (impactOrder[b.impact] || 5));

        issues.forEach(issue => {
            const div = document.createElement('div');
            div.className = 'issue';
            div.setAttribute('data-impact', issue.impact);

            div.innerHTML = `
                <strong>${issue.impact.toUpperCase()}</strong>: ${issue.help}<br/>
                <small>${issue.description}</small>
            `;
            issuesContainer.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const scanButton = document.getElementById('scan');

    if (scanButton) {
        scanButton.addEventListener('click', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "getAccessibilityReport" }, (response) => {
                    const issuesContainer = document.getElementById('issues');
                    const issueCount = document.getElementById('issue-count');
                    
                    issuesContainer.innerHTML = ""; 
                    issueCount.textContent = ""; 

                    if (response && response.issues && response.issues.length > 0) {
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
                        issuesContainer.textContent = "";
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

});

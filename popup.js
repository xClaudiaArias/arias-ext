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
                        issueCount.textContent = `${response.issues.length} issues found`;
                    
                        response.issues.forEach(issue => {
                            const div = document.createElement('div');
                            div.className = 'issue';
                    
                            let bgColor;
                            switch (issue.impact) {
                                case 'critical':
                                    bgColor = '#ff4d4d'; // Red
                                    break;
                                case 'serious':
                                    bgColor = '#ff944d'; // Orange
                                    break;
                                case 'moderate':
                                    bgColor = '#ffd11a'; // Yellow
                                    break;
                                case 'minor':
                                    bgColor = '#a3d977'; // Light green
                                    break;
                                default:
                                    bgColor = '#e0e0e0'; // Gray fallback
                            }
                    
                            div.style.backgroundColor = bgColor;
                            div.style.padding = '10px';
                            div.style.marginBottom = '10px';
                            div.style.borderRadius = '8px';
                    
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
});

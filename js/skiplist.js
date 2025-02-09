let searchValue = 13 // Value to search for
var e1 = document.querySelector('.e1');
var e2 = document.querySelector('.e2');
var e3 = document.querySelector('.e3');
var e4 = document.querySelector('.e4');
var e5 = document.querySelector('.e5');
var e6 = document.querySelector('.e6');
var e7 = document.querySelector('.e7');
var e8 = document.querySelector('.e8');
var e9 = document.querySelector('.e9');
var data = document.querySelector('.menu1 h1');

function expands()
{
    let key_box=document.querySelector('.key-box');
    document.getElementById('key-input').value = searchValue;
    key_box.classList.toggle('expand')
}
document.querySelector('.go').addEventListener('click', function() {
    // Prompt the user for the search value
    let key_box=document.querySelector('.key-box');

    // Make sure the search value is a valid number
    if (!isNaN(searchValue)) {
        // Set the value of the input field (optional)
      searchValue =  parseInt(document.getElementById('key-input').value);
      key_box.classList.remove('expand')
        // Now you can use the searchValue variable as needed
        console.log("Search value:", searchValue);
    } else {
        console.log("Invalid input. Please enter a number.");
    }
});

function highlightNode(node) {
    node.classList.add('highlighted');
}

function keepHighlightNode(node) {

    node.classList.add('previous-highlighted');
}

function drawLine(fromNode, toNode) {
    // Drawing logic (if needed)
}

let isPaused = false;
let isRestarted = false;
let currentTimeouts = []; // To track timeouts for proper pause and restart handling
let totalComparisons = 0; // To count total node comparisons
let levelsTraversed = 0; // To count levels traversed
let searchResult = ''; // To determine best, average, or worst case


function startSearch() {
    let currentLevel = 3; // Starting from the highest level
    let currentNodeIndex = 0; // Start at the first node of the current level
    let previousNodes = []; // To store nodes from previous levels
    totalComparisons = 0; // Reset counters
    levelsTraversed = 0;
    searchResult = '';
    let nodes
    function searchLevel(level, value) {
        nodes = document.getElementById(level).getElementsByClassName('node');
        let i = currentNodeIndex;

        function compareNodes() {
            if (isPaused || isRestarted) return; // Stop if paused or restarted
            e3.classList.remove('show');
            e4.classList.remove('show');
            e5.classList.remove('show');
            e6.classList.remove('show');
            e7.classList.remove('show');
            e8.classList.remove('show');
            e9.classList.remove('show');

            if (i < nodes.length) {
                totalComparisons++; // Increment comparisons count
                e3.classList.remove('show');
                e4.classList.toggle('show');
                e5.classList.toggle('show');
                e6.classList.remove('show');
                e7.classList.remove('show');
                e8.classList.remove('show');
                e9.classList.remove('show');
                highlightNode(nodes[i]); // Highlight node being compared
                let nodeValueText = nodes[i].textContent;
                let nodeValue = parseInt(nodeValueText);

                updateSkipListExplanation(level, parseInt(nodes[i].textContent), value, 'compare');

                if (isNaN(nodeValue)) {
                    i++;
                    customSetTimeout(compareNodes, 1000);
                    return;
                }
                e3.classList.remove('show');
                e4.classList.remove('show');
                e5.classList.remove('show');
                e6.classList.toggle('show');
                e7.classList.remove('show');
                e8.classList.remove('show');
                e9.classList.remove('show');
                data.innerHTML = "current node next value " + nodeValue + " is not equal to "+ value;

                if (nodeValue === value) {
                    e3.classList.remove('show');
                    e4.classList.remove('show');
                    e5.classList.remove('show');
                    e6.classList.toggle('show');
                    e7.classList.toggle('show');
                    e8.classList.remove('show');
                    e9.classList.remove('show');
                    finalizeSearchResult('found');
                    data.innerHTML = "current node next value " + nodeValue + " is equal to "+ value;
                    updateSkipListExplanation(level, parseInt(nodes[i].textContent), value, 'found');
                    customSetTimeout(() => {
                        if (!isPaused && !isRestarted) alert(`Value ${value} found!`);
                    }, 800);
                    return;
                }
                e3.classList.remove('show');
                e4.classList.toggle('show');
                e5.classList.remove('show');
                e6.classList.remove('show');
                e7.classList.remove('show');
                e8.classList.remove('show');
                e9.classList.remove('show');
                data.innerHTML = "current node next value " + nodeValue + " is less than "+ value;

                if (nodeValue > value) {
                    e3.classList.remove('show');
                    e4.classList.remove('show');
                    e5.classList.toggle('show');
                    e6.classList.remove('show');
                    e7.classList.remove('show');
                    e8.classList.remove('show');
                    data.innerHTML = "current node next value " + nodeValue + " is greater than "+ value;
                    updateSkipListExplanation(level, parseInt(nodes[i].textContent), value, 'drop');
                    currentNodeIndex = Math.max(i - 1, 0);
                    proceedToNextLevel();
                    return;
                }

                currentNodeIndex = i;
                i++;
                customSetTimeout(compareNodes, 1000);
            } else {
                proceedToNextLevel();
            }
        }

        function proceedToNextLevel() {
            if (isRestarted) return;

            if (currentLevel > 0) {
                currentLevel--;
                let prevNode = nodes[currentNodeIndex];
                let prevNodeValue = prevNode.textContent.trim();
                data.innerHTML = "search proceed to next level " + currentLevel;
                keepHighlightNode(prevNode);
                previousNodes.push(prevNode);
                levelsTraversed++; // Increment levels traversed
                e3.classList.remove('show');
                e4.classList.remove('show');
                e5.classList.remove('show');
                e6.classList.remove('show');
                e7.classList.remove('show');
                e8.classList.toggle('show');
                e9.classList.remove('show');
                let nextLevelNodes = Array.from(
                    document.getElementById(`level${currentLevel}`).getElementsByClassName('node')
                );

                let newIndex = currentNodeIndex;

                nextLevelNodes.forEach((node, j) => {
                    let nodeValueText = node.textContent.trim();
                    let nodeValue = parseInt(nodeValueText);

                    if (!isNaN(nodeValue) && nodeValue <= parseInt(prevNodeValue)) {
                        newIndex = j;
                    }
                });

                updateSkipListExplanation(currentLevel + 1, prevNode, value, 'level-down', parseInt(nextLevelNodes[newIndex].textContent));

                customSetTimeout(() => {
                    highlightMatchingNode(prevNodeValue, currentLevel);
                    customSetTimeout(() => {
                        currentNodeIndex = newIndex;
                        drawLine(prevNode, nextLevelNodes[currentNodeIndex]);
                        customSetTimeout(() => searchLevel(`level${currentLevel}`, value), 1000);
                    }, 1000);
                }, 1000);
            } else {
                compareFinalLevel();
            }
        }

        compareNodes();
    }

    function compareFinalLevel() {
        let nodes = document.getElementById('level0').getElementsByClassName('node');
        let i = currentNodeIndex;

        function compareNodes() {
            if (isPaused || isRestarted) return;
            let found = false;
            if (i < nodes.length) {
                totalComparisons++; // Increment comparisons count
                highlightNode(nodes[i]); // Highlight node being compared
                let nodeValueText = nodes[i].textContent;
                let nodeValue = parseInt(nodeValueText);

                updateSkipListExplanation(0, parseInt(nodes[i].textContent), searchValue, 'compare-final');

                if (isNaN(nodeValue)) {
                    i++;
                    customSetTimeout(compareNodes, 1000);
                    return;
                }

                if (nodeValue === searchValue) {
                    found = true;
                    finalizeSearchResult('found');
                    updateSkipListExplanation(0, parseInt(nodes[i].textContent), searchValue, 'found');
                    customSetTimeout(() => {
                        alert(`Value ${searchValue} found!`);
                    }, 800);
                    return;
                }

                if (nodeValue > searchValue) {
                    currentNodeIndex = Math.max(i - 1, 0);
                    proceedToNextLevel();
                    return;
                }

                currentNodeIndex = i;
                i++;
                customSetTimeout(compareNodes, 1000);
            }
            else {
                if (!found) {
                    e3.classList.remove('show');
                    e4.classList.remove('show');
                    e5.classList.remove('show');
                    e6.classList.remove('show');
                    e7.classList.remove('show');
                    e8.classList.remove('show');
                    e9.classList.toggle('show');
                    finalizeSearchResult('not-found');
                    updateSkipListExplanation(0, null, searchValue, 'not-found');
                    alert(`Value ${searchValue} not found in the final level.`);
                }
            }
        }

        compareNodes();
    }

    function customSetTimeout(callback, delay) {
        if (isPaused) return;

        const timeout = setTimeout(() => {
            if (!isPaused && !isRestarted) callback();
        }, delay);

        currentTimeouts.push(timeout); // Track timeouts for pausing and restarting
    }

    function highlightMatchingNode(valueToHighlight, nextLevel) {
        let nextLevelNodes = Array.from(document.getElementById(`level${nextLevel}`).getElementsByClassName('node'));
        nextLevelNodes.forEach(node => {
            let nodeValueText = node.textContent.trim();
            if (nodeValueText === valueToHighlight) {
                keepHighlightNode(node);
            }
        });
    }
    function finalizeSearchResult(status) {
        if (status === 'found') {
            if (levelsTraversed === 1 && totalComparisons === 2) {
                searchResult = 'Best Case';
            } else if (levelsTraversed > 1 && totalComparisons <= Math.log2(nodes.length)) {
                searchResult = 'Average Case';
            } else {
                searchResult = 'Worst Case';
            }
        } else {
            searchResult = 'Value not found';
        }
    
        displayComplexityDetails();
    }
    
    function displayComplexityDetails() {
        const complexityContainer = document.getElementById('complexity-analysis');
        complexityContainer.innerHTML = `
            <p>Search Result: ${searchResult}</p>
            <p>Nodes Compared: ${totalComparisons}</p>
            <p>Levels Traversed: ${levelsTraversed}</p>`;
    }
    searchLevel(`level${currentLevel}`, searchValue);
}
function resetVisualizationExplanation() {
    // Reset the visualization explanation
    document.getElementById('tcomplexity').innerHTML = `
      <div class="article-title text">
          <h1>Complexity</h1>
          <hr><br>
      </div>
      <div id="complexity-analysis"></div>
        `;
    document.getElementById('Explain').innerHTML = `
        <div class="article-title text">
            <div id="Explain">
                    
            </div>
        </div>`;
  }
function resetSearch() {
    isRestarted = true;

    // Clear all timeouts
    currentTimeouts.forEach(timeout => clearTimeout(timeout));
    currentTimeouts = [];

    // Reset colors and remove highlights
    const allNodes = document.querySelectorAll('.node');
    allNodes.forEach(node => {
        node.classList.remove('highlight', 'keep-highlight');
        node.style.backgroundColor = '';
    });

    // Hide all levels except level-0
    const allLevels = document.querySelectorAll('.level');
    allLevels.forEach(level => {
        if (level.id === 'level0') {
            level.style.display = 'block';
        } else {
            level.style.display = 'none';
        }
    });

    // Reset search parameters
    setTimeout(() => {
        currentLevel = 3;
        currentNodeIndex = 0;
        isRestarted = false;
    }, 500);
}


function updateSkipListExplanation(level, currentNode, targetValue, action, nextLevelNode = null) {
    // Get the info section from the DOM
    const info = document.getElementById("Explain");

    // Ensure the info element exists
    if (!info) {
        console.error("Info element is not found in the DOM.");
        return;
    }

    // Build the explanation based on the current operation
    let explanation = `<div><b>Level ${level}:</b><br>`;
    explanation += `<b>Current Node:</b> ${currentNode} <br>`;
    explanation += `<b>Target Value:</b> ${targetValue}.<br>`;

    if (action === "scan") {
        explanation += `<b>Action:</b> Scanning forward to the next node.<br>`;
    } else if (action === "drop" || action ==='level-down') {
        explanation += `<b>Action:</b> Dropping down to level ${level - 1}.<br>`;
        if (nextLevelNode) {
            explanation += `<b>Next Node:</b> ${nextLevelNode}<br>`;
        }
    } else if (action === "found") {
        explanation += `<b>Action:</b> Target value ${targetValue} .<br>`;
    } else if (action === "notFound") {
        explanation += `<b>Action:</b> Target value ${targetValue} not found in the skip list.<br>`;
    }

    explanation += `<hr></div>`; // Add a horizontal line to separate levels

    // Append the explanation to the info section
    info.innerHTML += explanation;
}
function pauseSearch() {
    isPaused = true;
    currentTimeouts.forEach(timeout => clearTimeout(timeout)); // Clear timeouts to pause animation
}

function resumeSearch() {
    if (isPaused) {
        isPaused = false;
        startSearch(); // Resume search from the last level
    }
}

// Attach reset, pause, and resume to buttons

document.getElementById('pauseButton').onclick = pauseSearch;
document.getElementById('resumeButton').onclick = resumeSearch;
function toggleWithDelay() {
    let level1 = document.getElementById('level1');
    let level1Nodes = document.querySelectorAll('#level1 .node');
    let node3 = document.querySelectorAll('#node3');
    let node5 = document.querySelectorAll('#node5');
    let node6 = document.querySelectorAll('#node6');
    let node8 = document.querySelectorAll('#node8');
    let node9 = document.querySelectorAll('#node9');
    let node10 = document.querySelectorAll('#node10');
    let node11 = document.querySelectorAll('#node11');
    let node16 = document.querySelectorAll('#node16');
    let node5_2 = document.querySelectorAll('#node5-2');
    let node8_2 = document.querySelectorAll('#node8-2');
    let node10_2 = document.querySelectorAll('#node10-2');
    let node16_2 = document.querySelectorAll('#node16-2');
    let node8_3 = document.querySelectorAll('#node8-3');
    let node16_3 = document.querySelectorAll('#node16-3');
    let level2 = document.getElementById('level2');
    let level2Nodes = document.querySelectorAll('#level2 .node');
    let level3 = document.getElementById('level3');
    let level3Nodes = document.querySelectorAll('#level3 .node');
    data.innerHTML = "key element " + searchValue + " ";
    // Toggle level 1 with no delay
    setTimeout(() => {
        level1.classList.toggle('visible');
        toggleClassList([node3, node5, node6, node8, node9, node10, node11, node16], 'expand');
        level1Nodes.forEach(node => node.classList.toggle('high'));

        // Toggle level 2 with a delay of 1 second
        setTimeout(() => {
            level2.classList.toggle('visible');
            toggleClassList([node5_2, node8_2, node10_2, node16_2], 'expand');
            level2Nodes.forEach(node => node.classList.toggle('high'));

            // Toggle level 3 with a delay of 2 seconds
            setTimeout(() => {
                level3.classList.toggle('visible');
                toggleClassList([node8_3, node16_3], 'expand');
                level3Nodes.forEach(node => node.classList.toggle('high'));

                // Additional delay before starting the search operation
                setTimeout(() => {
                    startSearch();
                }, 2000); // 2-second additional delay before calling startSearch

            }, 2000); // 2-second delay for the third level
        }, 1000); // 1-second delay for the second level
    }, 0); // No delay for the first level
}

// Utility function to toggle a class for multiple node lists
function toggleClassList(nodeLists, className) {
    nodeLists.forEach(nodeList => {
        nodeList.forEach(node => node.classList.toggle(className));
    });
}

// Function to reset all levels and nodes


function resetToLevel0() {
    isPaused = true; // Pause ongoing animations
    isRestarted = true; // Signal that a restart is in progress
    resetVisualizationExplanation();
    // Clear all active timeouts
    currentTimeouts.forEach(timeout => clearTimeout(timeout));
    currentTimeouts = [];

    let levels = ['level1', 'level2', 'level3'];
    let nodes = document.querySelectorAll('.node');
    const allNodes = document.querySelectorAll('.node');

    // Remove all highlights and reset styles
    allNodes.forEach(node => {
        node.classList.remove('highlighted', 'keep-highlight', 'high', 'expand','higlight','previous-highlighted');
        node.style.backgroundColor = '';
    });

    // Hide all levels except level-0
    levels.forEach(level => {
        let levelElement = document.getElementById(level);
        if (levelElement) {
            levelElement.classList.remove('visible');
        }
    });
    let level0 = document.getElementById('level0');
    if (level0) {
        level0.classList.add('visible');
    }
    // Reset flags after a delay to allow clean restart
    setTimeout(() => {
        isPaused = false;
        isRestarted = false;
    }, 500);
}

function customSetTimeout(callback, delay) {
    if (isPaused) return;

    const timeout = setTimeout(() => {
        if (!isPaused) callback();
    }, delay);

    currentTimeouts.push(timeout); // Track timeout
}

document.getElementById('restartButton').addEventListener('click', resetToLevel0);







/* mandatory code  */
/*arrows */
function showarrow1() {
    var arrow1 = document.querySelector('.arrow1 i');
    var menu1 = document.querySelector('.menu1');
    
    arrow1.classList.toggle('rotate'); // Rotate the arrow
    menu1.classList.toggle('expand'); // Expand or collapse the menu
    
    // Optional: Add responsive behavior
    if (window.innerWidth < 768) { // For mobile or small screens
        menu1.style.width = '100px'; // Example width for small screens
    } else {
        menu1.style.width = ''; // Reset to default width for larger screens
    }
}

// Add event listener for window resize to handle responsive behavior
window.addEventListener('resize', showarrow1);

function showarrow2() {
    var arrow2 = document.querySelector('.arrow2 i');
    var menu2 = document.querySelector('.menu2');
    var menu2Info = document.querySelector('.menu2-info');

    // Toggle the rotation of the arrow
    arrow2.classList.toggle('rotate');

    // Toggle the expansion of the menu2 and menu2-info
    menu2.classList.toggle('expand');
    menu2Info.classList.toggle('expand');

    // Optional: Add responsive behavior
    if (window.innerWidth < 768) { // For mobile or small screens
        menu2.style.width = '100px'; // Example width for small screens
    } else {
        menu2.style.width = ''; // Reset to default width for larger screens
    }
}

window.addEventListener('resize', showarrow2);
/*screen */
function fullscreen() {
    const theoryContainer = document.getElementById('Visualization');
    const controls = document.querySelector('.prompt');
    const menu1 = document.querySelector('.menu1');
    const menu2 = document.querySelector('.menu2');
    showarrow1();
    showarrow2();
    if (!theoryContainer) {
        console.error('Error: Visualization container not found.');
        return;
    }

    if (!controls) {
        console.error('Error: .prompt element not found.');
        
    }

    theoryContainer.classList.add('fullscreen-active');


    // Show menus
    if (menu1) menu1.style.display = 'block';
    if (menu2) menu2.style.display = 'block';
    if (menu2) menu2.style.display = 'block';
    theoryContainer.appendChild(controls);

}


function normalscreen() {
    const theoryContainer = document.getElementById('Visualization');
    const controls = document.querySelector('.prompt');
    const menu1 = document.querySelector('.menu1');
    const menu2 = document.querySelector('.menu2');

    theoryContainer.classList.remove('fullscreen-active');

    // Hide menus
    menu1.style.display = 'none';
    menu2.style.display = 'none';

    // Move controls back to the original location
    document.querySelector('#Visualization').appendChild(controls);
}




/*  buttons to start */
document.querySelectorAll('.btn1-start').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("Start button clicked");
        showarrow1();
        showarrow2();
        document.querySelectorAll('.btn1-re-start').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        startButton.classList.add('none'); // Hide the Start button
        console.log("Start button hidden");
    });
});
document.querySelectorAll('.btn1-re-start').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("restart button clicked");
        showarrow1();
        showarrow2();
        document.querySelectorAll('.btn1-start').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        startButton.classList.add('none'); // Hide the Start button
        console.log("Start button hidden");
    });
});

document.querySelectorAll('.btn2-pause').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("Start button clicked");

        document.querySelectorAll('.btn2-resume').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });

        startButton.classList.add('none'); // Hide the Start button
        console.log("Start button hidden");
    });
});
document.querySelectorAll('.btn2-resume').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("Start button clicked");

        document.querySelectorAll('.btn2-pause').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });

        startButton.classList.add('none'); // Hide the Start button
        console.log("Start button hidden");
    });
});

function toggle() {
    var menu = document.querySelector('.prompt-menu');
    menu.classList.toggle('visible');
    console.log('Menu toggled'); // Debugging log
}

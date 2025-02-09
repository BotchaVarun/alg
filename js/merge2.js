document.addEventListener('DOMContentLoaded', () => {
    initializeLevel1Visualization(array); // Visualize the level-1 container on load
});
let array=[6, 5, 12, 10, 9, 1, 7, 3, 19];
const treeContainer = document.getElementById('merge-sort-tree');
const startButton = document.getElementById('start-button');
// Global state variables
let isPaused = false;
let isStopped = false;
let pausePromise = null; 
// DOM elements for the buttons
const pauseButton = document.getElementById('pause-button');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
let speed = 2000; // Default speed
const speedInput = document.getElementById("speed");
// Function to get array values from input or use default
function initializeArray() {
    const inputField = document.getElementById('array-input');
    const inputValue = inputField.value;
    

    if (inputValue.trim() !== '') {
        // Convert input value to an array of numbers
        array = inputValue.split(',').map(value => parseInt(value.trim())).filter(value => !isNaN(value)).slice(0,9);
    } else {
        // Default array values
        array = [6, 5, 12, 10, 9, 1, 7, 3, 19];
    }
    
    // Initialize visualization with the array
    initializeLevel1Visualization(array);
}

// Update speed based on input value
speedInput.addEventListener("input", function() {
    switch(speedInput.value) {
        case '0':
            speed = 1500;
            break;
        case '1':
            speed = 1000;
            break;
        case '2':
            speed = 800;
            break;
        case '3':
            speed = 500;
            break;
        default:
            speed = 2000; // Default if out of range
    }
    console.log(speed);
});
document.addEventListener('DOMContentLoaded', () => {
    initializeLevel1Visualization(array); // Visualize the level-1 container on load
});

function createArrayContainer(arr, subtreeClass) {
    const arrayContainer = document.createElement('div');
    arrayContainer.className = `array-container ${subtreeClass}`;
    
    arr.forEach((num, index) => {
        // Create a wrapper for the element and its index
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'element-wrapper';

        // Create the array element
        const element = document.createElement('div');
        element.className = 'array-element';
        element.innerText = num;

        // Set the background color based on whether it's a left or right subtree
        if (subtreeClass.includes('left-tree')) {
            element.style.backgroundColor = 'rgb(129, 5, 71)';
        } else if (subtreeClass.includes('right-tree')) {
            element.style.backgroundColor = 'red';
        }

        // Create the index label
        const indexLabel = document.createElement('div');
        indexLabel.className = 'index-label';
        indexLabel.innerText = index;

        // Append the element and its index to the wrapper
        elementWrapper.appendChild(element);
        elementWrapper.appendChild(indexLabel);

        // Append the wrapper to the array container
        arrayContainer.appendChild(elementWrapper);
    });

    return arrayContainer;
}




async function addLevelToTree(arrays, subtreeClass, levelNumber) {
    const level = document.createElement('div');
    level.className = `level level-${levelNumber}`;
    const leveltag = document.createElement('div');
    leveltag.className = 'level-tag';
    leveltag.innerHTML = `level-${levelNumber}`;
    
    treeContainer.appendChild(level);
    level.appendChild(leveltag); // Add the level tag to the level container

    for (const arr of arrays) {
        await checkPaused(); // Check if paused before processing each array
        
        const arrayContainer = createArrayContainer(arr, subtreeClass);
        level.appendChild(arrayContainer);

        // Optional: Add some delay or animation if needed
        await sleep(speed/500); // Adjust the delay as needed
    }

    // Log for debugging
    console.log(`Added level-${levelNumber}:`, level);
}

let iterations = 0;
async function mergeSort(arr, subtreeClass = '', levelNumber = 1) {
    if (isStopped) return; // Check if sorting is stopped
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    let step = 1;
    console.log(`Merge sort level ${levelNumber}:`, arr);

    // Level 1: Original Array (full array)
    if (levelNumber === 1) {
        addLevelToTree([arr], subtreeClass, levelNumber);
        await checkPaused(); // ✅ Pause before visualizing level-1
        await updateMergeSortExplanation(arr, [], [], levelNumber, step++, []);
    }

    // Level 2: Split into left and right
    if (levelNumber === 2) {
        addLevelToTree([left, right], subtreeClass, levelNumber);
        await checkPaused(); // ✅ Pause before visualizing level-2
        await updateMergeSortExplanation(arr, left, [], levelNumber, step++, []);

        // Move up left and right arrays at level-1
        await moveLevel1ElementsUp(`${subtreeClass} left-tree`, arr);
        await checkPaused(); // ✅ Pause before moving right array
        await moveLevel1ElementsUp(`${subtreeClass} right-tree`, arr);
    }

    await checkPaused(); // ✅ Pause before recursive call
    const sortedLeft = await mergeSort(left, `${subtreeClass} left-tree`, levelNumber + 1);
    await checkPaused(); // ✅ Pause before right-side sorting
    const sortedRight = await mergeSort(right, `${subtreeClass} right-tree`, levelNumber + 1);

    // Level 3: Further splits (only for visualization)
    if (levelNumber === 2) {
        addLevelToTree([sortedLeft, sortedRight], subtreeClass, levelNumber + 1);
        await checkPaused(); // ✅ Pause before visualizing level-3
        await updateMergeSortExplanation(arr, [], right, levelNumber, step++, []);
    }

    const merged = await merge(sortedLeft, sortedRight);

    // Level 4: Merged sorted array
    if (levelNumber === 2) {
        await checkPaused(); // ✅ Pause before adding Level-4 elements
        await new Promise(resolve => setTimeout(resolve, 500));
        addLevelToTree([merged], subtreeClass, levelNumber + 2);
        await checkPaused(); // ✅ Pause before updating Level-4 explanation
        await updateMergeSortExplanation(arr, left, right, levelNumber, step++, merged);
    }

    // Hide Levels 2, 3, and 4 after the merge step is complete
    if (levelNumber === 2 && merged) {
        await sleep(speed);
        await checkPaused(); // ✅ Pause before hiding levels
        hideLevels([2, 3, 4]);
    }

    return merged;
}


async function moveLevel1ElementsUp(subtreeClass, arr) {
    // Correctly format the selector to get the elements for the specific subtree class
    const selector = `.level-1 .array-element`; // Adjusted to match elements directly under level-1
    console.log('Move up selector:', selector, 'Array:', arr);

    // Use the formatted selector to get the elements
    const level1Elements = document.querySelectorAll(selector);
    console.log('Number of elements found:', level1Elements.length);

    // Convert NodeList to an array and filter elements based on their text content
    const elementsToMove = Array.from(level1Elements).filter(element => {
        const elementValue = parseInt(element.innerText);
        console.log('Element value:', elementValue);
        return arr.includes(elementValue);
    });

    

    // Determine the highlight color based on the subtree class
    console.log("STATUS:",subtreeClass.includes('left-tree'));
    let highlightColor;
    if(subtreeClass.includes('left-tree'))
    {
        highlightColor='rgb(129, 5, 71)';
    }
    else{
        highlightColor='red'
    }

    // Add move-up class and apply the highlight color
    elementsToMove.forEach(element => {
        console.log('Elements to move up and highlight:', element);
        element.classList.add('move-up');
        element.style.backgroundColor = highlightColor; // Apply the highlight color
    });

    // Wait for the transition and highlight to complete
    await sleep(speed/500);

    // Optionally, remove the move-up class after the animation
    elementsToMove.forEach(element => {
        element.classList.remove('move-up');
        // Reset background color after animation
         
    });
}





async function merge(left, right) {
    const merged = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        iterations++;
        if (left[i] < right[j]) {
            merged.push(left[i++]);
        } else {
            merged.push(right[j++]);
        }
    }

    while (i < left.length) {
        merged.push(left[i++]);
    }

    while (j < right.length) {
        merged.push(right[j++]);
    }

    await sleep(speed);
    return merged;
}async function animateElements(leftElement, rightElement, newElement, container, highlightedElement) {
    // Ensure pause before any animation starts
    await checkPaused();

    // Apply move-up animation to both elements being compared
    if (leftElement) {
        leftElement.style.transition = 'transform 0.5s ease-in-out';
        leftElement.style.transform = 'translateY(-20px)';
    }

    if (rightElement) {
        rightElement.style.transition = 'transform 0.5s ease-in-out';
        rightElement.style.transform = 'translateY(-20px)';
    }

    console.log(leftElement);
    console.log(rightElement);

    await new Promise(resolve => setTimeout(resolve, 500));
    await checkPaused(); // ✅ Pause before highlighting

    // Determine which element to highlight green
    let leftArrayElement = leftElement ? leftElement.querySelector('.array-element') : null;
    if (leftArrayElement && highlightedElement === leftElement) {
        leftArrayElement.classList.add('highlight-green');
    }

    let rightArrayElement = rightElement ? rightElement.querySelector('.array-element') : null;
    if (rightArrayElement && highlightedElement === rightElement) {
        rightArrayElement.classList.add('highlight-green');
    }

    await checkPaused(); // ✅ Pause before adding the new element

    // Add new element to k-container and move up
    container.appendChild(newElement);
    newElement.style.transition = 'transform 0.5s ease-in-out';
    newElement.style.transform = 'translateY(-20px)';

    await new Promise(resolve => setTimeout(resolve, 500));
    await checkPaused(); // ✅ Pause before resetting positions

    // Move elements back down to their original positions
    if (leftElement) leftElement.style.transform = 'translateY(0)';
    if (rightElement) rightElement.style.transform = 'translateY(0)';
    newElement.style.transform = 'translateY(0)';

    await checkPaused(); // ✅ Pause before highlighting the merged element

    // Highlight the element that is placed into the merged container
    let newArrayElement = newElement ? newElement.querySelector('.array-element') : null;
    if (newArrayElement) {
        newArrayElement.classList.add('highlight');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    await checkPaused(); // ✅ Pause before removing highlight

    // Remove highlight after some time
    if (newArrayElement) {
        newArrayElement.classList.remove('highlight');
    }

    if (leftArrayElement) {
        leftArrayElement.classList.remove('highlight-green');
    }
    
    if (rightArrayElement) {
        rightArrayElement.classList.remove('highlight-green');
    }
}


// Updated mergeLevel4 function with pause functionality
async function mergeLevel4(left, right) {
    const merged = [];
    let i = 0, j = 0;

    // Find level-4 containers
    const leftLevel4Container = document.querySelector('.level-4 .left-tree');
    const rightLevel4Container = document.querySelector('.level-4 .right-tree');

    if (!leftLevel4Container || !rightLevel4Container) {
        console.error('Level-4 containers not found.');
        return merged;
    }

    const leftElements = Array.from(leftLevel4Container.children);
    const rightElements = Array.from(rightLevel4Container.children);

    // Create a container for left and right level-4 elements
    const combinedContainer = document.createElement('div');
    combinedContainer.className = 'array-container combined-container level-4-combined';
    treeContainer.appendChild(combinedContainer);

    // Create a new container for the merged result
    const kContainer = document.createElement('div');
    kContainer.className = 'array-container k-container level-4-k';
    treeContainer.appendChild(kContainer);

    // Append left and right level-4 elements to the combined container
    combinedContainer.appendChild(leftLevel4Container.cloneNode(true));
    combinedContainer.appendChild(rightLevel4Container.cloneNode(true));

    // Extract elements from the combined container
    const combinedLeftElements = Array.from(combinedContainer.querySelector('.left-tree').children);
    const combinedRightElements = Array.from(combinedContainer.querySelector('.right-tree').children);

    // Initialize index counters for left and right
    let leftIndex = 0;
    let rightIndex = 0;
    let kIndex = 0; // Index for elements in the kContainer

    // Start the merge process
    while (leftIndex < combinedLeftElements.length || rightIndex < combinedRightElements.length) {
        await checkPaused();  // Ensure pausing before each comparison
        
        const leftElement = leftIndex < combinedLeftElements.length ? combinedLeftElements[leftIndex] : null;
        const rightElement = rightIndex < combinedRightElements.length ? combinedRightElements[rightIndex] : null;

        const kElementWrapper = document.createElement('div');
        kElementWrapper.className = 'array-element-wrapper';

        const kElement = document.createElement('div');
        kElement.className = 'array-element';

        const indexLabel = document.createElement('div');
        indexLabel.className = 'index-label';
        indexLabel.innerText = kIndex; // Set the index label

        if (leftElement && rightElement) {
            const leftValue = parseInt(leftElement.innerText);
            const rightValue = parseInt(rightElement.innerText);

            await checkPaused(); // Pause before making the decision
            
            if (leftValue <= rightValue) {
                kElement.innerText = leftValue;
                kElementWrapper.appendChild(kElement);
                kElementWrapper.appendChild(indexLabel);
                await animateElements(leftElement, rightElement, kElementWrapper, kContainer, leftElement);
                merged.push(leftValue);
                leftIndex++;
            } else {
                kElement.innerText = rightValue;
                kElementWrapper.appendChild(kElement);
                kElementWrapper.appendChild(indexLabel);
                await animateElements(leftElement, rightElement, kElementWrapper, kContainer, rightElement);
                merged.push(rightValue);
                rightIndex++;
            }
        } else if (leftElement) {
            await checkPaused(); // Pause before processing remaining left elements
            
            kElement.innerText = parseInt(leftElement.innerText);
            kElementWrapper.appendChild(kElement);
            kElementWrapper.appendChild(indexLabel);
            await animateElements(leftElement, null, kElementWrapper, kContainer, leftElement);
            merged.push(parseInt(leftElement.innerText));
            leftIndex++;
        } else if (rightElement) {
            await checkPaused(); // Pause before processing remaining right elements
            
            kElement.innerText = parseInt(rightElement.innerText);
            kElementWrapper.appendChild(kElement);
            kElementWrapper.appendChild(indexLabel);
            await animateElements(null, rightElement, kElementWrapper, kContainer, rightElement);
            merged.push(parseInt(rightElement.innerText));
            rightIndex++;
        }

        kIndex++; // Increment the index for the kContainer elements
    }

    // Hide the level-4 containers for both left and right trees after merging
    leftLevel4Container.style.display = 'none';
    rightLevel4Container.style.display = 'none';

    // Highlight all elements in the kContainer with green
    const kElements = kContainer.querySelectorAll('.array-element');
    kElements.forEach(element => {
        element.classList.add('highlight-green');
    });

    await sleep(speed);

    const startTime = performance.now();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    calculateComplexity(iterations, merged.length, executionTime);

    if (leftElements && rightElements) {
        updateMergeSortExplanation(
            0,
            combinedLeftElements,
            combinedRightElements,
            4, 4, merged
        );
    } else {
        console.error("Left or Right elements are undefined.");
    }

    console.log("Merged", merged);
    return merged;
}


/* Visualization Explaination */
async function updateMergeSortExplanation(arr, left, right, level, step, merged) {
    const info = document.getElementById("Explain");

    if (!info) {
        console.error("Info element is not found in the DOM.");
        return;
    }

    let explanation = `<div><b>Step ${step}:</b><br>`;
    if (arr && arr.length > 0) {
        explanation += `<b>Array at Level-${level}:</b> [${arr.join(', ')}]<br>`;
    } else {
        explanation += ``;
    }
    
    if (level === 1) {
        explanation += `<b>Action:</b> Starting merge sort. The array is being divided into two halves.<br>`;
    } else if (level === 2) {
        explanation += `<b>Left Half:</b> [${left.join(', ')}], <b>Right Half:</b> [${right.join(', ')}]<br>`;
        explanation += `<b>Action:</b> Recursively sorting the left and right halves.<br>`;
    } else if (level === 3) {
        explanation += `<b>Sorted Left Half:</b> [${left.join(', ')}], <b>Sorted Right Half:</b> [${right.join(', ')}]<br>`;
        explanation += `<b>Action:</b> The left and right halves are now sorted, and we're merging them to form a sorted array.<br>`;
    }


    explanation += `<b>Merged Array:</b> [${merged.join(', ')}]<br>`;
    explanation += `<b>Action:</b> The left and right halves have been merged in sorted order.<br>`;
    explanation += `<hr></div>`; // Add a horizontal line to separate passes

    // Append the explanation to the info section
    info.innerHTML += explanation;
}
function calculateComplexity(iterations, n, executionTime) {
    let caseType = "Average Case";
    let timeComplexity = "O(n log n)"; // Merge Sort complexity

    if (iterations === n - 1) {
        caseType = "Best Case";
    }

    const spaceComplexity = "O(n)"; // Merge Sort uses extra space

    const complexityAnalysis = `
        <p><strong>Time Complexity:</strong> ${timeComplexity} (${caseType})</p>
        <p><strong>Space Complexity:</strong> ${spaceComplexity}</p>
        <p><strong>Array Size (n):</strong> ${n}</p>
        <p><strong>Total Iterations:</strong> ${iterations}</p>
        <p><strong>Execution Time:</strong> ${executionTime} ms</p>
    `;

    document.getElementById('complexity-analysis').innerHTML = complexityAnalysis;
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
async function highlightLevel1Elements(subtreeClass, arr) {
    // Correctly format the selector to get the elements for the specific subtree class
    const selector = `.level-1 .array-element`; // Adjusted to match elements directly under level-1
    console.log('Highlight selector:', selector, 'Array:', arr);
 
    // Use the formatted selector to get the elements
    const level1Elements = document.querySelectorAll(selector);
    console.log('Number of elements found:', level1Elements.length);

    // Convert NodeList to an array and filter elements based on their text content
    const elementsToHighlight = Array.from(level1Elements).filter(element => {
        const elementValue = parseInt(element.innerText);
        console.log('Element value:', elementValue);
        return arr.includes(elementValue);
    });

    console.log('Elements to highlight:', elementsToHighlight);

    // Add highlight class to all elements in the level-1 container
    elementsToHighlight.forEach(element => {
        element.classList.add('highlight');
    });
    
    // Wait for a short period to show highlights before animation
    await sleep(speed);

    // Remove highlight class after showing
    elementsToHighlight.forEach(element => {
        element.classList.remove('highlight');
    });
}






async function addElementToContainer(container, value) {
    const element = document.createElement('div');
    element.className = 'array-element';
    element.innerText = value;
    container.appendChild(element);

    // Ensure the container is visible
    container.style.display = 'flex';
    container.style.flexDirection = 'row';

    // Apply move-up animation
    element.style.transition = 'transform 0.5s ease-in-out';
    element.style.transform = 'translateY(-20px)'; // Initial move up

    // Use a timeout to ensure the transition is applied
    await new Promise(resolve => setTimeout(resolve, 0));
    element.style.transform = 'translateY(0)'; // Move back down
}

function hideLevels(levels) {
    levels.forEach(levelNumber => {
        const levelsToHide = document.querySelectorAll(`.level-${levelNumber}`);
        levelsToHide.forEach(level => {
            level.style.display = 'none';
        });
    });
}


function initializeLevel1Visualization(array) {
    treeContainer.innerHTML = ''; // Clear the tree container
    addLevelToTree([array], '', 1); // Add level-1 to the tree
}

// Event listener for the start button to trigger the merge sort animation
startButton.addEventListener('click', async () => {
    isPaused = false;
    isStopped = false;
    treeContainer.innerHTML = ''; // Clear the previous tree (if any)
    resetVisualizationExplanation();
    // Start the merge sort animation
    await mergeSort(array);

    // Wait a bit to ensure all levels are rendered
    await sleep(speed); 

    // Debugging: Check the contents of treeContainer
    console.log('Tree container contents:', treeContainer.innerHTML);

    // Attempt to find the level-4 containers
    const leftLevel4 = document.querySelector('.level-4 .left-tree');
    const rightLevel4 = document.querySelector('.level-4 .right-tree');

    console.log('Left Level 4:', leftLevel4);
    console.log('Right Level 4:', rightLevel4);

    if (leftLevel4 && rightLevel4) {
        const leftArray = Array.from(leftLevel4.children).map(el => parseInt(el.innerText));
        const rightArray = Array.from(rightLevel4.children).map(el => parseInt(el.innerText));

        console.log('Left Array:', leftArray);
        console.log('Right Array:', rightArray);

        await mergeLevel4(leftArray, rightArray);
    } else {
        console.error('Could not find level-4 containers.');
    }
});

// Function to set the paused state
function setPaused(paused) {
    isPaused = paused;
    if (paused) {
        pausePromise = new Promise(resolve => {
            // Resolve the promise when resume is clicked
            document.getElementById('resumeButton').onclick = () => {
                setPaused(false);
                resolve();
            };
        });
    } else if (pausePromise) {
        pausePromise.then(() => pausePromise = null);  // Clear the promise when resuming
    }
}

// Event listeners for the control buttons
document.getElementById('pauseButton').addEventListener('click', () => {
    setPaused(true);
});

document.getElementById('resumeButton').addEventListener('click', () => {
    setPaused(false);
});
// Function to check if sorting is paused
async function checkPaused() {
    while (isPaused) { // If paused, keep waiting
        await new Promise(resolve => setTimeout(resolve, 100)); // Short delay
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




restartButton.addEventListener('click', () => {
    isPaused = false;
    isStopped = true;
    treeContainer.innerHTML = ''; // Clear the tree container
    initializeLevel1Visualization(array); // Re-initialize the visualization
    resetVisualizationExplanation();
});
document.getElementById('goButton').addEventListener('click', () => {
    toggle(); // Assuming toggle is a predefined function
    initializeArray(); // Initialize visualization with the input array
});

/* arrow animation */




/*  buttons to start */
document.querySelectorAll('#start-button').forEach(function(startButtonAsc) {
    startButtonAsc.addEventListener('click', function() {
        console.log("Start Ascending button clicked");

        document.querySelectorAll('.btn1-re-start').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        startButtonAsc.classList.add('none'); // Hide the Start Ascending button

        console.log("Start Ascending and Start Descending buttons hidden");
    });
});


document.querySelectorAll('.btn1-re-start').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("Start button clicked");
  
        document.querySelectorAll('#start-button').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });

        document.querySelectorAll('.btn2-resume').forEach(function(restartButton) {
            restartButton.classList.add('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
         document.querySelectorAll('.btn2-pause').forEach(function(restartButton) {
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
/* full screen */
function fullscreen() {
    const theoryContainer = document.getElementById('Visualization');
    const controls = document.querySelector('.prompt');
    console.log("performed");
    theoryContainer.classList.add('fullscreen-active');
    // Move controls into the Theory container
    
  }
  
  function normalscreen() {
    const theoryContainer = document.getElementById('Visualization');
    const controls = document.querySelector('.controls');
    
    theoryContainer.classList.remove('fullscreen-active');
  
    // Move controls back to the original location
    
  }
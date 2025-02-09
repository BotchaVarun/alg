// Sample input for the knapsack problem
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;
const numItems = weights.length;
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const resetBtn = document.getElementById('reset-btn');
var e1 = document.querySelector('.e1');
var e2 = document.querySelector('.e2');
var e3 = document.querySelector('.e3');
var e4 = document.querySelector('.e4');
var e5 = document.querySelector('.e5');
var e6 = document.querySelector('.e6');
var e7 = document.querySelector('.e7');

var data = document.querySelector('.menu1 h1');
// 2D table to store DP results
let dpTable = Array(numItems + 1).fill(null).map(() => Array(capacity + 1).fill(0));

// Pause flag
let isPaused = false;

// Function to populate weights and values
function snap() {
    const weightContainer = document.querySelector('.weights'); // Use appropriate selector
    const valueContainer = document.querySelector('.values'); // Use appropriate selector

    if (weightContainer && valueContainer) {
        // Populate weights
        weights.forEach((weight, index) => {
            const weightDiv = document.createElement('div');
            weightDiv.className = 'wei';
            weightDiv.textContent = weight; // Add weight value
            weightContainer.appendChild(weightDiv);
            console.log(weight);
            // Add an id for identifying which weight to highlight later (based on item index)
            weightDiv.setAttribute('id', `weight-${index + 1}`);
        });

        // Populate values
        values.forEach((value, index) => {
            const valueDiv = document.createElement('div');
            valueDiv.className = 'val';
            valueDiv.textContent = value; // Add value text
            valueContainer.appendChild(valueDiv);

            // Add an id for each value for potential future use
            valueDiv.setAttribute('id', `value-${index + 1}`);
        });
    } else {
        console.error('Containers for weights or values not found.');
    }
}

// Function to highlight weights included in the bag
function highlightWeight(itemIndex) {
    const weight = weights[itemIndex - 1]; // Get the weight of the item
    const weightElements = document.querySelectorAll('.wei'); // Select all weight elements in the container

    // Find and highlight the corresponding weight element
    weightElements.forEach((element) => {
        if (parseInt(element.textContent) === weight) {
            element.classList.add('fit-in-bag'); // Add the fit-in-bag class to highlight it
        }
    });
}

// Adjusted backtracking function to highlight weights
async function backtrackItems() {
    let i = numItems;
    let c = capacity;
    const selectedItems = [];

    // Backtrack through the table to find the selected items
    while (i > 0 && c > 0) {
        if (dpTable[i][c] !== dpTable[i - 1][c]) { // If the value is different, the item was included
            selectedItems.push(i); // Push the item index (1-based)
            highlightCell(i, c, 'fit-in-bag'); // Highlight the cell as part of the solution
            highlightItem(i); // Highlight the respective item container
            highlightWeight(i); // Highlight the weight in the container
            c -= weights[i - 1]; // Reduce capacity
        }
        i--;
    }

    // Highlight weightContainer elements that gave maximum profit
    selectedItems.forEach(itemIndex => {
        highlightWeight(itemIndex); // Ensure weight is highlighted in the weightContainer
    });
    return selectedItems;
}

// Function to highlight the item container based on the item index
function highlightItem(itemIndex) {
    const item = document.getElementById(`item-${itemIndex}`);

    // Check if item exists before trying to modify it
    if (item) {
        item.classList.add("fit-in-bag");
    } else {
        console.error(`Item with index ${itemIndex} not found!`);
    }
}

// Function to create the table (same as before)
function createTable() {
    const tableContainer = d3.select("#knapsack-table");
    tableContainer.html(""); // Clear any previous table content

    // Create the table
    const table = tableContainer.append("table");

    // Create table header (capacities)
    const headerRow = table.append("tr");
    headerRow.append("th").text("Item/Capacity");
    for (let c = 0; c <= capacity; c++) {
        headerRow.append("th").text(c);
    }

    // Create table rows (items)
    for (let i = 0; i <= numItems; i++) {
        const row = table.append("tr");
        row.append("th").text(i === 0 ? "No Item" : `Item ${i}`);
        for (let c = 0; c <= capacity; c++) {
            row.append("td").attr("id", `cell-${i}-${c}`).text(dpTable[i][c]);
        }
    }
}

// Function to highlight a specific cell in the table
function highlightCell(i, c, highlightClass) {
    d3.select(`#cell-${i}-${c}`).classed(highlightClass, true);
}

// Function to update the cell value in the DP table
function updateCell(i, c, value) {
    dpTable[i][c] = value;
    d3.select(`#cell-${i}-${c}`).text(value);
}

// Function to highlight the pseudo-code steps (e1, e2, e3, etc.)
function highlightPseudoCode(element) {
    // Remove highlight from all pseudo code elements
    document.querySelectorAll('.code h4').forEach((el) => el.classList.remove('highlights'));

    // Add highlight class to the currently active pseudo code element
    element.classList.add('highlights');
}

async function startKnapsack() {
    showarrow1();
    showarrow2();
    const data = document.querySelector('.menu1 h1'); // Element to display updates
    createTable(); // Create knapsack table

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    resetBtn.disabled = false;
    const explainDiv = document.getElementById("Explain");
    
    // Set animationInProgress to true to indicate that the animation has started
    animationInProgress = true;

    // Initialize explanation and update explanation div
    explainDiv.innerHTML = `<b>Step 1:</b> Initializing table and starting algorithm.<br>`;
    explainDiv.innerHTML += `Weights: [${weights}]<br>`;
    explainDiv.innerHTML += `Capacity: ${capacity}<br>`;
    data.innerHTML = "Initializing table and starting algorithm."; // Update data
    await new Promise(r => setTimeout(r, 500));

    // Iterate through all items and capacities
    for (let i = 1; i <= numItems; i++) {
        // Highlight the second pseudo code step (e2)
        highlightPseudoCode(e2);
        data.innerHTML = `Processing item ${i} of ${numItems}.`; // Update data
        explainDiv.innerHTML += `<b>Step 2:</b> Processing item ${i} of ${numItems}.<br>`; // Update explanation
        await new Promise(r => setTimeout(r, 500));

        for (let w = 0; w <= capacity; w++) {
            if (!animationInProgress) {
                return; // Stop execution if animation is not in progress (reset has been called)
            }

            // Pause if the pause flag is set
            while (isPaused) {
                // Display paused message and prevent further execution until resumed
               
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait until paused state is cleared
            }

            // Highlight the current cell being processed
            highlightCell(i, w, 'highlight');
            data.innerHTML = `Processing weight capacity ${w} for item ${i}.`; // Update data
            explainDiv.innerHTML += `<hr>
            <b>Step 3:</b> Processing weight capacity ${w} for item ${i}.<br>`; // Update explanation
            await new Promise(r => setTimeout(r, 500));

            if (weights[i - 1] <= w) {
                // Highlight the third pseudo code step (e3)
                highlightPseudoCode(e3);
                data.innerHTML = `Item can be included (${weights[i-1]} <= ${capacity}). Calculating values.`; // Update data
                explainDiv.innerHTML += `<b>Step 4:</b> Item can be included (${weights[i-1]} <= ${capacity}). Calculating values.<br>`; // Update explanation
                await new Promise(r => setTimeout(r, 500));

                // Compute exclude and include values
                const excludeItem = dpTable[i - 1][w]; // Exclude current item
                const includeItem = dpTable[i - 1][w - weights[i - 1]] + values[i - 1]; // Include current item

                // Highlight cells contributing to calculation
                highlightCell(i - 1, w, 'exclude'); // Highlight exclude path
                highlightCell(i - 1, w - weights[i - 1], 'include'); // Highlight include path
                await new Promise(r => setTimeout(r, 500));

                // Highlight the fourth pseudo code step (e4)
                highlightPseudoCode(e4);
                await new Promise(r => setTimeout(r, 500));

                // Update the cell value with the maximum of exclude or include
                const maxValue = Math.max(excludeItem, includeItem);
                updateCell(i, w, maxValue);
                data.innerHTML = `Comparing exclude and include paths. Updating table with max value:${maxValue}`;
                explainDiv.innerHTML += `<b>Step 5:</b> Comparing exclude and include paths. Updating table with max value: ${maxValue}.<br>`; // Update explanation

                // Highlight the chosen path
                if (maxValue === includeItem) {
                    highlightCell(i - 1, w - weights[i - 1], 'selected-item'); // Highlight include path
                } else {
                    highlightCell(i - 1, w, 'selected-item'); // Highlight exclude path
                }
            } else {
                // If the item's weight exceeds current capacity, retain the previous value
                // Highlight the fifth pseudo code step (e5)
                highlightPseudoCode(e5);
                data.innerHTML = `Item weight exceeds capacity. Retaining previous value.`; // Update data
                explainDiv.innerHTML += `<b>Step 6:</b> Item weight exceeds capacity. Retaining previous value.<br>`; // Update explanation
                await new Promise(r => setTimeout(r, 500));

                updateCell(i, w, dpTable[i - 1][w]);

                // Highlight the sixth pseudo code step (e6)
                highlightPseudoCode(e6);
                data.innerHTML = `Updating cell without including item. Highlighting selected path.`; // Update data
                explainDiv.innerHTML += `<b>Step 7:</b> Updating cell without including item. Highlighting selected path.<br>`; // Update explanation
                await new Promise(r => setTimeout(r, 500));

                highlightCell(i - 1, w, 'selected-item'); // Highlight exclude path
            }

            // Remove highlights after processing the cell
            d3.selectAll('.exclude').classed('exclude', false);
            d3.selectAll('.include').classed('include', false);
            d3.select(`#cell-${i}-${w}`).classed('highlight', false);
        }
    }

    // Highlight the seventh pseudo code step (e7) at the end
    highlightPseudoCode(e7);
    displayKnapsackComplexityAnalysis();
    const selectedItems = await backtrackItems();
    data.innerHTML = `Backtracking complete. Items selected for the knapsack: ${selectedItems.join(', ')}.`;
    explainDiv.innerHTML += `<b>Step 8:</b> Backtracking complete. Items selected for the knapsack: ${selectedItems.join(', ')}.<br>`; // Update explanation
    await new Promise(r => setTimeout(r, 500));
    // Start backtracking to find the items that fit in the bag
    await backtrackItems();
}



// Add CSS for highlight class if not already added
const style = document.createElement('style');
style.innerHTML = `
    .highlight {
        background-color: yellow; /* Highlight color */
        font-weight: bold;
    }
    .exclude {
        background-color: lightblue; /* Exclude path color */
    }
    .include {
        background-color: lightgreen; /* Include path color */
    }
    .selected-item {
        background-color: orange; /* Selected item color */
    }
`;
document.head.appendChild(style);

// Modify reset function to stop animation
function resetKnapsack() {
    animationInProgress = false; // Stop any ongoing animation
    dpTable = Array(numItems + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    createTable(); // Recreate the table
    d3.selectAll('.fit-in-bag').classed('fit-in-bag', false); // Remove all highlights
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    resetBtn.disabled = true;
    resetVisualizationExplanation();
    showarrow1();
    showarrow2();
}

// Event listeners for buttons
pauseBtn.addEventListener("click", pauseKnapsack);
resumeBtn.addEventListener("click", resumeKnapsack);
resetBtn.addEventListener("click", resetKnapsack);


// Pause the execution
function pauseKnapsack() {
    isPaused = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
}

// Resume the execution
function resumeKnapsack() {
    isPaused = false;
    resumeBtn.disabled = true;
    pauseBtn.disabled = false;
}
/* Complexity analysis */
function displayKnapsackComplexityAnalysis() {
    const complexityDiv = document.getElementById('complexity-analysis');
    const n = numItems; // Number of items
    const W = capacity; // Knapsack capacity

    // Time complexity components
    const timeComplexity = `O(n * W)`;
    const spaceComplexity = `O(n * W)`;

    // Creating the HTML content for complexity analysis
    const complexityContent = `
        <p><strong>Time Complexity:</strong> ${timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${spaceComplexity}</p>
        <p><strong>Explanation:</strong> The time complexity of the Knapsack Dynamic Programming approach is proportional to the product of the number of items and the knapsack's capacity, i.e., O(n * W). Similarly, the space complexity is also O(n * W), as we need to store the DP table for each item and weight combination.</p>
    `;

    // Insert the generated HTML content into the `complexity-analysis` div
    complexityDiv.innerHTML = complexityContent;
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
    
}

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
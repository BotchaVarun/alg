const graphContainer = document.getElementById('graph-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
var e1 = document.querySelector('.e1');
var e2 = document.querySelector('.e2');
var e3 = document.querySelector('.e3');
var e4 = document.querySelector('.e4');
var e5 = document.querySelector('.e5');
var e6 = document.querySelector('.e6');
var e7 = document.querySelector('.e7');
var e8 = document.querySelector('.e8');

var data = document.querySelector('.menu1 h1');
let isPaused = false;
let isReset = false;

const nodes = [
    { id: 1, x: 50, y: 50 },
    { id: 2, x: 300, y: 80 },
    { id: 3, x: 500, y: 50 },
    { id: 4, x: 200, y: 320 },
    { id: 5, x: 350, y: 250 },
    { id: 6, x: 500, y: 360 },
    { id: 7, x: 200, y: 180 },
    { id: 8, x: 600, y: 210 }
];

const edges = [
    { from: 1, to: 2, weight: 4 },
    { from: 1, to: 4, weight: 7 },
    { from: 2, to: 3, weight: 3 },
    { from: 2, to: 5, weight: 6 },
    { from: 3, to: 5, weight: 5 },
    { from: 4, to: 5, weight: 2 },
    { from: 4, to: 6, weight: 8 },
    { from: 5, to: 6, weight: 1 },
    { from: 5, to: 7, weight: 4 },
    { from: 7, to: 8, weight: 3 },
    { from: 6, to: 8, weight: 5 }
];

function createNode(node) {
    const div = document.createElement('div');
    div.className = 'node';
    div.style.left = `${node.x}px`;
    div.style.top = `${node.y}px`;
    div.textContent = node.id;
    div.dataset.id = node.id;
    graphContainer.appendChild(div);
}

function createEdge(edge) {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    const x1 = fromNode.x + 20;
    const y1 = fromNode.y + 20;
    const x2 = toNode.x + 20;
    const y2 = toNode.y + 20;

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const edgeDiv = document.createElement('div');
    edgeDiv.className = 'edge';
    edgeDiv.style.width = `${length}px`;
    edgeDiv.style.height = `2px`;
    edgeDiv.style.left = `${x1}px`;
    edgeDiv.style.top = `${y1}px`;
    edgeDiv.style.transform = `rotate(${angle}deg)`;

    const label = document.createElement('div');
    label.className = 'edge-label';
    label.textContent = edge.weight;
    label.style.left = `${(x1 + x2) / 2}px`;
    label.style.top = `${(y1 + y2) / 2}px`;

    graphContainer.appendChild(edgeDiv);
    graphContainer.appendChild(label);

    edge.div = edgeDiv;
}

function resetGraph() {
    isReset = true;
    isPaused = false;
    graphContainer.innerHTML = '';
    nodes.forEach(createNode);
    edges.forEach(createEdge);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(ms) {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}
let mstEdges=[]
const explainDiv = document.getElementById("Explain");



async function animateMST() {
    const visited = new Set();
    mstEdges = [];
    visited.add(1);  // Start from node 1

    isReset = false;

    // Step 1: Initialize MST
    updateExplanation("Step 1: Initializing MST with the starting node. Enqueuing all the neighboring edges.");
    data.innerHTML = "Initializing MST with the starting node...";
    highlightStep(e1, e2, e3);
    
    // Visualizing the enqueue operation
    const enqueueEdges = edges.filter(edge => visited.has(edge.from) || visited.has(edge.to));
    enqueueEdges.forEach(edge => {
        edge.div.classList.add('enqueue');  // Add a class to highlight enqueued edges
    });
    
    // Show enqueued edges and their weights
    updateExplanation(`Enqueued edges: ${enqueueEdges.map(edge => `(${edge.from}, ${edge.to}) - Weight: ${edge.weight}`).join(', ')}`);
    await sleep(1000);
    unhighlightStep(e1, e2, e3);

    // Step 2: Compare edges
    while (visited.size < nodes.length && !isReset) {
        let minEdge = null;

        updateExplanation("Step 2: Enqueuing edges connected to the visited nodes. Now, comparing these edges to select the one with the smallest weight.");
        data.innerHTML = "Enqueuing edges connected to the visited nodes...";
        highlightStep(e4);
        await sleep(1000);
        unhighlightStep(e4);

        // Compare each edge connected to a visited node
        for (const edge of edges) {
            if (isReset) return;

            // Pause handling
            while (isPaused) {
                await sleep(100);
            }

            // Step 3: Compare edges
            if (
                (visited.has(edge.from) && !visited.has(edge.to)) ||
                (visited.has(edge.to) && !visited.has(edge.from))
            ) {
                data.innerHTML = `Comparing edge (${edge.from}, ${edge.to}) with weight ${edge.weight}...`;
                highlightStep(e5);
                edge.div.classList.add('comparing');
                
                // Show comparison of edges
                updateExplanation(`Comparing edge (${edge.from}, ${edge.to}) - Weight: ${edge.weight}`);
                await sleep(500);
                edge.div.classList.remove('comparing');
                unhighlightStep(e5);

                // Track the minimum edge
                if (!minEdge || edge.weight < minEdge.weight) {
                    minEdge = edge;
                }
            }
        }

        // Step 4: Add edge to MST
        if (minEdge && !isReset) {
            data.innerHTML = `Selecting edge (${minEdge.from}, ${minEdge.to}) with weight ${minEdge.weight}...`;
            highlightStep(e6);
            minEdge.div.classList.add('selected');
            mstEdges.push(minEdge);

            visited.add(minEdge.from);
            visited.add(minEdge.to);

            // Visualize the selected edge
            updateExplanation(``, minEdge);
            await sleep(1000);
            unhighlightStep(e6);
        }
    }

    // Step 5: Finalize MST
    const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);  // Total weight of MST
    data.innerHTML = `Total Weight of Mst:${totalWeight}`;
    updateExplanation(`Total weight of MST: ${totalWeight}`);
    highlightStep(e7, e8);
    await sleep(2000);
    unhighlightStep(e7, e8);
    displayComplexityAnalysis();
}

// Helper function to update the explanation in `explainDiv`
// Helper function to append the explanation in `explainDiv`
// Helper function to append new explanations to `explainDiv` with highlighting for selected edge
function updateExplanation(text, selectedEdge = null) {
    // Create a new paragraph element to display the explanation
    const newParagraph = document.createElement('p');
    newParagraph.innerText = text;  // Set the explanation text

    // If there is a selected edge, highlight it visually in the explanation
    if (selectedEdge) {
        const edgeText = document.createElement('span');
        edgeText.innerText = ` Selected Edge: (${selectedEdge.from}, ${selectedEdge.to}) with weight ${selectedEdge.weight}`;
        edgeText.style.color = 'red';  // You can change the color for highlighting

        // Append the selected edge text to the paragraph
        newParagraph.appendChild(edgeText);
    }

    // Append the new paragraph to the explainDiv without clearing the previous content
    explainDiv.appendChild(newParagraph);
}




// Highlighting helper functions
function highlightStep(...elements) {
    elements.forEach(el => el.classList.add('highlight'));
}

function unhighlightStep(...elements) {
    elements.forEach(el => el.classList.remove('highlight'));
}
/* Complexity Analysis */
function displayComplexityAnalysis() {
    const complexityDiv = document.getElementById('complexity-analysis');
    const edgesCount = edges.length;  // Total edges in the graph
    const verticesCount = nodes.length;  // Total nodes in the graph

    // Time complexity components for Prim's algorithm
    const bestCaseComplexity = `O(V^2)`; // For adjacency matrix representation
    const averageCaseComplexity = `O((V + E) log V)`; // For adjacency list + priority queue
    const worstCaseComplexity = `O((V + E) log V)`; // Same as average for dense graphs

    // Determine the graph type
    let caseType = "Average Case"; // Default case is average
    if (edgesCount <= verticesCount - 1) {
        caseType = "Best Case"; // Sparse graph
    } else if (edgesCount >= verticesCount * (verticesCount - 1) / 2) {
        caseType = "Worst Case"; // Dense graph
    }

    // Assume the total weight of the MST is calculated as `totalWeight`
    const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0); // Sum of all edge weights

    // Execution time estimate (approximation for illustration)
    const executionTime = caseType === "Best Case" 
        ? verticesCount ** 2 
        : edgesCount * Math.log2(verticesCount);

    // Creating the HTML content for complexity analysis
    const complexityContent = `
  
        <p><strong>Graph Type:</strong> ${caseType}</p>
        <p><strong>Time Complexity:</strong> ${caseType === "Best Case" ? bestCaseComplexity : averageCaseComplexity}</p>
        <p><strong>Total Weight of Minimum Spanning Tree:</strong> ${totalWeight}</p>
        <p><strong>Execution Time Estimate:</strong> ${executionTime.toFixed(2)} ms</p>
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
/* buttons */
startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    resetBtn.disabled = false;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    showarrow1();
    showarrow2();
    animateMST();
});

resetBtn.addEventListener('click', () => {
    startBtn.disabled = false;
    resetBtn.disabled = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    mstEdges = [];
    resetVisualizationExplanation();
    showarrow1();
    showarrow2();
    resetGraph();
});

pauseBtn.addEventListener('click', () => {
    isPaused = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
});

resumeBtn.addEventListener('click', () => {
    isPaused = false;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
});

resetGraph();

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
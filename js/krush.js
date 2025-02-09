const graphContainer = document.getElementById('graph-container');
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
const nodes = [
    { id: 1, x: 50, y: 50 },
    { id: 2, x: 300, y: 80 },
    { id: 3, x: 700, y: 150 },
    { id: 4, x: 200, y: 300 },
    { id: 5, x: 450, y: 250 },
    { id: 6, x: 650, y: 350 }
];

const edges = [
    { from: 1, to: 2, weight: 4 },
    { from: 1, to: 4, weight: 7 },
    { from: 2, to: 3, weight: 3 },
    { from: 2, to: 5, weight: 3 },
    { from: 3, to: 5, weight: 3 },
    { from: 4, to: 5, weight: 2 },
    { from: 4, to: 6, weight: 8 },
    { from: 5, to: 6, weight: 1 }
];

let paused = false; // To track the pause state
let pauseResolve = null; // To manage the pause state in the animation

function createNode(node) {
    const div = document.createElement('div');
    div.className = 'node';
    div.style.left = `${node.x}px`;
    div.style.top = `${node.y}px`;
    div.textContent = node.id;
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
    graphContainer.innerHTML = '';
    nodes.forEach(createNode);
    edges.forEach(createEdge);
}

function pause() {
    return new Promise(resolve => {
        pauseResolve = resolve;
    });
}
let mstEdges=[]
async function animateKruskal() {
    
    mstEdges = [];
    const sortedEdges = edges.slice().sort((a, b) => a.weight - b.weight);
    console.log(sortedEdges);
    const formattedEdges = sortedEdges.map(edge => `${edge.weight}(${edge.from}, ${edge.to})`);
    data.innerHTML=`Edges are sorted in increasing order of weight: ${formattedEdges}`;
    console.log(formattedEdges);
    const parent = {};
    nodes.forEach(node => (parent[node.id] = node.id));
    
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (x, y) => { parent[find(x)] = find(y); };
    const pauseEdgeAnimation = async () => {
        return new Promise(resolve => {
            if (!paused) {
                resolve();  // Resolve immediately if not paused
                return;
            }
            // Wait for the pause state to be cleared
            const interval = setInterval(() => {
                if (!paused) {
                    clearInterval(interval); // Stop the interval once resumed
                    resolve(); // Resume execution
                }
            }, 100);  // Check every 100ms if the pause state is cleared
        });
    };
    const sortedEdgesFormatted = sortedEdges.map(edge => `${edge.weight}(${edge.from}, ${edge.to})`);
    const explainDiv = document.getElementById("Explain");
    const expDiv = document.getElementById("Exp");
    explainDiv.innerHTML =`Kruskals algorithm using Greedy Approach`;
    expDiv.innerHTML = `<br><p>Step 1: Edges sorted in increasing order of weight:</p><p>${sortedEdgesFormatted.join(', ')}</p>`;
    console.log(sortedEdgesFormatted);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for displaying sorted edges
    for (const edge of sortedEdges) {
        
        await pauseEdgeAnimation();
        e3.classList.remove('show');
        e4.classList.remove('show');
        e5.classList.remove('show');
        e6.classList.remove('show');
        e7.classList.remove('show');
        
        // Highlight the pseudocode section equivalent to adding an edge
        if (find(edge.from) !== find(edge.to)) {
            union(edge.from, edge.to);
            mstEdges.push(edge);
            data.innerHTML=`Edge (${edge.from}, ${edge.to}) added, parent structure:${parent}`; 
            e3.classList.remove('show');
            e4.classList.toggle('show');
            e5.classList.toggle('show');
            e6.classList.remove('show');
            e7.classList.remove('show');
            // Parallelize animation with the setTimeout promise
            edge.div.classList.add('selected'); // Highlights the edge
            explainDiv.innerHTML += `<p>Edge (${edge.from}, ${edge.to}) added to the MST.</p>`;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for animation
            console.log(`Edge (${edge.from}, ${edge.to}) added, parent structure:`, parent);
        } else {
            // Skip edge and log it
            data.innerHTML=`Edge (${edge.from}, ${edge.to}) skipped (forms cycle)`
            // Add visual highlighting for the 'else' condition (ignore edge)
            e3.classList.remove('show');
            e4.classList.remove('show');
            e5.classList.remove('show');
            e6.classList.toggle('show');
            e7.classList.remove('show');
            explainDiv.innerHTML += `<p>Edge (${edge.from}, ${edge.to}) skipped (forms cycle).</p>`;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
            console.log(`Edge (${edge.from}, ${edge.to}) skipped (forms cycle)`);
        }
              
    }
    
    e3.classList.remove('show');
    e4.classList.remove('show');
    e5.classList.remove('show');
    e6.classList.remove('show');
    e7.classList.toggle('show');
    data.innerHTML="MST formed";
    const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);
    explainDiv.innerHTML += `<p><strong>Total weight of the MST:</strong> ${totalWeight}</p>`;
    displayComplexityAnalysis();
    resetBtn.disabled = false;
}
startBtn.addEventListener('click', () => {
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = true;
    
    animateKruskal();
    resetVisualizationExplanation();
    showarrow1();
    showarrow2();
});

pauseBtn.addEventListener('click', () => {
    paused = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
});

resumeBtn.addEventListener('click', () => {
    paused = false;
    resumeBtn.disabled = true;
    pauseBtn.disabled = false;
    if (pauseResolve) pauseResolve();
});

resetBtn.addEventListener('click', () => {
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    resetBtn.disabled = true;
    paused = false;
    mstEdges = [];
    resetVisualizationExplanation();
    showarrow1();
    showarrow2();
    resetGraph();
});

resetGraph();

/* complexity analysis & Visulaization Explaination */
function displayComplexityAnalysis() {
    const complexityDiv = document.getElementById('complexity-analysis');
    const edgesCount = edges.length;  // Total edges in the graph
    const verticesCount = nodes.length;  // Total nodes in the graph
    
    // Time complexity components
    const bestCaseComplexity = `O(E log E)`;
    const averageCaseComplexity = `O(E log E + E α(V))`;
    const worstCaseComplexity = `O(E log E + E α(V))`;

    // Check the graph type (sparse, average, dense)
    let caseType = "Average Case";  // Default case is average
    if (edgesCount < verticesCount) {
        caseType = "Best Case";  // Sparse graph
    } else if (edgesCount >= verticesCount * (verticesCount - 1) / 2) {
        caseType = "Worst Case";  // Dense graph
    }

    // Assume total weight is available as `totalWeight`
    const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);  // Sum of all edge weights

    // Creating the HTML content for complexity analysis
    const complexityContent = `
        
        <p>Case:${caseType}</p>
        <p>Time Complexity: ${caseType === "Best Case" ? bestCaseComplexity : averageCaseComplexity}</p>
        <p>Total Weight of Minimum Spanning Tree: ${totalWeight}</p>
        <p>Execution Time: ${edgesCount * Math.log(edgesCount) + edgesCount * Math.log(verticesCount)}</p>
       
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
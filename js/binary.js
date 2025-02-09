/* toggle */
function toggleMenu() {
  var menu = document.querySelector('.menu-1');
  var arrow = document.querySelector('#leftarrow');
  var menu2 = document.querySelector('.prompt');
  var menu3 = document.querySelector('.menu-2');
  var menu_3 = document.querySelector('.menu-3');
  menu.classList.toggle('show');
  menu3.classList.remove('going');
  menu2.classList.remove('show1');
  menu_3.classList.remove('going');
  arrow.classList.toggle('rotate');
}

function toggle() {
  var menu = document.querySelector('.prompt');
  var menu_2 = document.querySelector('.menu-2');
  var menu_3 = document.querySelector('.menu-3');
  menu.classList.toggle('show1');
  menu_2.classList.toggle('going');
  menu_3.classList.toggle('going');
}

function toggleMenu2() {
  var menu = document.querySelector('.menu-2');
  var extramenu = document.querySelector('.menu-2 .e1');
  var arrow = document.querySelector('#rightarrow1');
  menu.classList.toggle('show');
  extramenu.classList.toggle('flow');
  arrow.classList.toggle('rotate');
}

function toggleMenu3() {
  var menu = document.querySelector('.menu-3');
  var extramenu = document.querySelector('.code');
  var arrow = document.querySelector('#rightarrow2');
  menu.classList.toggle('show');
  extramenu.classList.toggle('flow');
  arrow.classList.toggle('rotate');
}

/* arrow animation */

function showarrow1() {
  var arrow1 = document.querySelector('.arrow1 i');
  var menu1 = document.querySelector('.menu-2');
  
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
  var menu2 = document.querySelector('.menu-3');
  var menu2Info = document.querySelector('.code');

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


window.addEventListener('resize', showarrow2);
/* playback speed */
let speed = 2000; // Default speed
const speedInput = document.getElementById("speed");

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
/* binary.js */
let key = parseInt(document.querySelector('.input-key').value); 
let searchbtn = document.querySelector('.menu-1 .menu1-ul .search');
let restartbtn = document.querySelector('.menu-1 .menu1-ul .restart');

// Update the input
function updateValue(value) {
  key = value || document.querySelector('.input-key').getAttribute('value');
  console.log(key);
}
function update(value)
{
  key=value;
}

document.addEventListener('DOMContentLoaded', function() {
  let predefinedArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  let array = [];
  let paused = false;
  let resolvePause;
  let isSearching = false;
  

  // Create the initial array on page load
  function createArray() {
    const arrayContainer = document.getElementById('array');
    arrayContainer.innerHTML = ''; // Clear the container
    array = []; // Reset the array

    // Limit predefinedArray to a maximum of 10 integers
    const limitedArray = predefinedArray.slice(0, 10);

    limitedArray.forEach((item, index) => {
        const div = document.createElement('div');
        div.textContent = item;
        div.className = 'array-item';

        const indexSpan = document.createElement('span');
        indexSpan.textContent = index;
        div.appendChild(indexSpan);

        array.push(div);
        arrayContainer.appendChild(div);
    });
}


  createArray(); // Initial array creation

  // Sleep function for delays
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Pause functionality
  function checkPaused() {
    if (paused) {
      return new Promise(resolve => {
        resolvePause = resolve;
      });
    }
    return Promise.resolve();
  }

  function restartSearch() {
   
    paused = false;
    isSearching = false; 
    resolvePause && resolvePause(); 

    
    resetVisualizationExplanation(); 

  
    createArray(); 


    const e1Element = document.querySelector('.menu-2 .e1');
    if (e1Element) {
        e1Element.innerHTML = "";
    } else {
        console.warn("Element '.menu-2 .e1' not found.");
    }

   
    const codeDivs = document.querySelectorAll('.code div');
    if (codeDivs.length > 0) {
        codeDivs.forEach(div => div.classList.remove('show'));
    } else {
        console.warn("No '.code div' elements found.");
    }


    console.log("Binary search visualization reset.");
}


  async function startBinarySearch() {
    if (isSearching) return; 
    isSearching = true;
  
    const arrayItems = document.querySelectorAll('.array-item');
    const key = parseInt(document.querySelector('.input-key').value, 10);
    const startTime = Date.now();
    let iterations = 0;
    let left = 0;
    let right = arrayItems.length - 1;
  
    // Run binary search with iteration and execution tracking
    await binarySearch(arrayItems, key, left, right, iterations, startTime);
  
    isSearching = false;
  }
  
  // Binary search algorithm
  async function binarySearch(array, key, left, right) {
    console.log("KEY :",key);
    console.log('Starting binary search');
    const startTime = performance.now();
    let iterations = 0;  // Initialize iteration counter if needed
    const n = array.length;  // Set n to the array's length
    resetVisualizationExplanation();
    while (left <= right) {
        console.log(`Left: ${left}, Right: ${right}`);

        await checkPaused(); // Check for pause

        // Visualize the search process
        document.querySelector('.e3').classList.add('show');
        document.querySelector('.e4').classList.add('show');
        document.querySelector('.e5').classList.remove('show');
        document.querySelector('.e6').classList.remove('show');
        document.querySelector('.e7').classList.remove('show');

        let mid = Math.floor((left + right) / 2);
        console.log(`Mid index: ${mid}`);

        if (array[mid] && array[left] && array[right]) {
            array[mid].style.backgroundColor = "yellow";
            array[left].style.backgroundColor = "blue";
            array[right].style.backgroundColor = "red";
        } else {
            console.error("Index out of bounds or element is undefined", { mid, left, right, array });
            return; // Exit the function early if any element is undefined
        }
        let midValue = parseInt(array[mid].firstChild.textContent, 10);
        key=parseInt(key);
        console.log(array);
        document.querySelector('.menu-2 .e1').innerHTML = "Mid value is: " + midValue;
        console.log(`Mid value: ${midValue}`);
        await sleep(speed);
        console.log(midValue === key);
        document.querySelector('.menu-2 .e1').innerHTML="if "+midValue+" == "+key+" equals it goes to the condition it returns the index of the key element"
        updateVisualizationExplanation(left, right, mid, key, array, midValue === key);
        if (midValue === key) {
            await checkPaused(); // Ensure pause state is checked
            array[mid].style.animation = 'highlights 1s forwards';
            document.querySelector('.e5').classList.add('show');
            document.querySelector('.e3').classList.remove('show');
            document.querySelector('.e4').classList.remove('show');
            document.querySelector('.e6').classList.remove('show');
            document.querySelector('.e7').classList.remove('show');
            document.querySelector('.e8').classList.remove('show');
            document.querySelector('.menu-2 .e1').innerHTML = "Key element found at index: " + mid;
            console.log(`Key found at index: ${mid}`);
            const executionTime = performance.now() - startTime;
            calculateComplexity(iterations, n, executionTime, true);
            return;
        } else if (midValue < key) {
            await checkPaused(); // Ensure pause state is checked
            document.querySelector('.e5').classList.remove('show');
            document.querySelector('.e3').classList.remove('show');
            document.querySelector('.e4').classList.remove('show');
            document.querySelector('.e7').classList.remove('show');
            document.querySelector('.e6').classList.add('show');
            for (let i = left; i <= mid; i++) {
                await checkPaused(); // Ensure pause state is checked
                await sleep(speed);
                v=parseInt(array[i].innerText);
                document.querySelector('.menu-2 .e1').innerHTML="mid value "+midValue+" is less than key value "+key+" so we remove left half element "+v;
                if (array[i]) {
                    array[i].style.animation = 'fadeOut 1s forwards';
                }
            }
            left = mid + 1;
            console.log(`Updating left to: ${left}`);
        } else {
            await checkPaused(); // Ensure pause state is checked
            document.querySelector('.e3').classList.remove('show');
            document.querySelector('.e4').classList.remove('show');
            document.querySelector('.e5').classList.remove('show');
            document.querySelector('.e6').classList.remove('show');
            document.querySelector('.e7').classList.add('show');
            for (let i = right; i >= mid; i--) {
                await checkPaused(); // Ensure pause state is checked
                await sleep(speed);
                v=parseInt(array[i].innerText);
                document.querySelector('.menu-2 .e1').innerHTML="mid value "+midValue+" is less than key value "+key+" so we remove right half element "+v;
                if (array[i]) {
                    array[i].style.animation = 'fadeOut 1s forwards';
                }
            }
            right = mid - 1;
            console.log(`Updating right to: ${right}`);
        }

        await checkPaused(); // Ensure pause state is checked
        await sleep(speed); // Delay for visualization

        // Reset other elements
        for (let i = 0; i < array.length; i++) {
            if (i !== mid && (i < left || i > right)) {
                await checkPaused(); // Ensure pause state is checked
                if (array[i]) {
                    array[i].style.backgroundColor = 'lightblue';
                }
            }
        }

        await checkPaused(); // Ensure pause state is checked
        await sleep(speed); // Delay for visualization

        // Reset animation and remove unnecessary elements for the next iteration
        for (let i = 0; i < array.length; i++) {
            if (i !== mid && (i < left || i > right)) {
                await checkPaused(); // Ensure pause state is checked
                if (array[i]) {
                    array[i].style.animation = '';
                    array[i].remove();
                }
            }
        }
    }
    document.querySelector('.e3').classList.remove('show');
    document.querySelector('.e4').classList.remove('show');
    document.querySelector('.e5').classList.remove('show');
    document.querySelector('.e6').classList.remove('show');
    document.querySelector('.e7').classList.remove('show');
    document.querySelector('.e8').classList.add('show');
    const executionTime = performance.now() - startTime;
    calculateComplexity(iterations, n, executionTime, false);
    document.querySelector('.menu-2 .e1').innerHTML = "Key not found in the array.";
    console.log('Key not found');

}

  

  // Pause functionality
  function togglePause() {
    paused = !paused;
    if (!paused) {
      resolvePause && resolvePause(); // Resume the search
    }
  }
  
function toggleResume()
{
  togglePause();
}
  // Event Listeners
  document.querySelector('.btn1-start').addEventListener('click', startBinarySearch);
  document.querySelector('.btn1-re-start').addEventListener('click', restartSearch);
  document.querySelector('.btn2-pause').addEventListener('click', togglePause);
  document.querySelector('.btn2-resume').addEventListener('click', toggleResume);
});

//custom search
function sortAsc(arr) {
    
  return arr.slice().sort((a, b) => a - b);
}
function initializeSearch1() {
  const arrayValuesInput = document.querySelector('#array-input').value;
  let array1 = arrayValuesInput.split(',').map(value => parseInt(value.trim(), 10)).slice(0, 10);
  let array2 = sortAsc(array1);

  currentIndex1 = 0;
  keyPosition1 = 0;
  console.log(array2);

  const container1 = document.getElementById('array');
  container1.innerHTML = ''; 

  array2.forEach((item, index) => {
      let div = document.createElement('div');
      div.textContent = item;
      div.className = 'array-item';
      
      let indexSpan = document.createElement('span');
      indexSpan.textContent = index;
      div.appendChild(indexSpan);
      
      container1.appendChild(div);
  });

  const key1 = document.querySelector('.key');
  updateValue(document.querySelector('.input-key').value);
  console.log(key1);
}
// Complexity Analysis Function
function calculateComplexity(iterations, n, executionTime, found) {
  let timeComplexity;

  if (iterations === 1 && found) {
      timeComplexity = "Best Case: O(1)";
  } else if (iterations <= Math.log2(n)) {
      timeComplexity = `Average Case: O(log n)`;
  } else {
      timeComplexity = `Worst Case: O(log n)`;
  }

  const spaceComplexity = "O(1)"; // Constant extra space used

  const complexityAnalysis = `
      <p><strong>Time Complexity:</strong> ${timeComplexity}</p>
      <p><strong>Space Complexity:</strong> ${spaceComplexity}</p>
      <p><strong>Array Size (n):</strong> ${n}</p>
      <p><strong>Execution Time:</strong> ${executionTime} ms</p>
  `;
  document.getElementById('complexity-analysis').innerHTML = complexityAnalysis;
}
function updateVisualizationExplanation(left, right, mid, searchValue, elements, found) {
  let midValue = parseInt(elements[mid].firstChild.textContent);
  let leftValue = parseInt(elements[left].firstChild.textContent);
  let rightValue = parseInt(elements[right].firstChild.textContent);

  // Highlight the current left, mid, and right elements
  elements.forEach((el, index) => {
      el.classList.remove('highlight-left', 'highlight-mid', 'highlight-right');

  });

  // Determine the search direction
  const searchDirection = found
      ? '<span style="color: green;">Match found!</span>'
      : midValue < searchValue
      ? "<span style='color: blue;'>Searching in the right half.</span>"
      : "<span style='color: red;'>Searching in the left half.</span>";

  // Generate explanation for the current step
  const explanationStep = `
      <li>
          <strong>Current Elements:</strong> 
          <ul>
              <li>Left (index: <strong>${left}</strong>, value: <strong>${leftValue}</strong>)</li>
              <li>Mid (index: <strong>${mid}</strong>, value: <strong>${midValue}</strong>)</li>
              <li>Right (index: <strong>${right}</strong>, value: <strong>${rightValue}</strong>)</li>
          </ul>
          <strong>Comparison:</strong> Search value <strong>${searchValue}</strong> with middle element. ${searchDirection}
      </li>`;

  // Add final conclusion if applicable
  const conclusion = found
      ? `<li><span style="color: green;">Element found at index <strong>${mid}</strong>.</span></li>`
      : left > right
      ? `<li><span style="color: red;">Element not found in the array.</span></li>`
      : '';

  // Update the Explain element by appending the new step
  const explainElement = document.getElementById('Explain');
  explainElement.innerHTML += `<ul>${explanationStep}${conclusion}</ul>`;
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
  document.getElementById('explanation').innerHTML = `
      <div class="article-title text">
          <h1>Visualization Explanation</h1>
          <hr><br>
          <div id="Explain">
                  
          </div>
      </div>`;
}
 
/*
restartbtn.addEventListener('click', function() {
    // Reset array elements to initial state
    array.forEach(element => {
        element.style.backgroundColor = 'lightblue';
        element.style.animation = '';
    });

    // Restart the binary search
    initializeSearch1();
});*/



/************************************************* */



function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  if (submenu.style.display === 'block') {
      submenu.style.display = 'none';
  } else {
      submenu.style.display = 'block';
  }
}



document.querySelectorAll('.sidebar a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScrollTo(target, 1000); 
  });
});

/* full screen */
function fullscreen() {
  const theoryContainer = document.getElementById('Theory');
  const controls = document.querySelector('.controls');
  
  theoryContainer.classList.add('fullscreen-active');

  // Move controls into the Theory container
  theoryContainer.appendChild(controls);
}

function normalscreen() {
  const theoryContainer = document.getElementById('Theory');
  const controls = document.querySelector('.controls');
  
  theoryContainer.classList.remove('fullscreen-active');

  // Move controls back to the original location
  document.querySelector('.content').appendChild(controls);
}
/* full screen */
function fullscreen() {
  const theoryContainer = document.getElementById('Visualization');
  const controls = document.querySelector('.prompt');
  
  theoryContainer.classList.add('fullscreen-active');

  // Move controls into the Theory container
  theoryContainer.appendChild(controls);
}

function normalscreen() {
  const theoryContainer = document.getElementById('Visualization');
  const controls = document.querySelector('.controls');
  
  theoryContainer.classList.remove('fullscreen-active');

  // Move controls back to the original location
  document.querySelector('.content').appendChild(controls);
}

/*  buttons to start */
document.querySelectorAll('.btn1-start').forEach(function(startButton) {
  startButton.addEventListener('click', function() {
      console.log("Start button clicked");

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
      console.log("Start button clicked");

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

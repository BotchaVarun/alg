let paused = false;
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const sortButton = document.getElementById('sortButton');
    const sortDescendingButton = document.getElementById('sortDescendingButton');
    const pauseButton = document.getElementById('pauseButton');
    const playButton = document.getElementById('playButton');
    const restartButton = document.getElementById('restartButton');
    const arrayInput = document.getElementById('array-input');
    var e1 = document.querySelector('.e1');
    var e2 = document.querySelector('.e2');
    var e3 = document.querySelector('.e3');
    var e4 = document.querySelector('.e4');
    var e5 = document.querySelector('.e5');    
    var e6 = document.querySelector('.e6');    
    var e7 = document.querySelector('.e7');    
    var e8 = document.querySelector('.e8');    
    var data = document.querySelector('.data');    
    let numbers = [];
  
    let resolvePause;
    let descending = false;
    let sortingCanceled = false;
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
    // Define initializeArray in the global scope
    window.initializeArray = function () {
        const inputValues = arrayInput.value
            .split(',')
            .map(Number)
            .filter(val => !isNaN(val))
            .slice(0, 10); // Limit to 10 values
        resetComplexityAndExplanation();
        if (inputValues.length > 1) {
            // Clear current numbers and container
            container.innerHTML = '';
            numbers = [];
            e2.classList.add('show');
            e3.classList.remove('show');
            e4.classList.remove('show');
            e5.classList.remove('show');
            e6.classList.remove('show');
            e7.classList.remove('show');
            e8.classList.remove('show');
            // Assuming 'data' is a reference to an HTML element where you want to display the length
            data.innerHTML = `Array length is ${inputValues.length}`;
        
            // Create number elements based on user input
            inputValues.forEach((value, i) => {
                const numContainer = document.createElement('div');
                numContainer.classList.add('number');
                const numValue = document.createElement('div');
                numValue.textContent = value;
                numValue.dataset.value = value;
                numValue.classList.add('num-value');
                numContainer.appendChild(numValue);
        
                const numIndex = document.createElement('div');
                numIndex.textContent = i;
                numIndex.classList.add('index');
        
                const wrapper = document.createElement('div');
                wrapper.classList.add('wrapper');
                wrapper.appendChild(numContainer);
                wrapper.appendChild(numIndex);
        
                numbers.push(wrapper);
                container.appendChild(wrapper);
            });
        } else {
            // If input is empty or invalid, generate random numbers
            console.log("Executed");
            createNumbers();
        }
    };

    function createNumbers() {
        container.innerHTML = '';
        numbers = [];
        for (let i = 0; i < 10; i++) {
            const numContainer = document.createElement('div');
            numContainer.classList.add('number');
            const value = Math.floor(Math.random() * 100);
            const numValue = document.createElement('div');
            numValue.textContent = value;
            numValue.dataset.value = value;
            numValue.classList.add('num-value');
            numContainer.appendChild(numValue);
            e2.classList.add('show');
            e3.classList.remove('show');
            e4.classList.remove('show');
            e5.classList.remove('show');
            e6.classList.remove('show');
            e7.classList.remove('show');
            e8.classList.remove('show');
            data.innerHTML = `Array length is 10`;
            const numIndex = document.createElement('div');
            numIndex.textContent = i;
            numIndex.classList.add('index');

            const wrapper = document.createElement('div');
            wrapper.classList.add('wrapper');
            wrapper.appendChild(numContainer);
            wrapper.appendChild(numIndex);

            numbers.push(wrapper);
            container.appendChild(wrapper);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function checkPaused() {
        if (paused) {
            return new Promise(resolve => {
                resolvePause = resolve;
            });
        }
        return Promise.resolve();
    }

/* visualization explaination */
function calculateComplexity(iterations, n, executionTime, found) {
    let timeComplexity;
  
    // Determine the time complexity based on the number of iterations
    if (iterations === 1 && found) {
        timeComplexity = "Best Case: O(1)";
    } else if (iterations <= Math.log2(n)) {
        timeComplexity = `Average Case: O(log n)`;
    } else {
        timeComplexity = `Worst Case: O(n^2)`;
    }
  
    // Space complexity for Bubble Sort is O(1) because it uses constant extra space
    const spaceComplexity = "O(1)"; // Constant extra space used
  
    // Create the complexity analysis string
    const complexityAnalysis = `
        <p><strong>Time Complexity:</strong> ${timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${spaceComplexity}</p>
        <p><strong>Array Size (n):</strong> ${n}</p>
        <p><strong>Execution Time:</strong> ${executionTime} ms</p>
    `;
  
    // Display the complexity analysis in the 'complexity-analysis' element
    document.getElementById('complexity-analysis').innerHTML = complexityAnalysis;
  }
  
  function updateBubbleSortExplanation(i, j, currentValue, nextValue, swapped, numbers, speed) {
    // Get the values of the elements being compared
    let element1 = parseInt(numbers[j].firstChild.firstChild.dataset.value);
    let element2 = parseInt(numbers[j + 1].firstChild.firstChild.dataset.value);

    // Set the comparison explanation
    let comparisonExplanation = `Comparing A[${j}] = ${currentValue} and A[${j + 1}] = ${nextValue}`;

    // Determine whether a swap happens
    let swapExplanation = swapped
        ? `Swapping A[${j}] and A[${j + 1}]`
        : `No swap, as A[${j}] <= A[${j + 1}]`;

    // Update the visualization explanation with the comparison and swap information
    const explanationStep = `
        <li>
            <strong>Iteration ${i + 1}, Pass ${j + 1}:</strong>
            <ul>
                <li>Comparing: ${comparisonExplanation}</li>
                <li>Result: ${swapExplanation}</li>
                <li>Array state: [${numbers.map(n => parseInt(n.firstChild.firstChild.dataset.value)).join(', ')}]</li>
            </ul>
        </li>
    `;

    // Append the current step to the explanation
    const explainElement = document.getElementById('Explain');
    explainElement.innerHTML += `<ul>${explanationStep}</ul>`;

    // Update the execution time or any relevant information (optional)
    const executionTime = (i * speed); // Example: execution time based on loop iterations and speed

    // Calculate and display the complexity
    calculateComplexity(i + 1, numbers.length, executionTime, false);

    // Update time complexity explanation (Bubble Sort has O(n^2) complexity in worst case)
    const timeComplexityExplanation = `
        <p>Time Complexity: O(n^2) for each pass. In the worst case, we have to compare every element.</p>
    `;

}
function resetComplexityAndExplanation() {
    // Clear the content of the complexity section
    const complexityElement = document.getElementById('complexity-analysis');
    if (complexityElement) {
        complexityElement.innerHTML = '';  // Clear the current complexity analysis
        console.log('Complexity reset');
    } else {
        console.log('Error: #complexity-analysis element not found');
    }

    // Clear the content of the explanation section
    const explanationElement = document.getElementById('Explain');
    if (explanationElement) {
        explanationElement.innerHTML = '';  // Clear the current explanation steps
        console.log('Explanation reset');
    } else {
        console.log('Error: #Explain element not found');
    }
}
    
    
    async function bubbleSort() {
        for (let i = 0; i < numbers.length - 1; i++) {
            let swapped = false; // Initialize swapped to false at the start of each pass
    
            for (let j = 0; j < numbers.length - i - 1; j++) {
                if (sortingCanceled) return;
    
                let currentValue = parseInt(numbers[j].firstChild.firstChild.dataset.value);
                let nextValue = parseInt(numbers[j + 1].firstChild.firstChild.dataset.value);
    
                console.log('Comparing:', currentValue, nextValue);
    
                // Log swapped value before passing to updateBubbleSortExplanation
                console.log(`Before updateBubbleSortExplanation: swapped = ${swapped}`);
                
                // Highlight elements being compared
                numbers[j].firstChild.style.transform = 'translateY(-25px)';
                numbers[j + 1].firstChild.style.transform = 'translateY(-25px)';
                numbers[j].firstChild.style.backgroundColor = '#e67e22';
                numbers[j + 1].firstChild.style.backgroundColor = '#e74c3c';
    
                // Update explanation with swapped status
  
                
                await sleep(speed);
                await checkPaused();
    
                // Determine condition based on the sorting order (ascending or descending)
                var condition = descending ? "less" : "greater";
    
                // Swap elements based on the sorting direction
                if ((descending && currentValue < nextValue) || (!descending && currentValue > nextValue)) {
                    swapped = true; // Set swapped to true if elements are swapped
                    console.log('Swapping:', currentValue, nextValue);
                    await checkPaused();
    
                    data.innerHTML = `current value is ${condition} than next value, Swapping: ${currentValue} ${nextValue}`;
    
                    // Handle element visibility updates
                    if (e2 && e3 && e4 && e5 && e6 && e7 && e8) {
                        e2.classList.remove('show');
                        e3.classList.remove('show');
                        e4.classList.add('show');
                        e5.classList.add('show');
                        e6.classList.add('show');
                        e7.classList.remove('show');
                        e8.classList.remove('show');
                    } else {
                        console.error('One or more elements are missing.');
                    }
    
                    // Perform the swap
                    container.insertBefore(numbers[j + 1], numbers[j]);
                    [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]]; // Swap in the array
                    updateIndexes(); // Update indices after swapping
                } else {
                    await checkPaused();
                    console.log('Not Swapping:', currentValue, nextValue);
                    data.innerHTML = `condition fails, no Swapping: ${currentValue} ${nextValue}`;
    
                    // Handle element visibility updates
                    if (e2 && e3 && e4 && e5 && e6 && e7 && e8) {
                        e2.classList.remove('show');
                        e3.classList.remove('show');
                        e4.classList.remove('show');
                        e5.classList.remove('show');
                        e6.classList.remove('show');
                        e7.classList.add('show');
                        e8.classList.add('show');
                    } else {
                        console.error('One or more elements are missing.');
                    }
                }
                updateBubbleSortExplanation(i, j, currentValue, nextValue, swapped, numbers, speed);
                // Reset styles after comparison
                numbers[j].firstChild.style.transform = 'translateY(0)';
                numbers[j + 1].firstChild.style.transform = 'translateY(0)';
                numbers[j].firstChild.style.backgroundColor = '#3498db';
                numbers[j + 1].firstChild.style.backgroundColor = '#3498db';
            }
    
            // Mark the end of the sorted section
            numbers[numbers.length - i - 1].firstChild.style.backgroundColor = '#2ecc71';
        }
    
        // Final color for the first element
        numbers[0].firstChild.style.backgroundColor = '#2ecc71';
        const endTime = performance.now(); // End the timer
        executionTime = endTime - startTime; // Calculate the execution time
    
        // Now call calculateComplexity with the executionTime
        calculateComplexity(n, executionTime);
    }
    
    

    function updateIndexes() {
        numbers.forEach((wrapper, index) => {
            wrapper.lastChild.textContent = index;
        });
    }

    sortButton.addEventListener('click', () => {
        resetComplexityAndExplanation();
        descending = false;
        sortingCanceled = false;
        sortButton.disabled = true;
        sortDescendingButton.disabled = true;
        pauseButton.disabled = false;
        playButton.disabled = true;
        bubbleSort().then(() => {
            sortButton.disabled = false;
            sortDescendingButton.disabled = false;
            pauseButton.disabled = true;
            playButton.disabled = true;
        });
    });

    sortDescendingButton.addEventListener('click', () => {
        resetComplexityAndExplanation();
        descending = true;
        sortingCanceled = false;
        sortButton.disabled = true;
        sortDescendingButton.disabled = true;
        pauseButton.disabled = false;
        playButton.disabled = true;
        bubbleSort().then(() => {
            sortButton.disabled = false;
            sortDescendingButton.disabled = false;
            pauseButton.disabled = true;
            playButton.disabled = true;
        });
    });

    pauseButton.addEventListener('click', () => {
        paused = true;
        pauseButton.disabled = true;
        playButton.disabled = false;
    });

    playButton.addEventListener('click', () => {
        paused = false;
        resolvePause();
        pauseButton.disabled = false;
        playButton.disabled = true;
    });

    restartButton.addEventListener('click', () => {
        sortingCanceled = true;
        initializeArray();  // Initialize with user input or default array
        resetComplexityAndExplanation();
        sortButton.disabled = false;
        sortDescendingButton.disabled = false;
        pauseButton.disabled = true;
        playButton.disabled = true;
    });

    createNumbers(); // Create the default numbers initially
});


/* arrow animation */

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


window.addEventListener('resize', showarrow2);



/*  buttons to start */
document.querySelectorAll('.btn1-startasc').forEach(function(startButtonAsc) {
    startButtonAsc.addEventListener('click', function() {
        console.log("Start Ascending button clicked");

        document.querySelectorAll('.btn1-re-start').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        startButtonAsc.classList.add('none'); // Hide the Start Ascending button
        
        document.querySelectorAll('.btn1-startdsc').forEach(function(startButtonDsc) {
            startButtonDsc.classList.add('none'); // Hide the Start Descending button
        });

        console.log("Start Ascending and Start Descending buttons hidden");
    });
});

document.querySelectorAll('.btn1-startdsc').forEach(function(startButtonDsc) {
    startButtonDsc.addEventListener('click', function() {
        console.log("Start Descending button clicked");

        document.querySelectorAll('.btn1-re-start').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        startButtonDsc.classList.add('none'); // Hide the Start Descending button
        
        document.querySelectorAll('.btn1-startasc').forEach(function(startButtonAsc) {
            startButtonAsc.classList.add('none'); // Hide the Start Ascending button
        });

        console.log("Start Descending and Start Ascending buttons hidden");
    });
});
document.querySelectorAll('.btn1-re-start').forEach(function(startButton) {
    startButton.addEventListener('click', function() {
        console.log("Start button clicked");
  
        document.querySelectorAll('.btn1-startasc').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        document.querySelectorAll('.btn1-startdsc').forEach(function(restartButton) {
            restartButton.classList.remove('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
        });
        document.querySelectorAll('.btn2-resume').forEach(function(restartButton) {
            restartButton.classList.add('none'); // Show the Re-Start button
            console.log("Re-Start button shown");
            paused = false;
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
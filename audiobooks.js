


// Your existing audiobook-related code
// const spotifyAuth = require('./spotifyAuth.js');

// Use spotifyAuth functions where necessary
// For example, when you need to refresh the token:
// spotifyAuth.refreshAccessToken(yourStoredRefreshToken);


// Array to store audiobook embed links
let audiobooks = [];


const fs = require('fs');
const path = require('path');
// Get the button that opens the modal
const btn = document.getElementById("manage-audiobooks-btn");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close-btn")[0];

function loadAudiobooks() {
    const audiobooksPath = path.join(__dirname, 'audiobooks.json');
    fs.readFile(audiobooksPath, (err, data) => {
        if (err) {
            console.error('Error reading audiobooks:', err);
        } else {
            audiobooks = JSON.parse(data);
            console.log('Loaded audiobooks:', audiobooks);
            displayAudiobooks();
        }
    });
}



function saveAudiobooks(audiobooks) {
    const audiobooksPath = path.join(__dirname, 'audiobooks.json');
    try {
        fs.writeFileSync(audiobooksPath, JSON.stringify(audiobooks, null, 2));
        console.log('Audiobooks have been updated.');
    } catch (err) {
        console.error('Error saving audiobooks:', err);
    }
}



// Function to add a new audiobook
function addAudiobook(embedLink) {
    if (audiobooks.length < 3) {
        audiobooks.push(embedLink);
        displayAudiobooks();
        saveAudiobooks(audiobooks); // Call save function after adding the new audiobook
    } else {
        console.log("Maximum of 3 audiobooks reached.");
    }
}


// Function to display audiobooks
function displayAudiobooks() {
    // Clear existing audiobooks
    document.getElementById("column-3-cell-3-col-1-cell-1").innerHTML = '';
    document.getElementById("column-3-cell-3-col-1-cell-2").innerHTML = '';
    document.getElementById("column-3-cell-3-col-2-cell-1").innerHTML = '';

    // Loop through the audiobooks array and display each audiobook
    audiobooks.forEach((embedLink, index) => {
        const cellId = `column-3-cell-3-col-${Math.floor(index / 2) + 1}-cell-${index % 2 + 1}`;
        document.getElementById(cellId).innerHTML = embedLink;
    });
}



// Function to update the list of audiobooks in the modal
function updateAudiobookList() {
    const list = document.getElementById('audiobook-list');
    list.innerHTML = ''; // Clear the current list

    audiobooks.forEach((audiobook, index) => {
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'audiobook-item'; // Added class for styling

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'audiobook-' + index;
        checkbox.className = 'audiobook-checkbox';

        // Create label
        const label = document.createElement('label');
        label.htmlFor = 'audiobook-' + index;
        label.textContent = `Audiobook ${index + 1}: `;

        // Append checkbox and label to list item
        listItem.appendChild(checkbox);
        // listItem.appendChild(label);

        // Create iframe element from the embedLink
        // Since the embedLink is a string containing the iframe HTML, we can use it directly
        listItem.innerHTML += audiobook; // Append the iframe HTML to the list item

        // Append list item to list
        list.appendChild(listItem);
    });

    // Add or remove the text area and "Add Audiobook" button based on the number of audiobooks
    toggleAddAudiobookArea(audiobooks.length < 3);
}


// Function to toggle the add audiobook area
function toggleAddAudiobookArea(show) {
    const addArea = document.getElementById('add-audiobook-area');
    if (show) {
        addArea.style.display = 'block';
    } else {
        addArea.style.display = 'none';
    }
}

// Function to handle "Remove Selected" button click
function removeSelectedAudiobooks() {
    const checkboxes = document.querySelectorAll('.audiobook-checkbox');
    let removed = false; // Flag to check if any audiobook was removed

    // Iterate backwards since we'll be modifying the array
    for (let i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            audiobooks.splice(i, 1);
            removed = true; // Set the flag to true as we've removed an audiobook
        }
    }

    if (removed) {
        updateAudiobookList(); // Update the list in the modal
        displayAudiobooks();   // Update the audiobook display in the HTML
        saveAudiobooks(audiobooks); // Save the updated array to the file
    }
}





/***************************************************/
/**                                               **/
/**             AUDIOBOOK MANAGER                 **/
/**                                               **/
/***************************************************/
// Get the modal
const audiobookModal = document.getElementById("audiobook-manage-modal");


// When the user clicks the button, open the modal
btn.onclick = function() {
    audiobookModal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    audiobookModal.style.display = "none";
}


// Load audiobooks when the app starts
loadAudiobooks();

// Set up event listeners for the modal
document.getElementById('manage-audiobooks-btn').addEventListener('click', function() {
    audiobookModal.style.display = "block";
    updateAudiobookList(); // Update the list whenever the modal is opened
});

document.getElementsByClassName("close-btn")[0].onclick = function() {
    audiobookModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === audiobookModal) {
        audiobookModal.style.display = "none";
    }
}

document.getElementById('add-audiobook-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const embedLink = document.getElementById('audiobook-link-input').value;
    if (embedLink) {
        addAudiobook(embedLink);
        document.getElementById('audiobook-link-input').value = ''; // Clear the input field
        updateAudiobookList();
    } else {
        console.log('No embed link provided.');
    }
});

// Add event listener for the "Remove Selected" button
document.getElementById('remove-selected-btn').addEventListener('click', removeSelectedAudiobooks);

document.getElementById('spotify-login-btn').addEventListener('click', () => {
    window.electronAPI.openAuthWindow();
});

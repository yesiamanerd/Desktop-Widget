


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


async function searchForAudiobook(author, title) {
    const accessToken = await localStorage.getItem('spotifyAccessToken'); // Retrieve the access token

    // Build the query based on the provided author and/or title
    let query = '';
    if (author) query += `author:${encodeURIComponent(author)}`;
    if (author && title) query += ' ';
    if (title) query += `name:${encodeURIComponent(title)}`;

    // Append the type audiobook to the search query
    query += `&type=audiobook`;

    const searchUrl = `https://api.spotify.com/v1/search?q=${query}&market=US&limit=20`;

    const searchOptions = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    };

    try {
        console.log(searchUrl);
        const response = await fetch(searchUrl, searchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        // Assuming audiobooks are what you want and available in the response
        displaySearchResults(data.audiobooks.items);
    } catch (error) {
        console.error('Error fetching search results:', error);
        // Handle errors, such as by displaying a message to the user
    }
}

function displaySearchResults(items) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!items || items.length === 0) {
        resultsContainer.textContent = 'No audiobooks found.';
        resultsContainer.style.display = 'block';
        return;
    }

    items.forEach(item => {
        const button = document.createElement('button');
        button.textContent = `${item.name} by ${item.authors.map(author => author.name).join(', ')}`;
        button.classList.add('manage-audiobooks-btn');
        // Create an img element for the cover
        const img = document.createElement('img');
        img.src = item.images[0].url; // Assuming the first image is the cover thumbnail
        img.alt = `Cover of ${item.name}`;
        img.style.position = 'absolute';
        img.style.left = '10px'; // Adjust as needed
        img.style.top = '50%';
        img.style.transform = 'translateY(-50%)';
        img.style.width = '60px'; // Adjust as needed
        img.style.height = '60px'; // Adjust as needed
        img.style.paddingLeft = '20px';
        button.appendChild(img);
        button.addEventListener('click', () => {
            selectAudiobook(item);
        });
        resultsContainer.appendChild(button);
    });
    resultsContainer.style.display = 'block';
    resultsContainer.style.backgroundColor = '#00007f';
    resultsContainer.style.border = '2px solid #ffcc00';
    resultsContainer.style.padding = '40px';
    resultsContainer.style.borderRadius = '10px';

}


function selectAudiobook(item) {
    // Implement functionality to handle audiobook selection
    console.log('Selected audiobook:', item.name);
}



document.addEventListener('DOMContentLoaded', function() {
// Load audiobooks when the app starts
    loadAudiobooks();

// Set up event listeners for the modal
    document.getElementById('manage-audiobooks-btn').addEventListener('click', function () {
        audiobookModal.style.display = "block";
        updateAudiobookList(); // Update the list whenever the modal is opened
    });

    document.getElementsByClassName("close-btn")[0].onclick = function () {
        audiobookModal.style.display = "none";
    }
// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === audiobookModal) {
            audiobookModal.style.display = "none";
        }
    }

    document.getElementById('add-audiobook-btn').addEventListener('click', function (event) {
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


    document.getElementById('search-spotify-btn').addEventListener('click', function() {
        // Display the search modal
        const searchModal = document.getElementById('search-spotify-modal');
        searchModal.style.display = "block";
    });

// Event listener for closing the modal
    document.querySelector('#search-spotify-modal .close-btn').addEventListener('click', function() {
        const searchModal = document.getElementById('search-spotify-modal');
        searchModal.style.display = "none";
    });

// Event listener for submitting the search
    document.getElementById('search-button').addEventListener('click', function() {
        const author = document.getElementById('author-name').value.trim();
        const title = document.getElementById('book-title').value.trim();
        searchForAudiobook(author, title);
    });


});

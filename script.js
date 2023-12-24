function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('date-time');

    // Format the date and time as desired
    const dayOfWeek = now.toLocaleString('en-US', {weekday: 'long'});
    const date = now.toLocaleString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'});
    const time = now.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});

    dateTimeElement.textContent = `${dayOfWeek}, ${date}, ${time}`;
    const stardateElement = document.getElementById('stardate');
    stardateElement.textContent = `Stardate ${calculateStardate()}`;
}

// Update the time every second
setInterval(updateDateTime, 1000);

// Set the initial date and time
document.addEventListener('DOMContentLoaded', updateDateTime);


function calculateStardate() {
    const referenceDate = new Date('January 1, 2023');
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - referenceDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const stardate = 41000.0 + differenceInDays;

    return stardate.toFixed(1); // Rounds to one decimal place
}

function generateRandomHex() {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

function updateLcarsNumbers() {
    const lcarsNumbers = document.querySelectorAll('.lcars-num');
    lcarsNumbers.forEach((numElement, index) => {
        const sectionNumber = (index + 1).toString().padStart(3, '0');
        const randomHex = generateRandomHex();
        numElement.textContent = `${sectionNumber}-${randomHex}`;
    });
}

// Call the function to update numbers on page load
document.addEventListener('DOMContentLoaded', updateLcarsNumbers);


// document.addEventListener('DOMContentLoaded', function () {
//     fetch('http://feeds.feedburner.com/theysaidso/qod')
//         .then(response => response.text())
//         .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
//         .then(data => {
//             const quote = data.querySelector("item description").textContent;
//             document.getElementById('quote-of-the-day').innerHTML = quote;
//         })
//         .catch(error => {
//             console.error('Error fetching quote: ', error);
//             document.getElementById('quote-of-the-day').textContent = 'No quote available today.';
//         });
// });

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://feeds.feedburner.com/theysaidso/qod')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            const quotes = Array.from(items).map(item => item.querySelector("description").textContent);

            let currentQuoteIndex = 0;
            const updateQuote = () => {
                if (currentQuoteIndex >= quotes.length) currentQuoteIndex = 0;
                document.getElementById('quote-of-the-day').innerHTML = quotes[currentQuoteIndex];
                currentQuoteIndex++;
            };

            updateQuote(); // Initial quote update
            setInterval(updateQuote, 300000); // Update every 5 minutes
        })
        .catch(error => {
            console.error('Error fetching quote: ', error);
            document.getElementById('quote-of-the-day').textContent = 'No quote available today.';
        });
});


function scheduleQuoteRefresh() {
    const now = new Date();
    // Set the time for the next refresh: tomorrow at 00:00:00
    let nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let timeoutDuration = nextMidnight - now;

    setTimeout(function () {
        fetchQuote();
        // Once the first refresh is done, set it to repeat every 24 hours
        setInterval(fetchQuote, 86400000);
    }, timeoutDuration);
}

// Run scheduleQuoteRefresh when the page loads
document.addEventListener('DOMContentLoaded', scheduleQuoteRefresh);

const tasksData = {
    "Monday": ["Take Vitamins", "Take out the trash", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],
    "Tuesday": ["Take Vitamins", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],
    "Wednesday": ["Take Vitamins", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Turn on Sprinklers", "Chrissy Meds", "Geoff Meds"],
    "Thursday": ["Take Vitamins", "Take out the trash and Recycling", "Put dirty clothes in hamper", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],
    "Friday": ["Take Vitamins", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],
    "Saturday": ["Make Eggs for Chrissy", "Take Vitamins", "Yard Work", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],
    "Sunday": ["Make Eggs for Chrissy", "Take Vitamins", "Dishes", "Morning Feed Cat", "Read 30 min", "Study 1 HR", "Chrissy Meds", "Geoff Meds"],

    // ... other days
};

const cssColorClasses = ['color-class-1', 'color-class-2', 'color-class-4', 'color-class-5', 'color-class-6'];
const cssCompletedColor = 'color-class-completed';

function handleTaskClick(taskDiv, day, taskName) {
    // Find the <a> tag inside the taskDiv
    const linkElement = taskDiv.querySelector('a');

    // Change the <a> tag's color class to indicate completion
    linkElement.className = cssCompletedColor;

    // Move the task to the end of the list
    taskDiv.parentNode.appendChild(taskDiv);

    // Update tasksData to reflect the change
    const taskIndex = tasksData[day].indexOf(taskName);
    const completedTask = tasksData[day].splice(taskIndex, 1)[0];
    tasksData[day].push(completedTask);
}


function updateTasksForDay(day) {
    const tasks = tasksData[day];
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    tasks.forEach(task => {
        const colorClass = cssColorClasses[Math.floor(Math.random() * cssColorClasses.length)];
        const taskElement = document.createElement('div');
        taskElement.className = 'list-button';

        const linkElement = document.createElement('a');
        linkElement.href = "#";
        linkElement.textContent = task;
        linkElement.className = colorClass;
        taskElement.appendChild(linkElement);

        // Add click event listener
        taskElement.addEventListener('click', () => handleTaskClick(taskElement, day, task));

        taskListElement.appendChild(taskElement);
    });
}

function updateTime() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0); // Next day at 00:01
    return midnight.getTime() - now.getTime(); // Time until midnight in milliseconds
}

function refreshTasksAtMidnight() {
    setTimeout(() => {
        // Update the task list
        const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
        updateTasksForDay(today);

        // Set the next refresh
        refreshTasksAtMidnight();
    }, updateTime());
}

// Initial call to start the cycle
refreshTasksAtMidnight();


// Get today's day name
const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
updateTasksForDay(today);

const { exec } = require('child_process');
const { shell } = require('electron');

const urls = [
    'https://www.humblebundle.com/?hmb_source=navbar',
    'https://read.amazon.com/kindle-library',
    'https://subscription.packtpub.com/owned',
    'https://drive.google.com/drive/my-drive',
    'https://annas-archive.org/',
    'https://1lib.sk/'
];


function openUrlsInNewWindow(urls) {
    // Path to your Brave browser executable
    const browserPath = '"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\Brave.exe"';
    const args = urls.map(url => `"${url}"`).join(' ');

    // Constructing the command to open all URLs in a new window
    const command = `${browserPath} --new-window ${args}`;

    exec(command, (err) => {
        if (err) {
            // Handle errors here
            console.error('Error opening URLs:', err);
        }
    });
}

function openBrowserWithTabs() {
    openUrlsInNewWindow(urls);
}

document.getElementById('bottom-right').addEventListener('click', () => {
    shell.openPath('C:\\Users\\yesia\\AppData\\Local\\Amazon Games\\App\\Amazon Games.exe')
        .then(result => {
            if (result) {
                console.error('Error opening Amazon Games:', result);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('top-right').addEventListener('click', () => {
    shell.openPath('C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe')
        .then(result => {
            if (result) {
                console.error('Error opening Epic Games:', result);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('bottom-left').addEventListener('click', () => {
    shell.openPath('C:\\Program Files (x86)\\Steam\\steam.exe')
        .then(result => {
            if (result) {
                console.error('Error opening Epic Games:', result);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});




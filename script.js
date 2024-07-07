// Query selectors for DOM elements
const refresh = document.querySelector("header i");
const container = document.querySelector(".flags");
const flagInfoWrapper = document.querySelector(".flag-info");
const returnButton = document.querySelector(".return");

// Array to keep track of used indexes to avoid duplicates
let usedIndexes = [];

/**
 * Function to display random countries
 * Fetches a random list of country flags and displays them on the page
 */
async function randomCountries() {
    // Number of countries to display
    const amount = 8;
    container.innerHTML = "";  // Clear the container
    usedIndexes = [];  // Reset the used indexes

    for (let i = 0; i < amount; i++) {
        let index;
        // Use a do-while loop to ensure unique country flags
        do {
            // Generate a random index
            index = Math.floor(Math.random() * countries.length);
        } while (usedIndexes.includes(index))
        usedIndexes.push(index);  // Add index to the used indexes array
        const countryName = countries[index];

        // Create a div element for each country flag
        const div = document.createElement("div");
        div.className = "one-flag";
        const imgSrc = await getImage(countryName);  // Fetch the flag image URL
        if (imgSrc) {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = countryName + " flag";
            // Append the image to the div
            div.appendChild(img);
        }
        // Create and append a heading for the country name
        const heading = document.createElement("h2");
        heading.textContent = countryName;
        div.appendChild(heading);

        // Create and append a button for more information
        const button = document.createElement("button");
        button.textContent = "More Info";
        button.onclick = () => {
            showOneFlag(countryName);
        }
        div.appendChild(button);

        // Append the div to the container
        container.appendChild(div);
    }
}

/**
 * Function to fetch the flag image URL for a given country
 * @param {string} countryName - The name of the country
 * @returns {string} The URL of the flag image
 */
async function getImage(countryName) {
    try {
        const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            if (!data) return;
            return data[0].flags.png;  // Return the URL of the flag image
        }
    } catch (error) {
        console.error(error);  // Log any errors
    }
}

/**
 * Function to show detailed information about a single country
 * @param {string} countryName - The name of the country
 */
async function showOneFlag(countryName) {
    container.innerHTML = "";  // Clear the container
    flagInfoWrapper.classList.remove("hide");  // Show the info wrapper

    // Query selectors for detailed country information
    const title = document.querySelector(".info h2");
    const img = document.querySelector(".info img");
    const capitalElement = document.querySelector(".capital span");
    const continentElement = document.querySelector(".continent span");
    const populationElement = document.querySelector(".population span");
    const currencyElement = document.querySelector(".currency span");

    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    const response = await fetch(url);

    if (!response.ok) return;

    const json = await response.json();
    console.log(json);

    if (json) {
        // Update the DOM elements with country information
        title.textContent = countryName;
        capitalElement.textContent = json[0].capital;
        continentElement.textContent = json[0].region;
        populationElement.textContent = json[0].population;
        currencyElement.textContent = json[0].currencies[Object.keys(json[0].currencies)].name;
        img.src = await getImage(countryName);  // Update the image source
    }
}

/**
 * Function to return to the random country list view
 * Refreshes the list of random countries and hides the detailed view
 */
function returnBack() {
    randomCountries();  // Display random countries
    flagInfoWrapper.classList.add("hide");  // Hide the detailed info
}

// Event listeners for user interactions
onload = randomCountries();  // Load random countries on page load
refresh.addEventListener("click", randomCountries);  // Refresh the list on click
returnButton.addEventListener("click", returnBack);  // Return to the main view on click

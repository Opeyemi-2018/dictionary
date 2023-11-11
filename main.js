let faMoon = document.querySelector(".fa-moon");
let faSun = document.querySelector(".fa-sun");
let bodyElment = document.body
let form = document.getElementById("form")
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  bodyElment.classList.add(savedTheme);
  if (savedTheme === "dark-theme") {
    faMoon.classList.replace("fa-moon", "fa-sun");
  }
}

faMoon.addEventListener("click", () => {
  bodyElment.classList.toggle("dark-theme");

  if (faMoon.classList.contains("fa-moon")) {
    faMoon.classList.replace("fa-moon", "fa-sun");
    // Save the theme setting to local storage
    localStorage.setItem("theme", "dark-theme");
  } else {
    faMoon.classList.replace("fa-sun", "fa-moon");
    // Save the theme setting to local storage
    localStorage.setItem("theme", "");
  }
});

let dictionaryDiv = document.querySelector(".dictionary-body");
let searchText = document.getElementById("text");
let searchIcon = document.querySelector(".fa-search");

// Check local storage for the last search term when the page loads
const savedSearchTerm = localStorage.getItem("lastSearchTerm");
if (savedSearchTerm) {
  searchText.value = savedSearchTerm;
}

// Check local storage for the last dictionary data when the page loads
const savedDictionaryData = localStorage.getItem("lastDictionaryData");
if (savedDictionaryData) {
  dictionaryDiv.innerHTML = savedDictionaryData;
}

searchIcon.addEventListener("click", ()=>{
  getMeaning()
})

// This section handles the click event on the search icon for fetching the word's definition.
searchText.addEventListener("keyup", () => {
  getMeaning()
});

function getMeaning(){
  // Get the trimmed text from the search input field
  let text = searchText.value.trim();

  // Check if a valid text input is provided
  if (text !== "") {
    // Display 'Loading...' while fetching the definition
    dictionaryDiv.innerHTML = "Loading...";

    // Fetch the definition data from the Merriam-Webster's API
    fetch(
      `https://dictionaryapi.com/api/v3/references/learners/json/${text}?key=05a6f186-4232-4fd5-be99-0e12575a6a6d`
    )
      .then((response) => response.json())
      .then((data) => {
        // Clear previous content from the dictionary div
        dictionaryDiv.innerHTML = "";

        // Check if the received data is an array and contains at least one result
        if (Array.isArray(data) && data.length > 0) {
          const wordData = data[0];

          // Check if the 'shortdef' property exists for the word
          if (wordData.shortdef) {
            // Extract the part of speech and the first definition for the word
            const partOfSpeech = wordData.fl; // Part of speech
            const definition = wordData.shortdef[0]; // First definition

            // Update the HTML to display the word, part of speech, and definition
            dictionaryDiv.innerHTML = `
            <div class="word-content">
              <div class="text">
                <h1>${text}</h1>
              </div>
              <div class="play-logo">
                <i class="fa fa-play" aria-hidden="true"></i>
              </div>
            </div>
            <div class="speech">
              <p>${partOfSpeech}</p>
              <hr />
            </div>
            <div class="meaning">Meaning</div>
            <div class="meaning-text">
              <li>${definition}</li>
            `;
          } else {
            // If 'shortdef' is not available, display a message indicating no definition found
            dictionaryDiv.innerHTML = "No definition found for the word.";
          }

          // Save the displayed dictionary data to local storage
          localStorage.setItem("lastDictionaryData", dictionaryDiv.innerHTML);

          // Add an event listener to the play icon button for text-to-speech
          const playIcon = dictionaryDiv.querySelector(".fa-play");
          playIcon.addEventListener("click", () => {
            // Retrieve the definition text and initiate text-to-speech
            let definitionText =
              document.querySelector(".meaning-text li").innerHTML;
            speakDefinition(definitionText);
          });
        } else {
          // If no data is found for the word, display an appropriate message
          dictionaryDiv.innerHTML = "No data found for the word.";
          dictionaryDiv.classList.add("error");
        }

        // Save the searched term to local storage for future retrieval
        localStorage.setItem("lastSearchTerm", text);
      })
      .catch((error) => {
        // Display an error message in case of API fetch failure
        dictionaryDiv.innerHTML = "Error: Unable to fetch data.";
        dictionaryDiv.classList.add("error-text");
        console.error("Error:", error);
      });

    // Clear the search input field after the search is initiated
    // searchText.value = "";
  }
}

function speakDefinition(definitionText) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(definitionText);
    speechSynthesis.speak(utterance);
  } else {
    console.log("Text-to-speech not supported in this browser.");
  }
}

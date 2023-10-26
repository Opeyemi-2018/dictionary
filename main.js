let faMoon = document.querySelector(".fa-moon");
let faSun = document.querySelector(".fa-sun");
let mainContainer = document.querySelector(".main-container");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  mainContainer.classList.add(savedTheme);
  if (savedTheme === "dark-theme") {
    faMoon.classList.replace("fa-moon", "fa-sun");
  }
}

faMoon.addEventListener("click", () => {
  mainContainer.classList.toggle("dark-theme");

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

searchIcon.addEventListener("click", () => {
  let text = searchText.value.trim();
  if (text !== "") {
    dictionaryDiv.innerHTML = "Loading...";

    fetch(
      `https://dictionaryapi.com/api/v3/references/learners/json/${text}?key=05a6f186-4232-4fd5-be99-0e12575a6a6d`
    )
      .then((response) => response.json())
      .then((data) => {
        dictionaryDiv.innerHTML = ""; // Clear previous content

        if (Array.isArray(data) && data.length > 0) {
          const wordData = data[0];

          if (wordData.shortdef) {
            // Display the first definition (you can loop through 'wordData.shortdef' for multiple definitions)
            const partOfSpeech = wordData.fl; // Part of speech
            const definition = wordData.shortdef[0]; // First definition

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
            dictionaryDiv.innerHTML = "No definition found for the word.";
          }

          // Save the dictionary data to local storage
          localStorage.setItem("lastDictionaryData", dictionaryDiv.innerHTML);

          // Add event listener to the play icon button
          const playIcon = dictionaryDiv.querySelector(".fa-play");
          playIcon.addEventListener("click", () => {
            let definitionText =
              document.querySelector(".meaning-text li").innerHTML;
            speakDefinition(definitionText);
          });
        } else {
          dictionaryDiv.innerHTML = "No data found for the word.";
        }

        // Save the search term to local storage
        localStorage.setItem("lastSearchTerm", text);
      })
      .catch((error) => {
        dictionaryDiv.innerHTML = "Error: Unable to fetch data.";
        console.error("Error:", error);
      });

    searchText.value = "";
  }
});

function speakDefinition(definitionText) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(definitionText);
    speechSynthesis.speak(utterance);
  } else {
    console.log("Text-to-speech not supported in this browser.");
  }
}

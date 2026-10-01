

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("articles-container");
    const status = document.getElementById("speech-status");
    const stopButton = document.getElementById("stop-speech");

    const images = {
        "SCP-002": "./images/800px-SCP002.jpg",
        "SCP-003": "./images/scp-003.jpg",
        "SCP-004": "./images/scp004_door.jpg",
        "SCP-005": "./images/scp-005.jpg",
        "SCP-006": "./images/scp-006.jpg"
    };

    fetch("./data/scp-data.json")
        .then(function (response) {
            if (!response.ok) throw new Error("Unable to load JSON file.");
            return response.json();
        })
        .then(function (scpData) {
            container.innerHTML = "";
            status.textContent = "JSON catalogue loaded. Use Read Description on any SCP record.";

            scpData.forEach(function (scp) {
                const article = document.createElement("article");
                article.className = "card";
                const page = "./" + scp.subject.toLowerCase() + ".html";

                article.innerHTML = `
                    <img src="${images[scp.subject]}" alt="${scp.subject} image">
                    <h2>${scp.subject}</h2>
                    <p><strong>Object Class:</strong> ${scp.class}</p>
                    <h3>Description Summary</h3>
                    <p>${scp.descriptionSummary}</p>
                    <h3>Containment Summary</h3>
                    <p>${scp.containmentSummary}</p>
                    <button type="button" class="speech-btn">🔊 Read Description</button>
                    <p><a href="${page}">Open ${scp.subject} record</a></p>
                `;

                article.querySelector(".speech-btn").addEventListener("click", function () {
                    window.speechSynthesis.cancel();
                    const speech = new SpeechSynthesisUtterance(
                        scp.subject + ". " + scp.descriptionSummary
                    );
                    speech.lang = "en-NZ";
                    speech.onstart = function () {
                        status.textContent = "Reading " + scp.subject + " description...";
                    };
                    speech.onend = function () {
                        status.textContent = "Finished reading " + scp.subject + ".";
                    };
                    window.speechSynthesis.speak(speech);
                });

                container.appendChild(article);
            });
        })
        .catch(function (error) {
            console.error(error);
            status.textContent = "JSON could not be loaded.";
            container.innerHTML =
                '<p class="error-message">Unable to load SCP catalogue data. Run the project with Live Server or upload it to your web server.</p>';
        });

    stopButton.addEventListener("click", function () {
        window.speechSynthesis.cancel();
        status.textContent = "Speech stopped.";
    });
});
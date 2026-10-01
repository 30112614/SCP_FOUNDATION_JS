


document.addEventListener("DOMContentLoaded", function () {
    const main = document.querySelector("main");
    if (!main) return;

    const headings = Array.from(main.querySelectorAll("h2, h3"));
    const descriptionHeading = headings.find(function (heading) {
        return heading.textContent.trim().toLowerCase().startsWith("description");
    });


    const descriptionParts = [];
    let textToRead = "";

    if (descriptionHeading) {
        let node = descriptionHeading.nextElementSibling;

        while (node) {
            if (/^H[23]$/.test(node.tagName)) break;
            if (node.matches("section") && node.querySelector("h2, h3")) break;
            if (node.matches("p, li")) descriptionParts.push(node.textContent.trim());
            node = node.nextElementSibling;
        }

        if (descriptionParts.length === 0 && descriptionHeading.parentElement.matches("section")) {
            descriptionHeading.parentElement.querySelectorAll("p, li").forEach(function (el) {
                descriptionParts.push(el.textContent.trim());
            });
        }
        textToRead = descriptionParts.join(" ");
    } else if (isHome) {
        const pTag = main.querySelector("p");
        if (pTag) {
            textToRead = pTag.textContent.trim();
        }
    }

    const panel = document.createElement("div");
    panel.className = "speech-panel";
    panel.innerHTML = `
        <p class="speech-status" aria-live="polite"></p>
        <button type="button" class="btn-speech read-description">🔊 Read Description</button>
        <button type="button" class="btn-speech pause-description">⏸ Pause</button>
        <button type="button" class="btn-speech resume-description">▶ Resume</button>
        <button type="button" class="btn-speech stop-description">⏹ Stop</button>
    `;

    const title = main.querySelector("h1");
    title.insertAdjacentElement("afterend", panel);

    const status = panel.querySelector(".speech-status");

    panel.querySelector(".read-description").addEventListener("click", function () {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "en-NZ";
        utterance.onstart = function () { status.textContent = "Reading..."; };
        utterance.onend = function () { status.textContent = "Finished."; };
        utterance.onerror = function () { status.textContent = "Speech could not be played."; };
        window.speechSynthesis.speak(utterance);
    });

    panel.querySelector(".pause-description").addEventListener("click", function () {
        window.speechSynthesis.pause();
        status.textContent = "Paused.";
    });
    panel.querySelector(".resume-description").addEventListener("click", function () {
        window.speechSynthesis.resume();
        status.textContent = "Reading...";
    });
    panel.querySelector(".stop-description").addEventListener("click", function () {
        window.speechSynthesis.cancel();
        status.textContent = "Stopped.";
    });
});
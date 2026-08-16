const form          = document.getElementById("applicationForm");
const submitButton  = document.getElementById("submitButton");
const statusMessage = document.getElementById("statusMessage");

/*
    Google Apps Script URL
    Replace this with your own deployed URL.
*/
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwWbGu5MNk9MQC0dgH5J-j9H8Lh93USLGI0GBboXL3vbJWJF4QEchrkLYUtg3-zbj-DLw/exec";


/* --- Force uppercase on batch field in real-time --- */

document.getElementById("batch").addEventListener("input", function () {
    const cursor = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(cursor, cursor);
});


/* --- Inline validation helper ---------------------- */

function setError(fieldId, message) {

    const group = document.getElementById(fieldId).closest(".form-group");
    const errEl = document.getElementById(fieldId + "-error");

    if (group)  group.classList.toggle("has-error", !!message);
    if (errEl)  errEl.textContent = message || "";

}

function clearAllErrors() {

    document.querySelectorAll(".form-group.has-error")
        .forEach(g => g.classList.remove("has-error"));

    document.querySelectorAll(".field-error")
        .forEach(e => e.textContent = "");

}


/* --- Show status banner ----------------------------- */

function showStatus(text, type) {

    statusMessage.textContent = text;
    statusMessage.className   = "status-message visible " + type;

}

function hideStatus() {

    statusMessage.className   = "status-message";
    statusMessage.textContent = "";

}


/* --- Form submit ------------------------------------ */

form.addEventListener("submit", async function (event) {

    event.preventDefault();
    clearAllErrors();
    hideStatus();


    /* Collect values */

    const name     = document.getElementById("name").value.trim();
    const email    = document.getElementById("email").value.trim();
    const phone    = document.getElementById("phone").value.trim();
    const position = document.getElementById("position").value;
    const batch    = document.getElementById("batch").value.trim().toUpperCase();
    const message  = document.getElementById("message").value.trim();


    /* Validate */

    let hasError = false;

    if (!name) {
        setError("name", "Full name is required.");
        hasError = true;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email", "A valid email address is required.");
        hasError = true;
    }

    if (!phone || !/^[6-9][0-9]{9}$/.test(phone)) {
        setError("phone", "Enter a valid 10-digit Indian mobile number.");
        hasError = true;
    }

    if (!position) {
        setError("position", "Please select a position.");
        hasError = true;
    }

    if (hasError) return;


    /* Build payload — full phone includes +91 prefix */

    const applicationData = {
        name:     name,
        email:    email,
        phone:    "+91 " + phone,
        position: position,
        batch:    batch,
        message:  message
    };


    /* Loading state */

    submitButton.disabled = true;
    submitButton.classList.add("loading");

    document.querySelector(".btn-text").textContent = "Submitting…";


    try {

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body:   JSON.stringify(applicationData)
        });

        const result = await response.json();

        if (result.success) {

            showStatus("✓  Application submitted successfully!", "success");
            form.reset();
            document.getElementById("batch").value = ""; /* clear uppercase field */

        } else {

            showStatus("Something went wrong. Please try again.", "error");

        }


    } catch (error) {

        console.error("Submission error:", error);
        showStatus("Unable to submit. Check your connection and try again.", "error");

    }


    /* Restore button */

    submitButton.disabled = false;
    submitButton.classList.remove("loading");
    document.querySelector(".btn-text").textContent = "Submit Application";

});

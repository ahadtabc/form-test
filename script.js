const form =
    document.getElementById("applicationForm");

const submitButton =
    document.getElementById("submitButton");

const statusMessage =
    document.getElementById("statusMessage");


/*
    Google Apps Script URL

    Replace this with your own URL.
*/

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwWbGu5MNk9MQC0dgH5J-j9H8Lh93USLGI0GBboXL3vbJWJF4QEchrkLYUtg3-zbj-DLw/exec";

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const position =
        document.getElementById("position").value;

    const message =
        document.getElementById("message").value.trim();


    /* Validation */

    if (!name || !email || !phone || !position) {

        statusMessage.textContent =
            "Please fill in all required fields.";

        return;

    }


    /* Data */

    const applicationData = {

        name: name,

        email: email,

        phone: phone,

        position: position,

        message: message

    };


    /* Loading */

    submitButton.disabled = true;

    submitButton.textContent =
        "Submitting...";

    statusMessage.textContent =
        "";


    try {

        const response =
            await fetch(SCRIPT_URL, {

                method: "POST",

                body: JSON.stringify(applicationData)

            });


        const result =
            await response.json();


        if (result.success) {

            statusMessage.textContent =
                "Application submitted successfully!";

            form.reset();

        } else {

            statusMessage.textContent =
                "Something went wrong.";

        }


    } catch (error) {

        console.error(error);

        statusMessage.textContent =
            "Unable to submit application.";

    }


    submitButton.disabled = false;

    submitButton.textContent =
        "Submit Application";

});
const API_URL = "http://127.0.0.1:8001";


// =========================================================
// NAVIGATION
// =========================================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.add("hidden");
    });

    document
        .getElementById(sectionId)
        .classList.remove("hidden");
}


// =========================================================
// ADD PATIENT
// =========================================================

const patientForm =
    document.getElementById("patient-form");


patientForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value;

        const age =
            Number(document.getElementById("age").value);

        const gender =
            document.getElementById("gender").value;

        const phone =
            document.getElementById("phone").value;

        const email =
            document.getElementById("email").value;

        const city =
            document.getElementById("city").value;

        const state =
            document.getElementById("state").value;

        const pincode =
            document.getElementById("pincode").value;

        const height =
            Number(document.getElementById("height").value);

        const weight =
            Number(document.getElementById("weight").value);

        const bloodGroup =
            document.getElementById("blood-group").value;

        const allergiesInput =
            document.getElementById("allergies").value;


        const allergies =
            allergiesInput
                .split(",")
                .map(function(allergy) {
                    return allergy.trim();
                })
                .filter(function(allergy) {
                    return allergy !== "";
                });


        const patient = {

            personal_info: {

                name: name,

                age: age,

                gender: gender,

                contact: {

                    phone: phone,

                    email: email

                }

            },

            address: {

                city: city,

                state: state,

                pincode: pincode

            },

            medical_info: {

                height: height,

                weight: weight,

                blood_group: bloodGroup,

                allergies: allergies

            }

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/patients`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(patient)
                    }
                );


            if (!response.ok) {

                const errorData =
                    await response.json();

                console.log(
                    "Backend error:",
                    errorData
                );

                alert(
                    "Unable to add patient. Please check the information."
                );

                return;
            }


            const savedPatient =
                await response.json();


            alert(
                `Patient added successfully!\nPatient ID: ${savedPatient.id}`
            );


            patientForm.reset();

            loadPatients();

        }

        catch (error) {

            console.error(
                "Connection error:",
                error
            );

            alert(
                "Could not connect to the backend."
            );

        }

    }
);


// =========================================================
// LOAD PATIENTS
// =========================================================

async function loadPatients() {

    try {

        const response =
            await fetch(
                `${API_URL}/patients`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        updateDashboard(patients);

    }

    catch (error) {

        console.error(
            "Error loading patients:",
            error
        );

    }

}


// =========================================================
// UPDATE DASHBOARD
// =========================================================

function updateDashboard(patients) {

    document.getElementById(
        "total-patients"
    ).textContent =
        patients.length;


    document.getElementById(
        "new-patients"
    ).textContent =
        patients.length;

}


// =========================================================
// SEARCH PATIENT
// =========================================================

async function searchPatient() {

    const searchText =
        document
            .getElementById("search")
            .value
            .trim()
            .toLowerCase();


    const patientList =
        document.getElementById("patient-list");


    if (searchText === "") {

        patientList.textContent =
            "Please enter a patient name.";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/patients`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        const results =
            patients.filter(
                function(patient) {

                    return patient
                        .personal_info
                        .name
                        .toLowerCase()
                        .includes(searchText);

                }
            );


        patientList.innerHTML = "";


        if (results.length === 0) {

            patientList.textContent =
                "No patient found.";

            return;
        }


        results.forEach(
            function(patient) {

                createPatientCard(
                    patient,
                    patientList
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Search error:",
            error
        );

        patientList.textContent =
            "Could not search patients.";

    }

}


// =========================================================
// CREATE PATIENT CARD
// =========================================================

function createPatientCard(
    patient,
    patientList
) {

    const card =
        document.createElement("div");


    card.className =
        "patient-card";


    const name =
        document.createElement("h3");

    name.textContent =
        patient.personal_info.name;


    const id =
        createPatientDetail(
            "Patient ID",
            patient.id
        );


    const age =
        createPatientDetail(
            "Age",
            patient.personal_info.age
        );


    const gender =
        createPatientDetail(
            "Gender",
            patient.personal_info.gender
        );


    const phone =
        createPatientDetail(
            "Phone",
            patient.personal_info.contact.phone
        );


    const email =
        createPatientDetail(
            "Email",
            patient.personal_info.contact.email
        );


    const city =
        createPatientDetail(
            "City",
            patient.address.city
        );


    const state =
        createPatientDetail(
            "State",
            patient.address.state
        );


    const pincode =
        createPatientDetail(
            "Pincode",
            patient.address.pincode
        );


    const height =
        createPatientDetail(
            "Height",
            `${patient.medical_info.height} cm`
        );


    const weight =
        createPatientDetail(
            "Weight",
            `${patient.medical_info.weight} kg`
        );


    const bloodGroup =
        createPatientDetail(
            "Blood Group",
            patient.medical_info.blood_group
        );


    const allergies =
        createPatientDetail(
            "Allergies",
            patient.medical_info.allergies.join(", ") || "None"
        );


    const bmi =
        createPatientDetail(
            "BMI",
            patient.medical_info.bmi
        );


    const bmiCategory =
        createPatientDetail(
            "BMI Category",
            patient.medical_info.bmi_category
        );


    const actions =
        document.createElement("div");

    actions.className =
        "patient-actions";


    const editButton =
        document.createElement("button");

    editButton.textContent =
        "Edit";

    editButton.className =
        "edit-button";


    editButton.addEventListener(
        "click",
        function() {

            editPatient(patient.id);

        }
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.className =
        "delete-button";


    deleteButton.addEventListener(
        "click",
        function() {

            deletePatient(patient.id);

        }
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    card.appendChild(name);

    card.appendChild(id);

    card.appendChild(age);

    card.appendChild(gender);

    card.appendChild(phone);

    card.appendChild(email);

    card.appendChild(city);

    card.appendChild(state);

    card.appendChild(pincode);

    card.appendChild(height);

    card.appendChild(weight);

    card.appendChild(bloodGroup);

    card.appendChild(allergies);

    card.appendChild(bmi);

    card.appendChild(bmiCategory);

    card.appendChild(actions);


    patientList.appendChild(card);

}


// =========================================================
// CREATE PATIENT DETAIL
// =========================================================

function createPatientDetail(
    label,
    value
) {

    const paragraph =
        document.createElement("p");


    const strong =
        document.createElement("strong");


    strong.textContent =
        `${label}: `;


    paragraph.appendChild(strong);


    const text =
        document.createTextNode(
            value
        );


    paragraph.appendChild(text);


    return paragraph;

}


// =========================================================
// DELETE PATIENT
// =========================================================

async function deletePatient(patientId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this patient?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        const result =
            await response.json();


        alert(
            result.message
        );


        await loadPatients();

        await searchPatient();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Could not delete patient."
        );

    }

}


// =========================================================
// EDIT / UPDATE PATIENT
// =========================================================

async function editPatient(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}`
            );


        if (!response.ok) {

            throw new Error(
                "Patient not found"
            );

        }


        const patient =
            await response.json();


        const name =
            prompt(
                "Patient Name:",
                patient.personal_info.name
            );


        if (name === null) {
            return;
        }


        const age =
            prompt(
                "Age:",
                patient.personal_info.age
            );


        if (age === null) {
            return;
        }


        const gender =
            prompt(
                "Gender (Male/Female/Other):",
                patient.personal_info.gender
            );


        if (gender === null) {
            return;
        }


        const phone =
            prompt(
                "Phone Number:",
                patient.personal_info.contact.phone
            );


        if (phone === null) {
            return;
        }


        const email =
            prompt(
                "Email:",
                patient.personal_info.contact.email
            );


        if (email === null) {
            return;
        }


        const city =
            prompt(
                "City:",
                patient.address.city
            );


        if (city === null) {
            return;
        }


        const state =
            prompt(
                "State:",
                patient.address.state
            );


        if (state === null) {
            return;
        }


        const pincode =
            prompt(
                "Pincode:",
                patient.address.pincode
            );


        if (pincode === null) {
            return;
        }


        const height =
            prompt(
                "Height (cm):",
                patient.medical_info.height
            );


        if (height === null) {
            return;
        }


        const weight =
            prompt(
                "Weight (kg):",
                patient.medical_info.weight
            );


        if (weight === null) {
            return;
        }


        const bloodGroup =
            prompt(
                "Blood Group:",
                patient.medical_info.blood_group
            );


        if (bloodGroup === null) {
            return;
        }


        const allergiesInput =
            prompt(
                "Allergies (comma separated):",
                patient.medical_info.allergies.join(", ")
            );


        if (allergiesInput === null) {
            return;
        }


        const allergies =
            allergiesInput
                .split(",")
                .map(function(allergy) {
                    return allergy.trim();
                })
                .filter(function(allergy) {
                    return allergy !== "";
                });


        const updatedPatient = {

            personal_info: {

                name: name,

                age: Number(age),

                gender: gender,

                contact: {

                    phone: phone,

                    email: email

                }

            },

            address: {

                city: city,

                state: state,

                pincode: pincode

            },

            medical_info: {

                height: Number(height),

                weight: Number(weight),

                blood_group: bloodGroup,

                allergies: allergies

            }

        };


        const updateResponse =
            await fetch(
                `${API_URL}/patients/${patientId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedPatient
                        )
                }
            );


        if (!updateResponse.ok) {

            const errorData =
                await updateResponse.json();

            console.error(
                "Update error:",
                errorData
            );

            alert(
                "Unable to update patient. Please check the information."
            );

            return;
        }


        await updateResponse.json();


        alert(
            "Patient updated successfully!"
        );


        await loadPatients();

        await searchPatient();

    }

    catch (error) {

        console.error(
            "Update error:",
            error
        );

        alert(
            "Could not update patient."
        );

    }

}


// =========================================================
// INITIAL LOAD
// =========================================================

loadPatients();
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    computed_field,
    model_validator
)
from typing import Literal, Annotated
import json
import re


app = FastAPI(title="Patient Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CUSTOM DATA TYPES
# =========================================================

PatientID = Annotated[
    int,
    Field(gt=0, description="Patient ID must be greater than 0")
]

PhoneNumber = Annotated[
    str,
    Field(
        min_length=10,
        max_length=10,
        pattern=r"^[6-9]\d{9}$",
        description="Indian 10-digit mobile number"
    )
]

Pincode = Annotated[
    str,
    Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$"
    )
]

BloodGroup = Literal[
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
]


# =========================================================
# NESTED MODEL - CONTACT INFORMATION
# =========================================================

class ContactInfo(BaseModel):
    phone: PhoneNumber
    email: EmailStr


# =========================================================
# NESTED MODEL - PERSONAL INFORMATION
# =========================================================

class PersonalInfo(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
        description="Patient full name"
    )

    age: int = Field(
        ge=0,
        le=120,
        description="Patient age"
    )

    gender: Literal["Male", "Female", "Other"]

    contact: ContactInfo


# =========================================================
# NESTED MODEL - ADDRESS
# =========================================================

class Address(BaseModel):
    city: str = Field(min_length=2)
    state: str = Field(min_length=2)
    pincode: Pincode


# =========================================================
# NESTED MODEL - MEDICAL INFORMATION
# =========================================================

class MedicalInfo(BaseModel):
    height: float = Field(
        gt=30,
        lt=250,
        description="Height in centimeters"
    )

    weight: float = Field(
        gt=1,
        lt=300,
        description="Weight in kilograms"
    )

    blood_group: BloodGroup

    allergies: list[str] = Field(
        default_factory=list
    )

    # -----------------------------------------------------
    # COMPUTED FIELD - BMI
    # -----------------------------------------------------

    @computed_field
    @property
    def bmi(self) -> float:

        height_in_meters = self.height / 100

        bmi_value = self.weight / (
            height_in_meters ** 2
        )

        return round(bmi_value, 2)

    # -----------------------------------------------------
    # COMPUTED FIELD - BMI CATEGORY
    # -----------------------------------------------------

    @computed_field
    @property
    def bmi_category(self) -> str:

        if self.bmi < 18.5:
            return "Underweight"

        elif self.bmi < 25:
            return "Normal"

        elif self.bmi < 30:
            return "Overweight"

        else:
            return "Obese"


# =========================================================
# MAIN PATIENT MODEL
# =========================================================

class Patient(BaseModel):

    id: PatientID | None = None

    personal_info: PersonalInfo

    address: Address

    medical_info: MedicalInfo

    # =====================================================
    # MODEL VALIDATOR
    # =====================================================

    @model_validator(mode="after")
    def validate_patient(self):

        age = self.personal_info.age
        height = self.medical_info.height
        weight = self.medical_info.weight

        # Example cross-field validation
        if age < 5 and weight > 100:
            raise ValueError(
                "Weight seems unrealistic for a patient below 5 years"
            )

        if age > 18 and height < 50:
            raise ValueError(
                "Height seems unrealistic for an adult patient"
            )

        return self


# =========================================================
# CREATE PATIENT
# =========================================================

@app.post("/patients")
def create_patient(patient: Patient):

    # Read existing patients
    with open("patients.json", "r") as file:
        patients = json.load(file)

    # Create patient ID
    new_id = max(
        (patient["id"] for patient in patients),
        default=0
        ) + 1

    # Assign generated ID
    patient.id = new_id

    # Convert Pydantic model to dictionary
    new_patient = patient.model_dump()

    # Add patient to list
    patients.append(new_patient)

    # Save patients
    with open("patients.json", "w") as file:
        json.dump(
            patients,
            file,
            indent=4
        )

    return new_patient

# =========================================================
# GET ALL PATIENTS
# =========================================================

@app.get("/patients")
def get_patients():

    # Read existing patients
    with open("patients.json", "r") as file:
        patients = json.load(file)

    return patients

# =========================================================
# GET PATIENT BY ID
# =========================================================

@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):

    # Read existing patients
    with open("patients.json", "r") as file:
        patients = json.load(file)

    # Search for patient
    for patient in patients:
        if patient["id"] == patient_id:
            return patient

    # Patient not found
    raise HTTPException(
    status_code=404,
    detail="Patient not found"
)

# =========================================================
# UPDATE PATIENT
# =========================================================

@app.put("/patients/{patient_id}")
def update_patient(patient_id: int, updated_patient: Patient):

    # Read existing patients
    with open("patients.json", "r") as file:
        patients = json.load(file)

    # Find patient
    for index, patient in enumerate(patients):

        if patient["id"] == patient_id:

            # Keep the existing ID
            updated_patient.id = patient_id

            # Convert updated patient to dictionary
            patients[index] = updated_patient.model_dump()

            # Save updated data
            with open("patients.json", "w") as file:
                json.dump(
                    patients,
                    file,
                    indent=4
                )

            return patients[index]

    # Patient not found
    raise HTTPException(
        status_code=404,
        detail="Patient not found"
    )

    # =========================================================
# DELETE PATIENT
# =========================================================

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):

    # Read existing patients
    with open("patients.json", "r") as file:
        patients = json.load(file)

    # Find patient
    for index, patient in enumerate(patients):

        if patient["id"] == patient_id:

            # Remove patient
            deleted_patient = patients.pop(index)

            # Save updated data
            with open("patients.json", "w") as file:
                json.dump(
                    patients,
                    file,
                    indent=4
                )

            return {
                "message": "Patient deleted successfully",
                "patient_id": patient_id,
                "deleted_patient": deleted_patient
            }

    # Patient not found
    raise HTTPException(
        status_code=404,
        detail="Patient not found"
    )
# 🏥 Patient Management System

A full-stack Patient Management System developed to digitize and simplify the management of patient records.

The project replaces traditional paper-based patient records with a web-based system where patient information can be added, searched, viewed, updated and deleted through a frontend connected to a FastAPI backend.

---

## 📌 Project Overview

The Patient Management System was built as a full-stack application with a separate frontend and backend.

The backend provides REST APIs using FastAPI and Pydantic for data validation, while the frontend provides a simple dashboard for interacting with patient records.

Patient information is stored in a JSON file for this version of the project.

The project also demonstrates nested Pydantic models, custom validation, computed fields and CRUD operations.

---

## ✨ Key Features

- Add new patients
- View patient information
- Search patients
- Update patient information
- Delete patients
- Automatic BMI calculation
- Automatic BMI category calculation
- Patient data validation
- Nested patient information structure
- REST API development
- Frontend and backend integration
- JSON-based data storage
- Interactive API documentation using Swagger
- CORS configuration for frontend-backend communication

---

## 🛠️ Technologies Used

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- REST API
- JSON

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- VS Code Live Server

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Swagger UI

---

## 🧠 Backend Concepts Implemented

This project uses several important Python and FastAPI concepts:

### FastAPI

Used to build the REST API and create endpoints for patient management.

### Pydantic

Used for:

- Request validation
- Data modelling
- Nested models
- Field constraints
- Type validation
- Custom data types

### Nested Pydantic Models

Patient information is divided into separate models:

- Personal Information
- Contact Information
- Address
- Medical Information

This creates a structured patient data model.

### Field Validation

The project validates information such as:

- Age
- Height
- Weight
- Phone number
- Email
- Pincode
- Blood group

### Custom Data Types

The project uses `Annotated` and `Field` to create validation rules for:

- Patient ID
- Indian phone numbers
- Pincodes
- Blood groups

### Computed Fields

BMI and BMI category are calculated automatically using Pydantic computed fields.

### Model Validator

A Pydantic model validator is used to check whether certain combinations of patient information are realistic.

For example, unrealistic height or weight combinations can be rejected.

---

## 📊 BMI Calculation

The system automatically calculates BMI using:

BMI = Weight (kg) / Height² (m)

The system also categorizes BMI as:

- Underweight
- Normal
- Overweight
- Obese

The BMI does not need to be entered manually by the user.

---

## 🔄 CRUD Operations

The backend provides complete CRUD functionality.

CRUD stands for:

- **Create** → Add a patient
- **Read** → View/search patients
- **Update** → Edit patient information
- **Delete** → Remove a patient

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/patients` | Create a new patient |
| GET | `/patients` | Get all patients |
| GET | `/patients/{patient_id}` | Get a patient by ID |
| PUT | `/patients/{patient_id}` | Update a patient |
| DELETE | `/patients/{patient_id}` | Delete a patient |

---

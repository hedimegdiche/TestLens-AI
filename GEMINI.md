📌 Graduation Project – Comprehensive Summary

🧠 Project Core

Title

Intelligent Test Case Management & Automation-Readiness Platform

Context

The project is developed within an automotive testing environment (infotainment systems) where test cases are managed through Jira but accessed via confidential Excel/Word extracts.

Engineers currently:





Manually read and classify test cases



Group them by similarity or difficulty



Plan execution on remote test benches



Prepare for future test automation

This process is:





Time-consuming



Subjective (human bias)



Not scalable

Problem Statement

How can we automatically analyze, classify, and optimize test cases while also identifying automation-ready scenarios, using only exported data (no direct system integration)?

Main Objectives



Automate test case classification (category + difficulty)



Detect similar and duplicate test cases



Optimize execution planning (grouping by preconditions, reducing redundancy)



Identify automation candidates (test cases sharing the same execution flow)



Provide decision support dashboards for both consultants and managers

🏗️ Technical Architecture

Frontend



React (recommended for role-based UI) OR Streamlit (for rapid prototyping)



Visualization: Plotly / Dash



Features:

Interactive dashboard



File upload interface



Role-based views (Consultant / Manager)

Backend



FastAPI (Python) or Django REST



REST APIs for:

File upload & parsing



AI processing



Results retrieval



Authentication:

JWT-based login



Role management (Consultant / Manager)

Database



PostgreSQL / MySQL



Stores:

Users & roles



Uploaded files metadata



Model outputs (classification, clustering)



User feedback (for improvement)

AI / NLP Stack



Python NLP ecosystem:

scikit-learn



Hugging Face Transformers



Sentence-BERT (SBERT)



Optional:

spaCy for preprocessing



LightGBM / XGBoost for baseline models

⚙️ Key Technical Decisions

1. Data Processing Pipeline

Input → Excel/Word Extract → Processing:





Text cleaning (English normalization + German fragments handling)



Feature extraction:

Number of steps



Length of preconditions



Keywords (eSIM, privacy, networking, etc.)



Structuring into usable dataset

2. Classification Approach



Predict:Category (privacy, eSIM, networking, apps…)

Difficulty (easy / medium / hard)



Techniques:

Baseline: TF-IDF + ML classifier



Advanced: Transformer-based model

3. Similarity & Clustering



Convert test cases into embeddings using Sentence-BERT



Compute similarity using cosine similarity



Cluster using:

HDBSCAN (preferred)



Hierarchical clustering (alternative)

Purpose:





Detect duplicates



Group similar test flows



Support optimization & automation

4. Automation-Readiness Scoring

Custom scoring system based on:





Step similarity across test cases



Shared preconditions



Repetitive patterns



Deterministic expected results

Output:





Score (0–100)



Classification:

High automation potential



Medium



Low (manual required)

5. Optimization Logic



Group test cases with:

Same preconditions



Similar execution flows



Suggest:

Execution order



Merge candidates



Redundant tests

6. Role-Based System

Consultant

Upload test cases



View analysis



Validate / adjust results

Manager

View aggregated insights



Track productivity improvements



Export reports


# 🗺️ Master Implementation Plan & Roadmap

TestLens AI is an advanced automotive infotainment test management and productivity ecosystem featuring tailored workflows and scope-restricted collaboration.

---

## 👥 User Roles & Permissions (RBAC)
* **Tester (Consultant):** Executes test cases, uploads sheets, generates JIRA bug drafts, logs daily reports, and updates live bench blocking states.
* **Function Owner (FO):** Reviews bench statuses, accesses the KPI calculator, and reviews draft bug suggestions *strictly* filtered by their assigned scope (e.g., Privacy, eSIM, User Focused).
* **Error Manager (EM):** Monitors active bench blockers to track software/hardware issues and accesses KPI calculations.
* **Test Manager (TM):** Configures static test bench hardware parameters (VIN, IP, CAN channels) and reviews team KPI metrics.

---

## Phase 1: JIRA Parser & Smart Bug Suggestions (Tester & Scope-Locked FO)
* **Backend (FastAPI):**
    * Regex splitting engine to parse JIRA's composite cells using strict prefix matching (`P1`, `A1`, `E1`/`Er1` etc.).
    * Scope-based filtering logic ensuring draft bug suggestions are only exposed to the Tester who generated them and the Function Owner assigned to that specific scope (e.g., Privacy & Security, eSIM & Connectivity).
* **Frontend (React):**
    * Interactive step-failure modal. Tester selects the failed action step to generate a structured JIRA bug markdown draft.
    * Shared Drafts Dashboard where the assigned Function Owner can review, comment on, or approve the drafted bug before JIRA submission.

---

## Phase 2: Daily Report Generator (Tester Exclusive)
* **Core Feature:** Tester form to compile daily execution, bug retest, and bench task metrics.
* **Telemetry:** Secretly logs daily points and activity metrics into the DB for monthly KPI evaluation.

---

## Phase 3: Dedicated Knowledge Hub (Tester Exclusive)
* **Core Feature:** Brand new page featuring a searchable abbreviation glossary (e.g., *KPM -> Konzern Problem Management*) and an unstructured document search (PDFs, Word) using RAG-lite.

---

## Phase 4: Test Bench Reporting Status (All Roles - Tiered Permissions)
* **Configuration (Test Manager Only):** Edit static specifications (VIN, MIB/OCU versions, SOP, Remote Laptop, Frame Grabber IP, CAN Channel).
* **Live Monitoring & Blockers (All Roles):** Testers toggle active blockers (gray globe, putty offline on Serial 2, KL15 relay failure). All roles can view the live statuses.

---

## Phase 5: Monthly KPI Calculator Chatbot (All Roles)
* **Core Feature:** Conversational chatbot calculating monthly scores using exact task weights:
    * **Hard Tasks ($H$):** 4 points per 30 minutes ($8\text{ pts/hour}$).
    * **Medium Tasks ($M$):** 4 points per 60 minutes ($4\text{ pts/hour}$).
    * **Easy Tasks ($E$):** 2 points per 60 minutes ($2\text{ pts/hour}$).
* **Teams Calendar Vision:** Upload zone for Microsoft Teams calendar screenshots parsed via OCR.

---

📊 Current Progress

✅ Defined



Full project concept and scope



Architecture (Frontend / Backend / AI)



Data pipeline design



Core AI components:

Classification



Clustering



Automation-readiness scoring



Dashboard concept and role-based system



Confidentiality strategy (using extracted & synthetic data)

🚧 Not Yet Implemented (as of now)



No actual code implementation started (based on conversation)



No trained model yet



No UI developed yet

▶️ Immediate Next Steps



Create sample dataset (synthetic test cases)



Implement:

Excel/Word parser



Preprocessing pipeline



Build baseline:

TF-IDF + classifier



Implement similarity:

SBERT embeddings + cosine similarity



Prototype dashboard:

Streamlit or simple React UI



Add authentication system

🧪 Unresolved Ideas / Future Enhancements ("Parking Lot")

🔹 Advanced Features



Active learning (model improves with user feedback)



Explainable AI (why a test is classified a certain way)



Multilingual support (better German handling)

🔹 Automation Expansion



Generate automation script templates from clusters



Integration with test automation tools (future)

🔹 Optimization Enhancements



Bench scheduling optimization (if execution data becomes available)



Time estimation refinement (if real execution logs are accessible)

🔹 Integration (Future, if allowed)



Jira API integration (currently restricted)



CI/CD pipeline integration for automated testing workflows

🔹 UX Improvements



Advanced filtering & search



Export to PDF/Excel reports



Visualization of clusters (graph view)

🧩 Final Positioning

This project evolves from a simple idea:



“Classify test cases automatically”

Into a complete system:



An AI-powered decision-support platform for test optimization and automation strategy in industrial environments 


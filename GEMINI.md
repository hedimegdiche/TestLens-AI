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


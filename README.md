# AI Project Analyzer 🚀

**AI Project Analyzer** is a full-stack web application designed for developers, students, and code reviewers. It allows users to upload any software project as a `.ZIP` archive, safely extract and inspect its source code, and run multi-stage static analysis powered by **Claude Fable 5.1** routed via the **Experiential Labs API Gateway**.

The system generates an interactive, high-density analysis dashboard containing tech stack breakdowns, architecture diagrams, code quality observations, issue detection, actionable recommendations, an automatically generated `README.md`, and 15–20 project-specific viva/interview questions.

---

## 🌟 Features

- **Drag-and-Drop ZIP Processing**: Upload software projects up to 50MB.
- **Zip Slip & Path Traversal Guard**: Prevents malicious zip archive entry extraction attacks outside the temporary workspace.
- **Secret Exclusion & Redaction**: Automatically ignores secret files (`.env`, `.env.*`, `*.pem`, `*.key`, `id_rsa`) and applies regex-based redaction to API keys, bearer tokens, passwords, and connection strings prior to AI processing.
- **Intelligent File Prioritization**: Ranks and selects primary configuration files, entry points (`index.js`, `main.py`, `App.jsx`), routes, services, and models within LLM token budget constraints.
- **Multi-Stage AI Pipeline via Experiential Labs Gateway**:
  - **Stage 1 (Discovery)**: Analyzes project metadata and directory structure.
  - **Stage 2 (Module Analysis)**: Analyzes individual high-value source files.
  - **Stage 3 (Synthesis)**: Synthesizes structured JSON output containing architectural flows, code quality assessments, and viva questions.
- **Interactive Dashboard**:
  - **Overview**: Purpose, summary, major detected features, core languages & frameworks.
  - **Tech Stack**: Categorized tools (Frontend, Backend, Database, Libraries) with detection rationale.
  - **Architecture**: Textual architecture summary + interactive Mermaid.js diagram.
  - **Project Structure Explorer**: Interactive file tree view with file size badges and inspector pane.
  - **Code Analysis**: Per-file purpose, key exports, dependencies, and maintainability scores.
  - **Issues**: Centralized findings categorized into Critical, Warning, and Improvement with suggested fixes.
  - **Recommendations**: Project-specific recommendations grounded in source code evidence.
  - **Documentation**: Generated project `README.md` with Copy & Download options.
  - **Viva / Interview Preparation**: 15–20 technical viva questions with suggested answers.
- **Zero Executed Code**: Static file inspection only. Project code is never executed (`npm install`, `exec`, or shell scripts are strictly prohibited).
- **Automated Workspace Cleanup**: Temporary directories are erased immediately after processing.

---

## 🏗️ Architecture & Flow

```
React Frontend (client/)
       ↓
Express Backend (server/)
       ↓
Experiential Labs Gateway (https://api.experientiallabs.ai/v1)
       ↓
Claude Fable 5.1 Model
       ↓
Express Backend (server/)
       ↓
React Dashboard
```

---

## 🔑 Environment Setup & Experiential Labs API Key

1. Navigate to the `server/` folder:
   ```bash
   cd server
   ```
2. Copy the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure your Experiential Labs API Key:
   ```env
   EXPLABS_API_KEY=your_experiential_labs_api_key_here
   EXPLABS_MODEL=claude-fable-5.1
   PORT=5000
   ```

> **Experiential Labs Platform**: Obtain your API key at [Experiential Labs Platform](https://platform.experientiallabs.ai/).

---

## ⚡ Installation & Running Locally

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
```

### 3. Start Development Servers

**Option A: Start Backend Server**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Option B: Start Frontend Development Server**
```bash
cd client
npm run dev
# Running on http://localhost:3000
```

Open your browser at `http://localhost:3000`.

---

## 🔒 Security Considerations

1. **Server-Side API Key**: The Experiential Labs API key (`EXPLABS_API_KEY`) is strictly maintained server-side in `server/.env` and is never sent to the browser, exposed in logs, or returned in API responses.
2. **Zip Slip Protection**: `zipService.js` resolves path destinations and validates that target file paths reside within the canonical temporary directory prior to writing.
3. **Secret Redaction**: `secretRedactor.js` executes regular expression scanning across all text buffers to obscure AWS keys, API tokens, private keys, and passwords.
4. **Limits & Safeguards**:
   - Max Zip Upload: 50 MB
   - Max Extracted Size: 150 MB
   - Max File Count: 1,500
   - Max Single File Size: 2 MB
   - Max AI Text Payload: ~350 KB
5. **No Code Execution**: Strictly static analysis; no shell commands or build scripts are executed.

# Affinity Workforce Platform Prototype

This is a high-fidelity prototype of the Affinity Workforce Platform, built with Next.js 15, Tailwind CSS, ShadCN UI, and Genkit for AI intelligence.

## 🚀 How to Use the Prototype

The app is running automatically in your preview. Use the navigation below to explore:

### 🔐 Login Credentials
Since this is a mock prototype, any password will work for the following emails:

- **Cleaner Portal:** `cleaner1@affinity.com`
- **Admin Control:** `david@affinity.com`

### 🛠️ Key Features

#### 1. Cleaner Experience
- **Simple Onboarding:** A friendly 3-step intro for first-time users.
- **Calm Home Screen:** Action-focused dashboard with a 3-button navigation row.
- **SmartClock™:** Visual geofencing UI with proximity detection.
- **Shift Photos:** A simplified tool for uploading progress photos and auditing supplies.
- **Vault & Arena:** Gamified rewards system and performance leaderboards.

#### 2. Admin Experience
- **Ops Center Dashboard:** High-level overview of staff health and compliance.
- **Live Pulse (Feed):** A real-time audit trail of all field activity.
- **Intelligent Time Review:** AI-powered analysis of shift discrepancies and Ontario break rule compliance.
- **Asset Management:** Inventory tracking for equipment and supplies.

## 📁 Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide React
- **AI Engine:** Genkit (Gemini 2.5 Flash)
- **State:** React Context with a Mock Repository (Simulating a database)

## 🏗️ Project Structure
- `src/ai/flows/`: Genkit AI logic for the Support Assistant and Time Review tool.
- `src/app/lib/repository.ts`: The mock database containing users, shifts, and complex operational scenarios.
- `src/app/cleaner/clock/page.tsx`: The map-based shift tracking logic.

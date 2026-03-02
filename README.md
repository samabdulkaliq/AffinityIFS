# Affinity Workforce Platform Prototype

This is a high-fidelity prototype of the Affinity Workforce Platform, built with Next.js 15, Tailwind CSS, ShadCN UI, and Genkit for AI intelligence.

## 🚀 How to Use the Prototype

The app is running automatically in your preview. Use the navigation below to explore:

### 1. Access Portals (Login Screen)
- **Cleaner Portal:** For on-site workers.
- **Admin Control:** For supervisors and payroll managers.

### 2. Cleaner Features
- **Time Clock:** A visual geofencing UI. In a real app, this would use the browser's Geolocation API. Here, it demonstrates the "Verified" status logic.
- **AI Support Center:** Located in **Settings > AI Support Center**. Cleaners can describe issues (e.g., "I can't find the key") and get instant guidance.
- **Wallet & Rewards:** Workers earn points for punctuality and high ratings.
- **Leaderboard:** A gamified view of top-performing cleaners.

### 3. Admin Features
- **Dashboard:** Overview of staff health and pending items.
- **Intelligent Time Review:** Navigate to **Approvals**, select a request, and click **"Run AI Analysis"**. This uses Genkit to analyze shift data against the **Ontario Break Rule** (30 min unpaid break after 5 hours) and suggests resolutions.
- **User Management:** Mock view of active staff.

## 🛠️ Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide React
- **AI Engine:** Genkit (Gemini 2.5 Flash)
- **State:** React Context with a Mock Repository (Simulating a database)

## 📁 Key Files
- `src/ai/flows/`: Genkit AI logic for the Support Assistant and Time Review tool.
- `src/app/lib/repository.ts`: The mock database containing users, shifts, and complex payroll scenarios.
- `src/app/cleaner/clock/page.tsx`: The visual map and proximity logic.

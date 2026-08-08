# JARVIS Firebase Setup & Configuration Guide

Follow these steps to connect your JARVIS Personal AI Study Assistant to your own Firebase project.

---

## 📋 Prerequisites
- A Google account to access [Firebase Console](https://console.firebase.google.com/).

---

## Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter a project name (e.g. `jarvis-study-assistant`).
4. (Optional) Disable or enable Google Analytics and click **Create project**.

---

## Step 2: Register a Web App & Copy Configuration
1. In the Project Overview page, click the **Web icon (`</>`)** to add an app.
2. Enter an app nickname (e.g., `jarvis-web`).
3. Click **Register app**.
4. Select the **Config** radio button under "SDK setup and configuration". You will see a block like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "jarvis-study.firebaseapp.com",
     projectId: "jarvis-study",
     storageBucket: "jarvis-study.firebasestorage.app",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:..."
   };
   ```

---

## Step 3: Populate `.env.local`
Open your local `.env.local` file in the root of `c:\projects\jarvis` and paste your credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=jarvis-study.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jarvis-study
VITE_FIREBASE_STORAGE_BUCKET=jarvis-study.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:...
```

> [!IMPORTANT]
> - Never commit `.env.local` to Git or share it publicly.
> - `.gitignore` is already configured to keep `.env.local` ignored while `.env.example` remains tracked.

---

## Step 4: Enable Email/Password Authentication
1. In Firebase Console, go to **Build → Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable the **Email/Password** toggle and click **Save**.

---

## Step 5: Create Cloud Firestore Database
1. In Firebase Console, go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a database location close to you (e.g. `us-central1`, `asia-south1`, `europe-west1`).
4. Select **Start in production mode** and click **Create**.

---

## Step 6: Deploy Security Rules
1. In Firestore Database, navigate to the **Rules** tab.
2. Replace the contents with the rules from [`firestore.rules`](file:///c:/projects/jarvis/firestore.rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;

         match /{subcollection}/{docId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
3. Click **Publish**.

---

## Step 7: Run JARVIS Locally
```bash
npm run dev
```

Open `http://localhost:5173`. JARVIS will automatically detect your Firebase configuration, enable live user sign-in, and synchronize your tasks, study sessions, and notes with Firestore!

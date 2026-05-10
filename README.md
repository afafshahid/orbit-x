🚀 Orbit X — Space Travel Booking App

"Leave the gravity behind."

A futuristic space travel booking application built with React + TypeScript and Firebase. Browse destinations across the solar system, select your seat class, process payment, and receive a digital boarding pass — all in a cyberpunk-themed interface.
Course: Applied Human Computer Interaction — Section 6C
Institution: FAST-NUCES Karachi
Instructor: Shaheer Ahmed Khan
Team: Maryiam Khan (23k-0585) · Afaf Shahid (23k-0678) · Aiman Nadeem (23k-0876)

📋 Table of Contents

Features
Tech Stack
Project Structure
Getting Started
Firebase Setup
Environment & Config
Available Scripts
Application Screens
HCI Principles
Deployment
Known Issues


✨ Features

Authentication — Email/password and Google OAuth via Firebase Auth
Explore Trips — Filterable destination cards (Moon, Mars, ISS, Europa, Saturn, and more) with live seat availability
Booking Engine — Interactive seat map with three transmission classes (Orbital-Standard, Star-Executive, Hyper-Suite) and real-time price calculation
Real-Time Conflict Detection — Firestore snapshot listeners prevent double-booking; conflicting seat selections are flagged instantly
Payment Simulation — Test card flow with atomic Firestore transaction (booking creation + seat decrement in one operation)
Digital Boarding Pass — Mission Clearance pass with dynamically generated QR code, downloadable and shareable
My Bookings (Manifest) — Full booking history with cancellation (atomic seat restore), boarding pass access, and review navigation
Reviews & Ratings — Star ratings (1–5) and text reviews per trip, stored as Firestore subcollections
Responsive UI — Mobile-first design with a collapsible navbar and fluid grid layouts


🛠 Tech Stack
LayerTechnologyVersionFrontendReact + TypeScript18.xBuild ToolVite5.xStylingTailwind CSSv4AnimationsFramer Motion11.xBackendFirebase (Auth + Firestore)10.xRoutingReact Router DOM6.xIconsLucide React0.383.xQR Codesqrcode.react3.xUtilitiesclsx + tailwind-mergelatestDeploymentVercel—

📁 Project Structure
orbit-x/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Fixed top nav with auth state
│   │   ├── Footer.tsx          # Site footer with destination links
│   │   └── ScrollToTop.tsx     # Resets scroll position on route change
│   ├── hooks/
│   │   └── useTrips.ts         # Firestore real-time trips subscription
│   ├── lib/
│   │   ├── firebase.ts         # Firebase app + Firestore init
│   │   ├── firebaseUtils.ts    # Centralized Firestore error handler
│   │   └── utils.ts            # cn(), formatDate(), formatPrice()
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── Auth.tsx            # Login / Registration
│   │   ├── Explore.tsx         # Trip discovery + filtering
│   │   ├── Booking.tsx         # Seat map + class selection
│   │   ├── Payment.tsx         # Payment form + Firestore transaction
│   │   ├── Ticket.tsx          # Digital boarding pass + QR code
│   │   ├── MyBookings.tsx      # Booking history + cancellation
│   │   ├── Reviews.tsx         # Trip reviews + star ratings
│   │   ├── About.tsx           # Mission statement
│   │   ├── Fleet.tsx           # Ship showcase
│   │   └── Terms.tsx           # Terms of flight
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and enums
│   ├── App.tsx                 # Router + auth state + layout
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Tailwind + custom theme tokens
├── firebase-applet-config.json # Firebase project config (gitignored if sensitive)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

🚀 Getting Started
Prerequisites

Node.js 18+ and npm
A Firebase project (see Firebase Setup)
Git

Installation
bash# 1. Clone the repository
git clone https://github.com/<your-username>/orbit-x.git
cd orbit-x

# 2. Install dependencies
npm install

# 3. Add your Firebase config (see Firebase Setup below)

# 4. Start the development server
npm run dev
The app will be available at http://localhost:5173.

🔥 Firebase Setup
1. Create a Firebase Project

Go to Firebase Console
Click Add project → name it orbit-x → create
Navigate to Project Settings → General → Your apps → add a Web app
Copy the config object

2. Add Config File
Create firebase-applet-config.json in the project root:
json{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "firestoreDatabaseId": "(default)"
}

⚠️ Add firebase-applet-config.json to .gitignore if your repo is public.

3. Enable Authentication
In Firebase Console → Authentication → Sign-in method, enable:

Email/Password
Google

4. Create Firestore Database

Firebase Console → Firestore Database → Create database
Start in test mode (update rules before production)
Choose your preferred region

5. Firestore Security Rules
Paste these rules in Firestore → Rules:
jsrules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Trips — public read, no client writes
    match /trips/{tripId} {
      allow read: if true;
      allow write: if false;

      // Reviews — public read, authenticated write
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if request.auth != null;
      }
    }

    // Bookings — users access only their own
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    // Users — own profile only
    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
6. Seed Trip Data
After logging in, navigate to /explore and click the Refresh Orbital Database link at the top of the page. This seeds the Firestore trips collection with sample destinations (ISS, Europa, Saturn, Moon, Mars).

⚙️ Environment & Config
All Firebase configuration lives in firebase-applet-config.json. No .env file is required. The file is imported directly in src/lib/firebase.ts.
If you prefer environment variables, replace the JSON import with:
ts// src/lib/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...etc
};
And create a .env.local file:
envVITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

📜 Available Scripts
bashnpm run dev        # Start Vite dev server at localhost:5173
npm run build      # TypeScript compile + Vite production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint

🖥 Application Screens
RouteScreenAuth Required/Home / Landing PageNo/authLogin & RegistrationNo/exploreBrowse DestinationsNo/booking/:tripIdSeat Selection & Class✅ Yes/paymentPayment Authorization✅ Yes/ticket/:bookingIdDigital Boarding Pass✅ Yes/bookingsMy Bookings (Manifest)✅ Yes/reviews/:tripIdTrip ReviewsNo (write requires auth)/aboutOur MissionNo/fleetFleet DetailsNo/termsTerms of FlightNo

🎨 HCI Principles
PrincipleImplementationVisibility of System StatusLive seat availability, real-time price updates, processing animations, next-departure status panelUser Control & FreedomBack navigation at every step, cancel booking, change class/seat before paymentError PreventionForm validation, real-time seat conflict alerts, atomic Firestore transactionsFeedbackImmediate seat highlight on click, price recalculation on class change, success animation post-paymentConsistency & StandardsUniform card layout, consistent button styles, Lucide icon set throughoutAesthetic & Minimalist DesignDark cyberpunk theme with focused layouts, low cognitive loadLearnabilityFamiliar e-commerce booking flow, color-coded seat legend, progressive disclosureAccessibilityHigh contrast (cyber-cyan on dark bg), readable fonts, keyboard-navigable forms

🌐 Deployment
The app is configured for deployment on Vercel.
Deploy to Vercel
bash# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
Or connect your GitHub repo directly in the Vercel dashboard for automatic deployments on every push to main.
SPA Routing Fix
Create a vercel.json in the project root to ensure client-side routes work correctly:
json{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

⚠️ Known Issues

Seat map uses simulated availability — Pre-booked seats are generated deterministically from the trip ID rather than being persisted per-seat in Firestore. Only real confirmed bookings (from the current app) appear as booked in real-time.
Payment is simulated — No real payment gateway is integrated. The test card 4242 4242 4242 4242 (expiry 12/26, CVC 123) is pre-filled.
Download/Share on boarding pass — The Save Pass and Transmit buttons are UI placeholders; browser-level PDF export or Web Share API integration is a planned enhancement.
Reviews are not editable — Review submission is create-only in the current version; edit and delete flows are a planned enhancement.


📄 License
This project was created for academic purposes as part of the Applied Human Computer Interaction course at FAST-NUCES Karachi. Not licensed for commercial use.


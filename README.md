# ElSol Study

A custom flash card study website with Anki-style spaced repetition, designed for teachers to create educational content and students to study effectively.

## Features

- **Teacher Admin Portal**: Teachers can create classes, flash card bundles, and manage content
- **Student Study Interface**: Interactive flash cards with multiple question types
- **Spaced Repetition**: Adaptive learning algorithm based on performance
- **Optional Login**: Students can study without logging in, or login to sync progress
- **Custom Gradients**: Teachers can customize their class page appearance
- **Multiple Question Types**: Multiple choice, typed answers, and free recall

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Routing**: React Router
- **Authentication**: Google OAuth via Firebase

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd elsolstudy
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Google Authentication:
     - Go to Authentication > Sign-in method
     - Enable Google provider
   - Create a Firestore database:
     - Go to Firestore Database > Create database
     - Start in production mode
   - Get your Firebase config:
     - Go to Project Settings > Your Apps
     - Copy the configuration object

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### Firebase Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId &&
                      (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin']));
    }

    // Classes collection
    match /classes/{classId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update, delete: if isAdmin() && resource.data.teacherId == request.auth.uid;
    }

    // Flash card bundles
    match /flashcardBundles/{bundleId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update, delete: if isAdmin() && resource.data.teacherId == request.auth.uid;
    }

    // Flash cards
    match /flashcards/{cardId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update, delete: if isAdmin() && resource.data.teacherId == request.auth.uid;
    }

    // Student progress
    match /studentProgress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firestore Indexes

Create these composite indexes in Firestore:

1. Collection: `classes`
   - Fields: `grade` (Ascending), `subject` (Ascending)

2. Collection: `flashcardBundles`
   - Fields: `classId` (Ascending), `createdAt` (Descending)

3. Collection: `flashcards`
   - Fields: `bundleId` (Ascending), `order` (Ascending)

### Making a User an Admin

Since admin privileges must be manually assigned:

1. Have the teacher sign in to the app at least once
2. Go to Firebase Console > Firestore Database
3. Find their user document in the `users` collection
4. Edit the document and set `isAdmin: true`

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Deploying to Firebase Hosting (Optional)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── pages/             # Page components
│   ├── Home.jsx
│   ├── ClassPage.jsx
│   ├── StudyPage.jsx
│   ├── Settings.jsx
│   └── TeacherDashboard.jsx
├── config/            # Configuration files
│   └── firebase.js
├── App.jsx           # Main app component
└── main.jsx         # Entry point
```

## Documentation

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Detailed project specifications
- [FIRESTORE_STRUCTURE.md](FIRESTORE_STRUCTURE.md) - Database schema and structure

## Features Roadmap

### Implemented
- ✅ Firebase authentication with Google
- ✅ Teacher admin dashboard
- ✅ Class creation with custom gradients
- ✅ Student browsing by grade/subject/teacher
- ✅ Basic study interface
- ✅ Settings page with avatar selection
- ✅ Optional student login

### To Be Implemented
- ⬜ Flash card bundle creation interface
- ⬜ Flash card creation with multiple question types
- ⬜ Spaced repetition algorithm
- ⬜ Local storage for student progress
- ⬜ Progress syncing when students log in
- ⬜ Teacher analytics dashboard
- ⬜ Bulk import/export of flash cards
- ⬜ Rich text editor for questions

## Contributing

This is a private educational project. For questions or suggestions, please contact the project maintainer.

## License

See [LICENSE](LICENSE) file for details.

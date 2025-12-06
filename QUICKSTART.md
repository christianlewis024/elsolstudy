# Quick Start Guide

This guide will help you get ElSol Study up and running quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Firebase

### Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or use an existing project
3. Follow the setup wizard

### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Click on **Sign-in method** tab
4. Enable **Google** provider
5. Add your email as a test user if needed

### Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location close to your users
5. Click **Enable**

### Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "ElSol Study Web")
5. Copy the `firebaseConfig` object

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 4: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on the **Rules** tab
3. Copy and paste the security rules from the README.md file
4. Click **Publish**

## Step 5: Run the Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see your app!

## Step 6: Make Your First Admin User

Since you need at least one admin (teacher) to create content:

1. Sign in to the app using Google
2. Go to Firebase Console → Firestore Database
3. Click on the **users** collection
4. Find your user document (it will be created after first sign-in)
5. Click on the document
6. Click **Edit field** on the `isAdmin` field
7. Change `false` to `true`
8. Save the changes
9. Refresh your app - you should now see "My Classes" in the navbar

## Step 7: Create Your First Class

1. Click **My Classes** in the navbar
2. Click **Create New Class**
3. Fill in:
   - Grade (e.g., "6th", "7th", "12th")
   - Subject (e.g., "Science", "Math", "English")
   - Choose gradient colors for your class page
4. Click **Create Class**

## Next Steps

Now that you have the basic setup complete, you'll need to implement:

1. **Flash Card Bundle Creation** - Interface for teachers to create sets of flash cards
2. **Flash Card Creation** - Form to add individual cards with different question types
3. **Spaced Repetition Algorithm** - Logic to calculate when cards should be reviewed
4. **Local Storage** - Save student progress locally when not logged in
5. **Progress Sync** - Sync local progress to Firebase when students log in

## Troubleshooting

### "Firebase app not configured" error
- Make sure your `.env` file exists and has all the required variables
- Restart the dev server after creating/modifying `.env`

### "Permission denied" errors in Firestore
- Check that your security rules are published
- Verify you're signed in when trying to access protected data
- For admin features, ensure your user's `isAdmin` field is `true`

### Can't see "My Classes" link
- Sign out and sign back in after setting `isAdmin: true`
- Check browser console for any errors
- Verify the user document exists in Firestore with `isAdmin: true`

### Styles not loading
- Make sure you've imported all CSS files in their respective components
- Check that the CSS files exist in the correct locations
- Clear browser cache and refresh

## Development Tips

- Use the browser's DevTools Console to check for errors
- Install React Developer Tools browser extension for debugging
- Use Firebase Console to inspect your database in real-time
- Check the Network tab to see Firebase API calls

## Need Help?

- Review the [PROJECT_PLAN.md](PROJECT_PLAN.md) for feature details
- Check [FIRESTORE_STRUCTURE.md](FIRESTORE_STRUCTURE.md) for database schema
- See [README.md](README.md) for comprehensive documentation

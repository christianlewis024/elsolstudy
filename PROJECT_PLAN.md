# ElSol Study - Project Plan

## Overview
A custom flash card study website with Anki-style spaced repetition, designed for teachers to create educational content and students to study effectively.

## Core Concept
- Teachers create and manage flash card sets for their specific grade/subject combinations
- Students use these flash cards with adaptive learning based on performance
- Spaced repetition algorithm adjusts based on answer accuracy and response time
- Firebase backend with Google authentication
- No social features or messaging between users

## User Roles

### Students (Default)
- **No login required** for basic access
- **Optional login** for personalized features:
  - Custom display name
  - Avatar selection from predefined list
  - Progress tracking across sessions
- Local storage for progress data (when not logged in)
- Can reset their progress data via settings

### Teachers (Admin)
- Must log in with Google authentication
- Admin status manually assigned through backend
- Can create, edit, and delete their own content
- Manage multiple grade/subject combinations
- Each teacher can have multiple unique class pages (e.g., Mrs. Smith's 6th Grade Science AND 7th Grade Science)

## Flash Card Features

### Question Types
Teachers can choose from three formats per flash card:
1. **Multiple Choice** - Select from provided options
2. **Typed Answer** - Must spell correctly
3. **Free Answer** - Self-assessed (say aloud or think)

Each flash card set can mix different question types.

### Timing System
- Teachers set target time per question
- Default timing options available for quick setup
- Manual override for individual questions
- Student performance tracked against target time

### Spaced Repetition Algorithm
Performance metrics tracked:
- Response time vs. target time
- Answer correctness
- Skipped questions
- Incorrect attempts

Algorithm adjusts card frequency based on these factors.

## Navigation Structure

### Student View
**Left Sidebar Navigation:**
```
Grades (expandable)
├── [Grade Level]
    └── Subjects (expandable)
        └── Teachers (clickable)
            → Leads to specific teacher's class page
```

**Top Navigation Bar:**
- Browse/Search
- Settings (includes reset progress option)
- Login (optional)

### Teacher View
**Top Navigation Bar:**
- My Classes
- Settings
- Profile/Logout

Teachers only see and manage their own classes.

## Teacher Class Page Features

### Content Creation
- Create flash card bundles
- Add/edit/delete individual flash cards
- Set question types per card
- Configure timing targets (default or custom)

### Supplementary Content
- Add text comments/notes to bundles
- Embed YouTube video links
- Additional study resources

### Customization
- Custom gradient background color picker
- Personalize page appearance per class

## Technical Stack

### Backend
- **Firebase** for all backend services
- **Firebase Authentication** with Google sign-in
- **Firestore Database** for content storage
- **Firebase Hosting** (optional)

### Data Storage
- Server-side: All flash card content, teacher data
- Client-side (Local Storage): Student progress when not logged in
- Server-side: Student progress when logged in

### Security
- No user-to-user messaging capabilities
- Admin privileges manually assigned
- Teachers can only modify their own content
- Students have read-only access to content

## Data Structure (Conceptual)

### Teachers
- Teacher ID (from Google Auth)
- Name
- Admin status
- List of classes they manage

### Classes
- Unique ID per grade/subject/teacher combination
- Grade level
- Subject
- Teacher ID
- Custom gradient colors
- Flash card bundles

### Flash Card Bundles
- Bundle ID
- Title
- Description/comments
- YouTube links
- Array of flash cards
- Creation/modification dates

### Flash Cards
- Question text
- Answer
- Question type (multiple choice, typed, free answer)
- Multiple choice options (if applicable)
- Target time
- Metadata

### Student Progress (Local or Firebase)
- Card ID
- Last reviewed date
- Performance history
- Next review date
- Confidence level

## Key Features Summary

### For Students
- No login required (optional login available)
- Browse by grade → subject → teacher
- Multiple question formats
- Adaptive learning based on performance
- Progress persistence
- Reset progress option
- Avatar and display name customization (when logged in)

### For Teachers
- Google authentication required
- Create unlimited class pages (multiple grades/subjects)
- Flexible flash card creation
- Mix question types within sets
- Add supplementary materials
- Custom page styling
- Full control over their content

## Authentication Flow

### Students
1. Can use app without logging in (progress stored locally)
2. Optional: Sign in with Google
3. Set display name and choose avatar
4. Progress syncs to Firebase

### Teachers
1. Must sign in with Google
2. Admin status verified
3. Access to "My Classes" management interface
4. Create/edit content for their classes

## Scope Limitations (Initial Release)
- No direct messaging between users
- No social features
- No student-created content
- Admin privileges assigned manually (no self-registration as teacher)
- Predefined avatar list only
- No custom student avatars

## Future Considerations (Not in Initial Scope)
- Analytics for teachers to view class performance
- Export/import flash card sets
- Collaboration between teachers
- Mobile app version
- Offline mode
- Print-friendly study sheets

## Settings Features
- Reset progress data
- Toggle login
- Customize study preferences
- Display preferences
- Avatar/name management (logged in users)

## Design Notes
- Clean, minimal interface
- Focus on studying, not social interaction
- Mobile-responsive design
- Accessibility considerations
- Fast loading times
- Intuitive navigation

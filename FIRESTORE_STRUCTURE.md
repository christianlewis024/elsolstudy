# Firestore Database Structure

## Collections Overview

### 1. users
Stores user profiles for both students and teachers.

```javascript
users/{userId}
{
  uid: string,                    // Firebase Auth UID
  email: string,                  // User's email
  displayName: string,            // From Google Auth
  customDisplayName: string,      // Student's custom display name (optional)
  selectedAvatar: string | null,  // Avatar ID from predefined list
  isAdmin: boolean,               // true for teachers, false for students
  createdAt: string,              // ISO date string
  photoURL: string | null         // Custom avatar URL
}
```

### 2. classes
Stores class information created by teachers.

```javascript
classes/{classId}
{
  id: string,                     // Auto-generated class ID
  teacherId: string,              // User ID of the teacher who created this
  teacherName: string,            // Display name of teacher
  grade: string,                  // e.g., "6th", "7th", "12th"
  subject: string,                // e.g., "Science", "Math", "English"
  gradientColors: {               // Custom background gradient
    color1: string,               // Hex color
    color2: string,               // Hex color
    angle: number                 // Gradient angle in degrees
  },
  createdAt: string,              // ISO date string
  updatedAt: string               // ISO date string
}
```

### 3. flashcardBundles
Stores bundles/sets of flash cards created by teachers.

```javascript
flashcardBundles/{bundleId}
{
  id: string,                     // Auto-generated bundle ID
  classId: string,                // Reference to class this belongs to
  teacherId: string,              // User ID of teacher
  title: string,                  // Bundle title
  description: string,            // Bundle description
  comments: string,               // Teacher's comments/notes
  youtubeLinks: [                 // Array of YouTube video links
    {
      url: string,
      title: string
    }
  ],
  createdAt: string,              // ISO date string
  updatedAt: string,              // ISO date string
  cardCount: number               // Number of cards in this bundle
}
```

### 4. flashcards
Stores individual flash cards.

```javascript
flashcards/{cardId}
{
  id: string,                     // Auto-generated card ID
  bundleId: string,               // Reference to bundle this belongs to
  classId: string,                // Reference to class
  teacherId: string,              // User ID of teacher
  question: string,               // The question text
  answer: string,                 // The correct answer
  questionType: string,           // "multiple_choice" | "typed" | "free_answer"
  multipleChoiceOptions: [        // Only if questionType is "multiple_choice"
    string,
    string,
    string,
    string
  ],
  targetTime: number,             // Target time in seconds
  order: number,                  // Order within the bundle
  createdAt: string,              // ISO date string
  updatedAt: string               // ISO date string
}
```

### 5. studentProgress
Stores student progress for logged-in users (synced from local storage).

```javascript
studentProgress/{userId}/cards/{cardId}
{
  userId: string,                 // User ID
  cardId: string,                 // Flash card ID
  bundleId: string,               // Bundle ID
  lastReviewed: string,           // ISO date string
  nextReview: string,             // ISO date string (calculated by algorithm)
  confidenceLevel: number,        // 0-5, used for spaced repetition
  reviewCount: number,            // Total number of reviews
  correctCount: number,           // Number of correct answers
  incorrectCount: number,         // Number of incorrect answers
  skipCount: number,              // Number of times skipped
  averageResponseTime: number,    // Average response time in seconds
  performanceHistory: [           // Last 10 performance records
    {
      timestamp: string,          // ISO date string
      correct: boolean,
      responseTime: number,       // In seconds
      skipped: boolean
    }
  ]
}
```

## Security Rules

### Users Collection
- Users can read their own document
- Users can update their own document (except isAdmin field)
- Only admins can write to other user documents
- Admin status can only be changed through backend/admin SDK

### Classes Collection
- Anyone can read classes (for browsing)
- Only teachers (isAdmin: true) can create classes
- Teachers can only update/delete their own classes

### FlashcardBundles Collection
- Anyone can read bundles
- Only the teacher who created the bundle can update/delete it

### Flashcards Collection
- Anyone can read flash cards
- Only the teacher who created the card can update/delete it

### StudentProgress Collection
- Users can only read/write their own progress data
- No cross-user access allowed

## Indexes Required

1. Classes by grade and subject:
   - Collection: `classes`
   - Fields: `grade ASC, subject ASC`

2. Classes by teacher:
   - Collection: `classes`
   - Fields: `teacherId ASC, grade ASC`

3. Bundles by class:
   - Collection: `flashcardBundles`
   - Fields: `classId ASC, createdAt DESC`

4. Cards by bundle:
   - Collection: `flashcards`
   - Fields: `bundleId ASC, order ASC`

5. Student progress by next review:
   - Collection: `studentProgress/{userId}/cards`
   - Fields: `nextReview ASC, confidenceLevel ASC`

## Local Storage Structure (for non-logged-in students)

```javascript
// Key: elsolstudy_progress
{
  cards: {
    [cardId]: {
      cardId: string,
      bundleId: string,
      lastReviewed: string,
      nextReview: string,
      confidenceLevel: number,
      reviewCount: number,
      correctCount: number,
      incorrectCount: number,
      skipCount: number,
      averageResponseTime: number,
      performanceHistory: [...]
    }
  },
  lastSync: string // ISO date string
}
```

When a user logs in, this data should be synced to Firestore.

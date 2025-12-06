// Grade levels
export const GRADE_LEVELS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1st', label: '1st Grade' },
  { value: '2nd', label: '2nd Grade' },
  { value: '3rd', label: '3rd Grade' },
  { value: '4th', label: '4th Grade' },
  { value: '5th', label: '5th Grade' },
  { value: '6th', label: '6th Grade' },
  { value: '7th', label: '7th Grade' },
  { value: '8th', label: '8th Grade' },
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' }
];

// Elementary grades (K-5th) - single teacher, no subject selection needed
export const ELEMENTARY_GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th'];

// Subjects for middle school (6th-8th) and high school (9th-12th)
export const SUBJECTS = [
  // Core Subjects
  { value: 'Math', label: 'Math', category: 'Core' },
  { value: 'English/Language Arts', label: 'English/Language Arts', category: 'Core' },
  { value: 'Science', label: 'Science', category: 'Core' },
  { value: 'Social Studies', label: 'Social Studies', category: 'Core' },
  { value: 'History', label: 'History', category: 'Core' },

  // Math Subtypes
  { value: 'Algebra I', label: 'Algebra I', category: 'Math' },
  { value: 'Algebra II', label: 'Algebra II', category: 'Math' },
  { value: 'Geometry', label: 'Geometry', category: 'Math' },
  { value: 'Pre-Calculus', label: 'Pre-Calculus', category: 'Math' },
  { value: 'Calculus', label: 'Calculus', category: 'Math' },
  { value: 'Statistics', label: 'Statistics', category: 'Math' },
  { value: 'Trigonometry', label: 'Trigonometry', category: 'Math' },

  // Science Subtypes
  { value: 'Biology', label: 'Biology', category: 'Science' },
  { value: 'Chemistry', label: 'Chemistry', category: 'Science' },
  { value: 'Physics', label: 'Physics', category: 'Science' },
  { value: 'Earth Science', label: 'Earth Science', category: 'Science' },
  { value: 'Environmental Science', label: 'Environmental Science', category: 'Science' },
  { value: 'Anatomy & Physiology', label: 'Anatomy & Physiology', category: 'Science' },

  // History/Social Studies Subtypes
  { value: 'World History', label: 'World History', category: 'History' },
  { value: 'US History', label: 'US History', category: 'History' },
  { value: 'European History', label: 'European History', category: 'History' },
  { value: 'Government/Civics', label: 'Government/Civics', category: 'Social Studies' },
  { value: 'Economics', label: 'Economics', category: 'Social Studies' },
  { value: 'Geography', label: 'Geography', category: 'Social Studies' },
  { value: 'Psychology', label: 'Psychology', category: 'Social Studies' },

  // English Subtypes
  { value: 'Literature', label: 'Literature', category: 'English/Language Arts' },
  { value: 'Writing/Composition', label: 'Writing/Composition', category: 'English/Language Arts' },
  { value: 'Reading', label: 'Reading', category: 'English/Language Arts' },

  // Foreign Languages
  { value: 'Spanish', label: 'Spanish', category: 'Language' },
  { value: 'French', label: 'French', category: 'Language' },
  { value: 'German', label: 'German', category: 'Language' },
  { value: 'Chinese', label: 'Chinese', category: 'Language' },
  { value: 'Japanese', label: 'Japanese', category: 'Language' },
  { value: 'Latin', label: 'Latin', category: 'Language' },

  // Arts
  { value: 'Art', label: 'Art', category: 'Arts' },
  { value: 'Music', label: 'Music', category: 'Arts' },
  { value: 'Drama/Theater', label: 'Drama/Theater', category: 'Arts' },
  { value: 'Band', label: 'Band', category: 'Arts' },
  { value: 'Choir', label: 'Choir', category: 'Arts' },
  { value: 'Orchestra', label: 'Orchestra', category: 'Arts' },

  // Physical Education
  { value: 'Physical Education', label: 'Physical Education', category: 'PE' },
  { value: 'Health', label: 'Health', category: 'PE' },

  // Technology/Computer
  { value: 'Computer Science', label: 'Computer Science', category: 'Technology' },
  { value: 'Programming', label: 'Programming', category: 'Technology' },
  { value: 'Web Design', label: 'Web Design', category: 'Technology' },
  { value: 'Robotics', label: 'Robotics', category: 'Technology' },

  // Career/Technical
  { value: 'Business', label: 'Business', category: 'Career/Technical' },
  { value: 'Accounting', label: 'Accounting', category: 'Career/Technical' },
  { value: 'Marketing', label: 'Marketing', category: 'Career/Technical' },
  { value: 'Engineering', label: 'Engineering', category: 'Career/Technical' },
  { value: 'Culinary Arts', label: 'Culinary Arts', category: 'Career/Technical' },
  { value: 'Auto Shop', label: 'Auto Shop', category: 'Career/Technical' },
  { value: 'Woodworking', label: 'Woodworking', category: 'Career/Technical' },

  // Other
  { value: 'Study Hall', label: 'Study Hall', category: 'Other' },
  { value: 'Homeroom', label: 'Homeroom', category: 'Other' },
  { value: 'Special Education', label: 'Special Education', category: 'Other' },
  { value: 'ESL/ELL', label: 'ESL/ELL', category: 'Other' }
];

// Default subject for elementary grades
export const ELEMENTARY_SUBJECT = 'General Education';

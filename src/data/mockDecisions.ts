import { User, Decision, Option, Vote, Reaction, Comment } from '../types/decision';

// Mock user data
export const mockUsers: User[] = [
  { id: '1', name: 'Zhang Ming', avatar: '👨‍💼' },
  { id: '2', name: 'Li Hua', avatar: '👩‍💻' },
  { id: '3', name: 'Wang Fang', avatar: '👩‍🎓' },
  { id: '4', name: 'Liu Qiang', avatar: '👨‍🔧' },
  { id: '5', name: 'Chen Jie', avatar: '👩‍🏫' },
];

// Mock decision data
export const mockDecisions: Decision[] = [
  {
    id: '1',
    title: 'Select Team Project Topic',
    description: 'We need to choose a project topic for our software engineering course. Please propose ideas and vote.',
    creatorId: '1',
    stage: 'vote',
    status: 'active',
    createdAt: new Date('2025-10-10'),
    deadline: new Date('2025-10-15'),
  },
  {
    id: '2',
    title: 'Weekend Team Building Location',
    description: "Where should we go for next weekend's team building activity?",
    creatorId: '2',
    stage: 'explore',
    status: 'active',
    createdAt: new Date('2025-10-11'),
  },
  {
    id: '3',
    title: 'Technology Stack Selection',
    description: 'Choose the tech stack for the new project, considering team familiarity and project requirements.',
    creatorId: '1',
    stage: 'vote',
    status: 'active',
    createdAt: new Date('2025-10-09'),
  },
];

// Mock option data
export const mockOptions: Option[] = [
  // Options for decision 1
  {
    id: '1',
    decisionId: '1',
    title: 'Smart Campus Navigation System',
    description: 'Develop an AR-based campus navigation app to help freshmen and visitors find destinations quickly',
    proposedBy: '1',
    createdAt: new Date('2025-10-10T10:00:00'),
  },
  {
    id: '2',
    decisionId: '1',
    title: 'Online Learning Platform',
    description: 'Build a learning management system with video courses, assignment submission, and discussion features',
    proposedBy: '2',
    createdAt: new Date('2025-10-10T10:30:00'),
  },
  {
    id: '3',
    decisionId: '1',
    title: 'Campus Second-hand Marketplace',
    description: 'Provide a safe and convenient platform for students to trade second-hand items on campus',
    proposedBy: '3',
    createdAt: new Date('2025-10-10T11:00:00'),
  },
  {
    id: '4',
    decisionId: '1',
    title: 'Healthy Diet Recommendation System',
    description: 'Recommend cafeteria dishes and nutritional combinations based on user health data and preferences',
    proposedBy: '4',
    createdAt: new Date('2025-10-10T11:30:00'),
  },
  // Options for decision 2
  {
    id: '5',
    decisionId: '2',
    title: 'Hiking at Fragrant Hills',
    description: 'Beautiful autumn leaves at Fragrant Hills, great for exercise and nature',
    proposedBy: '2',
    createdAt: new Date('2025-10-11T09:00:00'),
  },
  {
    id: '6',
    decisionId: '2',
    title: 'Escape Room',
    description: 'Team collaboration and puzzle solving to strengthen teamwork',
    proposedBy: '3',
    createdAt: new Date('2025-10-11T09:30:00'),
  },
  {
    id: '7',
    decisionId: '2',
    title: 'Mystery Murder Game',
    description: 'Immersive gaming experience, fun and great for getting to know each other better',
    proposedBy: '5',
    createdAt: new Date('2025-10-11T10:00:00'),
  },
  // Options for decision 3
  {
    id: '8',
    decisionId: '3',
    title: 'React + Node.js',
    description: 'React frontend + Node.js/Express backend + MongoDB',
    proposedBy: '1',
    createdAt: new Date('2025-10-09T14:00:00'),
  },
  {
    id: '9',
    decisionId: '3',
    title: 'Vue + Spring Boot',
    description: 'Vue3 frontend + Spring Boot backend + MySQL',
    proposedBy: '2',
    createdAt: new Date('2025-10-09T14:30:00'),
  },
  {
    id: '10',
    decisionId: '3',
    title: 'Next.js + Supabase',
    description: 'Next.js full-stack framework + Supabase backend service',
    proposedBy: '4',
    createdAt: new Date('2025-10-09T15:00:00'),
  },
];

// Mock vote data
export const mockVotes: Vote[] = [
  // Votes for decision 1
  { id: '1', userId: '1', optionId: '1', decisionId: '1', createdAt: new Date() },
  { id: '2', userId: '2', optionId: '2', decisionId: '1', createdAt: new Date() },
  { id: '3', userId: '3', optionId: '2', decisionId: '1', createdAt: new Date() },
  { id: '4', userId: '4', optionId: '4', decisionId: '1', createdAt: new Date() },
  { id: '5', userId: '5', optionId: '2', decisionId: '1', createdAt: new Date() },
  // Votes for decision 3
  { id: '6', userId: '1', optionId: '8', decisionId: '3', createdAt: new Date() },
  { id: '7', userId: '2', optionId: '9', decisionId: '3', createdAt: new Date() },
  { id: '8', userId: '3', optionId: '8', decisionId: '3', createdAt: new Date() },
  { id: '9', userId: '4', optionId: '10', decisionId: '3', createdAt: new Date() },
];

// Mock reaction data
export const mockReactions: Reaction[] = [
  { id: '1', userId: '1', optionId: '1', type: 'like' },
  { id: '2', userId: '2', optionId: '1', type: 'like' },
  { id: '3', userId: '3', optionId: '1', type: 'question' },
  { id: '4', userId: '4', optionId: '2', type: 'like' },
  { id: '5', userId: '5', optionId: '2', type: 'like' },
  { id: '6', userId: '1', optionId: '3', type: 'concern' },
  { id: '7', userId: '2', optionId: '5', type: 'like' },
  { id: '8', userId: '3', optionId: '6', type: 'like' },
  { id: '9', userId: '4', optionId: '6', type: 'like' },
];

// Mock comment data
export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    decisionId: '1',
    optionId: '1',
    content: 'Would AR technology be too complex to implement? We need to consider the development timeline.',
    createdAt: new Date('2025-10-10T12:00:00'),
  },
  {
    id: '2',
    userId: '3',
    decisionId: '1',
    optionId: '2',
    content: 'The online learning platform is very practical, and we are all familiar with this tech stack.',
    createdAt: new Date('2025-10-10T12:30:00'),
  },
  {
    id: '3',
    userId: '4',
    decisionId: '1',
    content: "Let's consider the balance between innovation and practicality, as well as our timeline.",
    createdAt: new Date('2025-10-10T13:00:00'),
  },
  {
    id: '4',
    userId: '5',
    decisionId: '2',
    optionId: '7',
    content: 'Mystery murder games need advance booking. If we choose this, I can help contact the venue.',
    createdAt: new Date('2025-10-11T11:00:00'),
  },
];

// 类型定义

export type TopicStatus = 'exploring' | 'voting' | 'closed';
export type ReactionType = 'like' | 'question' | 'concern';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  status: TopicStatus;
  createdAt: string;
  deadline?: string;
}

export interface Option {
  id: string;
  topicId: string;
  title: string;
  description: string;
  proposedBy: string;
  votes: number;
  createdAt: string;
}

export interface Vote {
  id: string;
  userId: string;
  optionId: string;
  topicId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  optionId: string;
  topicId: string;
  content: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  optionId: string;
  type: ReactionType;
}

// Core data type definitions

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type DecisionStage = 'explore' | 'vote';
export type DecisionStatus = 'active' | 'closed';

export type Decision = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  stage: DecisionStage;
  status: DecisionStatus;
  createdAt: Date;
  deadline?: Date;
};

export type Option = {
  id: string;
  decisionId: string;
  title: string;
  description?: string;
  proposedBy: string;
  createdAt: Date;
};

export type Vote = {
  id: string;
  userId: string;
  optionId: string;
  decisionId: string;
  createdAt: Date;
};

export type ReactionType = 'like' | 'question' | 'concern';

export type Reaction = {
  id: string;
  userId: string;
  optionId: string;
  type: ReactionType;
};

export type Comment = {
  id: string;
  userId: string;
  decisionId: string;
  optionId?: string;
  content: string;
  createdAt: Date;
};

// Aggregated data type for display
export type OptionWithStats = Option & {
  voteCount: number;
  reactions: {
    like: number;
    question: number;
    concern: number;
  };
  hasUserVoted: boolean;
  userReactions: ReactionType[];
};

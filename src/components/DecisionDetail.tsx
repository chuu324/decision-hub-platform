import { useState } from 'react';
import {
  Decision,
  Option,
  Vote,
  Reaction,
  Comment,
  User,
  OptionWithStats,
  ReactionType,
} from '../types/decision';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { OptionCard } from './OptionCard';
import { AddOptionDialog } from './AddOptionDialog';
import { CommentSection } from './CommentSection';
import {
  ArrowLeft,
  Plus,
  Play,
  Lock,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type DecisionDetailProps = {
  decision: Decision;
  options: Option[];
  votes: Vote[];
  reactions: Reaction[];
  comments: Comment[];
  users: User[];
  currentUserId: string;
  onBack: () => void;
  onAddOption: (decisionId: string, title: string, description: string) => void;
  onVote: (decisionId: string, optionId: string) => void;
  onReaction: (optionId: string, type: ReactionType) => void;
  onAddComment: (decisionId: string, content: string) => void;
  onChangeStage: (decisionId: string, stage: Decision['stage']) => void;
  onCloseDecision: (decisionId: string) => void;
};

export function DecisionDetail({
  decision,
  options,
  votes,
  reactions,
  comments,
  users,
  currentUserId,
  onBack,
  onAddOption,
  onVote,
  onReaction,
  onAddComment,
  onChangeStage,
  onCloseDecision,
}: DecisionDetailProps) {
  const [showAddOption, setShowAddOption] = useState(false);
  const [showStageChangeDialog, setShowStageChangeDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const isCreator = decision.creatorId === currentUserId;

  // 计算每个选项的统计数据
  const optionsWithStats: OptionWithStats[] = options.map((option) => {
    const optionVotes = votes.filter((v) => v.optionId === option.id);
    const optionReactions = reactions.filter((r) => r.optionId === option.id);
    const userVote = optionVotes.find((v) => v.userId === currentUserId);
    const userReactions = optionReactions
      .filter((r) => r.userId === currentUserId)
      .map((r) => r.type);

    return {
      ...option,
      voteCount: optionVotes.length,
      reactions: {
        like: optionReactions.filter((r) => r.type === 'like').length,
        question: optionReactions.filter((r) => r.type === 'question').length,
        concern: optionReactions.filter((r) => r.type === 'concern').length,
      },
      hasUserVoted: !!userVote,
      userReactions,
    };
  });

  // 按票数排序
  const sortedOptions = [...optionsWithStats].sort((a, b) => b.voteCount - a.voteCount);
  const winningOption = sortedOptions.length > 0 ? sortedOptions[0] : null;
  const totalVotes = votes.filter((v) => v.decisionId === decision.id).length;

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown User';
  };

  const handleAddOption = (data: { title: string; description: string }) => {
    onAddOption(decision.id, data.title, data.description);
  };

  const handleVote = (optionId: string) => {
    // Check if user has already voted
    const hasVoted = votes.some(
      (v) => v.decisionId === decision.id && v.userId === currentUserId
    );
    if (!hasVoted) {
      onVote(decision.id, optionId);
    }
  };

  const handleAddComment = (content: string) => {
    onAddComment(decision.id, content);
  };

  const handleChangeStage = () => {
    const newStage = decision.stage === 'explore' ? 'vote' : 'explore';
    onChangeStage(decision.id, newStage);
    setShowStageChangeDialog(false);
  };

  const decisionComments = comments.filter((c) => c.decisionId === decision.id);

  return (
    <div className="space-y-6">
      {/* Header navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1>{decision.title}</h1>
          <p className="text-muted-foreground">{decision.description}</p>
        </div>
      </div>

      {/* Status information */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant={decision.stage === 'explore' ? 'secondary' : 'default'}>
          {decision.stage === 'explore' ? '🔍 Exploration Phase' : '📊 Voting Phase'}
        </Badge>
        <span className="text-muted-foreground">
          Creator: {getUserName(decision.creatorId)}
        </span>
        <span className="text-muted-foreground">
          Participants: {new Set(votes.map((v) => v.userId)).size}
        </span>
        {decision.stage === 'vote' && (
          <span className="text-muted-foreground">Total Votes: {totalVotes}</span>
        )}
      </div>

      {/* Phase description */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {decision.stage === 'explore' ? 'Exploration Phase' : 'Voting Phase'}
        </AlertTitle>
        <AlertDescription>
          {decision.stage === 'explore'
            ? 'During the exploration phase, all members can propose new candidate solutions and provide feedback on existing ones.'
            : 'During the voting phase, options are locked. Each member can vote for one solution. Discussion can continue after voting.'}
        </AlertDescription>
      </Alert>

      {/* Creator control buttons */}
      {isCreator && (
        <div className="flex gap-2">
          {decision.stage === 'explore' ? (
            <Button onClick={() => setShowStageChangeDialog(true)}>
              <Play className="mr-2 h-4 w-4" />
              Enter Voting Phase
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setShowStageChangeDialog(true)}>
              <Lock className="mr-2 h-4 w-4" />
              Return to Exploration
            </Button>
          )}
          {decision.status === 'active' && (
            <Button variant="destructive" onClick={() => setShowCloseDialog(true)}>
              <Award className="mr-2 h-4 w-4" />
              Close Decision
            </Button>
          )}
        </div>
      )}

      {/* Add option button */}
      {decision.stage === 'explore' && decision.status === 'active' && (
        <Button onClick={() => setShowAddOption(true)} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Option
        </Button>
      )}

      {/* Options list */}
      <div className="space-y-4">
        <h2>Candidate Solutions ({options.length})</h2>
        {sortedOptions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Candidate Solutions Yet</AlertTitle>
            <AlertDescription>
              {decision.stage === 'explore'
                ? 'Click "Add New Option" to propose the first candidate solution.'
                : 'No options available to vote on.'}
            </AlertDescription>
          </Alert>
        ) : (
          sortedOptions.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              proposerName={getUserName(option.proposedBy)}
              currentUserId={currentUserId}
              stage={decision.stage}
              totalVotes={totalVotes}
              isWinner={decision.status === 'closed' && option.id === winningOption?.id}
              onVote={handleVote}
              onReaction={onReaction}
            />
          ))
        )}
      </div>

      {/* Comments section */}
      <CommentSection
        comments={decisionComments}
        users={users}
        currentUserId={currentUserId}
        onAddComment={handleAddComment}
      />

      {/* Dialogs */}
      <AddOptionDialog
        open={showAddOption}
        onOpenChange={setShowAddOption}
        onAddOption={handleAddOption}
      />

      <AlertDialog open={showStageChangeDialog} onOpenChange={setShowStageChangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {decision.stage === 'explore' ? 'Enter Voting Phase?' : 'Return to Exploration?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {decision.stage === 'explore'
                ? 'After entering the voting phase, all options will be locked. Members can only vote and discuss, but cannot add new options. Are you sure you want to proceed?'
                : 'Returning to exploration phase will clear all voting records. Members can continue to add and modify options. Are you sure you want to proceed?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeStage}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Decision?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing the decision will lock the voting results and announce the winning solution. This action cannot be undone. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onCloseDecision(decision.id);
                setShowCloseDialog(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

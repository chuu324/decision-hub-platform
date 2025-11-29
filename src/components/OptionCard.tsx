import { OptionWithStats, User, DecisionStage } from '../types/decision';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ThumbsUp, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

type OptionCardProps = {
  option: OptionWithStats;
  proposerName: string;
  currentUserId: string;
  stage: DecisionStage;
  totalVotes: number;
  isWinner?: boolean;
  onVote: (optionId: string) => void;
  onReaction: (optionId: string, type: 'like' | 'question' | 'concern') => void;
};

export function OptionCard({
  option,
  proposerName,
  currentUserId,
  stage,
  totalVotes,
  isWinner,
  onVote,
  onReaction,
}: OptionCardProps) {
  const votePercentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;

  const reactionButtons = [
    { type: 'like' as const, icon: ThumbsUp, label: 'Support', color: 'text-blue-500' },
    { type: 'question' as const, icon: HelpCircle, label: 'Question', color: 'text-amber-500' },
    { type: 'concern' as const, icon: AlertCircle, label: 'Concern', color: 'text-red-500' },
  ];

  return (
    <Card className={`${isWinner ? 'border-2 border-green-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle>{option.title}</CardTitle>
              {isWinner && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  获胜方案
                </Badge>
              )}
            </div>
            {option.description && (
              <p className="text-muted-foreground mt-2">{option.description}</p>
            )}
            <p className="text-muted-foreground mt-2">提议者: {proposerName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vote progress bar */}
        {stage === 'vote' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Votes: {option.voteCount}</span>
              <span className="text-muted-foreground">{votePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={votePercentage} className="h-2" />
          </div>
        )}

        {/* Vote button */}
        {stage === 'vote' && (
          <Button
            className="w-full"
            variant={option.hasUserVoted ? 'default' : 'outline'}
            onClick={() => onVote(option.id)}
            disabled={option.hasUserVoted}
          >
            {option.hasUserVoted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Voted
              </>
            ) : (
              'Vote for this option'
            )}
          </Button>
        )}

        {/* Reaction buttons */}
        <div className="flex items-center gap-2">
          {reactionButtons.map(({ type, icon: Icon, label, color }) => {
            const count = option.reactions[type];
            const hasReacted = option.userReactions.includes(type);
            return (
              <Button
                key={type}
                variant={hasReacted ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => onReaction(option.id, type)}
              >
                <Icon className={`h-4 w-4 mr-1 ${hasReacted ? '' : color}`} />
                {label}
                {count > 0 && <span className="ml-1">({count})</span>}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

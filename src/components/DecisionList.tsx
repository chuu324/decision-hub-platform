import { Decision, User } from '../types/decision';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Users, CheckCircle2 } from 'lucide-react';

type DecisionListProps = {
  decisions: Decision[];
  users: User[];
  onSelectDecision: (decisionId: string) => void;
};

export function DecisionList({ decisions, users, onSelectDecision }: DecisionListProps) {
  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US');
  };

  const getStageBadge = (stage: Decision['stage']) => {
    if (stage === 'explore') {
      return <Badge variant="secondary">Exploration Phase</Badge>;
    }
    return <Badge variant="default">Voting Phase</Badge>;
  };

  return (
    <div className="space-y-4">
      {decisions.map((decision) => (
        <Card
          key={decision.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectDecision(decision.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="mb-2">{decision.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {decision.description}
                </CardDescription>
              </div>
              {getStageBadge(decision.stage)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Creator: {getUserName(decision.creatorId)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(decision.createdAt)}</span>
              </div>
              {decision.status === 'closed' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

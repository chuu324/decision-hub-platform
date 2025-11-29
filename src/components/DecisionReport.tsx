import {
  Decision,
  Option,
  Vote,
  Reaction,
  Comment,
  User,
  OptionWithStats,
} from '../types/decision';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  Trophy,
  Users,
  MessageSquare,
  ThumbsUp,
  Calendar,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type DecisionReportProps = {
  decision: Decision;
  options: Option[];
  votes: Vote[];
  reactions: Reaction[];
  comments: Comment[];
  users: User[];
  onBack: () => void;
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DecisionReport({
  decision,
  options,
  votes,
  reactions,
  comments,
  users,
  onBack,
}: DecisionReportProps) {
  // Calculate statistics
  const optionsWithStats: OptionWithStats[] = options.map((option) => {
    const optionVotes = votes.filter((v) => v.optionId === option.id);
    const optionReactions = reactions.filter((r) => r.optionId === option.id);

    return {
      ...option,
      voteCount: optionVotes.length,
      reactions: {
        like: optionReactions.filter((r) => r.type === 'like').length,
        question: optionReactions.filter((r) => r.type === 'question').length,
        concern: optionReactions.filter((r) => r.type === 'concern').length,
      },
      hasUserVoted: false,
      userReactions: [],
    };
  });

  const sortedOptions = [...optionsWithStats].sort((a, b) => b.voteCount - a.voteCount);
  const winner = sortedOptions[0];
  const totalVotes = votes.filter((v) => v.decisionId === decision.id).length;
  const totalParticipants = new Set(votes.map((v) => v.userId)).size;
  const decisionComments = comments.filter((c) => c.decisionId === decision.id);
  const totalReactions = reactions.filter((r) =>
    options.some((o) => o.id === r.optionId)
  ).length;

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown User';
  };

  // Prepare chart data
  const chartData = sortedOptions.map((option, index) => ({
    name: option.title.length > 15 ? option.title.substring(0, 15) + '...' : option.title,
    fullName: option.title,
    votes: option.voteCount,
    percentage: totalVotes > 0 ? ((option.voteCount / totalVotes) * 100).toFixed(1) : 0,
    fill: COLORS[index % COLORS.length],
  }));

  const pieData = sortedOptions
    .filter((o) => o.voteCount > 0)
    .map((option, index) => ({
      name: option.title,
      value: option.voteCount,
      fill: COLORS[index % COLORS.length],
    }));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDuration = () => {
    const start = new Date(decision.createdAt);
    const end = new Date();
    const diff = end.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days === 0) {
      return `${hours} hours`;
    }
    return `${days} days ${hours} hours`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1>Decision Report</h1>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">
              Completed
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{decision.title}</p>
        </div>
      </div>

      {/* Winning solution highlight */}
      {winner && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white p-3 rounded-full">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Winning Solution
                </CardTitle>
                <h2 className="mt-2">{winner.title}</h2>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {winner.description && (
              <p className="text-muted-foreground">{winner.description}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-muted-foreground">Votes Received</div>
                <div className="text-3xl mt-1">{winner.voteCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-muted-foreground">Vote Percentage</div>
                <div className="text-3xl mt-1">
                  {totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-muted-foreground">Support Reactions</div>
                <div className="text-3xl mt-1">{winner.reactions.like}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-muted-foreground">Proposed By</div>
                <div className="mt-1">{getUserName(winner.proposedBy)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-muted-foreground">Participants</div>
                <div className="text-2xl">{totalParticipants}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-muted-foreground">Options</div>
                <div className="text-2xl">{options.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-muted-foreground">Comments</div>
                <div className="text-2xl">{decisionComments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-3 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-muted-foreground">Reactions</div>
                <div className="text-2xl">{totalReactions}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voting results charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Results Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="mb-1">{payload[0].payload.fullName}</p>
                          <p>Votes: {payload[0].value}</p>
                          <p>Percentage: {payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="votes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sortedOptions.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1">{option.title}</span>
                  <span>{option.voteCount} votes</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedOptions.map((option, index) => (
              <div key={option.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {index === 0 ? (
                      <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="bg-secondary text-foreground w-10 h-10 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4>{option.title}</h4>
                        {option.description && (
                          <p className="text-muted-foreground mt-1">{option.description}</p>
                        )}
                        <p className="text-muted-foreground mt-2">
                          Proposed by: {getUserName(option.proposedBy)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl">{option.voteCount}</div>
                        <div className="text-muted-foreground">
                          {totalVotes > 0
                            ? ((option.voteCount / totalVotes) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="outline">
                        👍 {option.reactions.like}
                      </Badge>
                      <Badge variant="outline">
                        ❓ {option.reactions.question}
                      </Badge>
                      <Badge variant="outline">
                        ⚠️ {option.reactions.concern}
                      </Badge>
                    </div>
                  </div>
                </div>
                {index < sortedOptions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision information */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Creator:</span>
                <span>{getUserName(decision.creatorId)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(decision.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span>{getDuration()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground">Participation Rate:</span>
                <span className="ml-2">
                  {totalParticipants} / {users.length} (
                  {((totalParticipants / users.length) * 100).toFixed(0)}%)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Discussion Activity:</span>
                <span className="ml-2">
                  {decisionComments.length} comments + {totalReactions} reactions
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <p className="mt-1">{decision.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

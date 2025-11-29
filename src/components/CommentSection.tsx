import { useState } from 'react';
import { Comment, User } from '../types/decision';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageSquare } from 'lucide-react';

type CommentSectionProps = {
  comments: Comment[];
  users: User[];
  currentUserId: string;
  onAddComment: (content: string) => void;
};

export function CommentSection({
  comments,
  users,
  currentUserId,
  onAddComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const getUserInfo = (userId: string) => {
    return users.find((u) => u.id === userId) || { name: 'Unknown User', avatar: '👤' };
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment list */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => {
              const user = getUserInfo(comment.userId);
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0 text-2xl">{user.avatar}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="text-muted-foreground">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts and suggestions..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

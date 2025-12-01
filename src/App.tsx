import { useState, useEffect } from 'react';
import {
  Decision,
  Option,
  Vote,
  Reaction,
  Comment,
  User,
  ReactionType,
} from './types/decision';
import { AuthForm } from './components/AuthForm';
import { DecisionList } from './components/DecisionList';
import { DecisionDetail } from './components/DecisionDetail';
import { DecisionReport } from './components/DecisionReport';
import { CreateDecisionDialog } from './components/CreateDecisionDialog';
import { Button } from './components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { supabase } from './utils/supabase/supabaseClient';

type View = 'login' | 'list' | 'detail' | 'report';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // State management
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        await setupUser(session.user);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Session check error:', err);
      setLoading(false);
    }
  };

  const setupUser = async (user: any) => {
    let avatar = '👤';
    let name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      name = profile.name;
      avatar = profile.avatar;
    }

    const userData: User = {
      id: user.id,
      name: name,
      avatar: avatar,
    };

    setCurrentUser(userData);
    setCurrentView('list');
    await loadData(userData);
    setLoading(false);
  };

  const handleAuthSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setupUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('login');
    setDecisions([]);
    setOptions([]);
    setVotes([]);
    setReactions([]);
    setComments([]);
    setUsers([]);
    toast.success('Signed out successfully');
  };

  // --- Data Loading ---

  const loadData = async (activeUser?: User) => {
    try {
      const { data: decisionsData, error: decisionsError } = await supabase
        .from('decisions')
        .select('*')
        .order('createdAt', { ascending: false });

      if (decisionsError) throw decisionsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.warn('Could not load profiles:', profilesError.message);
      }

      if (decisionsData) {
        const fixedDecisions = decisionsData.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          deadline: d.deadline ? new Date(d.deadline) : undefined
        }));
        setDecisions(fixedDecisions);
      }

      let allUsers: User[] = [];
      if (profilesData && profilesData.length > 0) {
        allUsers = profilesData as User[];
      } else {
        const current = activeUser || currentUser;
        if (current) allUsers = [current];
      }
      setUsers(allUsers);

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load data');
    }
  };

  const loadDecisionDetail = async (decisionId: string) => {
    try {
      const [optionsRes, votesRes, reactionsRes, commentsRes] = await Promise.all([
        supabase.from('options').select('*').eq('decisionId', decisionId),
        supabase.from('votes').select('*').eq('decisionId', decisionId),
        supabase.from('reactions').select('*').eq('decisionId', decisionId),
        supabase.from('comments').select('*').eq('decisionId', decisionId).order('createdAt', { ascending: true }),
      ]);

      if (optionsRes.error) throw optionsRes.error;
      if (votesRes.error) throw votesRes.error;
      if (reactionsRes.error) throw reactionsRes.error;
      if (commentsRes.error) throw commentsRes.error;

      if (optionsRes.data) {
        setOptions(optionsRes.data.map((o: any) => ({ ...o, createdAt: new Date(o.createdAt) })));
      }
      if (votesRes.data) {
        setVotes(votesRes.data.map((v: any) => ({ ...v, createdAt: new Date(v.createdAt) })));
      }
      if (reactionsRes.data) {
        setReactions(reactionsRes.data.map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) })));
      }
      if (commentsRes.data) {
        setComments(commentsRes.data.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch (err) {
      console.error('Error loading decision detail:', err);
      toast.error('Failed to load details');
    }
  };

  const handleSelectDecision = async (decisionId: string) => {
    setSelectedDecisionId(decisionId);
    const decision = decisions.find((d) => d.id === decisionId);
    await loadDecisionDetail(decisionId);
    
    if (decision?.status === 'closed') {
      setCurrentView('report');
    } else {
      setCurrentView('detail');
    }
  };

  // --- Actions ---

  const handleCreateDecision = async (data: { title: string; description: string }) => {
    if (!currentUser) return;

    try {
      const { data: newDecisionRaw, error } = await supabase
        .from('decisions')
        .insert({
          title: data.title,
          description: data.description,
          creatorId: currentUser.id,
          stage: 'explore',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      const newDecision = {
        ...newDecisionRaw,
        createdAt: new Date(newDecisionRaw.createdAt)
      };
      
      setDecisions([newDecision, ...decisions]);
      toast.success('Decision created successfully!');
      setShowCreateDialog(false);
    } catch (err: any) {
      console.error('Error creating decision:', err);
      toast.error(err.message || 'Failed to create decision');
    }
  };

  const handleAddOption = async (decisionId: string, title: string, description: string) => {
    if (!currentUser) return;

    try {
      const { data: newOptionRaw, error } = await supabase
        .from('options')
        .insert({
          decisionId: decisionId,
          title,
          description,
          proposedBy: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newOption = {
        ...newOptionRaw,
        createdAt: new Date(newOptionRaw.createdAt)
      };

      setOptions([...options, newOption]);
      toast.success('Option added successfully!');
    } catch (err: any) {
      console.error('Error adding option:', err);
      toast.error('Failed to add option');
    }
  };

  const handleVote = async (decisionId: string, optionId: string) => {
    if (!currentUser) return;

    try {
      if (votes.some(v => v.userId === currentUser.id)) {
        toast.error('You have already voted');
        return;
      }

      const { data: newVoteRaw, error } = await supabase
        .from('votes')
        .insert({
          decisionId: decisionId,
          optionId: optionId,
          userId: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newVote = {
        ...newVoteRaw,
        createdAt: new Date(newVoteRaw.createdAt)
      };

      setVotes([...votes, newVote]);
      toast.success('Vote submitted successfully!');
    } catch (err: any) {
      console.error('Error voting:', err);
      toast.error('Failed to submit vote');
    }
  };

  const handleReaction = async (optionId: string, type: ReactionType) => {
    if (!currentUser || !selectedDecisionId) return;

    try {
      const existingReaction = reactions.find(
        r => r.optionId === optionId && r.userId === currentUser.id && r.type === type
      );

      if (existingReaction) {
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;
        setReactions(reactions.filter((r) => r.id !== existingReaction.id));
        toast.info('Reaction removed');
      } else {
        const { data: newRRaw, error } = await supabase
          .from('reactions')
          .insert({
            decisionId: selectedDecisionId,
            optionId: optionId,
            userId: currentUser.id,
            type: type,
          })
          .select()
          .single();

        if (error) throw error;

        const newReaction = {
          ...newRRaw,
          createdAt: new Date(newRRaw.createdAt)
        };
        setReactions([...reactions, newReaction]);
        toast.success('Reaction added');
      }
    } catch (err: any) {
      console.error('Error toggling reaction:', err);
    }
  };

  const handleAddComment = async (decisionId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { data: newCommentRaw, error } = await supabase
        .from('comments')
        .insert({
          decisionId: decisionId,
          content,
          userId: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newComment = {
        ...newCommentRaw,
        createdAt: new Date(newCommentRaw.createdAt)
      };
      setComments([...comments, newComment]);
      toast.success('Comment posted successfully!');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast.error('Failed to post comment');
    }
  };

  const handleChangeStage = async (decisionId: string, stage: Decision['stage']) => {
    if (!currentUser) return;

    try {
      const { data: updatedRaw, error } = await supabase
        .from('decisions')
        .update({ stage })
        .eq('id', decisionId)
        .select()
        .single();

      if (error) throw error;

      if (stage === 'explore') {
        await supabase.from('votes').delete().eq('decisionId', decisionId);
        setVotes([]);
        toast.info('Returned to exploration phase. Votes cleared.');
      } else {
        toast.success('Entered voting phase');
      }

      const updated = {
        ...updatedRaw,
        createdAt: new Date(updatedRaw.createdAt)
      };
      setDecisions(decisions.map((d) => (d.id === decisionId ? updated : d)));

    } catch (err: any) {
      console.error('Error changing stage:', err);
      toast.error('Failed to update stage');
    }
  };

  const handleCloseDecision = async (decisionId: string) => {
    if (!currentUser) return;

    try {
      const { data: updatedRaw, error } = await supabase
        .from('decisions')
        .update({ status: 'closed' })
        .eq('id', decisionId)
        .select()
        .single();

      if (error) throw error;

      const updated = {
        ...updatedRaw,
        createdAt: new Date(updatedRaw.createdAt)
      };
      setDecisions(decisions.map((d) => (d.id === decisionId ? updated : d)));

      toast.success('Decision closed! Generating report...');
      setTimeout(() => {
        setCurrentView('report');
      }, 500);
    } catch (err: any) {
      console.error('Error closing decision:', err);
      toast.error('Failed to close decision');
    }
  };

  // Login view
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  const selectedDecision = decisions.find((d) => d.id === selectedDecisionId);
  const decisionOptions = options;
  const decisionVotes = votes;

  return (
    <>
      {currentView === 'list' && (
        // 修复：添加了 <> ... </> 包裹
        <>
          <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1>DecisionHub</h1>
                  <p className="text-muted-foreground">
                    User: {currentUser?.name}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>

              <Button onClick={() => setShowCreateDialog(true)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Decision
              </Button>

              <div>
                <h2 className="mb-4">Decisions</h2>
                <DecisionList
                  decisions={decisions}
                  users={users}
                  onSelectDecision={handleSelectDecision}
                />
              </div>
            </div>
          </div>

          <CreateDecisionDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreateDecision={handleCreateDecision}
          />
        </>
      )}

      {currentView === 'detail' && selectedDecision && currentUser && (
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-6">
            <DecisionDetail
              decision={selectedDecision}
              options={decisionOptions}
              votes={decisionVotes}
              reactions={reactions}
              comments={comments}
              users={users}
              currentUserId={currentUser.id}
              onBack={() => setCurrentView('list')}
              onAddOption={handleAddOption}
              onVote={handleVote}
              onReaction={handleReaction}
              onAddComment={handleAddComment}
              onChangeStage={handleChangeStage}
              onCloseDecision={handleCloseDecision}
            />
          </div>
        </div>
      )}

      {currentView === 'report' && selectedDecision && (
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto p-6">
            <DecisionReport
              decision={selectedDecision}
              options={decisionOptions}
              votes={decisionVotes}
              reactions={reactions}
              comments={comments}
              users={users}
              onBack={() => setCurrentView('list')}
            />
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}
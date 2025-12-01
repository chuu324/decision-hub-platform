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

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setupUser(session.user);
      } else {
        setLoading(false); // 如果没登录，也要结束 loading
      }
    } catch (err) {
      console.error('Session check error:', err);
      setLoading(false);
    }
  };

  const setupUser = async (user: any) => {
    const userData: User = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      avatar: '👤',
    };
    setCurrentUser(userData);
    // 修复：把当前用户立即加入用户列表，防止显示 Unknown User
    setUsers([userData]); 
    setCurrentView('list');
    await loadDecisions(userData); // 把用户传进去，解决闭包问题
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
    toast.success('Signed out successfully');
  };

  // --- Data Loading (修复：字符串转 Date) ---

  const loadDecisions = async (activeUser?: User) => {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error loading decisions:', error);
      toast.error('Failed to load decisions');
    } else if (data) {
      // 关键修复：遍历数据，把字符串类型的 createdAt 转为 Date 对象
      const fixedData = data.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        deadline: d.deadline ? new Date(d.deadline) : undefined
      }));
      setDecisions(fixedData);
    }

    // 尝试加载其他用户资料 (如果有的话)
    // 如果没有 profiles 表，就只显示当前用户
    const currentUserObj = activeUser || currentUser;
    if (currentUserObj) {
       setUsers([currentUserObj]);
    }
  };

  const loadDecisionDetail = async (id: string) => {
    const [opts, vts, rcts, cmts] = await Promise.all([
      supabase.from('options').select('*').eq('decisionId', id),
      supabase.from('votes').select('*').eq('decisionId', id),
      supabase.from('reactions').select('*').eq('decisionId', id),
      supabase.from('comments').select('*').eq('decisionId', id).order('createdAt', { ascending: true })
    ]);

    // 关键修复：同样为详情数据做 Date 转换
    if (opts.data) {
      setOptions(opts.data.map((o: any) => ({ ...o, createdAt: new Date(o.createdAt) })));
    }
    if (vts.data) {
      setVotes(vts.data.map((v: any) => ({ ...v, createdAt: new Date(v.createdAt) })));
    }
    if (rcts.data) {
      setReactions(rcts.data.map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) })));
    }
    if (cmts.data) {
      setComments(cmts.data.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })));
    }
  };

  const handleSelectDecision = async (decisionId: string) => {
    setSelectedDecisionId(decisionId);
    const decision = decisions.find(d => d.id === decisionId);
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

    if (error) {
      toast.error('Failed to create decision');
    } else if (newDecisionRaw) {
      // 修复：新创建的数据也要转 Date
      const newDecision = {
        ...newDecisionRaw,
        createdAt: new Date(newDecisionRaw.createdAt)
      };
      setDecisions([newDecision, ...decisions]);
      toast.success('Decision created!');
      setShowCreateDialog(false);
    }
  };

  const handleAddOption = async (decisionId: string, title: string, description: string) => {
    if (!currentUser) return;
    const { data: newOptionRaw, error } = await supabase
      .from('options')
      .insert({
        decisionId,
        title,
        description,
        proposedBy: currentUser.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add option');
    } else if (newOptionRaw) {
      const newOption = {
        ...newOptionRaw,
        createdAt: new Date(newOptionRaw.createdAt)
      };
      setOptions([...options, newOption]);
      toast.success('Option added!');
    }
  };

  const handleVote = async (decisionId: string, optionId: string) => {
    if (!currentUser) return;
    if (votes.some(v => v.userId === currentUser.id)) {
      toast.error('You have already voted');
      return;
    }

    const { data: newVoteRaw, error } = await supabase
      .from('votes')
      .insert({
        decisionId,
        optionId,
        userId: currentUser.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Vote failed');
    } else if (newVoteRaw) {
      const newVote = {
        ...newVoteRaw,
        createdAt: new Date(newVoteRaw.createdAt)
      };
      setVotes([...votes, newVote]);
      toast.success('Vote submitted!');
    }
  };

  const handleReaction = async (optionId: string, type: ReactionType) => {
    if (!currentUser || !selectedDecisionId) return;
    
    const existing = reactions.find(r => r.optionId === optionId && r.userId === currentUser.id && r.type === type);

    if (existing) {
      // Remove
      const { error } = await supabase.from('reactions').delete().eq('id', existing.id);
      if (!error) {
        setReactions(reactions.filter(r => r.id !== existing.id));
        toast.info('Reaction removed');
      }
    } else {
      // Add
      const { data: newRRaw, error } = await supabase
        .from('reactions')
        .insert({
          decisionId: selectedDecisionId,
          optionId,
          userId: currentUser.id,
          type
        })
        .select()
        .single();
      
      if (!error && newRRaw) {
        const newR = {
          ...newRRaw,
          createdAt: new Date(newRRaw.createdAt)
        };
        setReactions([...reactions, newR]);
        toast.success('Reaction added');
      }
    }
  };

  const handleAddComment = async (decisionId: string, content: string) => {
    if (!currentUser) return;
    const { data: newCommentRaw, error } = await supabase
      .from('comments')
      .insert({
        decisionId,
        content,
        userId: currentUser.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to post comment');
    } else if (newCommentRaw) {
      const newComment = {
        ...newCommentRaw,
        createdAt: new Date(newCommentRaw.createdAt)
      };
      setComments([...comments, newComment]);
      toast.success('Comment posted!');
    }
  };

  const handleChangeStage = async (decisionId: string, stage: Decision['stage']) => {
    if (!currentUser) return;
    
    const { data: updatedRaw, error } = await supabase
      .from('decisions')
      .update({ stage })
      .eq('id', decisionId)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update stage');
      return;
    }

    if (stage === 'explore') {
      await supabase.from('votes').delete().eq('decisionId', decisionId);
      setVotes([]);
      toast.info('Returned to explore. Votes cleared.');
    } else {
      toast.success('Entered voting phase');
    }
    
    const updated = {
        ...updatedRaw,
        createdAt: new Date(updatedRaw.createdAt)
    };
    setDecisions(decisions.map(d => d.id === decisionId ? updated : d));
  };

  const handleCloseDecision = async (decisionId: string) => {
    if (!currentUser) return;

    const { data: updatedRaw, error } = await supabase
      .from('decisions')
      .update({ status: 'closed' })
      .eq('id', decisionId)
      .select()
      .single();

    if (!error && updatedRaw) {
      const updated = {
        ...updatedRaw,
        createdAt: new Date(updatedRaw.createdAt)
      };
      setDecisions(decisions.map(d => d.id === decisionId ? updated : d));
      toast.success('Decision closed');
      setTimeout(() => setCurrentView('report'), 500);
    }
  };

  // --- Render ---

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (currentView === 'login') return <><AuthForm onAuthSuccess={handleAuthSuccess} /><Toaster /></>;

  const selectedDecision = decisions.find(d => d.id === selectedDecisionId);
  const decisionOptions = options; 
  const decisionVotes = votes;     

  return (
    <>
      {currentView === 'list' && (
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1>DecisionHub</h1>
                <p className="text-muted-foreground">User: {currentUser?.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut /></Button>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="w-full"><Plus className="mr-2" /> New Decision</Button>
            <DecisionList decisions={decisions} users={users} onSelectDecision={handleSelectDecision} />
          </div>
          <CreateDecisionDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreateDecision={handleCreateDecision} />
        </div>
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
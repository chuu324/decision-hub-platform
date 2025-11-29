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
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser({
            id: user.id,
            // 优先使用元数据中的名字，如果没有则使用邮箱前缀
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar: user.user_metadata?.avatar || '👤',
          });
          setCurrentView('list');
          await loadData();
        }
      }
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // 1. 获取所有决策
      const { data: decisionsData, error: decisionsError } = await supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false });

      if (decisionsError) throw decisionsError;

      // 2. 获取用户列表 (注意：如果你还没有创建 public.profiles 表，这里可能需要调整)
      // 这里的逻辑尝试从 auth 系统获取当前用户信息，实际项目中建议创建一个 public.profiles 表
      // 为了让程序不报错，我们暂时把当前用户放入列表，或者如果不需要显示全部用户头像，可以留空
      // 这里的代码假设你可能会创建一个 'profiles' 表，如果没有，它会静默失败但不影响主流程
      let usersData: User[] = [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles') // 如果你还没建这个表，这一步会报错，我们在 catch 里忽略它
        .select('*');
      
      if (!profilesError && profiles) {
        usersData = profiles as unknown as User[];
      } else if (currentUser) {
        usersData = [currentUser]; // 至少包含自己
      }

      setDecisions(decisionsData || []);
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading data:', err);
      // 这里不 toast 报错，以免因为缺少 profiles 表而一直弹窗
    }
  };

  const loadDecisionData = async (decisionId: string) => {
    try {
      const [optionsRes, votesRes, reactionsRes, commentsRes] = await Promise.all([
        supabase.from('options').select('*').eq('decision_id', decisionId),
        supabase.from('votes').select('*').eq('decision_id', decisionId),
        supabase.from('reactions').select('*').eq('decision_id', decisionId),
        supabase.from('comments').select('*').eq('decision_id', decisionId).order('created_at', { ascending: true }),
      ]);

      if (optionsRes.error) throw optionsRes.error;
      if (votesRes.error) throw votesRes.error;
      if (reactionsRes.error) throw reactionsRes.error;
      if (commentsRes.error) throw commentsRes.error;

      setOptions(optionsRes.data || []);
      setVotes(votesRes.data || []);
      setReactions(reactionsRes.data || []);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error('Error loading decision data:', err);
      toast.error('Failed to load decision data');
    }
  };

  const handleAuthSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar: user.user_metadata?.avatar || '👤',
        });
        setCurrentView('list');
        await loadData();
      }
    } catch (err) {
      console.error('Error after auth:', err);
    }
  };

  const handleLogout = async () => {
    try {
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
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to sign out');
    }
  };

  // Create decision
  const handleCreateDecision = async (data: { title: string; description: string }) => {
    if (!currentUser) return;

    try {
      const { data: newDecision, error } = await supabase
        .from('decisions')
        .insert({
          title: data.title,
          description: data.description,
          creator_id: currentUser.id,
          stage: 'explore', // 明确指定默认值
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setDecisions([newDecision, ...decisions]);
      toast.success('Decision created successfully!');
      setShowCreateDialog(false);
    } catch (err: any) {
      console.error('Error creating decision:', err);
      toast.error(err.message || 'Failed to create decision');
    }
  };

  // Add option
  const handleAddOption = async (decisionId: string, title: string, description: string) => {
    if (!currentUser) return;

    try {
      const { data: newOption, error } = await supabase
        .from('options')
        .insert({
          decision_id: decisionId,
          title,
          description,
          proposed_by: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      setOptions([...options, newOption]);
      toast.success('Option added successfully!');
    } catch (err: any) {
      console.error('Error adding option:', err);
      toast.error(err.message || 'Failed to add option');
    }
  };

  // Vote
  const handleVote = async (decisionId: string, optionId: string) => {
    if (!currentUser) return;

    try {
      // 1. 检查是否已投票 (双重保险，UI已经检查过了)
      const hasVoted = votes.some(
        (v) => v.decisionId === decisionId && v.userId === currentUser.id
      );
      if (hasVoted) {
        toast.error('You have already voted');
        return;
      }

      // 2. 插入投票
      const { data: newVote, error } = await supabase
        .from('votes')
        .insert({
          decision_id: decisionId,
          option_id: optionId,
          user_id: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      setVotes([...votes, newVote]);
      toast.success('Vote submitted successfully!');
    } catch (err: any) {
      console.error('Error voting:', err);
      toast.error(err.message || 'Failed to submit vote');
    }
  };

  // Reaction (Toggle Logic)
  const handleReaction = async (optionId: string, type: ReactionType) => {
    if (!currentUser || !selectedDecisionId) return;

    try {
      // 1. 检查是否存在相同的 Reaction
      const existingReaction = reactions.find(
        r => r.optionId === optionId && r.userId === currentUser.id && r.type === type
      );

      if (existingReaction) {
        // --- 存在则删除 (Remove) ---
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;

        setReactions(reactions.filter((r) => r.id !== existingReaction.id));
        toast.info('Reaction removed');
      } else {
        // --- 不存在则添加 (Add) ---
        const { data: newReaction, error } = await supabase
          .from('reactions')
          .insert({
            decision_id: selectedDecisionId,
            option_id: optionId,
            user_id: currentUser.id,
            type: type,
          })
          .select()
          .single();

        if (error) throw error;

        setReactions([...reactions, newReaction]);
        toast.success('Reaction added');
      }
    } catch (err: any) {
      console.error('Error toggling reaction:', err);
      toast.error(err.message || 'Failed to toggle reaction');
    }
  };

  // Add comment
  const handleAddComment = async (decisionId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { data: newComment, error } = await supabase
        .from('comments')
        .insert({
          decision_id: decisionId,
          content,
          user_id: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      setComments([...comments, newComment]);
      toast.success('Comment posted successfully!');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast.error(err.message || 'Failed to post comment');
    }
  };

  // Change stage
  const handleChangeStage = async (decisionId: string, stage: Decision['stage']) => {
    if (!currentUser) return;

    try {
      // 1. 更新决策阶段
      const { data: updatedDecision, error } = await supabase
        .from('decisions')
        .update({ stage })
        .eq('id', decisionId)
        .select()
        .single();

      if (error) throw error;

      // 2. 如果返回探索阶段，需要清除投票
      if (stage === 'explore') {
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('decision_id', decisionId);
        
        if (deleteError) throw deleteError;
        
        // 重新加载所有数据以确保同步
        await loadDecisionData(decisionId);
        toast.info('Returned to exploration phase. Voting records cleared');
      } else {
        toast.success('Entered voting phase');
      }

      setDecisions(
        decisions.map((d) => (d.id === decisionId ? updatedDecision : d))
      );

    } catch (err: any) {
      console.error('Error changing stage:', err);
      toast.error(err.message || 'Failed to change stage');
    }
  };

  // Close decision
  const handleCloseDecision = async (decisionId: string) => {
    if (!currentUser) return;

    try {
      const { data: updatedDecision, error } = await supabase
        .from('decisions')
        .update({ status: 'closed' })
        .eq('id', decisionId)
        .select()
        .single();

      if (error) throw error;

      setDecisions(
        decisions.map((d) => (d.id === decisionId ? updatedDecision : d))
      );

      toast.success('Decision closed! Generating report...');
      setTimeout(() => {
        setCurrentView('report');
      }, 500);
    } catch (err: any) {
      console.error('Error closing decision:', err);
      toast.error(err.message || 'Failed to close decision');
    }
  };

  const handleSelectDecision = async (decisionId: string) => {
    setSelectedDecisionId(decisionId);
    const decision = decisions.find((d) => d.id === decisionId);
    
    // Load decision data
    await loadDecisionData(decisionId);
    
    // If decision is closed, show report page directly
    if (decision?.status === 'closed') {
      setCurrentView('report');
    } else {
      setCurrentView('detail');
    }
  };

  // Get current decision data
  const selectedDecision = decisions.find((d) => d.id === selectedDecisionId);
  // 注意：这里我们使用本地过滤，但在 loadDecisionData 中我们已经只加载了当前决策的数据
  // 所以 options, votes 等已经是筛选过的了，不过保留 filter 也无妨，以防状态未清除
  const decisionOptions = options.filter((o) => o.decisionId === selectedDecisionId);
  const decisionVotes = votes.filter((v) => v.decisionId === selectedDecisionId);

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

  // List view
  if (currentView === 'list') {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1>DecisionHub</h1>
                <p className="text-muted-foreground">
                  Current User: {currentUser?.name}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Create button */}
            <Button onClick={() => setShowCreateDialog(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Decision
            </Button>

            {/* Decision list */}
            <div>
              <h2 className="mb-4">Decisions</h2>
              <DecisionList
                decisions={decisions}
                users={users} // 如果没有profiles表，这里可能是空的，UI显示ID或Unknown
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
        <Toaster />
      </>
    );
  }

  // Detail view
  if (currentView === 'detail' && selectedDecision && currentUser) {
    return (
      <>
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
        <Toaster />
      </>
    );
  }

  // Report view
  if (currentView === 'report' && selectedDecision) {
    return (
      <>
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
        <Toaster />
      </>
    );
  }

  return null;
}
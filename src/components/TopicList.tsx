import { Topic } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Users, Eye } from 'lucide-react';
import { users } from '../data/mockData';

interface TopicListProps {
  topics: Topic[];
  onSelectTopic: (topicId: string) => void;
}

export function TopicList({ topics, onSelectTopic }: TopicListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'exploring':
        return <Badge className="bg-blue-500">探索阶段</Badge>;
      case 'voting':
        return <Badge className="bg-green-500">表决阶段</Badge>;
      case 'closed':
        return <Badge variant="secondary">已关闭</Badge>;
      default:
        return null;
    }
  };

  const getCreatorName = (creatorId: string) => {
    return users.find((u) => u.id === creatorId)?.name || '未知';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}天${hours}小时`;
    if (hours > 0) return `${hours}小时`;
    return '即将截止';
  };

  // 按状态分组
  const activeTopics = topics.filter((t) => t.status !== 'closed');
  const closedTopics = topics.filter((t) => t.status === 'closed');

  return (
    <div className="space-y-8">
      {/* 进行中的议题 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl">进行中的决策</h2>
          <Badge variant="outline">{activeTopics.length} 个议题</Badge>
        </div>
        
        {activeTopics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">暂无进行中的决策议题</p>
              <p className="text-sm text-gray-400">点击右上角「创建议题」开始新的决策</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTopics.map((topic) => (
              <Card
                key={topic.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => onSelectTopic(topic.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                    {getStatusBadge(topic.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>发起人：{getCreatorName(topic.creatorId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>创建于：{formatDate(topic.createdAt)}</span>
                    </div>
                    {topic.deadline && topic.status === 'voting' && (
                      <div className="mt-2 rounded-md bg-orange-50 px-3 py-2 text-orange-700">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>剩余时间：{getTimeRemaining(topic.deadline)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="mt-4 w-full" variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    查看详情
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 已关闭的议题 */}
      {closedTopics.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">历史决策</h2>
            <Badge variant="outline">{closedTopics.length} 个议题</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {closedTopics.map((topic) => (
              <Card
                key={topic.id}
                className="cursor-pointer opacity-75 transition-opacity hover:opacity-100"
                onClick={() => onSelectTopic(topic.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                    {getStatusBadge(topic.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>发起人：{getCreatorName(topic.creatorId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(topic.createdAt)}</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    查看结果
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

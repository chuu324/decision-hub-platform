// 模拟数据

import { User, Topic, Option, Vote, Comment, Reaction } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: '张三',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
  },
  {
    id: 'user-3',
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
  },
  {
    id: 'user-4',
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
  },
  {
    id: 'user-5',
    name: '陈七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
  },
];

export const mockTopics: Topic[] = [
  {
    id: 'topic-1',
    title: '选择小组项目主题',
    description: '我们需要为软件工程课程选择一个项目主题。请大家提出想法并投票决定最终方向。',
    creatorId: 'user-1',
    status: 'voting',
    createdAt: '2025-10-10T10:00:00Z',
    deadline: '2025-10-15T23:59:59Z',
  },
  {
    id: 'topic-2',
    title: '团队建设活动时间',
    description: '确定下周末团队建设活动的具体时间，请大家根据自己的时间安排投票。',
    creatorId: 'user-2',
    status: 'exploring',
    createdAt: '2025-10-11T14:30:00Z',
  },
  {
    id: 'topic-3',
    title: '选择技术栈',
    description: '新项目需要确定前端技术栈，请大家提出建议。',
    creatorId: 'user-1',
    status: 'closed',
    createdAt: '2025-10-05T09:00:00Z',
  },
  {
    id: 'topic-4',
    title: '周五聚餐餐厅选择',
    description: '这周五晚上一起吃饭，大家来投票选个餐厅吧！',
    creatorId: 'user-3',
    status: 'voting',
    createdAt: '2025-10-12T16:00:00Z',
  },
];

export const mockOptions: Option[] = [
  // Topic 1 的选项
  {
    id: 'option-1',
    topicId: 'topic-1',
    title: '在线教育平台',
    description: '开发一个支持视频课程、作业提交和在线测验的教育平台',
    proposedBy: 'user-1',
    votes: 8,
    createdAt: '2025-10-10T10:30:00Z',
  },
  {
    id: 'option-2',
    topicId: 'topic-1',
    title: '智能健康管理系统',
    description: '追踪用户健康数据，提供个性化健康建议和运动计划',
    proposedBy: 'user-2',
    votes: 12,
    createdAt: '2025-10-10T11:00:00Z',
  },
  {
    id: 'option-3',
    topicId: 'topic-1',
    title: '社区互助平台',
    description: '连接社区居民，促进邻里互助和资源共享',
    proposedBy: 'user-3',
    votes: 5,
    createdAt: '2025-10-10T14:00:00Z',
  },
  // Topic 2 的选项
  {
    id: 'option-4',
    topicId: 'topic-2',
    title: '周六上午 9:00-12:00',
    description: '适合早起的朋友，活动后还可以安排午餐',
    proposedBy: 'user-2',
    votes: 0,
    createdAt: '2025-10-11T14:45:00Z',
  },
  {
    id: 'option-5',
    topicId: 'topic-2',
    title: '周六下午 14:00-18:00',
    description: '下午时间比较充裕，大家可以睡个懒觉',
    proposedBy: 'user-1',
    votes: 0,
    createdAt: '2025-10-11T15:00:00Z',
  },
  {
    id: 'option-6',
    topicId: 'topic-2',
    title: '周日下午 15:00-19:00',
    description: '周日下午休闲时光，活动完刚好回家休息',
    proposedBy: 'user-4',
    votes: 0,
    createdAt: '2025-10-11T15:30:00Z',
  },
  // Topic 3 的选项（已关闭）
  {
    id: 'option-7',
    topicId: 'topic-3',
    title: 'React + TypeScript',
    description: '现代化开发体验，类型安全',
    proposedBy: 'user-1',
    votes: 15,
    createdAt: '2025-10-05T10:00:00Z',
  },
  {
    id: 'option-8',
    topicId: 'topic-3',
    title: 'Vue 3 + TypeScript',
    description: '轻量级框架，学习曲线平缓',
    proposedBy: 'user-3',
    votes: 8,
    createdAt: '2025-10-05T11:00:00Z',
  },
  // Topic 4 的选项
  {
    id: 'option-9',
    topicId: 'topic-4',
    title: '川味观',
    description: '地道川菜，麻辣鲜香，人均80元',
    proposedBy: 'user-3',
    votes: 6,
    createdAt: '2025-10-12T16:15:00Z',
  },
  {
    id: 'option-10',
    topicId: 'topic-4',
    title: '日式料理店',
    description: '新开的日料店，环境很好，人均120元',
    proposedBy: 'user-4',
    votes: 9,
    createdAt: '2025-10-12T16:30:00Z',
  },
  {
    id: 'option-11',
    topicId: 'topic-4',
    title: '海底捞火锅',
    description: '热闹氛围，服务一流，人均100元',
    proposedBy: 'user-5',
    votes: 7,
    createdAt: '2025-10-12T16:45:00Z',
  },
];

export const mockVotes: Vote[] = [
  // Topic 1 投票
  { id: 'v1', userId: 'user-1', optionId: 'option-2', topicId: 'topic-1', createdAt: '2025-10-10T10:35:00Z' },
  { id: 'v2', userId: 'user-2', optionId: 'option-2', topicId: 'topic-1', createdAt: '2025-10-10T11:05:00Z' },
  { id: 'v3', userId: 'user-3', optionId: 'option-1', topicId: 'topic-1', createdAt: '2025-10-10T12:00:00Z' },
  // Topic 3 投票（已关闭）
  { id: 'v4', userId: 'user-1', optionId: 'option-7', topicId: 'topic-3', createdAt: '2025-10-06T10:00:00Z' },
  { id: 'v5', userId: 'user-2', optionId: 'option-7', topicId: 'topic-3', createdAt: '2025-10-06T11:00:00Z' },
  { id: 'v6', userId: 'user-3', optionId: 'option-8', topicId: 'topic-3', createdAt: '2025-10-06T12:00:00Z' },
  // Topic 4 投票
  { id: 'v7', userId: 'user-1', optionId: 'option-10', topicId: 'topic-4', createdAt: '2025-10-12T17:00:00Z' },
  { id: 'v8', userId: 'user-2', optionId: 'option-9', topicId: 'topic-4', createdAt: '2025-10-12T17:15:00Z' },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'user-2',
    optionId: 'option-2',
    topicId: 'topic-1',
    content: '这个想法很棒！我们可以结合AI来提供更智能的健康建议。',
    createdAt: '2025-10-10T11:10:00Z',
  },
  {
    id: 'c2',
    userId: 'user-3',
    optionId: 'option-2',
    topicId: 'topic-1',
    content: '赞同！而且健康管理是个很有前景的方向。',
    createdAt: '2025-10-10T13:00:00Z',
  },
  {
    id: 'c3',
    userId: 'user-1',
    optionId: 'option-1',
    topicId: 'topic-1',
    content: '在线教育也不错，不过市场竞争比较激烈。',
    createdAt: '2025-10-10T14:30:00Z',
  },
  {
    id: 'c4',
    userId: 'user-5',
    optionId: 'option-5',
    topicId: 'topic-2',
    content: '周六下午我有空，支持这个时间！',
    createdAt: '2025-10-11T16:00:00Z',
  },
  {
    id: 'c5',
    userId: 'user-3',
    optionId: 'option-10',
    topicId: 'topic-4',
    content: '日料店环境确实很好，我上次去过，推荐！',
    createdAt: '2025-10-12T17:30:00Z',
  },
];

export const mockReactions: Reaction[] = [
  // Option 2 的反应
  { id: 'r1', userId: 'user-1', optionId: 'option-2', type: 'like' },
  { id: 'r2', userId: 'user-3', optionId: 'option-2', type: 'like' },
  { id: 'r3', userId: 'user-4', optionId: 'option-2', type: 'like' },
  { id: 'r4', userId: 'user-5', optionId: 'option-2', type: 'question' },
  // Option 1 的反应
  { id: 'r5', userId: 'user-2', optionId: 'option-1', type: 'like' },
  { id: 'r6', userId: 'user-4', optionId: 'option-1', type: 'concern' },
  // Option 3 的反应
  { id: 'r7', userId: 'user-5', optionId: 'option-3', type: 'like' },
  // Option 10 的反应
  { id: 'r8', userId: 'user-2', optionId: 'option-10', type: 'like' },
  { id: 'r9', userId: 'user-3', optionId: 'option-10', type: 'like' },
  { id: 'r10', userId: 'user-4', optionId: 'option-10', type: 'like' },
];

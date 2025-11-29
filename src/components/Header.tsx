import { Users, Home, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { currentUser } from '../data/mockData';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Header({ onNavigate, currentView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl">DecisionHub</h1>
            <p className="text-xs text-gray-500">小组协作决策平台</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('home')}
          >
            <Home className="mr-2 h-4 w-4" />
            首页
          </Button>
          <Button
            variant={currentView === 'create' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('create')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            创建议题
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm">{currentUser.name}</div>
            <div className="text-xs text-gray-500">当前用户</div>
          </div>
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

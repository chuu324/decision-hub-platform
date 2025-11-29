import { useState, useEffect } from 'react';
import { User } from '../types/decision';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RefreshCw } from 'lucide-react';

type UserSelectorProps = {
  users: User[];
  onSelectUser: (userId: string) => void;
};

// 生成随机验证码
const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

export function UserSelector({ users, onSelectUser }: UserSelectorProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username
    if (!username.trim()) {
      setError('Please enter username');
      return;
    }

    // Validate password
    if (!password) {
      setError('Please enter password');
      return;
    }

    // Validate captcha
    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      setError('Incorrect captcha');
      refreshCaptcha();
      return;
    }

    // Find user (simplified: username match only)
    const user = users.find((u) => u.name === username);
    if (user) {
      onSelectUser(user.id);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">DecisionHub</CardTitle>
          <CardDescription>
            Team Collaborative Decision Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha">Captcha</Label>
              <div className="flex gap-2">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Enter captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <div className="bg-secondary px-4 py-2 rounded-md border border-border select-none flex items-center justify-center min-w-[100px]">
                    <span className="tracking-wider">{captcha}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={refreshCaptcha}
                    title="Refresh captcha"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-center p-2 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="text-center text-muted-foreground border-t pt-4">
              <p>Test Accounts:</p>
              <p className="mt-1">Zhang Ming / Li Hua / Wang Fang / Liu Qiang / Chen Jie</p>
              <p className="mt-1">Any password</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

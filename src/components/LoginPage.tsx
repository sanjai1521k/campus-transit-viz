import React, { useState } from 'react';
import { Eye, EyeOff, Bus, User, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome to Campus Transport Tracker!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fillDemoCredentials = (role: 'student' | 'admin') => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('student@college.edu');
      setPassword('student123');
    } else {
      setEmail('admin@college.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bus className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Campus Transport</h1>
          </div>
          <p className="text-muted-foreground">Track your college buses in real-time</p>
        </div>

        {/* Demo Credentials */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'student' ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => fillDemoCredentials('student')}
          >
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Student Demo</p>
              <p className="text-xs text-muted-foreground mt-1">View bus tracking</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'admin' ? 'ring-2 ring-secondary border-secondary' : ''
            }`}
            onClick={() => fillDemoCredentials('admin')}
          >
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <p className="font-medium">Admin Demo</p>
              <p className="text-xs text-muted-foreground mt-1">Manage fleet</p>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <Card className="shadow-card-soft">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Select a demo role above to auto-fill credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant={selectedRole === 'admin' ? 'transport' : 'gradient'}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Demo Credentials:</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Student:</strong> student@college.edu / student123</p>
              <p><strong>Admin:</strong> admin@college.edu / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
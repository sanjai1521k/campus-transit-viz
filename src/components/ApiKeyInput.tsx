import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      onApiKeySubmit(apiKey.trim());
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="h-96 bg-muted rounded-lg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>Google Maps API Key Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              To display the interactive map, please enter your Google Maps API key.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Google Maps API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!apiKey.trim() || isSubmitting}
              variant="gradient"
            >
              {isSubmitting ? 'Loading Map...' : 'Load Google Maps'}
            </Button>
          </form>
          
          <div className="text-center">
            <a
              href="https://developers.google.com/maps/gmp-get-started"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Get Google Maps API Key
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;
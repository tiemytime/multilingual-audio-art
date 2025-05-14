import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

const TTSInterface = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      if (response.ok) {
        setServerStatus('online');
        setIsSimulated(false);
      } else {
        setServerStatus('offline');
        setIsSimulated(true);
      }
    } catch (error) {
      console.error('Server check failed:', error);
      setServerStatus('offline');
      setIsSimulated(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsLoading(true);
    try {
      // First check server status
      await checkServerStatus();
      
      if (serverStatus === 'offline') {
        throw new Error('TTS server is not available');
      }

      const response = await fetch('http://localhost:3000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      // Construct the full URL for the audio file
      const audioUrl = `http://localhost:3000${data.audioUrl}`;
      console.log('Audio URL:', audioUrl); // Debug log

      // Test if the audio file is accessible
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        throw new Error('Audio file not accessible');
      }

      setAudioUrl(audioUrl);
      toast.success('Speech generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process text');
      setIsSimulated(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Multilingual Text-to-Speech</CardTitle>
          <CardDescription>
            {serverStatus === 'checking' ? (
              "Checking server status..."
            ) : serverStatus === 'offline' ? (
              <span className="text-red-600">
                TTS server is not available. Please make sure the server is running at http://localhost:3000
              </span>
            ) : (
              "Convert your text into natural-sounding speech in multiple languages"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="text" className="text-sm font-medium">
                Enter Text
              </label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Select Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mixed">Mixed Language</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || serverStatus === 'offline'}
            >
              {isLoading ? 'Processing...' : 'Generate Speech'}
            </Button>
          </form>

          {audioUrl && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium">Generated Audio</h3>
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  {isSimulated ? (
                    "Audio generation is currently in simulated mode. The TTS service is not available."
                  ) : (
                    "Your audio is ready to play"
                  )}
                </p>
              </div>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TTSInterface; 
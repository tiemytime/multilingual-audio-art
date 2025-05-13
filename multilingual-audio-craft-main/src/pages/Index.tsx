
import { useState, useEffect } from "react";
import TextInputForm from "@/components/TextInputForm";
import AudioPlayer from "@/components/AudioPlayer";
import NarrationHistory from "@/components/NarrationHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SpeechProcessor } from "@/lib/speechProcessor";

const Index = () => {
  const [currentText, setCurrentText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{ text: string; audioUrl: string; timestamp: number }[]>([]);
  const [phonemeData, setPhonemeData] = useState<string[]>([]);

  // Simulated speech processor for the initial version
  const speechProcessor = new SpeechProcessor();

  const handleTextSubmit = async (text: string, language: string) => {
    setIsProcessing(true);
    setCurrentText(text);
    
    try {
      // In a real implementation, this would call your backend API
      const result = await speechProcessor.processText(text, language);
      setAudioUrl(result.audioUrl);
      setPhonemeData(result.phonemes);
      
      // Add to history
      const newEntry = { 
        text, 
        audioUrl: result.audioUrl, 
        timestamp: Date.now() 
      };
      setHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 10));
    } catch (error) {
      console.error("Error processing text:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Bilingual TTS Project</h1>
          <p className="text-lg text-purple-700">Convert text to speech in English and Romanized Hindi</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <TextInputForm onSubmit={handleTextSubmit} isProcessing={isProcessing} />
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-purple-800 mb-4">Speech Output</h2>
                  {audioUrl ? (
                    <AudioPlayer 
                      audioUrl={audioUrl} 
                      text={currentText} 
                      phonemes={phonemeData}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Enter text above to generate speech
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Tabs defaultValue="history">
              <TabsList className="w-full">
                <TabsTrigger value="history" className="flex-1">Narration History</TabsTrigger>
                <TabsTrigger value="technical" className="flex-1">Technical Details</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <Card className="shadow-lg">
                  <CardContent className="p-4">
                    <NarrationHistory history={history} onSelect={(item) => {
                      setCurrentText(item.text);
                      setAudioUrl(item.audioUrl);
                    }} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="technical">
                <Card className="shadow-lg">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-purple-800">Technical Components</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Frontend: React with Tailwind CSS</li>
                        <li>Text Processing: NLTK for tokenization</li>
                        <li>Speech Synthesis: Coqui TTS (planned)</li>
                        <li>Verification: Speech-to-text (planned)</li>
                        <li>Database: MongoDB (planned)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

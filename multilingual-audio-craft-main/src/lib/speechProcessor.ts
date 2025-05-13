
// This file connects to our Express backend with Coqui TTS
import { toast } from "@/components/ui/sonner";

export class SpeechProcessor {
  // Make API URL configurable with a default value
  private API_BASE_URL: string;
  private useFallback = false;
  private connectionTestInProgress = false;

  constructor(apiBaseUrl?: string) {
    // Default URL with fallback options
    this.API_BASE_URL = apiBaseUrl || import.meta.env.VITE_TTS_API_URL || "http://localhost:3000/api/tts";
    console.log(`SpeechProcessor initialized with API URL: ${this.API_BASE_URL}`);
    
    // Test connection on initialization
    this.testConnection();
  }

  // Public method to test the connection and switch back to live mode if possible
  public async testConnection(): Promise<boolean> {
    if (this.connectionTestInProgress) return !this.useFallback;
    
    this.connectionTestInProgress = true;
    console.log(`Testing connection to TTS server at: ${this.API_BASE_URL}`);
    
    try {
      // Try to hit the health endpoint if available
      const healthEndpoint = this.API_BASE_URL.replace('/api/tts', '/api/health');
      const response = await fetch(healthEndpoint, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        console.log("TTS server connection successful!");
        
        // If we were in fallback mode, switch back to live mode
        if (this.useFallback) {
          this.useFallback = false;
          toast("TTS server connection restored! Using live TTS.");
        }
        
        this.connectionTestInProgress = false;
        return true;
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("TTS server connection test failed:", error);
      
      // Only show the toast if we're switching to fallback mode for the first time
      if (!this.useFallback) {
        this.useFallback = true;
        toast("Could not connect to TTS server. Using simulated mode.");
        toast("Check if the TTS server is running at " + this.API_BASE_URL.split('/api')[0]);
      }
      
      this.connectionTestInProgress = false;
      return false;
    }
  }

  async processText(text: string, language: string): Promise<{
    audioUrl: string;
    phonemes: string[];
  }> {
    console.log(`Processing text in ${language}: ${text}`);
    
    // Try to reconnect if we're in fallback mode
    if (this.useFallback) {
      await this.testConnection();
    }
    
    try {
      if (this.useFallback) {
        return this.getFallbackResponse(text, language);
      }
      
      // Make a real API call to our Express backend with Coqui TTS
      console.log(`Sending request to ${this.API_BASE_URL}`);
      const response = await fetch(this.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        audioUrl: data.audioUrl,
        phonemes: data.phonemes,
      };
    } catch (error) {
      console.error("Failed to process speech:", error);
      
      // If this is the first error, notify the user about the backend connection issue
      if (!this.useFallback) {
        this.useFallback = true;
        toast("Could not connect to TTS server. Using simulated mode.");
      }
      
      // Use fallback response when server is not available
      return this.getFallbackResponse(text, language);
    }
  }

  private getFallbackResponse(text: string, language: string): {
    audioUrl: string;
    phonemes: string[];
  } {
    // Generate a simulated audio URL
    // In a real app, you might have some sample audio files bundled with the frontend
    const audioUrl = `https://github.com/extend-ludens/coqui-tts-samples/raw/main/${language}.mp3`;
    
    // Generate simulated phonemes
    const words = text.split(/\s+/).slice(0, 15);
    const phonemes = words
      .filter(word => word.length > 1 && !/^[,.!?;:()[\]{}]$/.test(word))
      .map(word => {
        const cleanWord = word.replace(/[,.!?;:()[\]{}]/g, "");
        
        // Detect if it's a Hindi word
        const isHindi = /[\u0900-\u097F]/.test(cleanWord);
        
        // Return a simple phoneme representation
        if (language === "hindi" || (language === "mixed" && isHindi)) {
          return `${cleanWord}-hi`;
        } else {
          return `${cleanWord}-en`;
        }
      });
    
    return {
      audioUrl,
      phonemes,
    };
  }

  // Public method to get the current connection status
  public getConnectionStatus(): string {
    return this.useFallback ? "fallback" : "connected";
  }

  // Public method to update the API URL and test the connection
  public async updateApiUrl(newUrl: string): Promise<boolean> {
    this.API_BASE_URL = newUrl;
    return this.testConnection();
  }
}

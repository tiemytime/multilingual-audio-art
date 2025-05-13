
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryItem {
  text: string;
  audioUrl: string;
  timestamp: number;
}

interface NarrationHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const NarrationHistory = ({ history, onSelect }: NarrationHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No narration history yet
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + "..." 
      : text;
  };

  // Detect language based on text
  const detectLanguage = (text: string) => {
    // Check if text contains Devanagari Unicode characters (Hindi)
    const hasHindi = /[\u0900-\u097F]/.test(text);
    
    // Check for English words pattern
    const hasEnglish = /[a-zA-Z]{2,}/.test(text);
    
    if (hasHindi && hasEnglish) return "mixed";
    if (hasHindi) return "hindi";
    return "english";
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        <h3 className="font-medium text-purple-800">Recent Narrations</h3>
        
        {history.map((item, index) => {
          const language = detectLanguage(item.text);
          
          return (
            <div 
              key={index}
              onClick={() => onSelect(item)}
              className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant="outline" 
                  className={`
                    ${language === "english" ? "border-blue-300 text-blue-700 bg-blue-50" : 
                      language === "hindi" ? "border-green-300 text-green-700 bg-green-50" : 
                      "border-purple-300 text-purple-700 bg-purple-50"}
                  `}
                >
                  {language === "english" ? "English" : 
                   language === "hindi" ? "Hindi" : "Mixed"}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700" dir={language === "hindi" ? "auto" : "ltr"}>
                {truncateText(item.text)}
              </p>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default NarrationHistory;

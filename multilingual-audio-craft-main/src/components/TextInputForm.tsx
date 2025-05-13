
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TextInputFormProps {
  onSubmit: (text: string, language: string) => void;
  isProcessing: boolean;
}

const TextInputForm = ({ onSubmit, isProcessing }: TextInputFormProps) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("english");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, language);
    }
  };

  // Example sentences for different languages
  const examples = {
    english: "The quick brown fox jumps over the lazy dog.",
    hindi: "मेरा नाम जॉन है। मैं एक विद्यार्थी हूँ।",
    mixed: "I am learning Hindi language. मुझे हिंदी सीखना पसंद है।"
  };

  const loadExample = (type: keyof typeof examples) => {
    setText(examples[type]);
    setLanguage(type === "hindi" ? "hindi" : type === "mixed" ? "mixed" : "english");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-purple-800 mb-2">Enter Text</h2>
        <Textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[120px] text-base"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-purple-800">Language</Label>
        <RadioGroup 
          value={language} 
          onValueChange={setLanguage}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="english" id="english" />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hindi" id="hindi" />
            <Label htmlFor="hindi">Hindi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" />
            <Label htmlFor="mixed">Mixed</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-purple-50 p-3 rounded-lg">
        <p className="text-sm text-purple-700 mb-2">Example texts:</p>
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => loadExample("english")}
            className="text-xs"
          >
            English Example
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => loadExample("hindi")}
            className="text-xs"
          >
            Hindi Example
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => loadExample("mixed")}
            className="text-xs"
          >
            Mixed Example
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isProcessing || !text.trim()} 
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isProcessing ? "Processing..." : "Generate Speech"}
        </Button>
      </div>
    </form>
  );
};

export default TextInputForm;
